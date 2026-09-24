"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NAV, isActive, isCurrent } from "./nav-data";

// The bottom padding reserves the underline's room on every item, so the active one does not
// sit lower than its neighbours.
const label = "relative pb-2 text-base leading-6 tracking-[-0.2px] transition";

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

  return (
    <nav ref={nav} aria-label="Main" className="hidden items-center gap-6 lg:flex xl:gap-7">
      {NAV.map((item) => {
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

        return (
          <div key={item.label} className="relative" onMouseEnter={() => setOpen(item.label)}>
            <button
              type="button"
              aria-expanded={open === item.label}
              onClick={() => setOpen(open === item.label ? null : item.label)}
              className={`flex items-center gap-1.5 ${label} ${tone}`}
            >
              {item.label}
              <ChevronDown size={14} aria-hidden className={`-mr-[3px] transition ${open === item.label ? "rotate-180" : ""}`} />
              {active && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-brand" />}
            </button>
            {open === item.label ? (
              <div
                className="absolute left-1/2 top-full z-50 w-[212px] -translate-x-1/2 pt-7"
                onMouseLeave={() => setOpen(null)}
              >
                <ul className="overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-[0_12px_32px_rgba(6,47,80,0.14)]">
                  {item.items.map((sub) => (
                    <li key={sub.label}>
                      <Link
                        href={sub.href}
                        aria-current={isCurrent(sub.href, pathname) ? "page" : undefined}
                        className={`block px-4 py-2.5 text-[15px] font-medium transition hover:bg-mist hover:text-navy ${
                          isCurrent(sub.href, pathname) ? "text-brand" : "text-ink-soft"
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
