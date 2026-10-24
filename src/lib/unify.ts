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

/** The forms a driver applies through. Business enquiries, Dost sign-ups and EIP stay on the website. */
export function isDriverForm(source: string): boolean {
  return ["home", "drive-with-us", "our-plans", "about-us"].includes(source) || /^(plan|city)\//.test(source);
}

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

/** The website's leads in Unify since `since`, oldest first; null when Unify is not set up or not answering. */
export async function readUnifyLeads(since: Date, limit = 2000): Promise<{ leads: UnifyLeadReport[]; truncated: boolean } | null> {
  if (!unifyEnabled()) return null;
  try {
    const query = new URLSearchParams({ since: since.toISOString(), limit: String(limit) });
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
    return { leads: body.leads ?? [], truncated: Boolean(body.truncated) };
  } catch (error) {
    console.error("[leads flow] Unify unreachable", error);
    return null;
  }
}
