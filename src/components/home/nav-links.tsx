"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Plans", href: "/own-now" },
  { label: "Our Services", href: "/our-services" },
  { label: "Everest Dost", href: "/#dost" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-12 lg:flex">
      {NAV.map((item) => {
        const active = item.href === pathname;
        return (
          <Link
            key={item.label}
            href={item.href}
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
