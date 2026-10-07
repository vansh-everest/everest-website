import "server-only";
import { unstable_cache } from "next/cache";
import type { CityPrices, Hub, Price, SiteContent } from "@/lib/content";
import { fleetConnectEnabled, fleetGet } from "@/lib/jarvis";

/**
 * Live fleet figures from Jarvis, read through fleet_connect: the cities Everest leases in, the
 * cars ready to hand over in each, their hubs, and every plan's rent, deposit and upfront per
 * city, as the driver app quotes them.
 *
 * The admin's content stays the source for words, photos and which cars and cities the site
 * shows. Jarvis supplies the numbers: ready cars per city, plan prices per city (and the lowest of
 * them as the national "starting from"), and hubs for a city whose hub list the admin left empty.
 * With fleet_connect unset, or Jarvis unreachable, the site shows the admin's numbers.
 */

export const FLEET_DATA_TAG = "fleet-data";
/** Pages that show live figures refresh at this pace; a publish refreshes them at once. */
const REFRESH_SECONDS = 900;
/** Calls to fleet_connect in flight at once while gathering a refresh. */
const PARALLEL = 4;

/* ------------------------------------------------------------------- Jarvis's shapes */

type JarvisHub = { id: number; name: string | null; address: string | null; map_url: string | null };
type JarvisCity = {
  id: number;
  name: string;
  uri: string | null;
  language: string | null;
  recommended_car: string | null;
  ready_cars: number;
  hubs: JarvisHub[];
};
type JarvisCar = {
  car_name: string;
  car_fuel_type: string | null;
  recommended?: boolean;
  car_creative?: { image?: string }[];
  min_sd_amount: number | string | null;
  rent: number | string | null;
};
type JarvisPlanOption = {
  plan_uri: string;
  rent_info?: { min_amount: number | string; max_amount: number | string } | null;
  min_sd_amount?: string | null;
  upfront_fee?: string | null;
};
type JarvisPlanCategory = { uri: string; options?: JarvisPlanOption[] };

/** Jarvis's plan names for the site's plans. */
const PLAN_IDS: Record<string, string> = {
  "own-now": "own-now",
  "drive-to-own": "drive-to-own",
  "dte-single": "leasing",
  "rev-share": "revenue-share",
};

/* ----------------------------------------------------------------------- what we keep */

export type LivePlanPrice = { rent: number | null; deposit: number | null; upfront: number | null };

export type LiveCar = {
  name: string;
  fuel: string;
  rent: number | null;
  deposit: number | null;
  photo: string | null;
  recommended: boolean;
  plans: Record<string, LivePlanPrice>;
};

export type LiveCity = {
  id: number;
  name: string;
  uri: string | null;
  language: string | null;
  recommendedCar: string | null;
  readyCars: number;
  hubs: Hub[];
  cars: LiveCar[];
};

export type LiveData = { at: string; cities: LiveCity[] };

/* --------------------------------------------------------------------------- reading */

/** Anything above this is a data slip, not a price. */
const MAX_RUPEES = 10_000_000;

/** "₹15000.00", 650, "₹45000-₹90000" → the first figure in whole rupees; zero and nonsense → null. */
export function money(value: unknown): number | null {
  let n: number;
  if (typeof value === "number") n = value;
  else if (typeof value === "string") {
    const found = value.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
    if (!found) return null;
    n = Number(found[0]);
  } else return null;
  const rupees = Math.round(n);
  return Number.isFinite(rupees) && rupees > 0 && rupees <= MAX_RUPEES ? rupees : null;
}

/** Jarvis's map links, kept only when they are plain https addresses. */
function mapLink(url: string | null): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).protocol === "https:" ? url : undefined;
  } catch {
    return undefined;
  }
}

const lowest = (values: (number | null)[]): number | null => {
  const real = values.filter((v): v is number => v !== null);
  return real.length ? Math.min(...real) : null;
};

async function pool<T, R>(items: T[], run: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await run(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(PARALLEL, items.length) }, worker));
  return out;
}

/**
 * One read through fleet_connect. Anything short of a fresh 200 throws, so a refresh that fails
 * part way keeps the last good figures instead of caching a gap; `missing` names the one answer
 * that means "nothing here" rather than "something broke".
 */
