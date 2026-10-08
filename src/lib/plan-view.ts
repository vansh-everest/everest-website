import type { PlanCalculatorView, PlanYear } from "@/lib/fleet-data";
import {
  fillFigures,
  fillOrDrop,
  headline,
  priceIn,
  rupees,
  type Car,
  type DepositOption,
  type Feature,
  type ImageSlot,
  type Plan,
  type Row,
  type SiteContent,
} from "@/lib/content";
import { PLAN_PAGES, type WizardKind } from "@/lib/plan-pages";

/**
 * What a card needs, already priced for one city. Built on the server and handed to the
 * client components, which only switch between cities; they never do the pricing themselves.
 */

export type PlanCardView = {
  id: string;
  name: string;
  tag: string;
  theme: Plan["theme"];
  /** The two boxes at the top of the card: the rent, then the upfront or deposit. */
  figures: { label: string; value: string }[];
  /** The small word after each figure, "Onwards" unless the plan sets its own. */
  suffix: string;
  /** The bullet list: the card rows first, then the key benefits. */
  points: string[];
  /** The plan's own page, when it has one. */
  href: string;
};

export type CarCardView = {
  id: string;
  make: string;
  name: string;
  subtitle: string;
  fuel: string;
  condition: string;
  highlight: string;
  highlightTone: Car["highlightTone"];
  image: ImageSlot;
  /** The label over `rent`, e.g. "Rent starting from". */
  rentLabel: string;
  /** "₹650/day" */
  rent: string;
  deposit: string;
  tenure: string;
  modelYears: string;
};

export type CityOption = { slug: string; name: string };

const months = (n: string) => (n ? `${n} month${n === "1" ? "" : "s"}` : "");

export function planCard(content: SiteContent, plan: Plan, city?: string): PlanCardView {
  const price = priceIn(plan.price, plan.cityPrices, city);
  const figures = [
    { label: `Rent${price.unit.replace(/^\+/, "")}`, value: rupees(price.amount) },
    price.upfront ? { label: "Upfront", value: rupees(price.upfront) } : { label: "Deposit", value: rupees(price.deposit) },
  ].filter((f) => f.value);
  const page = PLAN_PAGES.find((p) => p.planId === plan.id);
  return {
    id: plan.id,
    name: plan.name.en,
    tag: plan.tag,
    theme: plan.theme,
    figures,
    suffix: plan.depositNote || "Onwards",
    points: [...plan.rows.map((r) => r.value).filter(Boolean), ...plan.benefits],
    href: page ? `${page.path}/` : "",
  };
}

/**
 * On a plan's own page a car shows that plan's figures, since the plan sets the rent. Anywhere
 * else it shows its own.
 */
export function carCard(content: SiteContent, car: Car, city?: string, plan?: Plan): CarCardView {
  const price = plan ? priceIn(plan.price, plan.cityPrices, city) : priceIn(car.price, car.cityPrices, city);
  return {
    id: car.id,
    make: car.make,
    name: car.name,
    subtitle: car.subtitle,
    fuel: car.fuel,
    condition: car.condition,
    highlight: car.highlight,
    highlightTone: car.highlightTone,
    image: car.image,
    rentLabel: plan?.priceLabel || "Rent starting from",
    rent: headline(price),
    deposit: rupees(price.deposit),
    tenure: months(price.tenureMonths) || (plan?.tenureNote ?? ""),
    modelYears: car.modelYears,
  };
}

/** Cards for visible cars, optionally only those offered under one plan, priced per city. */
export function carCardsByCity(content: SiteContent, planId?: string): Record<string, CarCardView[]> {
  const plan = planId ? content.plans.find((p) => p.id === planId) : undefined;
  const cars = content.cars.filter((c) => c.visible && (!plan || plan.carIds.includes(c.id)));
  return Object.fromEntries(content.cities.map((city) => [city.slug, cars.map((car) => carCard(content, car, city.slug))]));
}

/** Cities that list a plan, or every city when none has been ticked yet. */
export function planCities(content: SiteContent, planId: string): CityOption[] {
  const listed = content.cities.filter((c) => c.plans.includes(planId));
  return (listed.length ? listed : content.cities).map((c) => ({ slug: c.slug, name: c.name.en }));
}

/** One box in a plan's row of figures: "Daily rent", "₹725/day", "onwards". */
export type PlanFigure = { label: string; value: string; suffix: string };

/**
 * The rent, then the upfront or the deposit, then the plan's own third figure. A figure the plan
 * leaves blank is left out rather than shown as zero.
 */
export function planFigures(plan: Plan): PlanFigure[] {
  const price = plan.price;
  const suffix = (plan.depositNote || "Onwards").toLowerCase();
  const daily = price.unit.includes("day");
  const term = { label: fillOrDrop(plan.page.term.label, price), value: fillOrDrop(plan.page.term.value, price) };
  return [
    { label: daily ? "Daily Rent" : "Rent", value: headline(price), suffix },
    price.upfront
      ? { label: "Upfront", value: rupees(price.upfront), suffix }
      : { label: "Deposit", value: rupees(price.deposit), suffix },
    { ...term, suffix: "" },
  ].filter((f) => f.label && f.value);
}

