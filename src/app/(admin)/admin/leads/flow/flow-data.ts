import { isDriverForm, type UnifyLeadReport } from "@/lib/unify";

/**
 * The Leads flow page's numbers: every website submission from Jarvis, joined by lead id to what
 * Unify reports for the driver ones, cut by day, city, form, channel and campaign.
 */

/** A website submission as Jarvis lists it. */
export type JarvisLead = {
  id: number;
  name: string;
  mobile: string;
  city: string;
  source: string;
  page: string;
  locale: string;
  referrer: string;
  campaign: string;
  details: Record<string, string | number | boolean | null>;
  status: string;
  created_at: string;
};

/** Where a driver application is on its way to the CRM; "missing" never reached Unify. */
export type Stage = "sent" | "waiting" | "duplicate" | "held" | "refused" | "missing";

/** Stack order, bottom to top; the colours are the status steps, checked for colour-blind separation in this order. */
export const STAGES: { stage: Stage; label: string; note: string; color: string }[] = [
  { stage: "sent", label: "New in CRM", note: "Added as a new lead", color: "#0ca30c" },
  { stage: "waiting", label: "Waiting", note: "Queued or retrying", color: "#fab219" },
  { stage: "duplicate", label: "Duplicate", note: "Already in the CRM or Unify", color: "#5b6b80" },
  { stage: "held", label: "Held", note: "Waiting for the Unify switch", color: "#ec835a" },
  { stage: "refused", label: "Refused", note: "Turned down by the CRM", color: "#d03b3b" },
  { stage: "missing", label: "Not in Unify", note: "Never reached Unify", color: "#d6d5ce" },
];

const STAGE_OF: Record<string, Stage> = {
  sent: "sent",
  duplicate: "duplicate",
  suppressed: "duplicate",
  queued: "waiting",
  retrying: "waiting",
  held: "held",
  blocked: "refused",
  rejected: "refused",
  failed: "refused",
};

