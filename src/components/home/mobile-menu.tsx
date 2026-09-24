"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { LocaleSwitch } from "./locale-switch";
import { NAV, UTILITY_LINKS, isActive, isCurrent } from "./nav-data";
import { PHONE_DISPLAY, PHONE_HREF } from "./ui";

const row = "flex w-full items-center justify-between py-4 text-[17px] leading-6 tracking-[-0.2px]";

/** The nav below `lg`: a toggle for the header and the panel it opens under the header. */
export function MobileMenu({ driveHref }: { driveHref: string }) {
  const pathname = usePathname();
  const id = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const [top, setTop] = useState(0);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Closed on navigation, derived during render for the same reason as the desktop menus.
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    // The page behind must not scroll, or the sticky header moves away from the panel.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // Keyboard focus has to stay in the panel rather than wander onto the page it covers.
    const behind = [...document.body.children].filter((el) => !el.contains(toggle.current));
    for (const el of behind) el.setAttribute("inert", "");
    const wide = window.matchMedia("(min-width: 64rem)");
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    }
    function widen(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }
    document.addEventListener("keydown", escape);
    wide.addEventListener("change", widen);
    return () => {
      document.body.style.overflow = overflow;
      for (const el of behind) el.removeAttribute("inert");
      document.removeEventListener("keydown", escape);
      wide.removeEventListener("change", widen);
    };
  }, [open]);

  function flip() {
    if (!open) {
      // The top bar shows from md, so the header's bottom edge is not a fixed number.
      setTop(toggle.current?.closest("header")?.getBoundingClientRect().bottom ?? 0);
      setGroup(NAV.find((item) => "items" in item && isActive(item, pathname))?.label ?? null);
    }
    setOpen(!open);
  }

  // A link to the page already open, or to an anchor on it, changes no pathname.
  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label="Menu"
        onClick={flip}
        className="-mr-2 flex size-11 items-center justify-center rounded-full text-navy transition hover:bg-mist lg:hidden"
      >
        {open ? <X size={26} aria-hidden /> : <Menu size={26} aria-hidden />}
      </button>

      <div
        id={id}
        hidden={!open}
        style={{ top }}
        className="fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-white lg:hidden"
      >
        <nav aria-label="Main" className="px-4 pb-6 md:px-6">
          <ul className="divide-y divide-line">
            {NAV.map((item) => {
              const active = isActive(item, pathname);
              const tone = active ? "font-semibold text-brand" : "font-medium text-navy";

              if (!("items" in item)) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`${row} ${tone}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              const expanded = group === item.label;
              const list = `${id}-${item.label.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={list}
                    onClick={() => setGroup(expanded ? null : item.label)}
                    className={`${row} ${tone}`}
                  >
                    {item.label}
                    <ChevronDown size={18} aria-hidden className={`transition ${expanded ? "rotate-180" : ""}`} />
                  </button>
                  <ul id={list} hidden={!expanded} className="-mt-1 mb-3 border-l-2 border-line pl-4">
                    {item.items.map((sub) => {
                      const current = isCurrent(sub.href, pathname);
                      return (
                        <li key={sub.label}>
                          <Link
                            href={sub.href}
                            onClick={close}
                            aria-current={current ? "page" : undefined}
                            className={`block py-2.5 text-[15px] leading-[22px] ${
                              current ? "font-semibold text-brand" : "font-medium text-ink-soft"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto space-y-5 bg-navy px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 text-white md:px-6">
          <div className="flex items-center justify-between gap-4">
            <a href={PHONE_HREF} className="flex items-center gap-2.5 text-[15px] font-semibold text-sun">
              <Phone size={17} fill="currentColor" strokeWidth={0} aria-hidden />
              {PHONE_DISPLAY}
            </a>
            <LocaleSwitch up />
          </div>
          <ul className="flex items-center gap-5 text-sm font-semibold leading-5">
            {UTILITY_LINKS.map(({ label, href }, i) => (
              <li key={href} className="flex items-center gap-5">
                {i > 0 && <span aria-hidden className="h-4 w-px bg-white/20" />}
                <Link href={href} onClick={close} className="transition hover:text-sun">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={driveHref}
            onClick={close}
            className="flex h-12 w-full items-center justify-center rounded-full bg-sun text-base font-bold text-navy transition hover:brightness-105"
          >
            Drive With Us
          </Link>
        </div>
      </div>
    </>
  );
}