export type PlanPageView = {
  name: string;
  headline: string;
  highlight: string;
  heroImage: ImageSlot;
  /** The phone hero's photo card; the hero photo when the plan has no phone crop. */
  heroImagePhone: ImageSlot;
  figures: PlanFigure[];
  tags: string[];
  /** The label over the benefit cards. */
  whyTag: string;
  features: Feature[];
  storiesTitle: string;
};

export function planPage(plan: Plan): PlanPageView {
  const fill = (text: string) => fillFigures(text, plan.price);
  const page = plan.page;
  return {
    name: plan.name.en,
    headline: fill(page.headline),
    highlight: fill(page.highlight),
    heroImage: page.heroImage,
    heroImagePhone: page.heroImagePhone.url ? page.heroImagePhone : page.heroImage,
    figures: planFigures(plan),
    tags: page.tags.map((t) => fillOrDrop(t, plan.price)).filter(Boolean),
    whyTag: fill(page.whyTag),
    features: page.features.map((f) => ({ ...f, title: fill(f.title), body: fill(f.body) })).filter((f) => f.title || f.body),
    storiesTitle: fill(page.storiesTitle),
  };
}

export type PlanStepView = { title: string; body: string; image: ImageSlot };

/** A plan's block on the Our Plans page. */
export type PlanOverviewView = {
  id: string;
  /** The block's heading: the overview title, or the plan name. */
  name: string;
  /** Small text after the heading, e.g. "Leasing Plan". */
  note: string;
  /** The plan's own page. */
  href: string;
  /** `short` is the phone's compact form of the value. */
  figures: (PlanFigure & { short: string })[];
  /** `short` drops everything after a " · ", for the phone. */
  tags: { full: string; short: string }[];
  /** Numbered photo cards. When there are none, `image` and `points` show instead. */
  steps: PlanStepView[];
  image: ImageSlot;
  points: string[];
  /** "Why drivers pick Own Now" */
  highlightsTitle: string;
  highlights: string[];
};

/** The phone's narrower boxes: "₹50,000" becomes "₹50k" and "12 Months" "12 Mo.". */
function compact(value: string): string {
  const money = /^₹([\d,]+)$/.exec(value);
  if (money) {
    const n = Number(money[1].replaceAll(",", ""));
    return n >= 10000 && n % 1000 === 0 ? `₹${n / 1000}k` : value;
  }
  return value.replace(/^(\d+)\s*months?$/i, "$1 Mo.");
}

/** "Low deposit · high daily rental plan" becomes "Low deposit" on a phone. */
const shortTag = (tag: string) => tag.split(" · ")[0];

export function planOverview(plan: Plan): PlanOverviewView {
  const fill = (text: string) => fillOrDrop(text, plan.price);
  const o = plan.overview;
  const page = PLAN_PAGES.find((p) => p.planId === plan.id);
  // The label already says "Daily rent", so a daily figure drops its "/day" here.
  const figures = planFigures(plan).map((f, i) => {
    const value = i === 0 && plan.price.unit.includes("day") ? rupees(plan.price.amount) : f.value;
    return { ...f, value, short: compact(value) };
  });
  return {
    id: plan.id,
    name: fill(o.title) || plan.name.en,
    note: fill(o.note),
    href: page ? `${page.path}/` : "",
    figures,
    tags: plan.page.tags
      .map(fill)
      .filter(Boolean)
      .map((tag) => ({ full: tag, short: shortTag(tag) })),
    steps: o.steps.map((s) => ({ title: fill(s.title), body: fill(s.body), image: s.image })).filter((s) => s.title || s.body),
    image: o.image,
    points: o.points.map(fill).filter(Boolean),
    highlightsTitle: `Why drivers pick ${plan.name.en}`,
    highlights: o.highlights.map(fill).filter(Boolean),
  };
}

/** Plans on the Our Plans page: visible ones with a home card, in the admin's order. */
export function planOverviews(content: SiteContent): PlanOverviewView[] {
  return content.plans.filter((p) => p.visible && p.showCard).map(planOverview);
}

/** One car in a plan page's picker, with the figures the plan's calculator sets for it, if any. */
export type WizardCar = {
  id: string;
  name: string;
  image: ImageSlot;
  /** Model years in the order the admin lists them; the first is picked to start with. */
  years: string[];
  /** Upfront-to-daily points from the calculator. None means the plan's own figures apply. */
  options: DepositOption[];
  defaultOption: number;
  /** Points per model year, when they differ by year (Jarvis's Own Now); "" for a car without years. */
  yearOptions?: Record<string, DepositOption[]>;
};

/** The plan's own figures in one city, for a car the calculator does not price. `money` is the upfront, or else the deposit. */
export type WizardPrice = { amount: string; unit: string; money: string; upfront: boolean; months: string };

