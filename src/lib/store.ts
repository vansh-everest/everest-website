import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/content";

/**
 * Where edited content lives.
 *
 * Local development writes a JSON file, which is git ignored. Production writes to Vercel
 * Blob when BLOB_READ_WRITE_TOKEN is set. With neither, the site still renders from the
 * defaults and the admin reports itself read only rather than silently dropping edits.
 */

const FILE = path.join(process.cwd(), ".content-store.json");
const BLOB_KEY = "site-content.json";

export type StoreMode = "file" | "blob" | "readonly";

export function storeMode(): StoreMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  // A serverless filesystem is read only, so the file store is development only.
  if (process.env.NODE_ENV !== "production") return "file";
  return "readonly";
}

function merge(saved: Partial<SiteContent> | null): SiteContent {
  if (!saved) return DEFAULT_CONTENT;
  return {
    ...DEFAULT_CONTENT,
    ...saved,
    cities: saved.cities?.length ? saved.cities : DEFAULT_CONTENT.cities,
    plans: saved.plans?.length ? saved.plans : DEFAULT_CONTENT.plans,
    images: { ...DEFAULT_CONTENT.images, ...(saved.images ?? {}) },
    posts: saved.posts ?? [],
  };
}

async function readBlob(): Promise<SiteContent> {
  const base = process.env.BLOB_PUBLIC_BASE_URL;
  if (!base) return DEFAULT_CONTENT;
  try {
    const res = await fetch(`${base}/${BLOB_KEY}`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_CONTENT;
    return merge(await res.json());
  } catch {
    return DEFAULT_CONTENT;
  }
}

async function readFile(): Promise<SiteContent> {
  try {
    return merge(JSON.parse(await fs.readFile(FILE, "utf8")));
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function getContent(): Promise<SiteContent> {
  switch (storeMode()) {
    case "blob":
      return readBlob();
    case "file":
      return readFile();
    default:
      return DEFAULT_CONTENT;
  }
}

export async function saveContent(next: SiteContent, editor: string): Promise<void> {
  const mode = storeMode();
  if (mode === "readonly") {
    throw new Error(
      "No content store is configured, so this change was not saved. " +
        "Set BLOB_READ_WRITE_TOKEN and BLOB_PUBLIC_BASE_URL to enable saving in production."
    );
  }
  const payload: SiteContent = { ...next, updatedAt: new Date().toISOString(), updatedBy: editor };

  if (mode === "file") {
    await fs.writeFile(FILE, JSON.stringify(payload, null, 2), "utf8");
    return;
  }

  const { put } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(payload, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
