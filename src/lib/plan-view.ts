import {
  fillFigures,
  fillOrDrop,
  headline,
  priceIn,
  rupees,
  type Car,
  type Feature,
  type ImageSlot,
  type Plan,
  type SiteContent,
} from "@/lib/content";
import { PLAN_PAGES } from "@/lib/plan-pages";

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

export function cityOptions(content: SiteContent): CityOption[] {
  return content.cities.map((c) => ({ slug: c.slug, name: c.name.en }));
}

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

/** Every visible home-page plan card, priced for every city. */
export function planCardsByCity(content: SiteContent): Record<string, PlanCardView[]> {
  const shown = content.plans.filter((p) => p.visible && p.showCard);
  return Object.fromEntries(content.cities.map((c) => [c.slug, shown.map((p) => planCard(content, p, c.slug))]));
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

/** Visible cars a plan offers, priced by that plan for every city it is sold in. */
export function planCarCards(content: SiteContent, plan: Plan): Record<string, CarCardView[]> {
  const cars = plan.carIds.map((id) => content.cars.find((c) => c.id === id)).filter((c): c is Car => !!c?.visible);
  return Object.fromEntries(
    planCities(content, plan.id).map((city) => [city.slug, cars.map((car) => carCard(content, car, city.slug, plan))])
  );
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
    { label: daily ? "Daily rent" : "Rent", value: headline(price), suffix },
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
  figures: PlanFigure[];
  tags: string[];
  whyTag: string;
  whyTitle: string;
  whySubtitle: string;
  benefitsImage: ImageSlot;
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
    figures: planFigures(plan),
    tags: page.tags.map((t) => fillOrDrop(t, plan.price)).filter(Boolean),
    whyTag: fill(page.whyTag),
    whyTitle: fill(page.whyTitle),
    whySubtitle: fill(page.whySubtitle),
    benefitsImage: page.benefitsImage,
    features: page.features.map((f) => ({ ...f, title: fill(f.title), body: fill(f.body) })).filter((f) => f.title || f.body),
    storiesTitle: fill(page.storiesTitle),
  };
}

export type PlanStepView = { title: string; body: string; image: ImageSlot };

/** A plan's block on the Our Plans page. */
export type PlanOverviewView = {
  id: string;
  name: string;
  /** Small text after the name, e.g. "Leasing plan". */
  note: string;
  /** The plan's own page. */
  href: string;
  figures: PlanFigure[];
  tags: string[];
  /** Numbered photo cards. When there are none, `image` and `points` show instead. */
  steps: PlanStepView[];
  image: ImageSlot;
  points: string[];
  /** "Why drivers pick Own Now" */
  highlightsTitle: string;
  highlights: string[];
};

export function planOverview(plan: Plan): PlanOverviewView {
  const fill = (text: string) => fillOrDrop(text, plan.price);
  const o = plan.overview;
  const page = PLAN_PAGES.find((p) => p.planId === plan.id);
  return {
    id: plan.id,
    name: plan.name.en,
    note: fill(o.note),
    href: page ? `${page.path}/` : "",
    figures: planFigures(plan),
    tags: plan.page.tags.map(fill).filter(Boolean),
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
