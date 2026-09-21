"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";

type Item = { label: string; href: string; items?: { label: string; href: string }[] };

export const NAV: Item[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "Our Plans",
    href: "/own-now",
    items: [
      { label: "Own Now", href: "/own-now" },
      { label: "Drive to Own", href: "/own-now#calculator" },
      { label: "Leasing", href: "/drive-with-us" },
    ],
  },
  {
    label: "Our Services",
    href: "/our-services",
    items: [
      { label: "Fleet Management", href: "/our-services" },
      { label: "Driver Sourcing", href: "/drive-with-us" },
      { label: "Maintenance", href: "/our-services#how" },
    ],
  },
  { label: "Everest Dost", href: "/#dost" },
];

export function NavLinks() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [openedAt, setOpenedAt] = useState(pathname);
  const nav = useRef<HTMLElement>(null);

  // A menu must not survive a navigation. Deriving it during render avoids an effect that
  // sets state, which would cost an extra render pass on every route change.
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(null);
  }

  // A menu left open after the pointer moves away is noise, and on a phone there is no
  // pointer to move, so it closes on any click outside and on Escape.
  useEffect(() => {
    function away(event: MouseEvent) {
      if (!nav.current?.contains(event.target as Node)) setOpen(null);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const active = (href: string) => href === pathname || `${href}/` === pathname;

  return (
    <nav ref={nav} className="hidden items-center gap-7 lg:flex xl:gap-10">
      {NAV.map((item) =>
        item.items ? (
          <div key={item.label} className="relative" onMouseEnter={() => setOpen(item.label)}>
            <button
              type="button"
              aria-expanded={open === item.label}
              onClick={() => setOpen(open === item.label ? null : item.label)}
              className={`flex items-center gap-1 text-[15px] font-medium leading-[22.5px] tracking-[-0.23px] transition ${
                active(item.href) ? "text-navy" : "text-ink-soft hover:text-navy"
              }`}
            >
              {item.label}
              <CaretDown size={13} weight="bold" className={open === item.label ? "rotate-180" : ""} />
            </button>
            {open === item.label ? (
              <div
                className="absolute left-1/2 top-full z-50 w-[212px] -translate-x-1/2 pt-3"
                onMouseLeave={() => setOpen(null)}
              >
                <ul className="overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-[0_12px_32px_rgba(6,47,80,0.14)]">
                  {item.items.map((sub) => (
                    <li key={sub.label}>
                      <Link
                        href={sub.href}
                        className="block px-4 py-2.5 text-[14px] font-medium text-ink-soft transition hover:bg-mist hover:text-navy"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active(item.href) ? "page" : undefined}
            className={`relative text-[15px] font-medium leading-[22.5px] tracking-[-0.23px] transition ${
              active(item.href) ? "text-navy" : "text-ink-soft hover:text-navy"
            }`}
          >
            {item.label}
            {active(item.href) && <span aria-hidden className="absolute left-0 top-[24.75px] h-0.5 w-full bg-sun" />}
          </Link>
        )
      )}
    </nav>
  );
}
