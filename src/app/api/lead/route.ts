import { NextResponse } from "next/server";
import { appendLead, type Lead } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lead capture.
 *
 * Every submission is stored with the page, locale and campaign that produced it, so a lead
 * can be attributed to a channel. Without that attribution an owned demand target cannot be
 * measured against paid.
 *
 * LEAD_WEBHOOK_URL forwards the same record to a CRM. A failure there is logged and the
 * driver still sees a success, because the record is already stored.
 */

const TEN_DIGITS = /^[6-9]\d{9}$/;

/**
 * A soft throttle per address. Instances are reused between requests, so this absorbs a
 * script hammering the form. It is not a substitute for a gateway rule.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const seen = new Map<string, number[]>();

function throttled(key: string): boolean {
  const now = Date.now();
  const hits = (seen.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  seen.set(key, hits);
  if (seen.size > 5000) seen.clear();
  return hits.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ error: "too_many" }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const value = (key: string) => String(form.get(key) ?? "").trim().slice(0, 300);
  const mobile = value("mobile").replace(/\D/g, "").slice(-10);
  const name = value("name");

  if (!name || !TEN_DIGITS.test(mobile)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const lead: Lead = {
    at: new Date().toISOString(),
    name,
    mobile,
    city: value("city"),
    locale: value("locale") || "en",
    source: value("source"),
    page: value("page"),
    referrer: value("referrer"),
    campaign: value("campaign"),
  };

  await appendLead(lead);

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (error) {
      console.error("[lead] webhook failed", error);
    }
  }

  return NextResponse.json({ ok: true });
}
