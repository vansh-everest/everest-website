import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { readSession } from "@/lib/auth";
import { CONTENT_VERSION, DEFAULT_CONTENT, type SiteContent } from "@/lib/content";
import { normalizeContent } from "@/lib/content-schema";

/**
 * Where edited content lives, in three parts:
 *
 * - published: what visitors see. Cached, and refreshed the moment something is published.
 * - draft: the working copy an admin saves and previews. Never shown to a visitor.
 * - history: every published version, so a bad publish can be rolled back.
 *
 * Local development keeps them as files, which git ignores. Production keeps them in a PRIVATE
 * Vercel Blob store, reached with CONTENT_BLOB_READ_WRITE_TOKEN and connected to production and
 * preview only, so a laptop can never write to the live site. Private reads can skip the CDN
 * and go to storage, so a read straight after a write always sees it; a public store's CDN can
 * answer with an older copy or a cached "not found". With neither, the site renders the
 * defaults and the admin says it is read only rather than silently dropping edits.
 *
 * Uploaded images are separate: they live in the public store (BLOB_READ_WRITE_TOKEN).
 */

export const CONTENT_TAG = "site-content";
const HISTORY_KEEP = 30;

export type StoreMode = "file" | "blob" | "readonly";
export type Version = { id: string; publishedAt: string; publishedBy: string };

export class DraftConflict extends Error {}

const token = () => process.env.CONTENT_BLOB_READ_WRITE_TOKEN;

export function storeMode(): StoreMode {
  if (token()) return "blob";
  // A serverless filesystem is read only, so the file store is development only.
  if (process.env.NODE_ENV !== "production") return "file";
  return "readonly";
}

/* ----------------------------------------------------------------------------- files */

// The file store only runs on a laptop. The turbopackIgnore marks below stop the bundler from
// treating its dynamic paths as a reason to ship the whole project with the server code.
const FILE = {
  published: path.join(process.cwd(), ".content-store.json"),
  draft: path.join(process.cwd(), ".content-draft.json"),
  history: path.join(process.cwd(), ".content-history"),
};

async function fileRead(file: string): Promise<unknown | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

async function fileWrite(file: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

/* ------------------------------------------------------------------------------ blob */

/**
 * One folder per Vercel environment. Preview deployments share the store with production, and
 * a publish from a preview must not change the live site behind its cache.
 */
const NS = process.env.VERCEL_ENV === "production" ? "content" : `content-${process.env.VERCEL_ENV ?? "local"}`;
const BLOB = {
  published: `${NS}/published.json`,
  /** Fixed, so every save overwrites it in place and can be made conditional. */
  draft: `${NS}/draft.json`,
  history: `${NS}/history/`,
};

const blob = () => import("@vercel/blob");

/**
 * Null when the blob does not exist. A failed read throws, so a cached page is kept.
 * useCache: false reads from storage rather than the CDN. The request is uncompressed because a
 * compressed response carries a weak ETag, and ifMatch needs the exact one.
 */
async function blobRead(pathnameOrUrl: string): Promise<{ data: unknown; etag: string } | null> {
  const { get } = await blob();
  const res = await get(pathnameOrUrl, {
    access: "private",
    useCache: false,
    token: token(),
    headers: { "accept-encoding": "identity" },
  });
  if (!res || res.statusCode !== 200) return null;
  return { data: JSON.parse(await new Response(res.stream).text()), etag: res.blob.etag };
}

type WriteMode = { unique: true } | { overwrite: true; ifMatch?: string } | { createOnly: true };

async function blobWrite(pathname: string, data: unknown, mode: WriteMode): Promise<void> {
  const { put } = await blob();
  await put(pathname, JSON.stringify(data), {
    access: "private",
    token: token(),
    contentType: "application/json",
    addRandomSuffix: "unique" in mode,
    allowOverwrite: "overwrite" in mode,
    ifMatch: "overwrite" in mode ? mode.ifMatch : undefined,
  });
}

/** A write refused because the draft changed or appeared since it was read. */
function isClash(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.name === "BlobPreconditionFailedError" || /already exists|precondition/i.test(error.message);
}

/** Newest first. */
async function blobList(prefix: string) {
  const { list } = await blob();
  const found: Awaited<ReturnType<typeof list>>["blobs"] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000, token: token() });
    found.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return found.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

