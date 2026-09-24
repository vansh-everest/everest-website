"use server";

import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authConfigured, requireAdmin, signIn, signOut } from "@/lib/auth";
import type { SiteContent } from "@/lib/content";
import { normalizeContent } from "@/lib/content-schema";
import { CONTENT_TAG, DraftConflict, discardDraft, publishContent, restoreVersion, saveDraft } from "@/lib/store";
import { callerKey, clear, tooMany } from "@/lib/throttle";

export type SignInState = { error: string };

/** Ten attempts in fifteen minutes. A correct password clears the count. */
const SIGN_IN_LIMIT = 10;
const SIGN_IN_WINDOW_MS = 15 * 60_000;

export async function signInAction(_prev: SignInState, form: FormData): Promise<SignInState> {
  if (!authConfigured()) {
    return { error: "Sign in is not configured on this deployment." };
  }

  const key = `signin:${callerKey(await headers())}`;
  if (tooMany(key, SIGN_IN_LIMIT, SIGN_IN_WINDOW_MS)) {
    return { error: "Too many attempts, locked for fifteen minutes." };
  }

  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const session = await signIn(email, password);
  if (!session) return { error: "Those details did not match." };

  clear(key);
  redirect("/admin");
}

export async function signOutAction(): Promise<void> {
  await signOut();
  redirect("/admin");
}

export type EditState = {
  status: "idle" | "saved" | "published" | "error";
  message: string;
  /** The draft timestamp to send as the base of the next save. Blank once published. */
  base: string;
  /** Increments on every successful save or publish, so the editor can tell a new result from an old one. */
  seq: number;
};

/** Generous for the whole site's content, small enough to refuse an accidental paste of a file. */
const MAX_PAYLOAD = 1_500_000;

function readPayload(form: FormData): SiteContent | string {
  const raw = String(form.get("content") ?? "");
  if (raw.length > MAX_PAYLOAD) return "That change is too large to save.";
  try {
    return normalizeContent(JSON.parse(raw));
  } catch {
    return "That change could not be read.";
  }
}

const fail = (prev: EditState, message: string): EditState => ({ ...prev, status: "error", message });

const clock = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

/** Saves the screen as the draft, or publishes exactly what is on screen. */
export async function editAction(prev: EditState, form: FormData): Promise<EditState> {
  const publishing = form.get("intent") === "publish";
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return fail(prev, `Administrator access is required to ${publishing ? "publish" : "save"}.`);
  }
  const content = readPayload(form);
  if (typeof content === "string") return fail(prev, content);

  try {
    const base = String(form.get("base") ?? "");
    if (!publishing) {
      const saved = await saveDraft(content, session.email, base);
      return { status: "saved", message: `Draft saved at ${clock(saved.updatedAt)}.`, base: saved.updatedAt, seq: prev.seq + 1 };
    }
    const live = await publishContent(content, session.email, base);
    refreshSite();
    return { status: "published", message: `Published at ${clock(live.publishedAt)}.`, base: "", seq: prev.seq + 1 };
  } catch (error) {
    if (error instanceof DraftConflict) return fail(prev, error.message);
    return fail(prev, error instanceof Error ? error.message : "That change was not saved.");
  }
}

/** Every public surface, in all three locale trees. Each has its own root layout. */
function refreshSite() {
  updateTag(CONTENT_TAG);
  for (const path of ["/", "/hi", "/te"]) revalidatePath(path, "layout");
}

/** Failures come back to the admin as a notice rather than an error screen. */
export async function discardDraftAction(): Promise<void> {
  let ok = true;
  try {
    await requireAdmin();
    await discardDraft();
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin" : "/admin?notice=discard-failed");
}

/** Bound to a version id in the history list: `restoreVersionAction.bind(null, id)`. */
export async function restoreVersionAction(id: string): Promise<void> {
  let ok = true;
  try {
    const session = await requireAdmin();
    await restoreVersion(String(id), session.email);
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin" : "/admin?notice=restore-failed");
}
