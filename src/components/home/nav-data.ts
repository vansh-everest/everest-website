/**
 * Site navigation, shared by the desktop nav, the mobile menu and the top bar.
 * It lives outside the client components so a server component can read it as data.
 */
export type NavLink = { label: string; href: string };
export type NavItem = NavLink | { label: string; items: NavLink[] };

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "Our Plans",
    items: [
      { label: "Own Now", href: "/own-now" },
      { label: "Drive to Own", href: "/drive-to-own" },
      { label: "Drive to Earn", href: "/drive-to-earn" },
      { label: "Revenue Share", href: "/revenue-share" },
    ],
  },
  {
    label: "Our Services",
    items: [
      { label: "Fleet Management", href: "/our-services" },
      { label: "Driver Sourcing", href: "/drive-with-us" },
      { label: "Maintenance", href: "/our-services#how" },
    ],
  },
  { label: "Everest Dost", href: "/#dost" },
];

/** The top bar's links. The mobile menu repeats them because the top bar is hidden there. */
export const UTILITY_LINKS: NavLink[] = [
  { label: "For Investors", href: "/investors" },
  { label: "Blogs", href: "/blog" },
];

// A hash link points into a page, so it never marks that page as the current one.
export function isCurrent(href: string, pathname: string): boolean {
  if (href.includes("#")) return false;
  return href === pathname || `${href}/` === pathname;
}

export function isActive(item: NavItem, pathname: string): boolean {
  return "items" in item
    ? item.items.some((sub) => isCurrent(sub.href, pathname))
    : isCurrent(item.href, pathname);
}
