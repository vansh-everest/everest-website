import "server-only";
import { cookies } from "next/headers";

/**
 * Two roles, signed into a cookie. No database and no third party.
 *
 * Viewer sees the admin and every value in it. Admin can save. The split exists so the
 * wider team can check what is on the site without being able to change it.
 *
 * Credentials come from the environment. With none set, the admin refuses to sign anyone
 * in rather than falling back to a default password.
 */

export const SESSION_COOKIE = "everest_admin";
export const ROLES = ["viewer", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type Session = { email: string; role: Role };

type Account = { email: string; password: string; role: Role };

function accounts(): Account[] {
  const list: Account[] = [];
  const admin = process.env.ADMIN_PASSWORD;
  const viewer = process.env.VIEWER_PASSWORD;
  if (admin) list.push({ email: process.env.ADMIN_EMAIL ?? "admin", password: admin, role: "admin" });
  if (viewer) list.push({ email: process.env.VIEWER_EMAIL ?? "viewer", password: viewer, role: "viewer" });
  return list;
}

export function authConfigured(): boolean {
  return accounts().length > 0 && Boolean(secret());
}

function secret(): string | undefined {
  return process.env.SESSION_SECRET;
}

const encoder = new TextEncoder();

async function hmac(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret() ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Buffer.from(signature).toString("base64url");
}

/** Constant time compare, so a wrong password cannot be narrowed down by timing. */
function equal(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signIn(email: string, password: string): Promise<Session | null> {
  const account = accounts().find((a) => a.email === email);
  if (!account || !equal(account.password, password)) return null;

  const session: Session = { email: account.email, role: account.role };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const token = `${payload}.${await hmac(payload)}`;

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return session;
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function readSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verify(token) : null;
}

export async function verify(token: string): Promise<Session | null> {
  if (!secret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!equal(await hmac(payload), signature)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    return (ROLES as readonly string[]).includes(parsed.role) ? parsed : null;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<Session> {
  const session = await readSession();
  if (session?.role !== "admin") throw new Error("Administrator access is required for this change.");
  return session;
}
