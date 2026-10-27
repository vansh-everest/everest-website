import type { SiteContent } from "./content";

/**
 * Every page built for a search term, in one list: the sitemap, llms.txt, the cross links and the
 * admin's Search pages section all read it, so a new page counts everywhere once it is added here.
 * They sit outside the main menu and the footer; search and the driver pages lead to them.
 */

export const RENT_ROOT = "/car-on-rent-for-uber";
export const FLEET_ROOT = "/uber-fleet-partner";
export const CONTACT_ROOT = "/driver-job-contact-number";

export const rentPath = (slug: string) => `${RENT_ROOT}/${slug}`;
export const fleetPath = (slug: string) => `${FLEET_ROOT}/${slug}`;
export const contactPath = (slug: string) => `${CONTACT_ROOT}/${slug}`;

export type SearchGroup = "Car on rent" | "Fleet operator" | "Contact number" | "Guide";

export type SearchPage = {
  /** With its trailing slash, as the site serves it. */
  path: string;
  group: SearchGroup;
  label: string;
  /** The search term the page is written for. */
  keyword: string;
  city?: string;
};

export const SEARCH_GROUPS: SearchGroup[] = ["Guide", "Car on rent", "Fleet operator", "Contact number"];

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
  ];
}

/** "/car-on-rent-for-uber/pune?x=1" → its entry; the slash and query do not matter. */
export function searchPageAt(pages: SearchPage[], path: string | null | undefined): SearchPage | undefined {
  if (!path) return undefined;
  const bare = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return pages.find((p) => p.path.replace(/\/+$/, "") === bare);
}
