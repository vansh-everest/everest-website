import "server-only";
import { unstable_cache } from "next/cache";
import type { CityPrices, Hub, ImageSlot, Price, SiteContent } from "@/lib/content";
import { fleetConnectEnabled, fleetGet } from "@/lib/jarvis";

/**
 * Live fleet figures from Jarvis, read through fleet_connect: the cities Everest leases in, the
 * cars ready to hand over in each, their hubs, and every plan's rent, deposit and upfront per
 * city, as the driver app quotes them.
 *
 * The admin's content stays the source for words, photos and which cars and cities the site
 * shows. Jarvis supplies the numbers: ready cars per city, plan prices per city, and hubs for a
 * city whose hub list the admin left empty. A city Jarvis has no prices for, and every page not
 * tied to a city, shows the admin's numbers, never another city's. With fleet_connect unset, or
 * Jarvis unreachable, the site shows the admin's numbers.
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
  rent: string | null;
  rent_info?: { min_amount: number | string; max_amount: number | string } | null;
  min_sd_amount?: string | null;
  upfront_fee?: string | null;
  car_year_screen?: boolean;
};
type JarvisPlanCategory = { uri: string; options?: JarvisPlanOption[] };
/** One Own Now row of car-year-info: the rent at the lowest upfront, and how the rent steps down. */
type JarvisOwnNowYear = {
  car_year?: string;
  min_rent?: number | string | null;
  min_upfront?: number | string | null;
  max_upfront?: number | string | null;
  rent_stepdown?: number | string | null;
  downpayment_stepup?: number | string | null;
  is_calculator_enabled?: boolean | null;
};
/** Jarvis's flat answer: one key per model, next to `model_years` and `creatives`. */
type JarvisCarYears = { model_years?: string[] } & Record<string, unknown>;

/** Jarvis's plan names for the site's plans. */
const PLAN_IDS: Record<string, string> = {
  "own-now": "own-now",
  "drive-to-own": "drive-to-own",
  "dte-single": "leasing",
  "rev-share": "revenue-share",
};

/* ----------------------------------------------------------------------- what we keep */

export type LivePlanPrice = { rent: number | null; deposit: number | null; upfront: number | null };

/**
 * One model year on the Own Now calculator. The daily rent is `rent` at `minUpfront` and drops by
 * `rentStep` for every `upfrontStep` paid on top, up to `maxUpfront`.
 */
export type OwnNowYear = { name: string; rent: number; minUpfront: number; maxUpfront: number; upfrontStep: number; rentStep: number };

