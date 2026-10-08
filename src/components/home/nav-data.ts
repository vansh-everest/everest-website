/**
 * Site navigation, shared by the desktop nav, the mobile menu and the top bar.
 * It lives outside the client components so a server component can read it as data.
 */
export type NavLink = { label: string; href: string };
/** `href` on a group is its own page: the label links there and marks the group current. */
export type NavGroup = { label: string; href?: string; items: NavLink[] };
export type NavItem = NavLink | NavGroup;

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "Our Plans",
    href: "/our-plans",
    items: [
      { label: "Own Now", href: "/own-now" },
      { label: "Drive To Earn", href: "/drive-to-earn" },
      { label: "Drive To Own", href: "/drive-to-own" },
    ],
  },
  {
    label: "Other Services",
    href: "/our-services",
    items: [
      { label: "Fleet Logistics", href: "/fleet-logistics" },
      { label: "Employee Mobility", href: "/employee-mobility" },
      { label: "Intercity", href: "/intercity" },
      { label: "Advertise With Us", href: "/advertise-with-us" },
    ],
  },
  { label: "Everest Dost", href: "/everest-dost" },
];

/** The top bar's links. The mobile menu repeats them because the top bar is hidden there. */
export const UTILITY_LINKS: NavLink[] = [
  { label: "For Investors", href: "/investors" },
  { label: "Blogs", href: "/blog" },
  { label: "ESG Report", href: "/investors#esg" },
];

// A hash link points into a page, so it never marks that page as the current one.
export function isCurrent(href: string, pathname: string): boolean {
  if (href.includes("#")) return false;
  return href === pathname || `${href}/` === pathname;
}

export function isActive(item: NavItem, pathname: string): boolean {
  if (!("items" in item)) return isCurrent(item.href, pathname);
  return (item.href !== undefined && isCurrent(item.href, pathname)) || item.items.some((sub) => isCurrent(sub.href, pathname));
}
