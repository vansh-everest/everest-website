import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { fleetConnectEnabled, fleetSend } from "@/lib/jarvis";
import { appendLead, type Lead } from "@/lib/leads";
import { UNKNOWN_CALLER, callerKey, tooMany } from "@/lib/throttle";
import { isDriverForm, sendToUnify } from "@/lib/unify";

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
 *
 * A driver form's lead also goes to Unify (lib/unify.ts), which sends it on to the CRM. Each
 * submission gets an ID, kept with the lead in Jarvis too, so the two can be matched.
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

  const leadId = randomUUID();
  details.lead_id = leadId;
  if (!(await sentToJarvis(lead, details))) await appendLead(lead);

  if (isDriverForm(lead.source)) {
    await sendToUnify({
      lead_id: leadId,
      name: lead.name,
      phone: lead.mobile,
      city: lead.city,
      form: lead.source,
      page: lead.page,
      campaign: lead.campaign,
      locale: lead.locale,
      submitted_at: lead.at,
    });
  }

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

  return NextResponse.json({ ok: true, lead_id: leadId });
}

/**
 * With a reCAPTCHA secret set, a lead needs a token Google accepts; with none there is no check.
 * RECAPTCHA_V3_SECRET_KEY is the invisible mode's: its token passes at a score of MIN_SCORE or more
 * for the "lead" action. A token it refuses is tried against RECAPTCHA_SECRET_KEY (the checkbox),
 * so pages cached before a switch between modes keep working. A build that ships the invisible
 * site key (inlined at build time, so the server knows too) while the server has no v3 secret lets
 * leads through and logs it: that is a deploy that set the key before the secret, and it must not
 * turn every driver away. The mode is never read from the request, so a sender cannot pick it.
 * Google not answering also lets the lead through, logged: a lost driver costs more than one bot.
 */
const MIN_SCORE = 0.3;
const INVISIBLE_BUILD = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY);

async function captchaPassed(token: string): Promise<boolean> {
  const v3 = process.env.RECAPTCHA_V3_SECRET_KEY;
  const v2 = process.env.RECAPTCHA_SECRET_KEY;
  if (!v3 && !v2) return true;
  if (INVISIBLE_BUILD && !v3) {
    console.error("[lead] invisible reCAPTCHA site key is built in but RECAPTCHA_V3_SECRET_KEY is not set: lead accepted unchecked");
    return true;
  }
  if (!token) return false;
  try {
    if (v3) {
      const answer = await verify(v3, token);
      if (answer.success && (!answer.action || answer.action === "lead")) {
        const score = answer.score ?? 0;
        if (score < MIN_SCORE) console.warn("[lead] captcha score too low", score);
        return score >= MIN_SCORE;
      }
      if (!v2) {
        console.warn("[lead] captcha refused", answer["error-codes"], answer.action);
        return false;
      }
    }
    const answer = await verify(v2 as string, token);
    if (!answer.success) console.warn("[lead] captcha refused", answer["error-codes"]);
    return answer.success === true;
  } catch (error) {
    console.error("[lead] captcha check unreachable, lead accepted", error);
    return true;
  }
}

async function verify(secret: string, token: string): Promise<{ success?: boolean; score?: number; action?: string; "error-codes"?: string[] }> {
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
    signal: AbortSignal.timeout(5000),
  });
  return res.json();
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
