import "server-only";

/**
 * Driver leads go on from the website to Unify, the recruitment desk's tool, which sends them to
 * the CRM with every other lead source: one queue, the desk's duplicate rules, retries, and its
 * own switch for when the website's leads start reaching the CRM.
 *
 * UNIFY_LEADS_URL is Unify's address (https://unify-staging.everestfleet.com); UNIFY_LEADS_KEY is
 * the key Unify holds as WEBSITE_LEADS_KEY. Without both, nothing is sent.
 */
const base = () => (process.env.UNIFY_LEADS_URL ?? "").replace(/\/+$/, "");
const key = () => process.env.UNIFY_LEADS_KEY ?? "";
const PATH = "/api/public/website-leads";

export const unifyEnabled = () => Boolean(base() && key());

/** The forms a driver applies through; only these go on to Unify. */
export { isDriverForm } from "./forms";

export type UnifyLead = {
  lead_id: string;
  name: string;
  phone: string;
  city: string;
  form: string;
  page: string;
  campaign: string;
  locale: string;
  submitted_at: string;
};

/** True once Unify has the lead. A failure is logged; the lead is already stored on the website. */
export async function sendToUnify(lead: UnifyLead): Promise<boolean> {
  if (!unifyEnabled()) return false;
  try {
    const res = await fetch(`${base()}${PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key()}` },
      body: JSON.stringify(lead),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) return true;
    console.error("[lead] Unify refused the lead", res.status, (await res.text()).slice(0, 200));
  } catch (error) {
    console.error("[lead] Unify unreachable", error);
  }
  return false;
}

const BATCH = 200;

/**
 * Many leads at once, BATCH a request (Unify takes up to 500). Unify keys each lead by its
 * lead_id, so sending one again counts as a duplicate and changes nothing. Null when Unify is
 * not set up; `failed` when a batch was refused or Unify stopped answering partway.
 */
export async function sendManyToUnify(
  leads: UnifyLead[]
): Promise<{ sent: number; new: number; duplicates: number; rejected: number; failed: boolean } | null> {
  if (!unifyEnabled()) return null;
  const out = { sent: 0, new: 0, duplicates: 0, rejected: 0, failed: false };
  for (let i = 0; i < leads.length; i += BATCH) {
    const batch = leads.slice(i, i + BATCH);
    try {
      const res = await fetch(`${base()}${PATH}`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key()}` },
        body: JSON.stringify({ leads: batch }),
        cache: "no-store",
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) {
        console.error("[lead] Unify refused a batch", res.status, (await res.text()).slice(0, 200));
        return { ...out, failed: true };
      }
      const body = (await res.json()) as { new?: number; duplicates?: number; rejected?: unknown[] };
      out.sent += batch.length;
      out.new += body.new ?? 0;
      out.duplicates += body.duplicates ?? 0;
      out.rejected += body.rejected?.length ?? 0;
    } catch (error) {
      console.error("[lead] Unify unreachable", error);
      return { ...out, failed: true };
    }
  }
  return out;
}

/** One website lead as Unify reports it: where it is on the way to the CRM. */
export type UnifyLeadReport = {
  lead_id: string;
  form: string | null;
  city: string | null;
  programme: string | null;
  phone_last4: string | null;
  crm_lead_id: string | null;
  status: string | null;
  crm_message: string | null;
  crm_source_id: number | null;
  submitted_at: string | null;
  received_at: string | null;
  sent_at: string | null;
};

const UNIFY_PAGE = 2000;
const UNIFY_PAGES = 5;

/**
 * The website's leads in Unify since `since`, oldest first; null when Unify is not set up or not
 * answering. Unify answers 2,000 at a time, so later pages start where the last one ended.
 */
export async function readUnifyLeads(since: Date): Promise<{ leads: UnifyLeadReport[]; truncated: boolean } | null> {
  if (!unifyEnabled()) return null;
  const seen = new Map<string, UnifyLeadReport>();
  let from = since.toISOString();
  try {
    for (let page = 0; page < UNIFY_PAGES; page++) {
      const query = new URLSearchParams({ since: from, limit: String(UNIFY_PAGE) });
      const res = await fetch(`${base()}${PATH}?${query}`, {
        headers: { authorization: `Bearer ${key()}` },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        console.error("[leads flow] Unify answered", res.status);
        return null;
      }
      const body = (await res.json()) as { leads?: UnifyLeadReport[]; truncated?: boolean };
      const leads = body.leads ?? [];
      for (const lead of leads) seen.set(lead.lead_id, lead);
      const last = leads[leads.length - 1]?.received_at;
      if (!body.truncated || !last || last === from) return { leads: [...seen.values()], truncated: false };
      from = last;
    }
    return { leads: [...seen.values()], truncated: true };
  } catch (error) {
    console.error("[leads flow] Unify unreachable", error);
    return null;
  }
}

/* --------------------------------------------------------------------------- call taps */

const CALLS_PATH = "/api/public/website-calls";

/** A tap on one of the site's call buttons. Nothing about the visitor: only the number, the page and the visit's source. */
export type CallTap = {
  call_id: string;
  phone: string;
  city: string | null;
  page: string;
  landing: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  locale: string | null;
  clicked_at: string;
};

export type CallTapReport = CallTap & { kind: string; received_at: string };

/** Posts one tap to Unify, which keeps it for the admin's calls page. A failure is logged and dropped. */
export async function sendCallToUnify(tap: CallTap): Promise<boolean> {
  if (!unifyEnabled()) return false;
  try {
    const res = await fetch(`${base()}${CALLS_PATH}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key()}` },
      body: JSON.stringify(tap),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) return true;
    console.error("[call] Unify refused the tap", res.status, (await res.text()).slice(0, 200));
  } catch (error) {
    console.error("[call] Unify unreachable", error);
  }
  return false;
}

/** The taps Unify holds since `since`, oldest first; null when Unify is not set up or not answering. */
export async function readUnifyCalls(since: Date): Promise<{ calls: CallTapReport[]; truncated: boolean } | null> {
  if (!unifyEnabled()) return null;
  const seen = new Map<string, CallTapReport>();
  let from = since.toISOString();
  try {
    for (let page = 0; page < UNIFY_PAGES; page++) {
      const query = new URLSearchParams({ since: from, limit: String(UNIFY_PAGE) });
      const res = await fetch(`${base()}${CALLS_PATH}?${query}`, {
        headers: { authorization: `Bearer ${key()}` },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        console.error("[calls] Unify answered", res.status);
        return null;
      }
      const body = (await res.json()) as { calls?: CallTapReport[]; truncated?: boolean };
      const calls = body.calls ?? [];
      for (const call of calls) seen.set(call.call_id, call);
      const last = calls[calls.length - 1]?.received_at;
      if (!body.truncated || !last || last === from) return { calls: [...seen.values()], truncated: false };
      from = last;
    }
    return { calls: [...seen.values()], truncated: true };
  } catch (error) {
    console.error("[calls] Unify unreachable", error);
    return null;
  }
}
