"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { siteCopy } from "@/content/site-copy";
import { fill, localeOfPath } from "@/lib/i18n";
import { isActive, isCurrent, navFor } from "./nav-data";

// The bottom padding reserves the underline's room on every item, so the active one does not
// sit lower than its neighbours.
const label = "relative pb-2 text-base leading-6 tracking-[-0.2px] transition";

export function NavLinks() {
  const pathname = usePathname();
  const locale = localeOfPath(pathname);
  const copy = siteCopy(locale).header;
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

  return (
    <nav ref={nav} aria-label={copy.main} className="hidden items-center gap-6 lg:flex xl:gap-7">
      {navFor(locale).map((item) => {
        const active = isActive(item, pathname);
        const tone = active ? "font-semibold text-brand" : "font-medium text-navy hover:text-brand";

        if (!("items" in item)) {
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`${label} ${tone}`}
            >
              {item.label}
              {active && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-brand" />}
            </Link>
          );
        }

        const shown = open === item.label;
        const flip = () => setOpen(shown ? null : item.label);
        const chevron = <ChevronDown size={14} aria-hidden className={`-mr-[3px] transition ${shown ? "rotate-180" : ""}`} />;
        return (
          // Hovering opens the menu; the label itself goes to the group's own page, and the
          // chevron opens the menu for keyboard and touch.
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setOpen(item.label)}
            onMouseLeave={() => setOpen((now) => (now === item.label ? null : now))}
          >
            {item.href ? (
              <span className={`flex items-center gap-1.5 ${label} ${tone}`}>
                <Link href={item.href} aria-current={isCurrent(item.href, pathname) ? "page" : undefined} className="hover:text-brand">
                  {item.label}
                </Link>
                <button
                  type="button"
                  aria-expanded={shown}
                  aria-label={fill(copy.groupPages, { label: item.label })}
                  onClick={flip}
                  className="-my-1 -mr-1 rounded p-1 hover:text-brand"
                >
                  {chevron}
                </button>
                {active && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-brand" />}
              </span>
            ) : (
              <button type="button" aria-expanded={shown} onClick={flip} className={`flex items-center gap-1.5 ${label} ${tone}`}>
                {item.label}
                {chevron}
                {active && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-brand" />}
              </button>
            )}
            {shown ? (
              <div className="absolute left-1/2 top-full z-50 w-[263px] -translate-x-1/2 pt-7">
                <ul className="overflow-hidden rounded-xl border border-[#dfe5ee] bg-white py-2 shadow-[0_14px_36px_rgba(6,47,80,0.22)]">
                  {item.items.map((sub) => (
                    <li key={sub.label}>
                      <Link
                        href={sub.href}
                        aria-current={isCurrent(sub.href, pathname) ? "page" : undefined}
                        className={`flex h-11 items-center px-[21px] text-base leading-6 transition hover:bg-mist hover:text-brand ${
                          isCurrent(sub.href, pathname) ? "font-semibold text-brand" : "font-medium text-navy"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