async function blobDelete(urls: string[]): Promise<void> {
  if (!urls.length) return;
  const { del } = await blob();
  await del(urls, { token: token() });
}

/* ---------------------------------------------------------------------- the three parts */

async function readPublishedRaw(): Promise<unknown | null> {
  switch (storeMode()) {
    case "blob":
      return (await blobRead(BLOB.published))?.data ?? null;
    case "file":
      return fileRead(FILE.published);
    default:
      return null;
  }
}

async function readPublished(): Promise<SiteContent> {
  const raw = await readPublishedRaw();
  return raw ? normalizeContent(raw) : DEFAULT_CONTENT;
}

/** The draft and a tag that changes whenever it is rewritten. */
async function readDraftEntry(): Promise<{ content: SiteContent; etag: string } | null> {
  switch (storeMode()) {
    case "blob": {
      const found = await blobRead(BLOB.draft);
      return found ? { content: normalizeContent(found.data), etag: found.etag } : null;
    }
    case "file": {
      const raw = await fileRead(FILE.draft);
      if (!raw) return null;
      const content = normalizeContent(raw);
      return { content, etag: content.updatedAt };
    }
    default:
      return null;
  }
}

async function readDraft(): Promise<SiteContent | null> {
  return (await readDraftEntry())?.content ?? null;
}

const cachedPublished = unstable_cache(readPublished, ["site-content", "published", CONTENT_VERSION], {
  tags: [CONTENT_TAG],
});

/** A signed-in admin or viewer who opened a preview sees the draft; everyone else the live copy. */
async function previewing(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled && Boolean(await readSession());
  } catch {
    // Outside a request (a build step or the sitemap) there is nothing to preview.
    return false;
  }
}

/** What a public page renders. */
export async function getContent(): Promise<SiteContent> {
  if (await previewing()) return (await readDraft()) ?? (await readPublished());
  return cachedPublished();
}

/** What the admin opens: the draft if one exists, otherwise the live copy. Never cached. */
export async function getEditorState(): Promise<{ content: SiteContent; hasDraft: boolean; live: SiteContent }> {
  const [draft, live] = await Promise.all([readDraft(), readPublished()]);
  return { content: draft ?? live, hasDraft: Boolean(draft), live };
}

function requireWritable(): Exclude<StoreMode, "readonly"> {
  const mode = storeMode();
  if (mode === "readonly") {
    throw new Error("No content store is configured, so this change was not saved.");
  }
  return mode;
}

/**
 * Saves the working copy. `base` is the draft timestamp the editor started from, so two
 * people editing at once cannot silently overwrite each other.
 */
export async function saveDraft(next: SiteContent, editor: string, base: string): Promise<SiteContent> {
  const mode = requireWritable();
  const current = await readDraftEntry();
  if (current && current.content.updatedAt !== base) {
    throw new DraftConflict(
      `${current.content.updatedBy} saved a newer draft at ${new Date(current.content.updatedAt).toLocaleTimeString("en-IN")}. Reload before saving.`
    );
  }

  const payload: SiteContent = { ...next, updatedAt: new Date().toISOString(), updatedBy: editor };

  if (mode === "file") {
    await fileWrite(FILE.draft, payload);
    return payload;
  }
  // The write only lands if the draft is still the one checked above, so two saves at the
  // same moment cannot both succeed and silently drop one of them.
  try {
    await blobWrite(BLOB.draft, payload, current ? { overwrite: true, ifMatch: current.etag } : { createOnly: true });
  } catch (error) {
    if (isClash(error)) throw new DraftConflict("Someone saved at the same moment. Reload before saving.");
    throw error;
  }
  return payload;
}

const stamp = (iso: string) => iso.replace(/[:.]/g, "-");
const unstamp = (s: string) => s.replace(/T(\d\d)-(\d\d)-(\d\d)-(\d{3})Z/, "T$1:$2:$3.$4Z");
const who = (email: string) => email.toLowerCase().replace(/[^a-z0-9@._]+/g, "_").slice(0, 60);

