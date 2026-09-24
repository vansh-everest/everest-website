import {
  DEFAULT_CONTENT,
  DIGIT_FIELDS,
  FEATURE_ICONS,
  PRICE_FIELDS,
  emptyPage,
  emptyPrice,
  placeholder,
  type Calculator,
  type CalculatorCar,
  type Car,
  type City,
  type CityPrices,
  type DepositOption,
  type FeatureIcon,
  type Hub,
  type ImageSlot,
  type Plan,
  type PlanPage,
  type Post,
  type Price,
  type Row,
  type SiteContent,
} from "@/lib/content";
import { LOCALES, type Locale } from "@/lib/i18n";

/**
 * Turns whatever arrives from the admin, or from an older saved file, into a SiteContent the
 * site can render. Nothing from the browser is trusted: every string is trimmed and capped,
 * every figure is reduced to digits, every image address must be ours or https, and every
 * reference between plans, cars and cities must point at something that exists.
 */

type Json = Record<string, unknown>;

const obj = (v: unknown): Json => (v && typeof v === "object" && !Array.isArray(v) ? (v as Json) : {});
const list = (v: unknown, max: number): unknown[] => (Array.isArray(v) ? v.slice(0, max) : []);
const text = (v: unknown, max = 120): string => (typeof v === "string" ? v.trim().slice(0, max) : "");
const flag = (v: unknown, fallback: boolean): boolean => (typeof v === "boolean" ? v : fallback);

/** Digits only, no leading zeros, at most nine of them (crores are the ceiling). */
export function digits(v: unknown, max = 9): string {
  if (typeof v !== "string" && typeof v !== "number") return "";
  return String(v).replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, max);
}

