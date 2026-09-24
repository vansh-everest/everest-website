"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { DEFAULT_LOCALE, EXTRA_LOCALES, LOCALES, LOCALE_META, isLocale, localePath } from "@/lib/i18n";

/** Paths that exist in every locale. Everything else sends the reader to the driver hub. */
const TRANSLATED = ["/drive-with-us", "/blog"];

function basePath(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  const stripped = isLocale(first) && first !== DEFAULT_LOCALE ? `/${rest.join("/")}` : pathname;
  const clean = stripped.replace(/\/+$/, "") || "/";
  return TRANSLATED.some((p) => clean === p || clean.startsWith(`${p}/`)) ? clean : "/drive-with-us";
}

/** `up` opens the list above the pill, for when the pill sits at the bottom of a panel. */
export function LocaleSwitch({ up = false }: { up?: boolean }) {
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
        aria-label={`Language: ${LOCALE_META[current].label}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[33px] items-center gap-2 rounded-full border border-white/30 bg-white/[0.08] pl-3.5 pr-[13px] text-sm font-bold leading-none text-white transition hover:border-white/50 hover:bg-white/[0.14]"
      >
        <Globe size={14} aria-hidden />
        <span className="uppercase">{current}</span>
        <ChevronDown size={12} aria-hidden className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <ul
          className={`absolute right-0 z-50 w-[132px] overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-[0_12px_32px_rgba(6,47,80,0.2)] ${
            up ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
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
