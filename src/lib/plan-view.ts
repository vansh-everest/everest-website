import {
  fillFigures,
  headline,
  plansOffering,
  priceIn,
  rupees,
  type Car,
  type Feature,
  type ImageSlot,
  type Plan,
  type Row,
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
  priceLabel: string;
  amount: string;
  unit: string;
  rows: Row[];
  benefits: string[];
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
  badges: string[];
};

export type CityOption = { slug: string; name: string };

export function cityOptions(content: SiteContent): CityOption[] {
  return content.cities.map((c) => ({ slug: c.slug, name: c.name.en }));
}

const months = (n: string) => (n ? `${n} month${n === "1" ? "" : "s"}` : "");

export function planCard(content: SiteContent, plan: Plan, city?: string): PlanCardView {
  const price = priceIn(plan.price, plan.cityPrices, city);
  const vehicles = plan.carIds
    .map((id) => content.cars.find((c) => c.id === id)?.name)
    .filter(Boolean)
    .join(", ");
  const rows: Row[] = [];
  if (price.deposit) rows.push({ label: "Deposit", value: `${rupees(price.deposit)}${plan.depositNote ? ` ${plan.depositNote}` : ""}` });
  if (vehicles) rows.push({ label: "Vehicles available", value: vehicles });
  rows.push(...plan.rows);
  const page = PLAN_PAGES.find((p) => p.planId === plan.id);
  return {
    id: plan.id,
    name: plan.name.en,
    tag: plan.tag,
    theme: plan.theme,
    priceLabel: plan.priceLabel,
    amount: price.amount,
    unit: price.unit,
    rows,
    benefits: plan.benefits,
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
    badges: plansOffering(content, car.id).map((p) => p.shortName || p.name.en),
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

export type PlanPageView = {
  name: string;
  headline: string;
  highlight: string;
  heroImage: ImageSlot;
  /** "₹499" and "+/mo", blank when the plan has no national amount. */
  amount: string;
  unit: string;
  whyTag: string;
  whyTitle: string;
  whySubtitle: string;
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
    amount: rupees(plan.price.amount),
    unit: plan.price.amount ? plan.price.unit : "",
    whyTag: fill(page.whyTag),
    whyTitle: fill(page.whyTitle),
    whySubtitle: fill(page.whySubtitle),
    features: page.features.map((f) => ({ ...f, title: fill(f.title), body: fill(f.body) })).filter((f) => f.title || f.body),
    storiesTitle: fill(page.storiesTitle),
  };
}