export type LiveCar = {
  name: string;
  fuel: string;
  rent: number | null;
  deposit: number | null;
  photo: string | null;
  recommended: boolean;
  plans: Record<string, LivePlanPrice>;
  ownNow: OwnNowYear[];
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
 * part way keeps the last good figures instead of caching a gap; `skip` names the answers that
 * mean "nothing usable here" (404 for routes not live yet, 400 for one record Jarvis rejects)
 * rather than "something broke".
 */
async function records<T>(path: string, skip: number[] = []): Promise<T | null> {
  const answer = await fleetGet<T>(path, { cache: "no-store" });
  if (skip.includes(answer.status)) return null;
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

function ownNowYears(answer: JarvisCarYears | null): OwnNowYear[] {
  const out: OwnNowYear[] = [];
  for (const name of answer?.model_years ?? []) {
    const row = answer?.[name] as JarvisOwnNowYear | undefined;
    const rent = money(row?.min_rent);
    const minUpfront = money(row?.min_upfront);
    if (!row || rent === null || minUpfront === null) continue;
    const upfrontStep = money(row.downpayment_stepup) ?? 0;
    // A row with the calculator off, or without steps, offers its lowest upfront only.
    const slides = row.is_calculator_enabled !== false && upfrontStep > 0;
    const maxUpfront = slides ? Math.max(minUpfront, money(row.max_upfront) ?? minUpfront) : minUpfront;
    out.push({ name: row.car_year || name, rent, minUpfront, maxUpfront, upfrontStep, rentStep: slides ? (money(row.rent_stepdown) ?? 0) : 0 });
  }
  return out;
}

async function readCity(city: JarvisCity): Promise<LiveCity> {
  // A car with no model name can be neither priced nor matched to the site's cars.
  const cars = ((await records<JarvisCar[]>(`/everest_website/cars?city_id=${city.id}`)) ?? []).filter((car) => car.car_name);
  const priced = await pool(cars, async (car): Promise<LiveCar> => {
    const query = new URLSearchParams({ city_id: String(city.id), car_name: car.car_name });
    if (car.car_fuel_type) query.set("car_fuel_type", car.car_fuel_type);
    // A 400 is Jarvis refusing this one car's data, so the car goes unpriced instead of the whole read failing.
    const categories = await records<JarvisPlanCategory[]>(`/everest_website/plan-details?${query}`, [400, 404]);
    const plans = planPrices(categories);
    const ownNowOffer = (categories ?? []).flatMap((c) => c.options ?? []).find((o) => o.plan_uri === "own-now");
    let ownNow: OwnNowYear[] = [];
    if (ownNowOffer?.rent && ownNowOffer.car_year_screen) {
      query.set("plan_uri", "own-now");
      ownNow = ownNowYears(await records<JarvisCarYears>(`/everest_website/plan-years?${query}`, [400, 404]));
    }
    return {
      name: car.car_name,
      fuel: car.car_fuel_type ?? "",
      rent: money(car.rent),
      deposit: money(car.min_sd_amount),
      photo: car.car_creative?.find((c) => c.image)?.image ?? null,
      recommended: Boolean(car.recommended),
      plans,
      ownNow,
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
  const cities = await records<JarvisCity[]>("/everest_website/cities", [404]);
  if (!cities?.length) return null;
  return { at: new Date().toISOString(), cities: await pool(cities, readCity) };
}

/**
 * A failed refresh throws, which Next does not cache: the previous figures stay up and the next
 * render tries again. The page keeps its fifteen-minute refresh either way, since Next records the
 * revalidate before running the read.
 */
const cachedLive = unstable_cache(readLive, ["fleet-data", "v3"], { revalidate: REFRESH_SECONDS, tags: [FLEET_DATA_TAG] });

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
      return { ...plan, cityPrices };
    }),
  };
}

/* ------------------------------------------------------------- Own Now calculator */

export type CalculatorCarView = { key: string; name: string; photo: ImageSlot | null; years: OwnNowYear[] };
export type CalculatorCityView = { slug: string; name: string; cars: CalculatorCarView[] };
export type OwnNowCalculatorView = { label: string; tenures: string[]; perks: string[]; cities: CalculatorCityView[] };

/**
 * The Own Now calculator: for each city that offers Own Now, the cars Jarvis prices there and
 * their model years. Words, tenures and photos come from the admin; null when Jarvis has none.
 */
export function ownNowCalculator(content: SiteContent, live: LiveData | null): OwnNowCalculatorView | null {
  if (!live) return null;
  const calculator = content.calculators.find((c) => c.planId === "own-now");
  const cities: CalculatorCityView[] = [];
  for (const city of content.cities) {
    if (!city.plans.includes("own-now")) continue;
    const cars = new Map<string, CalculatorCarView>();
    for (const liveCity of live.cities.filter((c) => siteCityFor(c, content) === city.slug)) {
      for (const car of liveCity.cars) {
        if (!car.ownNow?.length || cars.has(key(car.name))) continue;
        const siteCar = content.cars.find((c) => c.id === siteCarFor(car.name, content));
        const photo = calculator?.cars.find((c) => c.carId === siteCar?.id)?.image ?? siteCar?.image;
        cars.set(key(car.name), { key: key(car.name), name: siteCar?.name || car.name, photo: photo?.url ? photo : null, years: car.ownNow });
      }
    }
    if (cars.size) cities.push({ slug: city.slug, name: city.name.en, cars: [...cars.values()] });
  }
  if (!cities.length) return null;
  return {
    label: calculator?.depositLabel || "Upfront payment",
    tenures: calculator?.tenures ?? [],
    perks: calculator?.perks ?? [],
    cities,
  };
}
