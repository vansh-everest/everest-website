/**
 * Google tags and events from the browser. Both ids are read at build time; one that does not
 * look like an id counts as unset.
 */
import { leadType } from "./forms";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

const id = (value: string | undefined, shape: RegExp) => (value && shape.test(value) ? value : "");

/** A Tag Manager container, e.g. GTM-5PC2NFDV. Takes over from GA_ID when both are set. */
export const GTM_ID = id(process.env.NEXT_PUBLIC_GTM_ID, /^GTM-[A-Z0-9]+$/);
/** A GA4 property loaded on its own, e.g. G-4HGGTJ2JEN. */
export const GA_ID = id(process.env.NEXT_PUBLIC_GA_ID, /^G-[A-Z0-9]+$/);
/**
 * Everest's Meta dataset (Pixel), the one that already takes the CRM stage events. It is public,
 * so it ships in code; NEXT_PUBLIC_META_PIXEL_ID overrides it.
 */
export const META_PIXEL_ID = id(process.env.NEXT_PUBLIC_META_PIXEL_ID || "1101186622268082", /^\d{10,20}$/);

/**
 * A form was sent and accepted: GA4's recommended lead event, tagged with the form, the kind of lead
 * (driver, business, dost) and the city the visitor chose. Under Tag
 * Manager it goes to the data layer, where the container's triggers (GA4, the Ads conversion)
 * pick it up; with GA4 alone it goes straight to gtag. With neither tag loaded it does nothing.
 */
export function trackLead(form: string, data?: FormData, res?: Response): void {
  const lead = { form, lead_type: leadType(form), city: String(data?.get("city") ?? "").trim().toLowerCase() || undefined };
  if (GTM_ID) (window.dataLayer ??= []).push({ event: "generate_lead", ...lead });
  else window.gtag?.("event", "generate_lead", lead);
  if (lead.lead_type === "driver" && res) void metaLead(res, lead.city);
}

/**
 * Meta's Lead event, for driver applications only, so ad sets optimising for Lead learn from
 * drivers and not from business enquiries. Its eventID is the website's lead ID (the same ID
 * Unify and Jarvis hold), so Meta can dedupe it against the server-side stage events.
 */
async function metaLead(res: Response, city?: string): Promise<void> {
  if (!window.fbq) return;
  let leadId: string | undefined;
  try {
    leadId = ((await res.clone().json()) as { lead_id?: string }).lead_id;
  } catch {}
  window.fbq("track", "Lead", city ? { city } : {}, leadId ? { eventID: leadId } : undefined);
}