async function records<T>(path: string, missing?: 404): Promise<T | null> {
  const answer = await fleetGet<T>(path, { cache: "no-store" });
  if (answer.status === missing) return null;
  if (answer.status !== 200 || answer.stale) {
    throw new Error(`fleet_connect ${path.split("?")[0]} answered ${answer.status}${answer.stale ? " (stale)" : ""}`);
  }
  return answer.body.data?.records ?? null;
}

function planPrices(categories: JarvisPlanCategory[] | null): Record<string, LivePlanPrice> {
  const out: Record<string, LivePlanPrice> = {};
  for (const option of (categories ?? []).flatMap((c) => c.options ?? [])) {
    const id = PLAN_IDS[option.plan_uri];
    if (!id) continue;
    out[id] = {
      rent: money(option.rent_info?.min_amount),
      // Own Now's deposit is always zero; its money up front is the upfront. money() drops zeros.
      deposit: money(option.min_sd_amount),
      upfront: money(option.upfront_fee),
    };
  }
  return out;
}

async function readCity(city: JarvisCity): Promise<LiveCity> {
  const cars = (await records<JarvisCar[]>(`/everest_website/cars?city_id=${city.id}`)) ?? [];
  const priced = await pool(cars, async (car): Promise<LiveCar> => {
    const query = new URLSearchParams({ city_id: String(city.id), car_name: car.car_name });
    if (car.car_fuel_type) query.set("car_fuel_type", car.car_fuel_type);
    const plans = planPrices(await records<JarvisPlanCategory[]>(`/everest_website/plan-details?${query}`));
    return {
      name: car.car_name,
      fuel: car.car_fuel_type ?? "",
      rent: money(car.rent),
      deposit: money(car.min_sd_amount),
      photo: car.car_creative?.find((c) => c.image)?.image ?? null,
      recommended: Boolean(car.recommended),
      plans,
    };
  });
  return {
    id: city.id,
    name: city.name,
    uri: city.uri,
    language: city.language,
    recommendedCar: city.recommended_car,
    readyCars: Math.max(0, Math.floor(Number(city.ready_cars) || 0)),
    hubs: (city.hubs ?? [])
      .filter((h) => h.name || h.address)
      .map((h) => ({ name: h.name || h.address || "", address: h.address ?? "", hours: "", mapUrl: mapLink(h.map_url) })),
    cars: priced,
  };
}

async function readLive(): Promise<LiveData | null> {
  // A 404 is a fleet_connect without the website routes yet: no figures, and that answer is cached.
  const cities = await records<JarvisCity[]>("/everest_website/cities", 404);
  if (!cities?.length) return null;
  return { at: new Date().toISOString(), cities: await pool(cities, readCity) };
}

/**
 * A failed refresh throws, which Next does not cache: the previous figures stay up and the next
 * render tries again. The page keeps its fifteen-minute refresh either way, since Next records the
 * revalidate before running the read.
 */
const cachedLive = unstable_cache(readLive, ["fleet-data", "v2"], { revalidate: REFRESH_SECONDS, tags: [FLEET_DATA_TAG] });

/** Jarvis's figures and, when the last read failed with nothing to fall back on, why. */
export async function getLiveStatus(): Promise<{ live: LiveData | null; error: string | null }> {
  if (!fleetConnectEnabled()) return { live: null, error: null };
  try {
    return { live: await cachedLive(), error: null };
  } catch (error) {
    return { live: null, error: error instanceof Error ? error.message : String(error) };
  }
}

/** Jarvis's figures, at most fifteen minutes old; null when fleet_connect is unset or has none. */
export async function getLiveData(): Promise<LiveData | null> {
  return (await getLiveStatus()).live;
}

/* --------------------------------------------------------------------------- matching */

const key = (s: string | null | undefined) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/** Names Jarvis uses for the site's cities. Several Jarvis cities can make up one site city. */
const CITY_NAMES: Record<string, string[]> = {
  delhi: ["delhi", "delhincr", "newdelhi", "ncr", "gurgaon", "gurugram", "noida", "ghaziabad", "faridabad"],
  bengaluru: ["bengaluru", "bangalore"],
  mumbai: ["mumbai", "bombay", "navimumbai", "thane"],
  kolkata: ["kolkata", "calcutta"],
  chennai: ["chennai", "madras"],
  hyderabad: ["hyderabad", "secunderabad"],
  pune: ["pune"],
};

