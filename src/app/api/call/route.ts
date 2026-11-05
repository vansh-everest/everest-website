import { NextResponse } from "next/server";
import { PHONE_HREF } from "@/components/home/ui";
import { CITY_PHONES } from "@/lib/city-phones";
import { UNKNOWN_CALLER, callerKey, tooMany } from "@/lib/throttle";
import { sendCallToUnify } from "@/lib/unify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A tap on one of the site's call buttons (components/site/call-beacon.tsx), passed on to Unify
 * for the admin's calls page. A tap is not a lead and never reaches the CRM. Only the site's own
 * numbers are kept, so a script cannot fill the page with made-up ones. The answer is always
 * empty: the visitor's phone app has already opened.
 */

/** Every number the site links to: the main line, each city's line, and Advertise With Us. */
const KNOWN = new Set(
  [PHONE_HREF.replace(/^tel:/, ""), ...Object.values(CITY_PHONES), "+919970732823"].map((n) => n.replace(/\D/g, "")),
);
const PER_CALLER = 20;
const SHARED = 600;
/** All callers together, per instance: a flood that forges its address still stops here. */
const ALL = 300;
const WINDOW_MS = 60_000;
const MAX_BODY = 4096;

const text = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
const done = (status = 204) => new NextResponse(null, { status });

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY) return done(413);
  // Cloudflare sits in front of the live site and names the visitor; the platform headers are the fallback.
  const caller = request.headers.get("cf-connecting-ip")?.trim() || callerKey(request.headers);
  if (tooMany("call:all", ALL, WINDOW_MS)) return done(429);
  if (tooMany(`call:${caller}`, caller === UNKNOWN_CALLER ? SHARED : PER_CALLER, WINDOW_MS)) return done(429);

  let body: Record<string, unknown>;
  try {
    // sendBeacon posts the tap as text, which keeps it a simple request.
    body = JSON.parse((await request.text()).slice(0, MAX_BODY)) as Record<string, unknown>;
  } catch {
    return done(400);
  }
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  const page = text(body.page, 200);
  const callId = text(body.call_id, 64);
  if (!KNOWN.has(phone) || !page?.startsWith("/") || !callId) return done(400);

  const city = text(body.city, 32);
  await sendCallToUnify({
    call_id: callId,
    phone,
    city: city && city in CITY_PHONES ? city : null,
    page,
    landing: text(body.landing, 200),
    utm_source: text(body.utm_source, 64),
    utm_campaign: text(body.utm_campaign, 100),
    locale: text(body.locale, 8),
    clicked_at: text(body.clicked_at, 40) ?? new Date().toISOString(),
  });
  return done();
}
