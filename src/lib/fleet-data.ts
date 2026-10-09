import "server-only";
import { unstable_cache } from "next/cache";
import type { CityPrices, Hub, ImageSlot, Price, SiteContent } from "@/lib/content";
import type { WizardPrice } from "@/lib/plan-view";
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
  rent_stepdown?: number | string | null;
  downpayment_stepup?: number | string | null;
  /** Sent by Jarvis, not read: planYear() makes a slider wherever the figures allow one. */
  is_calculator_enabled?: boolean | null;
};
type JarvisPlanCategory = { uri: string; options?: JarvisPlanOption[] };
/**
 * One row of car-year-info. Own Now rows give the rent at the lowest upfront and how it steps down;
 * other plans give a rent range and a deposit.
 */
type JarvisYearRow = {
  car_year?: string;
  rent?: string | null;
  min_sd_amount?: number | string | null;
  min_rent?: number | string | null;
  min_upfront?: number | string | null;
  max_upfront?: number | string | null;
  rent_stepdown?: number | string | null;
  downpayment_stepup?: number | string | null;
  /** Sent by Jarvis, not read: planYear() makes a slider wherever the figures allow one. */
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
 * One model year on a plan calculator: `rent` (to `rentMax`) a day after paying `money` first, the
 * upfront on Own Now and the deposit elsewhere. With steps, every `moneyStep` paid on top, up to
 * `maxMoney`, takes `rentStep` off the daily rent.
 */
export type PlanYear = {
  name: string;
  rent: number;
  rentMax: number;
  money: number | null;
  maxMoney: number | null;
  moneyStep: number;
  rentStep: number;
};

export type LiveCar = {
  name: string;
  fuel: string;
  rent: number | null;
  deposit: number | null;
  photo: string | null;
  recommended: boolean;
  plans: Record<string, LivePlanPrice>;
  /** Per site plan with a calculator (own-now, drive-to-own, leasing): the car's model years. */
  years: Record<string, PlanYear[]>;
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

/** No rent, deposit or upfront is this small; below it is a typo in Jarvis (₹3 for ₹30,000). */
const MIN_PRICE = 100;

/** A rent, deposit or upfront figure: money(), with typos too small to be a price dropped. Step sizes stay on money(). */
export function price(value: unknown): number | null {
  const rupees = money(value);
  return rupees !== null && rupees >= MIN_PRICE ? rupees : null;
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
      rent: price(option.rent_info?.min_amount),
      // Own Now's deposit is always zero; its money up front is the upfront. price() drops zeros.
      deposit: price(option.min_sd_amount),
      upfront: price(option.upfront_fee),
    };
  }
  return out;
}

/** "₹40000.0-₹140000.0" → [40000, 140000]; one figure gives it twice. */
function range(value: unknown): [number | null, number | null] {
  if (typeof value !== "string") return [price(value), price(value)];
  const [low, high] = value.split("-");
  return [price(low), price(high ?? low)];
}

/**
 * The most that can be paid first on a slider from `paid` to `maxPaid`: on the step grid, and never
 * so far that the daily rent (less `down` per step) would fall below a real price.
 */
function slideTop(rent: number, paid: number, maxPaid: number, step: number, down: number): number {
  const steps = Math.floor((maxPaid - paid) / step);
  const floor = Math.floor((rent - MIN_PRICE) / down);
  return paid + Math.max(0, Math.min(steps, floor)) * step;
}

/**
 * One model year from Jarvis's figures. The money slides from its lowest to its highest wherever
 * Jarvis gives both and the step sizes (`step` paid on top takes `rentStep` off the daily rent);
 * otherwise it stays fixed at its lowest.
 *
 * Jarvis's is_calculator_enabled flag is ignored on purpose: production has it off (or unset) for
 * every Own Now car while the ranges and step sizes are filled in, and the business wants the
 * slider wherever those figures make one.
 */
