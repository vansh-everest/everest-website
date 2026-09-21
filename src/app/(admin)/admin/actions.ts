"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authConfigured, requireAdmin, signIn, signOut } from "@/lib/auth";
import type { SiteContent } from "@/lib/content";
import { saveContent } from "@/lib/store";
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

export type SaveState = { status: "idle" | "saved" | "error"; message: string };

export async function saveAction(_prev: SaveState, form: FormData): Promise<SaveState> {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return { status: "error", message: "Administrator access is required to save." };
  }

  let next: SiteContent;
  try {
    next = JSON.parse(String(form.get("content") ?? ""));
  } catch {
    return { status: "error", message: "That change could not be read." };
  }

  try {
    await saveContent(next, session.email);
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Saving failed." };
  }

  // Every surface that reads content, in all three locales.
  for (const path of ["/", "/drive-with-us", "/blog", "/hi", "/te"]) {
    revalidatePath(path, "layout");
  }
  return { status: "saved", message: "Saved." };
}
