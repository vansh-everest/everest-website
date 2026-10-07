/**
 * Google tags and events from the browser. Both ids are read at build time; one that does not
 * look like an id counts as unset.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const id = (value: string | undefined, shape: RegExp) => (value && shape.test(value) ? value : "");

/** A Tag Manager container, e.g. GTM-5PC2NFDV. Takes over from GA_ID when both are set. */
export const GTM_ID = id(process.env.NEXT_PUBLIC_GTM_ID, /^GTM-[A-Z0-9]+$/);
/** A GA4 property loaded on its own, e.g. G-4HGGTJ2JEN. */
export const GA_ID = id(process.env.NEXT_PUBLIC_GA_ID, /^G-[A-Z0-9]+$/);

/**
 * A form was sent and accepted: GA4's recommended lead event, tagged with which form. Under Tag
 * Manager it goes to the data layer, where the container's triggers (GA4, the Ads conversion)
 * pick it up; with GA4 alone it goes straight to gtag. With neither tag loaded it does nothing.
 */
export function trackLead(form: string): void {
  if (GTM_ID) {
    (window.dataLayer ??= []).push({ event: "generate_lead", form });
    return;
  }
  window.gtag?.("event", "generate_lead", { form });
}
