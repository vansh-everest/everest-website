import { NextResponse } from "next/server";
import { fleetConnectEnabled, fleetSend } from "@/lib/jarvis";
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
 *
 * With fleet_connect configured, the lead goes to Jarvis, where the website admin lists it,
 * together with every other field the form had (company, email, trip details). If that fails,
 * the site's own store keeps it, so a Jarvis outage never loses a lead.
 */

const TEN_DIGITS = /^[6-9]\d{9}$/;
/** The token Google's widget (components/site/captcha.tsx) adds to the form. */
const CAPTCHA_FIELD = "g-recaptcha-response";
/** Fields every form shares; anything else a form sends goes to Jarvis as a detail. */
const STANDARD = new Set(["name", "mobile", "city", "locale", "source", "page", "referrer", "campaign", CAPTCHA_FIELD]);
const MAX_DETAILS = 30;
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

  if (!(await captchaPassed(String(form.get(CAPTCHA_FIELD) ?? "")))) {
    return NextResponse.json({ error: "captcha" }, { status: 400 });
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

  const details: Record<string, string> = {};
  for (const [key, raw] of form.entries()) {
    if (STANDARD.has(key) || typeof raw !== "string" || !raw.trim() || key.startsWith("$")) continue;
    if (Object.keys(details).length >= MAX_DETAILS) break;
    details[key.slice(0, 40)] = raw.trim().slice(0, 300);
  }

  if (!(await sentToJarvis(lead, details))) await appendLead(lead);

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

/**
 * With RECAPTCHA_SECRET_KEY set, a lead needs a token Google accepts. Without it there is no check.
 * Google not answering lets the lead through, logged: a lost driver costs more than one stray bot.
 */
async function captchaPassed(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
    });
    const answer = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!answer.success) console.warn("[lead] captcha refused", answer["error-codes"]);
    return answer.success === true;
  } catch (error) {
    console.error("[lead] captcha check unreachable, lead accepted", error);
    return true;
  }
}

/** True once Jarvis has the lead. False when fleet_connect is not set up or did not take it. */
async function sentToJarvis(lead: Lead, details: Record<string, string>): Promise<boolean> {
  if (!fleetConnectEnabled()) return false;
  try {
    const { name, mobile, city, locale, page, referrer, campaign } = lead;
    const answer = await fleetSend("POST", "/everest_website/leads", {
      name, mobile, city, locale, page, referrer, campaign,
      source: lead.source || "apply",
      details,
    });
    if (answer.status >= 200 && answer.status < 300) return true;
    console.error("[lead] fleet_connect refused the lead", answer.status, answer.body.message);
  } catch (error) {
    console.error("[lead] fleet_connect unreachable", error);
  }
  return false;
}
