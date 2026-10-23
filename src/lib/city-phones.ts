/**
 * The visitor's city, as the top bar's picker keeps it, and each city's own phone number.
 *
 * A city with no number here keeps the main number (PHONE_HREF). Fill a slug with an E.164 number,
 * e.g. mumbai: "+919736364364", and every call link on a driver page switches to it for that city.
 * Business pages keep the main number (NOT_FOR_DRIVERS in components/home/city-picker.tsx).
 */
export const CITY_PHONES: Record<string, string> = {};

/** Cookie holding the chosen city's slug, so a choice outlives the visit. */
export const CITY_COOKIE = "ef_city";

/** Window event fired with the new slug whenever the city changes. */
export const CITY_EVENT = "ef-city";

/** "+918355897935" → { href: "tel:+918355897935", display: "83558 97935" }; null where the city has none. */
export function cityPhone(slug: string): { href: string; display: string } | null {
  const number = CITY_PHONES[slug];
  if (!number) return null;
  const local = number.replace(/^\+91/, "");
  return { href: `tel:${number}`, display: `${local.slice(0, 5)} ${local.slice(5)}` };
}
