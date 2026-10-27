import { cityPhone } from "./city-phones";
import { planFor, priceIn, rupees, type Hub, type SiteContent } from "./content";
import { siteCityFor, type LiveData } from "./fleet-data";
import { PLAN_PAGES } from "./plan-pages";

/**
 * The facts behind the search pages: which cars each city runs (Jarvis's live data) and each
 * plan's deposit, upfront and term as the city job pages show them (the admin's plan prices).
 * Daily rent is never published on the site, so it is not read here at all.
 */

export { RENT_ROOT, rentPath } from "./search-pages";

/** The plans in the order the pages list them. */
const ORDER = ["leasing", "drive-to-own", "own-now"] as const;

export type PlanRef = { planId: string; name: string; path: string };
/** A plan in one city: the figures a city job page shows, blank where the admin has none. */
export type PlanTerms = PlanRef & { deposit: string; upfront: string; months: number | null };
export type CityCar = { name: string; fuel: string; plans: PlanRef[] };
export type CityFacts = {
  slug: string;
  name: string;
  state: string;
  readyCars: number;
  hubs: Hub[];
  phone: { href: string; display: string } | null;
  cars: CityCar[];
  plans: PlanTerms[];
};

function planRef(content: SiteContent, planId: string): PlanRef | null {
  const plan = planFor(content, planId);
  const page = PLAN_PAGES.find((p) => p.planId === planId);
  if (!plan?.visible || !page) return null;
  return { planId, name: plan.name.en, path: `${page.path}/` };
}

/** Every visible plan with a page of its own, in page order, without figures (they differ by city). */
export function planRefs(content: SiteContent): PlanRef[] {
  return ORDER.map((id) => planRef(content, id)).filter((p): p is PlanRef => Boolean(p));
}

/** One city's cars, plans and hubs; null for a slug the admin does not list. */
export function cityFacts(content: SiteContent, live: LiveData | null, slug: string, fuel?: RegExp): CityFacts | null {
  const city = content.cities.find((c) => c.slug === slug);
  if (!city) return null;
  const seen = new Set<string>();
  const cars: CityCar[] = [];
  for (const liveCity of (live?.cities ?? []).filter((c) => siteCityFor(c, content) === slug)) {
    for (const car of liveCity.cars) {
      const key = `${car.name}|${car.fuel}`.toLowerCase();
      if (seen.has(key) || (fuel && !fuel.test(car.fuel))) continue;
      const plans = ORDER.filter((id) => car.plans[id]).map((id) => planRef(content, id)).filter((p): p is PlanRef => Boolean(p));
      if (!plans.length) continue;
      seen.add(key);
      cars.push({ name: car.name, fuel: car.fuel || "CNG", plans });
    }
  }
  const plans = ORDER.filter((id) => city.plans.includes(id)).flatMap((id) => {
    const ref = planRef(content, id);
    const plan = planFor(content, id);
    if (!ref || !plan) return [];
    const price = priceIn(plan.price, plan.cityPrices, slug);
    return [{ ...ref, deposit: rupees(price.deposit), upfront: rupees(price.upfront), months: Number(price.tenureMonths) || null }];
  });
  return {
    slug,
    name: city.name.en,
    state: city.state,
    readyCars: city.readyCars,
    hubs: fuel ? city.hubs.filter((h) => !h.fuel || fuel.test(h.fuel)) : city.hubs,
    phone: cityPhone(slug),
    cars,
    plans,
  };
}

/** Every city in the admin's order; with `fuel`, only the cities running such a car. */
export function allCityFacts(content: SiteContent, live: LiveData | null, fuel?: RegExp): CityFacts[] {
  return content.cities.flatMap((c) => {
    const facts = cityFacts(content, live, c.slug, fuel);
    return facts && (!fuel || facts.cars.length) ? [facts] : [];
  });
}

/** "Drive To Own: ₹10,000 refundable deposit" for each plan with a figure, as a city job page lists them. */
export function planLines(plans: PlanTerms[]): string[] {
  return plans.flatMap((p) => {
    const money = p.deposit ? `${p.deposit} refundable deposit` : p.upfront ? `${p.upfront} upfront` : "";
    const term = p.months ? `${p.months}-month term` : "";
    const detail = [money, term].filter(Boolean).join(", ");
    return detail ? [`${p.name}: ${detail}`] : [];
  });
}

/** Car names as a reader says them: "WagonR, Dzire and S-Presso". */
export function listNames(names: string[], joiner = "and"): string {
  const unique = [...new Set(names)];
  return unique.length <= 1 ? (unique[0] ?? "") : `${unique.slice(0, -1).join(", ")} ${joiner} ${unique.at(-1)}`;
}

/** "Aadhaar Card" → "Aadhaar card", "PAN Card" → "PAN card": document names mid-sentence. */
export const docName = (doc: string) => doc.split(" ").map((w, i) => (/^[A-Z]{2,}$/.test(w) || (i === 0 && w === "Aadhaar") ? w : w.toLowerCase())).join(" ");

/** "9 am to 7 pm, every day" for a hub, or its hours as entered. */
export const hubHours = (hub: Hub) => (hub.hours ? (hub.daily ? `${hub.hours}, every day` : hub.hours) : "");

/** Cars ready across the cities, as one figure. */
export const readyTotal = (cities: { readyCars: number }[]) => cities.reduce((s, c) => s + c.readyCars, 0);
