import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";

/**
 * The site's two connections to Everest's own systems, both over HTTPS, neither to a database.
 *
 * fleet_connect (FLEET_CONNECT_URL + FLEET_CONNECT_KEY): the public API the website's server
 * calls for published content and to hand in leads. It asks Jarvis and caches the answers.
 *
 * Jarvis (JARVIS_API_URL): the admin panel's backend. The panel runs on
 * website-admin.everestfleet.com, so the browser already carries Hawkeye's `session_id` cookie
 * (set for .everestfleet.com); that session is exchanged for a short Jarvis access token, and
 * Jarvis decides who may edit through the website-admin role.
 *
 * With neither set, the site keeps its own storage (see store.ts) and its own admin sign-in.
 */

const trim = (url: string | undefined) => url?.replace(/\/+$/, "") || "";

const fleetUrl = () => trim(process.env.FLEET_CONNECT_URL);
const fleetKey = () => process.env.FLEET_CONNECT_KEY ?? "";
const jarvisUrl = () => trim(process.env.JARVIS_API_URL);

/** Leads can move to Jarvis on their own, so this needs only fleet_connect. */
export const fleetConnectEnabled = () => Boolean(fleetUrl() && fleetKey());
/**
 * Content and the admin move together: public pages read what the admin publishes only when
 * both connections are set, so one without the other keeps the site on its own storage.
 */
export const jarvisAdminEnabled = () => Boolean(jarvisUrl() && fleetConnectEnabled());
export const hawkeyeUrl = () => trim(process.env.HAWKEYE_URL) || "https://hawkeye.everestfleet.com";

/** Jarvis and fleet_connect wrap every answer as { message, data: { records, ... } }. */
export type Envelope<T = unknown> = {
  message?: string;
  data?: { records?: T; metadata?: unknown; countdata?: number } | null;
  error_message?: unknown;
};

export type Answer<T = unknown> = { status: number; body: Envelope<T> };

async function readJson<T>(res: Response): Promise<Envelope<T>> {
  try {
    return (await res.json()) as Envelope<T>;
  } catch {
    return {};
  }
}

/* -------------------------------------------------------------------- fleet_connect */

export async function fleetGet<T>(path: string, init?: RequestInit): Promise<Answer<T>> {
  const res = await fetch(`${fleetUrl()}${path}`, {
    signal: AbortSignal.timeout(10_000),
    ...init,
    headers: { "X-Website-Key": fleetKey(), ...(init?.headers ?? {}) },
  });
  return { status: res.status, body: await readJson<T>(res) };
}

export async function fleetSend<T>(method: "POST" | "DELETE", path: string, json?: unknown): Promise<Answer<T>> {
  const res = await fetch(`${fleetUrl()}${path}`, {
    method,
    cache: "no-store",
    headers: { "X-Website-Key": fleetKey(), ...(json === undefined ? {} : { "content-type": "application/json" }) },
    body: json === undefined ? undefined : JSON.stringify(json),
    signal: AbortSignal.timeout(8_000),
  });
  return { status: res.status, body: await readJson<T>(res) };
}

/* ---------------------------------------------------------------------------- Jarvis */

/** Why the admin cannot be used: not signed into Hawkeye, or signed in without the role. */
export class JarvisAccessError extends Error {
  constructor(readonly reason: "signed-out" | "no-access") {
    super(reason === "signed-out" ? "Sign in to Hawkeye first." : "This account does not have website admin access.");
  }
}

/**
 * A Jarvis access token for the Hawkeye session. Jarvis rotates the session's refresh token on
 * every exchange, so the token is kept for a minute per session and callers arriving together
 * share one exchange; React's cache() does not cover server actions or route handlers. One retry
 * covers Hawkeye refreshing the same session at the same moment.
 */
const TOKEN_TTL_MS = 60_000;
const tokens = new Map<string, { until: number; token: Promise<string> }>();

async function sessionKey(session: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(session));
  return Buffer.from(digest).toString("hex");
}

async function exchange(session: string): Promise<string> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(`${jarvisUrl()}/api/refresh-token/`, {
      method: "POST",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ session_id: session }),
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) {
      const token = ((await res.json()) as { access_token?: string }).access_token;
      if (token) return token;
    } else if (res.status !== 400 && res.status !== 401) {
      throw new Error(`Jarvis did not answer the sign-in check (${res.status}).`);
    }
  }
  throw new JarvisAccessError("signed-out");
}

async function accessToken(): Promise<string> {
  const session = (await cookies()).get("session_id")?.value;
  if (!session) throw new JarvisAccessError("signed-out");
  const key = await sessionKey(session);
  const now = Date.now();
  const held = tokens.get(key);
  if (held && held.until > now) return held.token;
  for (const [k, v] of tokens) if (v.until <= now) tokens.delete(k);
  const token = exchange(session);
  tokens.set(key, { until: now + TOKEN_TTL_MS, token });
  token.catch(() => tokens.delete(key));
  return token;
}

export async function jarvisAdmin<T>(
  method: "GET" | "PUT" | "POST" | "PATCH" | "DELETE",
  path: string,
  json?: unknown
): Promise<Answer<T>> {
  const token = await accessToken();
  const res = await fetch(`${jarvisUrl()}${path}`, {
    method,
    cache: "no-store",
    headers: {
      authorization: `Bearer ${token}`,
      ...(json === undefined ? {} : { "content-type": "application/json" }),
    },
    body: json === undefined ? undefined : JSON.stringify(json),
    signal: AbortSignal.timeout(20_000),
  });
  if (res.status === 401) throw new JarvisAccessError("signed-out");
  if (res.status === 403) throw new JarvisAccessError("no-access");
  return { status: res.status, body: await readJson<T>(res) };
}

/** A multipart upload (the admin's photos); the browser-facing checks have already run. */
export async function jarvisAdminForm<T>(path: string, form: FormData): Promise<Answer<T>> {
  const token = await accessToken();
  const res = await fetch(`${jarvisUrl()}${path}`, {
    method: "POST",
    cache: "no-store",
    headers: { authorization: `Bearer ${token}` },
    body: form,
    signal: AbortSignal.timeout(60_000),
  });
  if (res.status === 401) throw new JarvisAccessError("signed-out");
  if (res.status === 403) throw new JarvisAccessError("no-access");
  return { status: res.status, body: await readJson<T>(res) };
}

/** The raw response, for downloads such as the leads CSV. */
export async function jarvisAdminRaw(path: string): Promise<Response> {
  const token = await accessToken();
  return fetch(`${jarvisUrl()}${path}`, {
    cache: "no-store",
    headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(30_000),
  });
}

/** The message Jarvis gave for a refusal, falling back to a plain one. */
export function jarvisMessage(answer: Answer, fallback: string): string {
  return typeof answer.body.message === "string" && answer.body.message && answer.body.message !== "success"
    ? answer.body.message
    : fallback;
}

export type JarvisUser = { id: number; name: string; username: string };

export type JarvisSignIn =
  | { user: JarvisUser; problem: null }
  | { user: null; problem: JarvisAccessError["reason"] };

/** Who is signed in, checked once per request: the user, or why there is none. */
export const jarvisSignIn = cache(async (): Promise<JarvisSignIn> => {
  try {
    const answer = await jarvisAdmin<JarvisUser>("GET", "/website/admin/me");
    const user = answer.status === 200 ? answer.body.data?.records : null;
    return user ? { user, problem: null } : { user: null, problem: "no-access" };
  } catch (error) {
    if (error instanceof JarvisAccessError) return { user: null, problem: error.reason };
    throw error;
  }
});