function planYear(
  name: string,
  rent: number | null,
  rentMax: number | null,
  paid: number | null,
  maxPaid: number | null,
  step: unknown,
  rentStep: unknown
): PlanYear | null {
  if (rent === null) return null;
  const moneyStep = money(step) ?? 0;
  const down = money(rentStep) ?? 0;
  const top = paid !== null && maxPaid !== null && moneyStep > 0 && down > 0 ? slideTop(rent, paid, maxPaid, moneyStep, down) : null;
  const slides = paid !== null && top !== null && top > paid;
  return {
    name,
    rent,
    rentMax: Math.max(rent, rentMax ?? rent),
    money: paid,
    maxMoney: slides ? top : paid,
    moneyStep: slides ? moneyStep : 0,
    rentStep: slides ? down : 0,
  };
}

function yearsFromAnswer(answer: JarvisCarYears | null): PlanYear[] {
  return (answer?.model_years ?? []).flatMap((name) => {
    const row = answer?.[name] as JarvisYearRow | undefined;
    if (!row) return [];
    const label = row.car_year || name;
    const [low, high] = range(row.rent);
    const year =
      "min_upfront" in row
        ? planYear(label, price(row.min_rent) ?? low, null, price(row.min_upfront), price(row.max_upfront), row.downpayment_stepup, row.rent_stepdown)
        : planYear(label, low, high, price(row.min_sd_amount), null, null, null);
    return year ? [year] : [];
  });
}

/** A car Jarvis prices without a model-year choice: its plan figures, as one unnamed year. */
function yearsFromOffer(offer: JarvisPlanOption): PlanYear[] {
  const low = price(offer.rent_info?.min_amount) ?? range(offer.rent)[0];
  const high = price(offer.rent_info?.max_amount) ?? range(offer.rent)[1];
  const [upfront, maxUpfront] = range(offer.upfront_fee);
  const year =
    offer.plan_uri === "own-now"
      ? planYear("", low, null, upfront, maxUpfront, offer.downpayment_stepup, offer.rent_stepdown)
      : planYear("", low, high, price(offer.min_sd_amount), null, null, null);
  return year ? [year] : [];
}

/** Jarvis's plans that have a calculator on the site; Revenue Share has none. */
const CALCULATOR_URIS = ["own-now", "drive-to-own", "dte-single"];

