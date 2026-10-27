import { cityPhone } from "./city-phones";
import { planFor, type Hub, type SiteContent } from "./content";
import { siteCityFor, type LiveData, type LivePlanPrice } from "./fleet-data";
import { PLAN_PAGES } from "./plan-pages";

/**
 * The figures behind the search pages (cars on rent per city, EV jobs), all from Jarvis's live
 * plan data and the admin's cities, so every number on them is the number a driver is quoted.
 */

export const RENT_ROOT = "/car-on-rent-for-uber";
export const rentPath = (slug: string) => `${RENT_ROOT}/${slug}`;

/** The plans in the order the pages list them, with each plan's own page. */
const ORDER = ["leasing", "drive-to-own", "own-now"] as const;

export type PlanFigure = { planId: string; name: string; path: string; rent: number | null; deposit: number | null; upfront: number | null };
export type RentCar = { name: string; fuel: string; plans: PlanFigure[] };
export type RentCity = {
  slug: string;
  name: string;
  state: string;
  readyCars: number;
  hubs: Hub[];
  phone: { href: string; display: string } | null;
  cars: RentCar[];
  /** Per plan, the lowest of each figure across the city's cars. */
  from: PlanFigure[];
};

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const lowest = (values: (number | null)[]) => {
  const real = values.filter((v): v is number => v !== null && v > 0);
  return real.length ? Math.min(...real) : null;
};

function figure(content: SiteContent, planId: string, price: LivePlanPrice | undefined): PlanFigure | null {
  const plan = planFor(content, planId);
  const page = PLAN_PAGES.find((p) => p.planId === planId);
  if (!plan?.visible || !page || !price) return null;
  if (price.rent === null && price.deposit === null && price.upfront === null) return null;
  return { planId, name: plan.name.en, path: `${page.path}/`, rent: price.rent, deposit: price.deposit, upfront: price.upfront };
}

/** One city's cars and plan figures; null when Jarvis prices no car there. */
export function rentCity(content: SiteContent, live: LiveData | null, slug: string, fuel?: RegExp): RentCity | null {
  const city = content.cities.find((c) => c.slug === slug);
  if (!city || !live) return null;
  const seen = new Set<string>();
  const cars: RentCar[] = [];
  for (const liveCity of live.cities.filter((c) => siteCityFor(c, content) === slug)) {
    for (const car of liveCity.cars) {
      const key = `${car.name}|${car.fuel}`.toLowerCase();
      if (seen.has(key) || (fuel && !fuel.test(car.fuel))) continue;
      const plans = ORDER.map((id) => figure(content, id, car.plans[id])).filter((p): p is PlanFigure => Boolean(p));
      if (!plans.length) continue;
      seen.add(key);
      cars.push({ name: car.name, fuel: car.fuel || "CNG", plans });
    }
  }
  if (!cars.length) return null;
  const from = ORDER.flatMap((id) => {
    const rows = cars.flatMap((c) => c.plans.filter((p) => p.planId === id));
    if (!rows.length) return [];
    const first = rows[0];
    return [{ ...first, rent: lowest(rows.map((r) => r.rent)), deposit: lowest(rows.map((r) => r.deposit)), upfront: lowest(rows.map((r) => r.upfront)) }];
  });
  return {
    slug,
    name: city.name.en,
    state: city.state,
    readyCars: city.readyCars,
    hubs: fuel ? city.hubs.filter((h) => !h.fuel || fuel.test(h.fuel)) : city.hubs,
    phone: cityPhone(slug),
    cars,
    from,
  };
}

/** Every city Jarvis prices a car in, in the admin's order. */
export function rentCities(content: SiteContent, live: LiveData | null, fuel?: RegExp): RentCity[] {
  return content.cities.flatMap((c) => {
    const view = rentCity(content, live, c.slug, fuel);
    return view ? [view] : [];
  });
}

/** "₹650 a day" for a plan's lowest daily figure, or its deposit / upfront when it has no rent. */
export function lead(f: PlanFigure): string {
  if (f.rent) return `${inr(f.rent)} a day`;
  if (f.deposit) return `${inr(f.deposit)} deposit`;
  if (f.upfront) return `${inr(f.upfront)} upfront`;
  return "";
}

/**
 * The figure a "car on rent from" line quotes: Drive To Earn (the rental plan) first, then Drive To
 * Own; Own Now's daily figure follows an upfront payment, so it is quoted only where nothing else is.
 */
export function cheapest(figures: PlanFigure[]): PlanFigure | null {
  for (const id of ["leasing", "drive-to-own", "own-now"]) {
    const f = figures.find((x) => x.planId === id && x.rent);
    if (f) return f;
  }
  return null;
}

/** Car names as a reader says them: "WagonR, Dzire and S-Presso". */
export function listNames(names: string[], joiner = "and"): string {
  const unique = [...new Set(names)];
  return unique.length <= 1 ? (unique[0] ?? "") : `${unique.slice(0, -1).join(", ")} ${joiner} ${unique.at(-1)}`;
}

/** "Aadhaar Card" → "Aadhaar card", "PAN Card" → "PAN card": document names mid-sentence. */
export const docName = (doc: string) => doc.split(" ").map((w, i) => (/^[A-Z]{2,}$/.test(w) || (i === 0 && w === "Aadhaar") ? w : w.toLowerCase())).join(" ");
