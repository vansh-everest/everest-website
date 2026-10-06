/**
 * Posts a business enquiry to the shared lead endpoint.
 *
 * The lead record stores name, mobile, city, source and page. Every other field on these forms
 * (company, email, job title, cargo type, brand or agency) is sent with the record but dropped by
 * the endpoint until the record grows fields for them.
 */
export async function sendLead(data: FormData, source: string): Promise<boolean> {
  data.set("locale", "en");
  data.set("source", source);
  data.set("page", window.location.pathname);
  data.set("referrer", document.referrer);
  data.set("campaign", new URLSearchParams(window.location.search).toString());
  try {
    const res = await fetch("/api/lead/", { method: "POST", body: data });
    return res.ok;
  } catch {
    return false;
  }
}