export type PlanWizardView = {
  kind: WizardKind;
  name: string;
  cities: CityOption[];
  cars: WizardCar[];
  /** Months offered on the upfront step. */
  tenures: string[];
  /** Lines beside the car on the upfront step; `{months}` prints the chosen tenure. */
  perks: string[];
  prices: Record<string, WizardPrice>;
  /** Jarvis's figures for one car in one city (city slug, then car id); they win over `prices`. */
  carPrices: Record<string, Record<string, WizardPrice>>;
  /** The cars on offer in each city, when they differ by city (Jarvis); otherwise `cars` everywhere. */
  byCity?: Record<string, WizardCar[]>;
  /** The plan's third figure, e.g. Liability: Zero. */
  term: Row;
  /** The plan's first tag, e.g. "Rental plan". */
  tag: string;
};

/**
 * The cars a plan offers that have a photo, in the plan's order, then any car only the calculator
 * lists. A car the calculator prices keeps its studio photo and slider points.
 */
function wizardCars(content: SiteContent, plan: Plan): WizardCar[] {
  const entries = content.calculators.find((c) => c.planId === plan.id)?.cars ?? [];
  const ids = [...plan.carIds, ...entries.map((e) => e.carId).filter((id) => !plan.carIds.includes(id))];
  return ids.flatMap((id): WizardCar[] => {
    const car = content.cars.find((c) => c.id === id);
    const entry = entries.find((e) => e.carId === id);
    const image = entry?.image.url ? entry.image : car?.image;
    if (!car || !image?.url) return [];
    return [
      {
        id,
        name: car.name,
        image,
        years: car.modelYears.split(",").map((y) => y.trim()).filter(Boolean),
        options: entry?.options.filter((o) => o.daily || o.deposit) ?? [],
        defaultOption: entry?.defaultOption ?? 0,
      },
    ];
  });
}

/** A plan page's picker, or null when the plan has no city, no car with a photo, or no figures to offer. */
export function planWizard(
  content: SiteContent,
  plan: Plan,
  kind: WizardKind,
  carPrices: Record<string, Record<string, WizardPrice>> = {}
): PlanWizardView | null {
  const cities = planCities(content, plan.id);
  const cars = wizardCars(content, plan);
  if (!cities.length || !cars.length) return null;
  const prices = Object.fromEntries(
    cities.map((c) => {
      const p = priceIn(plan.price, plan.cityPrices, c.slug);
      return [c.slug, { amount: p.amount, unit: p.unit, money: p.upfront || p.deposit, upfront: !!p.upfront, months: p.tenureMonths }];
    })
  );
  // With no figure anywhere the last step would have nothing to show.
  if (!cars.some((c) => c.options.length) && !Object.values(prices).some((p) => p.amount)) return null;
  const term = { label: fillOrDrop(plan.page.term.label, plan.price), value: fillOrDrop(plan.page.term.value, plan.price) };
  return {
    kind,
    name: plan.name.en,
    cities,
    cars,
    tenures: content.calculators.find((c) => c.planId === plan.id)?.tenures ?? [],
    perks: content.calculators.find((c) => c.planId === plan.id)?.perks ?? [],
    prices,
    carPrices,
    term: term.label && term.value ? term : { label: "", value: "" },
    tag: plan.page.tags.map((t) => fillOrDrop(t, plan.price)).find(Boolean) ?? "",
  };
}

/** Every step from the lowest upfront to the highest, each with its daily rent; one point without steps. */
function stepPoints(year: PlanYear): DepositOption[] {
  if (year.money === null) return [];
  const high = year.maxMoney ?? year.money;
  if (!year.moneyStep) return [{ deposit: String(year.money), daily: String(year.rent) }];
  const out: DepositOption[] = [];
  for (let i = 0, paid = year.money; paid <= high && i < 400; i++, paid += year.moneyStep) {
    out.push({ deposit: String(paid), daily: String(Math.max(0, year.rent - i * year.rentStep)) });
  }
  return out;
}

/** "Wagon R - 2025" is offered as 2025; a model name without a year stays whole. */
const yearChip = (name: string) => /(\d{4})\s*$/.exec(name)?.[1] ?? name;

/**
 * The plan picker with Jarvis's cities, cars, model years and upfront steps in place of the
 * admin's sample points. Words, tenures and the plan's term stay the admin's.
 */
export function withJarvisCars(base: PlanWizardView, calculator: PlanCalculatorView): PlanWizardView {
  const byCity = Object.fromEntries(
    calculator.cities.map((city) => [
      city.slug,
      city.cars.map(
        (car): WizardCar => ({
          id: car.key,
          name: car.name,
          image: car.photo ?? { label: car.name, url: "", alt: car.name },
          years: car.years.filter((y) => y.name).map((y) => yearChip(y.name)),
          options: stepPoints(car.years[0]),
          defaultOption: 0,
          yearOptions: Object.fromEntries(car.years.map((y) => [y.name ? yearChip(y.name) : "", stepPoints(y)])),
        })
      ),
    ])
  );
  return {
    ...base,
    cities: calculator.cities.map(({ slug, name }) => ({ slug, name })),
    cars: byCity[calculator.cities[0].slug],
    byCity,
    carPrices: {},
  };
}