/** Jarvis's fleet names for the site's cars, where they differ from the showroom name. */
const CAR_NAMES: Record<string, string[]> = {
  xprest: ["tigorev", "tigor", "xprestev"],
  wagonr: ["wagonr", "wagonrcng"],
};

/** The site city a Jarvis city belongs to, by slug, English name, or a known Jarvis name. */
export function siteCityFor(city: Pick<LiveCity, "name" | "uri">, content: SiteContent): string | null {
  const names = [key(city.name), key(city.uri)].filter(Boolean);
  for (const c of content.cities) {
    const known = [key(c.slug), key(c.name.en), ...(CITY_NAMES[c.slug] ?? [])];
    if (names.some((n) => known.includes(n))) return c.slug;
  }
  return null;
}

/** The site car a Jarvis car name stands for, by name, make and name, or a known fleet name. */
export function siteCarFor(name: string, content: SiteContent): string | null {
  const n = key(name);
  const aliases = CAR_NAMES[n] ?? [];
  for (const car of content.cars) {
    const own = [key(car.name), key(`${car.make}${car.name}`), key(car.id)];
    if (own.includes(n) || aliases.some((a) => own.includes(a))) return car.id;
  }
  return null;
}

/* --------------------------------------------------------------------------- overlay */

const digits = (n: number | null) => (n === null ? "" : String(n));

function merge(prices: CityPrices, slug: string, live: LivePlanPrice): CityPrices {
  const next: Partial<Price> = { ...prices[slug] };
  if (live.rent !== null) {
    next.amount = digits(live.rent);
    next.unit = "/day";
  }
  if (live.deposit !== null) next.deposit = digits(live.deposit);
  if (live.upfront !== null) next.upfront = digits(live.upfront);
  return { ...prices, [slug]: next };
}

/**
 * The content with Jarvis's figures laid over it. Pure: the same content and data always give the
 * same page, so the overlay never needs caching of its own.
 */
export function withLiveData(content: SiteContent, live: LiveData | null): SiteContent {
  if (!live) return content;

  const bySlug = new Map<string, LiveCity[]>();
  for (const city of live.cities) {
    const slug = siteCityFor(city, content);
    if (slug) bySlug.set(slug, [...(bySlug.get(slug) ?? []), city]);
  }
  if (!bySlug.size) return content;

  /** Per site plan, per site city: the lowest of each figure across that city's cars. */
  const planCity = new Map<string, Map<string, LivePlanPrice>>();
  for (const [slug, cities] of bySlug) {
    const cars = cities.flatMap((c) => c.cars);
    for (const planId of Object.values(PLAN_IDS)) {
      const quotes = cars.map((car) => car.plans[planId]).filter(Boolean);
      if (!quotes.length) continue;
      const price = {
        rent: lowest(quotes.map((q) => q.rent)),
        deposit: lowest(quotes.map((q) => q.deposit)),
        upfront: lowest(quotes.map((q) => q.upfront)),
      };
      if (price.rent === null && price.deposit === null && price.upfront === null) continue;
      if (!planCity.has(planId)) planCity.set(planId, new Map());
      planCity.get(planId)!.set(slug, price);
    }
  }

  return {
    ...content,
    cities: content.cities.map((city) => {
      const found = bySlug.get(city.slug);
      if (!found) return city;
      return {
        ...city,
        readyCars: found.reduce((sum, c) => sum + c.readyCars, 0),
        hubs: city.hubs.length ? city.hubs : found.flatMap((c) => c.hubs),
      };
    }),
    plans: content.plans.map((plan) => {
      const live = planCity.get(plan.id);
      if (!live) return plan;
      let cityPrices = plan.cityPrices;
      for (const [slug, price] of live) cityPrices = merge(cityPrices, slug, price);
      const all = [...live.values()];
      const national = merge({ all: plan.price }, "all", {
        rent: lowest(all.map((p) => p.rent)),
        deposit: lowest(all.map((p) => p.deposit)),
        upfront: lowest(all.map((p) => p.upfront)),
      }).all;
      return { ...plan, cityPrices, price: { ...plan.price, ...national } };
    }),
  };
}
