/** The forms a driver applies through. Business enquiries, Dost sign-ups and EIP are the rest. */
export function isDriverForm(source: string): boolean {
  return ["home", "drive-with-us", "our-plans", "about-us"].includes(source) || /^(plan|city|rent|guide)\//.test(source);
}

const BUSINESS = /^(fleet-logistics|employee-mobility|intercity|advertise-with-us|our-services)(\/|$)/;

/** What kind of lead a form produces, as GA4 reports it. */
export function leadType(source: string): "driver" | "business" | "dost" | "other" {
  if (isDriverForm(source)) return "driver";
  if (BUSINESS.test(source)) return "business";
  if (source === "everest-dost") return "dost";
  return "other";
}