/** One submission with everything the page cuts it by. */
export type FlowLead = {
  id: number;
  day: string;
  hour: number;
  city: string;
  form: string;
  driver: boolean;
  channel: string;
  campaign: string;
  locale: string;
  deskStatus: string;
  stage: Stage | null;
  programme: string | null;
  crmMessage: string | null;
  crmLeadId: string | null;
  minutesToCrm: number | null;
  phoneLast4: string;
  receivedLabel: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Jarvis stores Indian time without a zone: "2026-10-24T14:42:10" is read as IST digits. */
function istParts(stamp: string): { day: string; hour: number; label: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(stamp);
  if (!m) return { day: stamp.slice(0, 10), hour: 0, label: stamp };
  return { day: `${m[1]}-${m[2]}-${m[3]}`, hour: Number(m[4]), label: `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]}, ${m[4]}:${m[5]}` };
}

export const dayLabel = (day: string) => `${Number(day.slice(8, 10))} ${MONTHS[Number(day.slice(5, 7)) - 1]}`;

const CITY_ALIASES: Record<string, string> = {
  bangalore: "Bengaluru",
  bengaluru: "Bengaluru",
  delhi: "Delhi NCR",
  "delhi-ncr": "Delhi NCR",
  "delhi ncr": "Delhi NCR",
  ncr: "Delhi NCR",
  gurgaon: "Delhi NCR",
  gurugram: "Delhi NCR",
  noida: "Delhi NCR",
  bombay: "Mumbai",
  calcutta: "Kolkata",
};

/** "bengaluru", "Bangalore " and "BENGALURU" are one city on the page. */
export function cityLabel(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/_/g, "-");
  if (!key) return "No city";
  if (CITY_ALIASES[key]) return CITY_ALIASES[key];
  return key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const SOURCE_NAMES: Record<string, string> = { whatsapp: "WhatsApp", youtube: "YouTube", linkedin: "LinkedIn", google: "Google", bing: "Bing", sms: "SMS", email: "Email" };

const PAID = /^(cpc|ppc|paid|paidsocial|paid_social|paid-social|ads?|display|sem)$/i;

/** The channel a submission came through, from its page's query string first and its referrer second. */
export function channelOf(campaign: string, referrer: string): string {
  const q = new URLSearchParams(campaign.replace(/^\?/, ""));
  const source = (q.get("utm_source") ?? "").trim().toLowerCase();
  const medium = (q.get("utm_medium") ?? "").trim().toLowerCase();
  if (q.has("gclid") || q.has("gbraid") || q.has("wbraid") || (source === "google" && PAID.test(medium))) return "Google Ads";
  if (q.has("fbclid") || /^(facebook|fb|instagram|ig|meta)$/.test(source)) return PAID.test(medium) || q.has("fbclid") ? "Meta Ads" : "Facebook & Instagram";
  if (source) return SOURCE_NAMES[source] ?? source.charAt(0).toUpperCase() + source.slice(1);
  let host = "";
  try {
    host = referrer ? new URL(referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    host = "";
  }
  if (!host || /everestfleet\.(com|in)$/.test(host) || host.endsWith("amplifyapp.com")) return "Direct";
  if (/(^|\.)google\./.test(host) || /(^|\.)bing\.com$/.test(host) || /duckduckgo\.com$/.test(host)) return "Search";
  if (/facebook\.com$|instagram\.com$|fb\.com$/.test(host)) return "Facebook & Instagram";
  if (/youtube\.com$|youtu\.be$/.test(host)) return "YouTube";
  if (/whatsapp\.com$|wa\.me$/.test(host)) return "WhatsApp";
  if (/linkedin\.com$|lnkd\.in$/.test(host)) return "LinkedIn";
  return host;
}

/** utm_campaign, or "–" for submissions without one. */
export function campaignOf(campaign: string): string {
  return new URLSearchParams(campaign.replace(/^\?/, "")).get("utm_campaign")?.trim() || "–";
}

const LOCALES: Record<string, string> = { en: "English", hi: "Hindi", mr: "Marathi", ta: "Tamil", te: "Telugu", kn: "Kannada", bn: "Bengali" };

/** Joins Jarvis's submissions to Unify's reports by the lead id the website gave both. */
export function joinLeads(leads: JarvisLead[], reports: UnifyLeadReport[]): FlowLead[] {
  const byId = new Map(reports.map((r) => [r.lead_id, r]));
  return leads.map((lead) => {
    const when = istParts(lead.created_at);
    const driver = isDriverForm(lead.source);
    const report = driver ? byId.get(String(lead.details?.lead_id ?? "")) : undefined;
    const stage: Stage | null = !driver ? null : !report ? "missing" : report.status ? (STAGE_OF[report.status] ?? "waiting") : "waiting";
    const minutes =
      report?.received_at && report.sent_at && stage === "sent"
        ? Math.max(0, Math.round((Date.parse(report.sent_at) - Date.parse(report.received_at)) / 60_000))
        : null;
    const digits = lead.mobile.replace(/\D/g, "");
    return {
      id: lead.id,
      day: when.day,
      hour: when.hour,
      city: cityLabel(lead.city),
      form: lead.source || "unknown",
      driver,
      channel: channelOf(lead.campaign ?? "", lead.referrer ?? ""),
      campaign: campaignOf(lead.campaign ?? ""),
      locale: LOCALES[lead.locale] ?? (lead.locale || "–"),
      deskStatus: lead.status,
      stage,
      programme: report?.programme ?? null,
      crmMessage: report?.crm_message ?? null,
      crmLeadId: report?.crm_lead_id ?? null,
      minutesToCrm: minutes,
      phoneLast4: digits.slice(-4),
      receivedLabel: when.label,
    };
  });
}

export type Counts = Record<Stage, number> & { total: number; driver: number; converted: number };
export const emptyCounts = (): Counts => ({
  total: 0,
  driver: 0,
  converted: 0,
  sent: 0,
  waiting: 0,
  duplicate: 0,
  held: 0,
  refused: 0,
  missing: 0,
});

function add(c: Counts, lead: FlowLead) {
  c.total += 1;
  if (lead.deskStatus === "converted") c.converted += 1;
  if (lead.stage) {
    c.driver += 1;
    c[lead.stage] += 1;
  }
}

/** Counts per key, biggest first. */
export function tally(leads: FlowLead[], key: (lead: FlowLead) => string): [string, Counts][] {
  const out = new Map<string, Counts>();
  for (const lead of leads) {
    const k = key(lead);
    const c = out.get(k) ?? emptyCounts();
    add(c, lead);
    out.set(k, c);
  }
  return [...out.entries()].sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]));
}

export function totals(leads: FlowLead[]): Counts {
  const c = emptyCounts();
  for (const lead of leads) add(c, lead);
  return c;
}

/** Every day from `from` to `to` (YYYY-MM-DD, inclusive), so quiet days show as gaps, not missing columns. */
export function daySpan(from: string, to: string): string[] {
  const out: string[] = [];
  const end = Date.parse(`${to}T00:00:00Z`);
  for (let t = Date.parse(`${from}T00:00:00Z`); t <= end && out.length < 400; t += 86_400_000) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
}

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/** "42%" of a whole; "–" when there is nothing to divide by. */
export const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "–");
