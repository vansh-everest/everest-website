import { siteCopy, type LinkKey } from "@/content/site-copy";
import { DEFAULT_LOCALE, hrefIn, type Locale } from "@/lib/i18n";

/**
 * Site navigation, shared by the desktop nav, the mobile menu and the top bar.
 * It lives outside the client components so a server component can read it as data.
 */
export type NavLink = { label: string; href: string };
/** `href` on a group is its own page: the label links there and marks the group current. */
export type NavGroup = { label: string; href?: string; items: NavLink[] };
export type NavItem = NavLink | NavGroup;

type LinkDef = { key: LinkKey; href: string };
type GroupDef = { key: LinkKey; href?: string; items: LinkDef[] };

const NAV_DEF: (LinkDef | GroupDef)[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about-us" },
  {
    key: "plans",
    href: "/our-plans",
    items: [
      { key: "ownNow", href: "/own-now" },
      { key: "driveToEarn", href: "/drive-to-earn" },
      { key: "driveToOwn", href: "/drive-to-own" },
    ],
  },
  {
    key: "services",
    href: "/our-services",
    items: [
      { key: "fleetLogistics", href: "/fleet-logistics" },
      { key: "employeeMobility", href: "/employee-mobility" },
      { key: "intercity", href: "/intercity" },
      { key: "advertise", href: "/advertise-with-us" },
    ],
  },
  { key: "dost", href: "/everest-dost" },
];

/** The top bar's links. The mobile menu repeats them because the top bar is hidden there. */
const UTILITY_DEF: LinkDef[] = [
  { key: "forInvestors", href: "/investors" },
  { key: "blog", href: "/blog" },
];

/** A link in `locale`: its label in that language, and the page in that language when it has one. */
function link(def: LinkDef, locale: Locale): NavLink {
  return { label: siteCopy(locale).links[def.key], href: hrefIn(locale, def.href) };
}

export function navFor(locale: Locale): NavItem[] {
  return NAV_DEF.map((def) =>
    "items" in def
      ? {
          label: siteCopy(locale).links[def.key],
          href: def.href === undefined ? undefined : hrefIn(locale, def.href),
          items: def.items.map((item) => link(item, locale)),
        }
      : link(def, locale)
  );
}

export function utilityLinksFor(locale: Locale): NavLink[] {
  return UTILITY_DEF.map((def) => link(def, locale));
}

export const NAV: NavItem[] = navFor(DEFAULT_LOCALE);
export const UTILITY_LINKS: NavLink[] = utilityLinksFor(DEFAULT_LOCALE);

// A hash link points into a page, so it never marks that page as the current one.
export function isCurrent(href: string, pathname: string): boolean {
  if (href.includes("#")) return false;
  return href === pathname || `${href}/` === pathname || href === `${pathname}/`;
}

export function isActive(item: NavItem, pathname: string): boolean {
  if (!("items" in item)) return isCurrent(item.href, pathname);
  return (item.href !== undefined && isCurrent(item.href, pathname)) || item.items.some((sub) => isCurrent(sub.href, pathname));
}
