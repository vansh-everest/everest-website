"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { goHome, holdScroll } from "@/components/fx/smooth-scroll";
import { siteCopy } from "@/content/site-copy";
import { fill, hrefIn, localeOfPath } from "@/lib/i18n";
import { FormLink } from "./form-link";
import { LocaleRow } from "./locale-switch";
import { isActive, isCurrent, navFor, utilityLinksFor } from "./nav-data";
import { PHONE_DISPLAY, PHONE_HREF } from "./ui";

const subscribeNothing = () => () => {};

const row =
  "relative flex h-14 w-full items-center justify-between px-5 text-[17px] font-semibold leading-6 tracking-[-0.2px]";

/**
 * The nav below `lg`: a toggle for the header and the drawer it slides in from the right.
 * `home` is the home page in the visitor's language, whose lead form "Drive With Us" falls back to.
 */
export function MobileMenu({ home }: { home: string }) {
  const pathname = usePathname();
  const locale = localeOfPath(pathname);
  const copy = siteCopy(locale).header;
  const nav = navFor(locale);
  const id = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  // The drawer is portalled to <body>, which only exists once the page is in the browser.
  const inBrowser = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  // A group's label goes to its page; its chevron shows its pages. The group of the page
  // being read starts open, so the visitor sees where they are.
  const [shown, setShown] = useState<string[]>(() =>
    nav.filter((item) => "items" in item && isActive(item, pathname)).map((item) => item.label),
  );
  const [openedAt, setOpenedAt] = useState(pathname);

  // Closed on navigation, derived during render for the same reason as the desktop menus.
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    // The page behind must not scroll while the drawer covers it, natively or through the inertia
    // scroll; the drawer scrolls on its own (data-lenis-prevent).
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const release = holdScroll();
    // Keyboard focus has to stay in the drawer rather than wander onto the page it covers.
    const behind = [...document.body.children].filter(
      (el) => !el.contains(toggle.current) && !el.contains(drawer.current),
    );
    for (const el of behind) el.setAttribute("inert", "");
    closer.current?.focus();
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
      release();
      for (const el of behind) el.removeAttribute("inert");
      document.removeEventListener("keydown", escape);
      wide.removeEventListener("change", widen);
    };
  }, [open]);

  // A link to the page already open, or to an anchor on it, changes no pathname.
  const close = () => setOpen(false);
  const flipGroup = (label: string) =>
    setShown((list) =>
      list.includes(label) ? list.filter((l) => l !== label) : [...list, label],
    );

  return (
    <>
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={copy.menu}
        onClick={() => setOpen(true)}
        className="-mr-2 flex size-11 items-center justify-center rounded-full text-navy transition hover:bg-mist lg:hidden"
      >
        <Menu size={26} aria-hidden />
      </button>

      {inBrowser
        ? createPortal(
            <div
              ref={drawer}
              id={id}
              role="dialog"
              aria-modal="true"
              aria-label={copy.menu}
              inert={!open}
              className={`fixed inset-0 z-[60] transition-[visibility] duration-300 lg:hidden ${open ? "visible" : "invisible"}`}
            >
              <button
                type="button"
                tabIndex={-1}
                aria-label={copy.closeMenu}
                onClick={close}
                className={`absolute inset-0 bg-navy/90 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
              />
              <div
                data-lenis-prevent
                className={`absolute inset-y-0 right-0 flex w-[80%] max-w-[320px] flex-col overflow-y-auto overscroll-contain bg-white transition-transform duration-300 ease-out ${
                  open ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="flex h-[61px] shrink-0 items-center justify-between border-b border-line pl-3 pr-2">
                  <Link
                    href={hrefIn(locale, "/")}
                    onClick={(event) => {
                      close();
                      goHome(event);
                    }}
                    className="mt-1"
                  >
                    <Image
                      src="/figma/logo.png"
                      alt="Everest Fleet"
                      width={84}
                      height={48}
                      className="h-12 w-[84px]"
                    />
                  </Link>
                  <button
                    ref={closer}
                    type="button"
                    aria-label={copy.closeMenu}
                    onClick={() => {
                      close();
                      toggle.current?.focus();
                    }}
                    className="flex size-11 items-center justify-center rounded-full text-navy transition hover:bg-mist"
                  >
                    <X size={24} aria-hidden />
                  </button>
                </div>

                <nav aria-label={copy.main}>
                  <ul>
                    {nav.map((item) => {
                      const active = isActive(item, pathname);

                      if (!("items" in item)) {
                        return (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={close}
                              aria-current={active ? "page" : undefined}
                              className={`${row} ${active ? "text-brand" : "text-navy"}`}
                            >
                              {active && (
                                <span
                                  aria-hidden
                                  className="absolute inset-y-0 left-0 w-[3px] bg-brand"
                                />
                              )}
                              {item.label}
                            </Link>
                          </li>
                        );
                      }

                      const expanded = shown.includes(item.label);
                      const list = `${id}-${item.label.replace(/\s+/g, "-").toLowerCase()}`;
                      const toggle = (
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={list}
                          aria-label={item.href ? fill(copy.groupPages, { label: item.label }) : undefined}
                          onClick={() => flipGroup(item.label)}
                          className={
                            item.href
                              ? "flex size-14 shrink-0 items-center justify-center text-navy"
                              : `${row} ${expanded || active ? "text-brand" : "text-navy"}`
                          }
                        >
                          {item.href ? null : item.label}
                          <ChevronDown
                            size={16}
                            aria-hidden
                            className={`transition ${expanded ? "" : "-rotate-90"}`}
                          />
                        </button>
                      );
                      return (
                        <li key={item.label}>
                          {item.href ? (
                            <div className="flex items-center">
                              <Link
                                href={item.href}
                                onClick={close}
                                aria-current={isCurrent(item.href, pathname) ? "page" : undefined}
                                className={`${row} pr-0 ${active ? "text-brand" : "text-navy"}`}
                              >
                                {active && (
                                  <span
                                    aria-hidden
                                    className="absolute inset-y-0 left-0 w-[3px] bg-brand"
                                  />
                                )}
                                {item.label}
                              </Link>
                              {toggle}
                            </div>
                          ) : (
                            toggle
                          )}
                          <ul
                            id={list}
                            hidden={!expanded}
                            className="mb-1.5 ml-7 border-l-2 border-brand pl-[18px]"
                          >
                            {item.items.map((sub) => {
                              const current = isCurrent(sub.href, pathname);
                              return (
                                <li key={sub.label}>
                                  <Link
                                    href={sub.href}
                                    onClick={close}
                                    aria-current={current ? "page" : undefined}
                                    className={`flex h-11 items-center text-[15px] leading-[22px] ${
                                      current
                                        ? "font-semibold text-brand"
                                        : "text-navy"
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

                <ul className="mt-1.5 border-y border-line py-1.5">
                  {utilityLinksFor(locale).map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={close}
                        className="flex h-[46px] items-center px-5 text-[15px] font-medium text-ink-soft transition hover:text-navy"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <LocaleRow />

                <div className="mt-auto space-y-2.5 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
                  <FormLink
                    home={home}
                    onClick={close}
                    className="flex h-[50px] w-full items-center justify-center rounded-full bg-sun text-[17px] font-bold text-navy transition hover:brightness-105"
                  >
                    {copy.driveWithUs}
                  </FormLink>
                  <a
                    href={PHONE_HREF}
                    className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-full border-2 border-[#d5dbe3] text-[17px] font-bold text-navy transition hover:border-navy"
                  >
                    <Phone
                      size={17}
                      fill="currentColor"
                      strokeWidth={0}
                      aria-hidden
                    />
                    {fill(copy.call, { phone: PHONE_DISPLAY })}
                  </a>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
