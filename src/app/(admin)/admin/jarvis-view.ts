import "server-only";
import type { JarvisPrice, JarvisPriced, JarvisView } from "@/components/admin/shared";
import { priceIn, type CityPrices, type Price, type SiteContent } from "@/lib/content";
import { planCalculator, siteCityFor, withLiveData, type LiveData } from "@/lib/fleet-data";
import { PLAN_PAGES } from "@/lib/plan-pages";

const figures = (p: Price): JarvisPrice => ({ amount: p.amount, unit: p.amount ? p.unit : "", deposit: p.deposit, upfront: p.upfront });

/**
 * Jarvis's figures for the admin, worked out exactly as the public pages work them out (the same
 * overlay), so the read-only fields show what visitors see. With no data from Jarvis every figure
 * is blank and ready cars zero, as on the site.
 */
export function jarvisView(content: SiteContent, live: LiveData | null): JarvisView {
  const shown = withLiveData(content, live, true);
  const priced = (price: Price, cityPrices: CityPrices): JarvisPriced => ({
    price: figures(price),
    cities: Object.fromEntries(content.cities.map((c) => [c.slug, figures(priceIn(price, cityPrices, c.slug))])),
  });

  const cities: JarvisView["cities"] = {};
  for (const city of content.cities) {
    const found = (live?.cities ?? []).filter((c) => siteCityFor(c, content) === city.slug);
    cities[city.slug] = { readyCars: found.reduce((sum, c) => sum + c.readyCars, 0), hubs: found.flatMap((c) => c.hubs) };
  }

  return {
    at: live?.at ?? "",
    plans: Object.fromEntries(shown.plans.map((p) => [p.id, priced(p.price, p.cityPrices)])),
    cars: Object.fromEntries(shown.cars.map((c) => [c.id, priced(c.price, c.cityPrices)])),
    calculators: Object.fromEntries(
      PLAN_PAGES.map(({ planId }) => [
        planId,
        (planCalculator(content, live, planId)?.cities ?? []).map((city) => ({
          slug: city.slug,
          name: city.name,
          cars: city.cars.map((car) => ({ name: car.name, years: car.years })),
        })),
      ])
    ),
    cities,
  };
}