export function slugify(v: unknown): string {
  return text(v, 60)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;

/**
 * Our own paths or an upload in the Blob store, the same hosts next.config allows for images.
 * Rules out javascript:, data:, protocol-relative and any other external address.
 */
function address(v: unknown): string {
  const s = text(v, 1000);
  if (BLOB_HOST.test(s)) return s;
  if (s.startsWith("/") && !s.startsWith("//") && !s.includes("\\")) return s;
  return "";
}

function image(v: unknown, fallback: ImageSlot): ImageSlot {
  const o = obj(v);
  return {
    label: text(o.label) || fallback.label,
    url: "url" in o ? address(o.url) : fallback.url,
    alt: "alt" in o ? text(o.alt, 200) : fallback.alt,
  };
}

function localized(v: unknown, fallback: Record<Locale, string>, max = 200): Record<Locale, string> {
  const o = obj(v);
  return Object.fromEntries(
    LOCALES.map((l) => [l, typeof o[l] === "string" ? text(o[l], max) : fallback[l] ?? ""])
  ) as Record<Locale, string>;
}

function price(v: unknown, fallback: Price): Price {
  const o = obj(v);
  const out = { ...fallback };
  for (const f of DIGIT_FIELDS) if (f in o) out[f] = digits(o[f], f === "tenureMonths" ? 3 : 9);
  if ("unit" in o) out.unit = text(o.unit, 16);
  return out;
}

function cityPrices(v: unknown, cities: string[]): CityPrices {
  const o = obj(v);
  const out: CityPrices = {};
  for (const slug of cities) {
    const raw = obj(o[slug]);
    const own: Partial<Price> = {};
    for (const f of PRICE_FIELDS) {
      const value = f === "unit" ? text(raw[f], 16) : digits(raw[f], f === "tenureMonths" ? 3 : 9);
      if (value) own[f] = value;
    }
    if (Object.keys(own).length) out[slug] = own;
  }
  return out;
}

function rows(v: unknown): Row[] {
  return list(v, 8)
    .map((r) => ({ label: text(obj(r).label, 40), value: text(obj(r).value, 160) }))
    .filter((r) => r.label || r.value);
}

const lines = (v: unknown, max: number, len = 80): string[] => list(v, max).map((s) => text(s, len)).filter(Boolean);

/** Ids must be unique; a repeat gets a numbered suffix rather than silently replacing a sibling. */
function uniqueId(wanted: string, taken: Set<string>, fallback: string): string {
  let id = wanted || fallback;
  for (let n = 2; taken.has(id); n++) id = `${wanted || fallback}-${n}`;
  taken.add(id);
  return id;
}

function blankPlan(id: string): Plan {
  return {
    id,
    visible: false,
    showCard: false,
    name: { en: "", hi: "", te: "" },
    shortName: "",
    summary: { en: "", hi: "", te: "" },
    tag: "",
    priceLabel: "Rent starting from",
    theme: "light",
    price: emptyPrice(),
    depositNote: "",
    tenureNote: "",
    cityPrices: {},
    rows: [],
    benefits: [],
    carIds: [],
    page: emptyPage(),
  };
}

function blankCar(id: string): Car {
  return {
    id,
    visible: false,
    make: "",
    name: "",
    subtitle: "",
    fuel: "",
    condition: "",
    highlight: "",
    highlightTone: "brand",
    image: placeholder("Car photo"),
    modelYears: "",
    price: emptyPrice(),
    cityPrices: {},
  };
}

function page(v: unknown, base: PlanPage): PlanPage {
  const o = obj(v);
  const pick = (key: keyof PlanPage, max: number) => (key in o ? text(o[key], max) : (base[key] as string));
  return {
    headline: pick("headline", 60),
    highlight: pick("highlight", 60),
    heroImage: image(o.heroImage, base.heroImage),
    whyTag: pick("whyTag", 40),
    whyTitle: pick("whyTitle", 90),
    whySubtitle: pick("whySubtitle", 120),
    features:
      "features" in o
        ? list(o.features, 9)
            .map((f, i) => ({
              icon: (FEATURE_ICONS as readonly string[]).includes(obj(f).icon as string)
                ? (obj(f).icon as FeatureIcon)
                : FEATURE_ICONS[i % FEATURE_ICONS.length],
              title: text(obj(f).title, 40),
              body: text(obj(f).body, 90),
            }))
            .filter((f) => f.title || f.body)
        : structuredClone(base.features),
    storiesTitle: pick("storiesTitle", 90),
  };
}

/** Content saved before plans carried full prices kept three loose strings. */
function legacyPrice(o: Json, base: Price): Price {
  if ("price" in o) return base;
  const out = { ...base };
  if (typeof o.perDay === "string" && digits(o.perDay)) out.amount = digits(o.perDay);
  if (typeof o.upfront === "string" && digits(o.upfront)) out.upfront = digits(o.upfront);
  if (typeof o.months === "string" && digits(o.months)) out.tenureMonths = digits(o.months, 3);
  return out;
}

function plans(v: unknown, cityList: string[]): Plan[] {
  if (!Array.isArray(v)) return structuredClone(DEFAULT_CONTENT.plans);
  const taken = new Set<string>();
  return list(v, 12).map((raw, i) => {
    const o = obj(raw);
    const id = uniqueId(slugify(o.id), taken, `plan-${i + 1}`);
    const base = DEFAULT_CONTENT.plans.find((p) => p.id === id) ?? blankPlan(id);
    return {
      id,
      visible: flag(o.visible, base.visible),
      showCard: flag(o.showCard, base.showCard),
      name: localized(o.name, base.name, 60),
      shortName: "shortName" in o ? text(o.shortName, 16) : base.shortName,
      summary: localized(o.summary, base.summary, 400),
      tag: "tag" in o ? text(o.tag, 40) : base.tag,
      priceLabel: "priceLabel" in o ? text(o.priceLabel, 40) : base.priceLabel,
      theme: o.theme === "dark" || o.theme === "light" ? o.theme : base.theme,
      price: legacyPrice(o, price(o.price, base.price)),
      depositNote: "depositNote" in o ? text(o.depositNote, 24) : base.depositNote,
      tenureNote: "tenureNote" in o ? text(o.tenureNote, 24) : base.tenureNote,
      cityPrices: "cityPrices" in o ? cityPrices(o.cityPrices, cityList) : base.cityPrices,
      rows: "rows" in o ? rows(o.rows) : base.rows,
      benefits: "benefits" in o ? lines(o.benefits, 12, 60) : base.benefits,
      carIds: "carIds" in o ? lines(o.carIds, 40, 40).map(slugify) : base.carIds,
      page: page(o.page, base.page),
    };
  });
}

function cars(v: unknown, cityList: string[]): Car[] {
  if (!Array.isArray(v)) return structuredClone(DEFAULT_CONTENT.cars);
  const taken = new Set<string>();
  return list(v, 40).map((raw, i) => {
    const o = obj(raw);
    const id = uniqueId(slugify(o.id), taken, `car-${i + 1}`);
    const base = DEFAULT_CONTENT.cars.find((c) => c.id === id) ?? blankCar(id);
    return {
      id,
      visible: flag(o.visible, base.visible),
      make: "make" in o ? text(o.make, 40) : base.make,
      name: "name" in o ? text(o.name, 40) : base.name,
      subtitle: "subtitle" in o ? text(o.subtitle, 60) : base.subtitle,
      fuel: "fuel" in o ? text(o.fuel, 16) : base.fuel,
      condition: "condition" in o ? text(o.condition, 24) : base.condition,
      highlight: "highlight" in o ? text(o.highlight, 60) : base.highlight,
      highlightTone: o.highlightTone === "brand" || o.highlightTone === "leaf" ? o.highlightTone : base.highlightTone,
      image: image(o.image, base.image),
      modelYears: "modelYears" in o ? text(o.modelYears, 40) : base.modelYears,
      price: price(o.price, base.price),
      cityPrices: "cityPrices" in o ? cityPrices(o.cityPrices, cityList) : base.cityPrices,
    };
  });
}

function calculatorCar(raw: unknown, fallbackImage: ImageSlot): Omit<CalculatorCar, "carId"> {
  const o = obj(raw);
  const entered = list(o.options, 20).map((opt) => ({ deposit: digits(obj(opt).deposit), daily: digits(obj(opt).daily) }));
  const wanted = Number.isInteger(o.defaultOption) ? (o.defaultOption as number) : 0;
  const starting = entered[wanted];
  const options: DepositOption[] = entered
    .filter((opt) => opt.deposit && opt.daily)
    // The slider runs from the smallest deposit to the largest.
    .sort((a, b) => Number(a.deposit) - Number(b.deposit));
  // The starting point is chosen by its row, so it has to follow its row through the sort.
  const chosen = starting ? options.indexOf(starting) : 0;
  return {
    image: image(o.image, fallbackImage),
    options,
    defaultOption: Math.min(Math.max(chosen, 0), Math.max(options.length - 1, 0)),
  };
}

/** Saved before the calculator priced several cars: one car, one tenure, a driver's share. */
function legacyCalculator(o: Json): Json {
  if ("cars" in o || !("options" in o || "carId" in o)) return o;
  return {
    ...o,
    cars: [{ carId: o.carId, image: o.image, options: o.options, defaultOption: o.defaultOption }],
    tenures: "tenureMonths" in o ? [o.tenureMonths] : undefined,
  };
}

function calculator(v: unknown, planIds: string[], carIds: string[]): Calculator {
  const o = legacyCalculator(obj(v));
  const base = DEFAULT_CONTENT.calculator;
  const seen = new Set<string>();
  const entered = "cars" in o ? list(o.cars, 20) : base.cars;
  const cars = entered.flatMap((raw): CalculatorCar[] => {
    const carId = text(obj(raw).carId, 40);
    if (!carIds.includes(carId) || seen.has(carId)) return [];
    seen.add(carId);
    const seed = base.cars.find((c) => c.carId === carId);
    return [{ carId, ...calculatorCar(raw, seed?.image ?? placeholder("Car, studio photo")) }];
  });
  const wantedPlan = text(o.planId, 40);
  const tenures = Array.isArray(o.tenures) ? [...new Set(list(o.tenures, 8).map((t) => digits(t, 3)).filter(Boolean))] : base.tenures;
  return {
    planId: planIds.includes(wantedPlan) ? wantedPlan : planIds.includes(base.planId) ? base.planId : planIds[0] ?? "",
    cars,
    tenures,
    perks: "perks" in o ? lines(o.perks, 8, 80) : base.perks,
  };
}

function hubs(v: unknown): Hub[] {
  return list(v, 20).map((raw) => {
    const o = obj(raw);
    const mapUrl = address(o.mapUrl);
    return {
      name: text(o.name, 80),
      address: text(o.address, 300),
      hours: text(o.hours, 80),
      ...(mapUrl ? { mapUrl } : {}),
    };
  });
}

/** Cities are fixed by the addresses that already rank; an edit can change them, not add one. */
function cities(v: unknown, planIds: string[]): City[] {
  const saved = new Map(list(v, 50).map((raw) => [text(obj(raw).slug, 40), obj(raw)] as const));
  return DEFAULT_CONTENT.cities.map((base) => {
    const o = saved.get(base.slug);
    if (!o) return { ...structuredClone(base), plans: base.plans.filter((p) => planIds.includes(p)) };
    const count = Number(o.readyCars);
    return {
      slug: base.slug,
      name: localized(o.name, base.name, 60),
      state: "state" in o ? text(o.state, 60) : base.state,
      readyCars: Number.isFinite(count) ? Math.min(Math.max(Math.round(count), 0), 100_000) : 0,
      hubs: "hubs" in o ? hubs(o.hubs) : base.hubs,
      plans: ("plans" in o ? lines(o.plans, 12, 40) : base.plans).filter((p) => planIds.includes(p)),
      heroImage: image(o.heroImage, base.heroImage),
    };
  });
}

function posts(v: unknown): Post[] {
  if (!Array.isArray(v)) return structuredClone(DEFAULT_CONTENT.posts);
  // Two posts at one address in one language would hide each other, so a repeat is numbered.
  const taken: Record<string, Set<string>> = {};
  return list(v, 200).map((raw, i) => {
    const o = obj(raw);
    const date = text(o.date, 10);
    const locale = (LOCALES as readonly string[]).includes(o.locale as string) ? (o.locale as Locale) : "en";
    return {
      slug: uniqueId(slugify(o.slug), (taken[locale] ??= new Set()), `post-${i + 1}`),
      locale,
      title: text(o.title, 200),
      excerpt: text(o.excerpt, 400),
      body: lines(o.body, 100, 5000),
      published: flag(o.published, false),
      date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0, 10),
      coverImage: image(o.coverImage, placeholder("Cover image")),
    };
  });
}

export function normalizeContent(raw: unknown): SiteContent {
  const o = obj(raw);
  const cityList = DEFAULT_CONTENT.cities.map((c) => c.slug);
  const carList = cars(o.cars, cityList);
  const carIds = carList.map((c) => c.id);
  const planList = plans(o.plans, cityList).map((p) => ({
    ...p,
    carIds: [...new Set(p.carIds)].filter((id) => carIds.includes(id)),
  }));
  const planIds = planList.map((p) => p.id);
  const savedImages = obj(o.images);

  return {
    updatedAt: text(o.updatedAt, 40),
    updatedBy: text(o.updatedBy, 120),
    publishedAt: text(o.publishedAt, 40),
    publishedBy: text(o.publishedBy, 120),
    cities: cities(o.cities, planIds),
    plans: planList,
    cars: carList,
    calculator: calculator(o.calculator, planIds, carIds),
    posts: posts(o.posts),
    images: Object.fromEntries(
      Object.entries(DEFAULT_CONTENT.images).map(([key, base]) => [key, image(savedImages[key], base)])
    ),
  };
}