/**
 * Makes what is on screen live and keeps a copy in history. The draft it replaced is cleared,
 * but only if it is still the one checked here: a save that lands mid-publish stays as the new
 * draft. `base` is the draft timestamp the editor started from, as for saveDraft.
 */
export async function publishContent(next: SiteContent, editor: string, base: string): Promise<SiteContent> {
  const mode = requireWritable();
  const current = await readDraftEntry();
  if (current && current.content.updatedAt !== base) {
    throw new DraftConflict(
      `${current.content.updatedBy} saved a newer draft at ${new Date(current.content.updatedAt).toLocaleTimeString("en-IN")}. Reload before publishing.`
    );
  }

  const now = new Date().toISOString();
  const payload: SiteContent = { ...next, updatedAt: now, updatedBy: editor, publishedAt: now, publishedBy: editor };
  const name = `${stamp(now)}~${who(editor)}~`;

  if (mode === "file") {
    await fileWrite(FILE.published, payload);
    await fileWrite(path.join(FILE.history, `${name}.json`), payload);
    if (current && (await readDraftEntry())?.etag === current.etag) await fs.rm(FILE.draft, { force: true });
    const all = (await fs.readdir(/*turbopackIgnore: true*/ FILE.history)).filter((f) => f.endsWith(".json")).sort().reverse();
    await Promise.all(all.slice(HISTORY_KEEP).map((f) => fs.rm(path.join(/*turbopackIgnore: true*/ FILE.history, f), { force: true })));
    return payload;
  }

  // Each Blob call takes a second or more, so independent ones run side by side.
  await Promise.all([
    blobWrite(BLOB.published, payload, { overwrite: true }),
    blobWrite(`${BLOB.history}${name}.json`, payload, { unique: true }),
  ]);
  const { del } = await blob();
  await Promise.all([
    current
      ? del(BLOB.draft, { ifMatch: current.etag, token: token() }).catch((error) => {
          // A newer draft was saved while this one was publishing; it stays for its author.
          if (!isClash(error)) throw error;
        })
      : Promise.resolve(),
    blobList(BLOB.history).then((all) => blobDelete(all.slice(HISTORY_KEEP).map((b) => b.url))),
  ]);
  return payload;
}

export async function discardDraft(): Promise<void> {
  const mode = requireWritable();
  if (mode === "file") {
    await fs.rm(FILE.draft, { force: true });
    return;
  }
  await blobDelete([BLOB.draft]);
}

function parseVersion(id: string, name: string): Version | null {
  const match = /^([^~]+)~([^~]*)~/.exec(name);
  if (!match) return null;
  return { id, publishedAt: unstamp(match[1]), publishedBy: match[2] };
}

/** Published versions, newest first. */
export async function listVersions(): Promise<Version[]> {
  switch (storeMode()) {
    case "blob":
      return (await blobList(BLOB.history))
        .map((b) => parseVersion(b.url, b.pathname.slice(BLOB.history.length)))
        .filter((v): v is Version => v !== null);
    case "file": {
      const files = await fs.readdir(/*turbopackIgnore: true*/ FILE.history).catch(() => [] as string[]);
      return files
        .filter((f) => f.endsWith(".json"))
        .sort()
        .reverse()
        .map((f) => parseVersion(f, f))
        .filter((v): v is Version => v !== null);
    }
    default:
      return [];
  }
}

/** Copies a published version into the draft, to be checked and published again. */
export async function restoreVersion(id: string, editor: string): Promise<void> {
  // The id must be one this store listed, so a request cannot point the reader elsewhere.
  const version = (await listVersions()).find((v) => v.id === id);
  if (!version) throw new Error("That version no longer exists.");
  const raw = storeMode() === "blob" ? (await blobRead(version.id))?.data : await fileRead(path.join(/*turbopackIgnore: true*/ FILE.history, version.id));
  if (!raw) throw new Error("That version could not be read.");
  const current = await readDraft();
  await saveDraft(normalizeContent(raw), editor, current?.updatedAt ?? "");
}