async function readCity(city: JarvisCity): Promise<LiveCity> {
  // A car with no model name can be neither priced nor matched to the site's cars.
  const cars = ((await records<JarvisCar[]>(`/everest_website/cars?city_id=${city.id}`)) ?? []).filter((car) => car.car_name);
  const priced = await pool(cars, async (car): Promise<LiveCar> => {
    const query = new URLSearchParams({ city_id: String(city.id), car_name: car.car_name });
    if (car.car_fuel_type) query.set("car_fuel_type", car.car_fuel_type);
    // A 400 is Jarvis refusing this one car's data, so the car goes unpriced instead of the whole read failing.
    const categories = await records<JarvisPlanCategory[]>(`/everest_website/plan-details?${query}`, [400, 404]);
    const plans = planPrices(categories);
    const years: Record<string, PlanYear[]> = {};
    for (const offer of (categories ?? []).flatMap((c) => c.options ?? [])) {
      if (!offer.rent || !CALCULATOR_URIS.includes(offer.plan_uri)) continue;
      let found: PlanYear[] = [];
      if (offer.car_year_screen) {
        const byYear = new URLSearchParams(query);
        byYear.set("plan_uri", offer.plan_uri);
        found = yearsFromAnswer(await records<JarvisCarYears>(`/everest_website/plan-years?${byYear}`, [400, 404]));
      }
      years[PLAN_IDS[offer.plan_uri]] = found.length ? found : yearsFromOffer(offer);
    }
    return {
      name: car.car_name,
      fuel: car.car_fuel_type ?? "",
      rent: price(car.rent),
      deposit: price(car.min_sd_amount),
      photo: car.car_creative?.find((c) => c.image)?.image ?? null,
      recommended: Boolean(car.recommended),
      plans,
      years,
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
const cachedLive = unstable_cache(readLive, ["fleet-data", "v5"], { revalidate: REFRESH_SECONDS, tags: [FLEET_DATA_TAG] });

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

/**
 * A quote with a rent replaces the admin's rent, deposit and upfront together, so a figure Jarvis
 * leaves out (Own Now's deposit) shows as nothing rather than as the admin's number.
 */
function merge(prices: CityPrices, slug: string, live: LivePlanPrice): CityPrices {
  const next: CityPrices[string] = { ...prices[slug] };
  if (live.rent !== null) {
    next.amount = digits(live.rent);
    next.unit = "/day";
    next.deposit = digits(live.deposit);
    next.upfront = digits(live.upfront);
    next.exact = true;
  } else {
    if (live.deposit !== null) next.deposit = digits(live.deposit);
    if (live.upfront !== null) next.upfront = digits(live.upfront);
  }
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

  /** Per site plan, per site city: the lowest of each figure across the city's cars ("from"). */
  const planCity = new Map<string, Map<string, LivePlanPrice>>();
  for (const [slug, cities] of bySlug) {
    const cars = cities.flatMap((c) => c.cars);
    for (const planId of Object.values(PLAN_IDS)) {
      const price = lowestEach(cars.map((car) => car.plans[planId]).filter(Boolean));
      if (!price) continue;
      if (!planCity.has(planId)) planCity.set(planId, new Map());
      planCity.get(planId)!.set(slug, price);
    }
  }

  /** Per site car, per site city: the figures Jarvis's car list gives, as the driver app lists them. */
  const carCity = new Map<string, Map<string, LivePlanPrice>>();
  for (const [slug, cities] of bySlug) {
    for (const car of cities.flatMap((c) => c.cars)) {
      const id = siteCarFor(car.name, content);
      if (!id || (car.rent === null && car.deposit === null) || carCity.get(id)?.has(slug)) continue;
      if (!carCity.has(id)) carCity.set(id, new Map());
      carCity.get(id)!.set(slug, { rent: car.rent, deposit: car.deposit, upfront: null });
    }
  }

  // Once Jarvis answers, every figure on the site is Jarvis's: a city or car it has none for shows
  // none, never the admin's number or another city's.
  const BLANK = { exact: true } as const;
  const nothing = (price: Price): Price => ({ ...price, amount: "", deposit: "", upfront: "" });
  const whole = (price: Price, live: LivePlanPrice | null): Price =>
    live
      ? { ...price, amount: digits(live.rent), unit: live.rent === null ? price.unit : "/day", deposit: digits(live.deposit), upfront: digits(live.upfront) }
      : nothing(price);

  return {
    ...content,
    cities: content.cities.map((city) => {
      const found = bySlug.get(city.slug);
      if (!found) return { ...city, readyCars: 0 };
      return {
        ...city,
        readyCars: found.reduce((sum, c) => sum + c.readyCars, 0),
        hubs: city.hubs.length ? city.hubs : found.flatMap((c) => c.hubs),
      };
    }),
    plans: content.plans.map((plan) => {
      const live = planCity.get(plan.id) ?? new Map<string, LivePlanPrice>();
      let cityPrices: CityPrices = {};
      for (const city of content.cities) cityPrices[city.slug] = BLANK;
      for (const [slug, price] of live) cityPrices = merge(cityPrices, slug, price);
      return { ...plan, cityPrices, price: whole(plan.price, lowestEach([...live.values()])) };
    }),
    cars: content.cars.map((car) => {
      const live = carCity.get(car.id) ?? new Map<string, LivePlanPrice>();
      let cityPrices: CityPrices = {};
      for (const city of content.cities) cityPrices[city.slug] = BLANK;
      for (const [slug, price] of live) cityPrices = merge(cityPrices, slug, price);
      return { ...car, cityPrices, price: whole(car.price, lowestEach([...live.values()])) };
    }),
  };
}

const lowest = (values: (number | null)[]): number | null => {
  const real = values.filter((v): v is number => v !== null);
  return real.length ? Math.min(...real) : null;
};

/**
 * The "from" figures a summary shows (a city's plan card, a plan's "onwards" figures): each the
 * lowest on offer. A page about one car never uses these; it shows that car's own figures.
 */
function lowestEach(quotes: LivePlanPrice[]): LivePlanPrice | null {
  const price = { rent: lowest(quotes.map((q) => q.rent)), deposit: lowest(quotes.map((q) => q.deposit)), upfront: lowest(quotes.map((q) => q.upfront)) };
  return price.rent === null && price.deposit === null && price.upfront === null ? null : price;
}

/** Jarvis's figures for each site car in each site city, as the plan wizard shows one car. */
export function wizardCarPrices(content: SiteContent, live: LiveData | null, planId: string): Record<string, Record<string, WizardPrice>> {
  const out: Record<string, Record<string, WizardPrice>> = {};
  for (const city of live?.cities ?? []) {
    const slug = siteCityFor(city, content);
    if (!slug) continue;
    for (const car of city.cars) {
      const carId = siteCarFor(car.name, content);
      const quote = carId ? car.plans[planId] : undefined;
      if (!carId || !quote || quote.rent === null || out[slug]?.[carId]) continue;
      const money = quote.upfront ?? quote.deposit;
      (out[slug] ??= {})[carId] = {
        amount: String(quote.rent),
        unit: "/day",
        money: money === null ? "" : String(money),
        upfront: quote.upfront !== null,
        months: "",
      };
    }
  }
  return out;
}

/* ----------------------------------------------------------------- plan calculators */

export type CalculatorCarView = { key: string; name: string; photo: ImageSlot | null; years: PlanYear[] };
export type CalculatorCityView = { slug: string; name: string; cars: CalculatorCarView[] };
export type PlanCalculatorView = { label: string; tenures: string[]; perks: string[]; cities: CalculatorCityView[] };

/**
 * A plan page's calculator: for each city that offers the plan, the cars Jarvis prices there and
 * their model years. Words, tenures and photos come from the admin; null when Jarvis has none.
 */
export function planCalculator(content: SiteContent, live: LiveData | null, planId: string): PlanCalculatorView | null {
  if (!live) return null;
  const calculator = content.calculators.find((c) => c.planId === planId);
  const cities: CalculatorCityView[] = [];
  for (const city of content.cities) {
    if (!city.plans.includes(planId)) continue;
    const cars = new Map<string, CalculatorCarView>();
    for (const liveCity of live.cities.filter((c) => siteCityFor(c, content) === city.slug)) {
      for (const car of liveCity.cars) {
        const years = car.years?.[planId] ?? [];
        if (!years.length || cars.has(key(car.name))) continue;
        const siteCar = content.cars.find((c) => c.id === siteCarFor(car.name, content));
        const name = siteCar?.name || car.name;
        const own = calculator?.cars.find((c) => c.carId === siteCar?.id)?.image ?? siteCar?.image;
        // The admin's studio photo first; a car only Jarvis knows takes Jarvis's own car image.
        const photo = own?.url ? own : car.photo && /\.(png|jpe?g|webp)$/i.test(car.photo) ? { label: name, url: car.photo, alt: name } : null;
        cars.set(key(car.name), { key: key(car.name), name, photo, years });
      }
    }
    if (cars.size) cities.push({ slug: city.slug, name: city.name.en, cars: [...cars.values()] });
  }
  if (!cities.length) return null;
  return {
    label: calculator?.depositLabel || (planId === "own-now" ? "Upfront payment" : "Deposit"),
    tenures: calculator?.tenures ?? [],
    perks: calculator?.perks ?? [],
    cities,
  };
}
