import type { SiteContent } from "./content";
import { canonical } from "./i18n";
import { CONTACT_ROOT, FLEET_ROOT, RENT_ROOT, UBER_JOB_ROOT, VACANCY_ROOT, type SearchGroup, type SearchPage } from "./search-pages";

/**
 * The Hindi editions of the search pages, under /hi; each sits beside its English page as a language alternate.
 * Labels stay in English with " (Hindi)" so the admin reads them beside their English twins. The roots are
 * read inside the function, after search-pages.ts (which imports this file) has finished loading.
 */
export function hindiSearchPages(content: SiteContent): SearchPage[] {
  const page = (path: string, group: SearchGroup, label: string, keyword: string, city?: string): SearchPage => ({
    path: canonical("hi", path),
    group,
    label: `${label} (Hindi)`,
    keyword,
    ...(city ? { city } : {}),
    locale: "hi",
  });
  const cityPages = (root: string, group: SearchGroup, label: string, keyword: string): SearchPage[] =>
    content.cities.map((c) =>
      page(`${root}/${c.slug}/`, group, label.replace("{city}", c.name.en), keyword.replace("{city}", c.name.en.toLowerCase()), c.name.en)
    );
  const perCity = (root: string, group: SearchGroup, rootLabel: string, rootKeyword: string, label: string, keyword: string): SearchPage[] => [
    page(`${root}/`, group, rootLabel, rootKeyword),
    ...cityPages(root, group, label, keyword),
  ];
  return [
    page("/uber-driver-requirements/", "Guide", "Uber driver requirements", "uber driver banne ke liye documents"),
    page("/drive-for-uber-without-a-car/", "Guide", "Drive for Uber without a car", "bina gadi ke uber kaise chalaye"),
    page("/fleet-management-company/", "Guide", "Fleet management company", "fleet management company kya hai"),
    page("/ev-driver-jobs/", "Guide", "EV driver jobs", "ev car driver ki naukri"),
    ...perCity(RENT_ROOT, "Car on rent", "Car on rent for Uber", "uber ke liye car kiraye par", "Car on rent in {city}", "{city} me uber ke liye car kiraye par"),
    ...perCity(FLEET_ROOT, "Fleet operator", "Uber fleet partner", "uber fleet partner kya hai", "Uber fleet in {city}", "{city} me uber fleet"),
    ...perCity(CONTACT_ROOT, "Contact number", "Driver job contact numbers", "driver ki naukri contact number", "Driver job contact number, {city}", "{city} driver ki naukri number"),
    // City pages only: the all-cities pages of these two families are English.
    ...cityPages(VACANCY_ROOT, "Driver vacancy", "Driver vacancy in {city}", "{city} me driver ki vacancy"),
    ...cityPages(UBER_JOB_ROOT, "Uber driver job", "Uber driver job in {city}", "{city} me uber driver ki naukri"),
  ];
}
