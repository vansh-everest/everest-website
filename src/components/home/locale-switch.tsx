"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [, first] = pathname.split("/");
  const current = isLocale(first) && EXTRA_LOCALES.includes(first as "hi" | "te") ? first : DEFAULT_LOCALE;
  const path = basePath(pathname);

  return (
    <nav aria-label="Language" className="flex items-center gap-1">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={localePath(l, path)}
          hrefLang={LOCALE_META[l].htmlLang}
          aria-current={l === current ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 transition ${
            l === current ? "bg-white/[0.14] text-white" : "text-white/60 hover:text-white"
          }`}
        >
          {LOCALE_META[l].label}
        </Link>
      ))}
    </nav>
  );
}
