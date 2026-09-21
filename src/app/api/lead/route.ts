import { NextResponse } from "next/server";
import { appendLead, type Lead } from "@/lib/leads";
import { UNKNOWN_CALLER, callerKey, tooMany } from "@/lib/throttle";

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
const WINDOW_MS = 60_000;

/** Per caller when the platform names one. The shared bucket has to clear real traffic. */
const PER_CALLER = 5;
const SHARED = 60;
const PER_MOBILE = 3;
/** A ceiling on relayed records, so a flood cannot be amplified into the CRM. */
const WEBHOOK_PER_MINUTE = 120;

export async function POST(request: Request) {
  const caller = callerKey(request.headers);
  if (tooMany(`lead:${caller}`, caller === UNKNOWN_CALLER ? SHARED : PER_CALLER, WINDOW_MS)) {
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

  // A second key the caller cannot rotate freely, so a spoofed address chain still cannot
  // resubmit the same number in a loop.
  if (tooMany(`lead:mobile:${mobile}`, PER_MOBILE, WINDOW_MS)) {
    return NextResponse.json({ error: "too_many" }, { status: 429 });
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
  if (hook && !tooMany("lead:webhook", WEBHOOK_PER_MINUTE, WINDOW_MS)) {
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
