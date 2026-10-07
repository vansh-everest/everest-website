import { trackLead } from "@/lib/analytics";

/**
 * Posts a business enquiry to the shared lead endpoint.
 *
 * The lead record stores name, mobile, city, source and page. Every other field on these forms
 * (company, email, job title, cargo type, brand or agency) is kept as the lead's details once the
 * site is connected to Jarvis (see api/lead).
 */
export async function sendLead(data: FormData, source: string): Promise<boolean> {
  data.set("locale", "en");
  data.set("source", source);
  data.set("page", window.location.pathname);
  data.set("referrer", document.referrer);
  data.set("campaign", new URLSearchParams(window.location.search).toString());
  try {
    const res = await fetch("/api/lead/", { method: "POST", body: data });
    if (res.ok) trackLead(source);
    return res.ok;
  } catch {
    return false;
  }
}
