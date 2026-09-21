"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/lib/i18n";

/** `translated` pages exist in every locale. The rest are English only for now. */
export const NAV = [
  { label: "Home", href: "/", translated: false },
  { label: "About Us", href: "/about-us", translated: false },
  { label: "Our Plans", href: "/own-now", translated: false },
  { label: "Our Services", href: "/our-services", translated: false },
  { label: "Drive With Us", href: "/drive-with-us", translated: true },
  { label: "Guides", href: "/blog", translated: true },
  { label: "Everest Dost", href: "/#dost", translated: false },
];

export function NavLinks({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-6 lg:flex xl:gap-10">
      {NAV.map((item) => {
        const href = item.translated ? localePath(locale, item.href) : item.href;
        const active = href === pathname || `${href}/` === pathname;
        return (
          <Link
            key={item.label}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative text-[15px] font-medium leading-[22.5px] tracking-[-0.23px] transition ${
              active ? "text-navy" : "text-ink-soft hover:text-navy"
            }`}
          >
            {item.label}
            {active && <span aria-hidden className="absolute left-0 top-[24.75px] h-0.5 w-full bg-sun" />}
          </Link>
        );
      })}
    </nav>
  );
}
