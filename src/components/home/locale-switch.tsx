"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";
import { DEFAULT_LOCALE, EXTRA_LOCALES, LOCALES, LOCALE_META, isLocale, localePath } from "@/lib/i18n";

/** Paths that exist in every locale. Everything else sends the reader to the driver hub. */
const TRANSLATED = ["/drive-with-us", "/blog"];

function basePath(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  const stripped = isLocale(first) && first !== DEFAULT_LOCALE ? `/${rest.join("/")}` : pathname;
  const clean = stripped.replace(/\/+$/, "") || "/";
  return TRANSLATED.some((p) => clean === p || clean.startsWith(`${p}/`)) ? clean : "/drive-with-us";
}

export function LocaleSwitch() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function away(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, []);

  const [, first] = pathname.split("/");
  const current = isLocale(first) && EXTRA_LOCALES.includes(first as "hi" | "te") ? first : DEFAULT_LOCALE;
  const path = basePath(pathname);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 font-bold text-white transition hover:text-sun"
      >
        {LOCALE_META[current].label}
        <CaretDown size={11} weight="bold" className={open ? "rotate-180" : ""} />
      </button>

      {open ? (
        <ul className="absolute right-0 top-full z-50 mt-2 w-[132px] overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-[0_12px_32px_rgba(6,47,80,0.2)]">
          {LOCALES.map((l) => (
            <li key={l}>
              <Link
                href={localePath(l, path)}
                hrefLang={LOCALE_META[l].htmlLang}
                aria-current={l === current ? "true" : undefined}
                className={`block px-4 py-2 text-[13px] font-semibold transition hover:bg-mist ${
                  l === current ? "text-navy" : "text-ink-soft"
                }`}
              >
                {LOCALE_META[l].label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
