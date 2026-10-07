/**
 * Google Analytics events from the browser. With no NEXT_PUBLIC_GA_ID the tag is not loaded,
 * `gtag` does not exist, and these calls do nothing.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** A form was sent and accepted: GA4's recommended lead event, tagged with which form. */
export function trackLead(form: string): void {
  window.gtag?.("event", "generate_lead", { form });
}
