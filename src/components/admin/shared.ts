import type { Dispatch, SetStateAction } from "react";
import type { Hub, SiteContent } from "@/lib/content";
import type { PlanYear } from "@/lib/fleet-data";

export type Setter = Dispatch<SetStateAction<SiteContent>>;

/** A plan's or car's figures as the site shows them: digits, blank where Jarvis has none. */
export type JarvisPrice = { amount: string; unit: string; deposit: string; upfront: string };
export type JarvisPriced = { price: JarvisPrice; cities: Record<string, JarvisPrice> };
export type JarvisCalculatorCity = { slug: string; name: string; cars: { name: string; years: PlanYear[] }[] };

/**
 * What Jarvis supplies, for the admin to show read only when the site runs on Jarvis. Keyed by
 * plan id, car id and city slug; `at` is blank when Jarvis could not be read.
 */
export type JarvisView = {
  at: string;
  plans: Record<string, JarvisPriced>;
  cars: Record<string, JarvisPriced>;
  /** Per plan with a page: the cities and cars its picker prices, with their model years. */
  calculators: Record<string, JarvisCalculatorCity[]>;
  /** Per city: ready cars and Jarvis's own hubs (none when it lists none). */
  cities: Record<string, { readyCars: number; hubs: Hub[] }>;
};

/** An id from a display name that no sibling already uses: "Revenue Share" becomes "revenue-share". */
export function newId(name: string, taken: string[]): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 36) || "item";
  let id = base;
  for (let n = 2; taken.includes(id); n++) id = `${base}-${n}`;
  return id;
}
