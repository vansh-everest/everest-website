import { cityPath } from "./city-route";
import type { Hub, SiteContent } from "./content";
import { hindiSearchPages } from "./search-pages-hi";

/**
 * Every page built for a search term, in one list: the sitemap, llms.txt, the cross links and the
 * admin's Search pages section all read it, so a new page counts everywhere once it is added here.
 * They sit outside the main menu and the footer; search and the driver pages lead to them.
 */

export const RENT_ROOT = "/car-on-rent-for-uber";
export const FLEET_ROOT = "/uber-fleet-partner";
export const CONTACT_ROOT = "/driver-job-contact-number";
export const VACANCY_ROOT = "/driver-vacancy";
export const UBER_JOB_ROOT = "/uber-driver-job";

export const rentPath = (slug: string) => `${RENT_ROOT}/${slug}`;
export const fleetPath = (slug: string) => `${FLEET_ROOT}/${slug}`;
export const contactPath = (slug: string) => `${CONTACT_ROOT}/${slug}`;
export const vacancyPath = (slug: string) => `${VACANCY_ROOT}/${slug}`;
export const uberJobPath = (slug: string) => `${UBER_JOB_ROOT}/${slug}`;

/** "Gurugram Sector 17" → "gurugram-sector-17": a hub's address segment under its city page. */
export const hubSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Every hub's segment, in the city's hub order: from its name, "-2" on a repeated name, and
 * "hub-<n>" when a name has no letters or digits, so no two hubs (and no hub and its city) share a path.
 */
export function hubSlugs(hubs: Pick<Hub, "name">[]): string[] {
  const seen = new Map<string, number>();
  return hubs.map((h, i) => {
    const base = hubSlug(h.name) || `hub-${i + 1}`;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  });
}

/** One hub's segment; `hub` is one of `city.hubs` (the same object). */
export const hubSegment = (city: { hubs: Hub[] }, hub: Hub) => hubSlugs(city.hubs)[city.hubs.indexOf(hub)] ?? (hubSlug(hub.name) || "hub");

/** /drive-with-us/driver-job-in-mumbai/thane, without the trailing slash. */
export const hubPath = (city: { slug: string; hubs: Hub[] }, hub: Hub) => `${cityPath(city.slug)}/${hubSegment(city, hub)}`;

export type SearchGroup = "Car on rent" | "Fleet operator" | "Contact number" | "Driver vacancy" | "Uber driver job" | "Hub" | "Guide";

export type SearchPage = {
  /** With its trailing slash, as the site serves it. */
  path: string;
  group: SearchGroup;
  label: string;
  /** The search term the page is written for. */
  keyword: string;
  city?: string;
  /** Set on a page written in another language; English pages leave it out. */
  locale?: "hi";
};

export const SEARCH_GROUPS: SearchGroup[] = ["Guide", "Car on rent", "Fleet operator", "Contact number", "Driver vacancy", "Uber driver job", "Hub"];

const GUIDES: SearchPage[] = [
  { path: "/uber-driver-requirements/", group: "Guide", label: "Uber driver requirements", keyword: "uber driver requirements" },
  { path: "/drive-for-uber-without-a-car/", group: "Guide", label: "Drive for Uber without a car", keyword: "uber driver job without car" },
  { path: "/fleet-management-company/", group: "Guide", label: "Fleet management company", keyword: "fleet management companies in india" },
  { path: "/ev-driver-jobs/", group: "Guide", label: "EV driver jobs", keyword: "ev car driver job" },
];

export function searchPages(content: SiteContent): SearchPage[] {
  const perCity = (root: string, group: SearchGroup, label: string, keyword: string, rootLabel: string, rootKeyword: string): SearchPage[] => [
    { path: `${root}/`, group, label: rootLabel, keyword: rootKeyword },
    ...content.cities.map((c) => ({
      path: `${root}/${c.slug}/`,
      group,
      label: label.replace("{city}", c.name.en),
      keyword: keyword.replace("{city}", c.name.en.toLowerCase()),
      city: c.name.en,
    })),
  ];
  return [
    ...GUIDES,
    ...perCity(RENT_ROOT, "Car on rent", "Car on rent in {city}", "car on rent for uber in {city}", "Car on rent for Uber", "car on rent for uber"),
    ...perCity(FLEET_ROOT, "Fleet operator", "Uber fleet in {city}", "uber fleet {city}", "Uber fleet partner", "uber fleet partner"),
    ...perCity(CONTACT_ROOT, "Contact number", "Driver job contact number, {city}", "{city} driver job contact number", "Driver job contact numbers", "driver job contact number"),
    ...perCity(VACANCY_ROOT, "Driver vacancy", "Driver vacancy in {city}", "driver vacancy in {city}", "Driver vacancies", "driver vacancy"),
    ...perCity(UBER_JOB_ROOT, "Uber driver job", "Uber driver job in {city}", "uber driver job {city}", "Uber driver job", "uber driver job"),
    ...content.cities.flatMap((c) =>
      c.hubs.map((h) => ({
        path: `${hubPath(c, h)}/`,
        group: "Hub" as const,
        label: `${h.name} hub, ${c.name.en}`,
        keyword: `driver job in ${h.name.toLowerCase()}`,
        city: c.name.en,
      }))
    ),
    ...hindiSearchPages(content),
  ];
}

/** "/car-on-rent-for-uber/pune?x=1" → its entry; the slash and query do not matter. */
export function searchPageAt(pages: SearchPage[], path: string | null | undefined): SearchPage | undefined {
  if (!path) return undefined;
  const bare = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return pages.find((p) => p.path.replace(/\/+$/, "") === bare);
}
