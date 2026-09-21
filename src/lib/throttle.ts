import "server-only";

/**
 * A per caller attempt counter, held in the instance.
 *
 * Instances are reused between requests, so this absorbs a script hammering an endpoint.
 * It is best effort: a cold start clears it and concurrent instances do not share it. Put a
 * gateway rule in front of anything that has to hold under a real attack.
 */

const buckets = new Map<string, number[]>();
const MAX_KEYS = 5000;

export function tooMany(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > MAX_KEYS) buckets.clear();
  return hits.length > limit;
}

export function clear(key: string): void {
  buckets.delete(key);
}

/** No platform header, so the address could not be established. */
export const UNKNOWN_CALLER = "unknown";

/**
 * The caller's address, taken only from headers the platform writes itself.
 *
 * x-forwarded-for is deliberately not used: a request straight to the origin carries
 * whatever chain the caller typed, so keying a limit on it lets one script mint a fresh
 * bucket per request. Where no platform header exists, every caller shares one bucket,
 * which is why the limit for that bucket has to be set separately.
 */
export function callerKey(headers: Headers): string {
  const trusted = headers.get("x-vercel-forwarded-for") ?? headers.get("x-real-ip");
  return trusted?.split(",")[0].trim() || UNKNOWN_CALLER;
}
