/**
 * Locales for the driver pages.
 *
 * English is the default and carries no prefix, because the eight driver addresses on the
 * live property already rank and must not move. Every other language is served under its own
 * prefix (/hi, /mr, /kn, /te, /bn, /ta). More locales are added by extending LOCALES and the
 * dictionary; no routing changes. The order here is the order of the language picker.
 */
export const DEFAULT_LOCALE = "en" as const;
export const EXTRA_LOCALES = ["hi", "mr", "kn", "te", "bn", "ta"] as const;
export const LOCALES = [DEFAULT_LOCALE, ...EXTRA_LOCALES] as const;

export type Locale = (typeof LOCALES)[number];
export type ExtraLocale = (typeof EXTRA_LOCALES)[number];

/**
 * The three languages the whole home page and the header and footer are written in. They are
 * the only ones the language picker offers; the other locales keep their driver pages.
 */
export const MAIN_LOCALES = ["en", "hi", "kn"] as const;
export type MainLocale = (typeof MAIN_LOCALES)[number];

export function isMainLocale(value: string): value is MainLocale {
  return (MAIN_LOCALES as readonly string[]).includes(value);
}

export const LOCALE_META: Record<Locale, { label: string; htmlLang: string; fontVar: string }> = {
  en: { label: "English", htmlLang: "en-IN", fontVar: "font-sans" },
  hi: { label: "हिन्दी", htmlLang: "hi-IN", fontVar: "font-deva" },
  mr: { label: "मराठी", htmlLang: "mr-IN", fontVar: "font-deva" },
  kn: { label: "ಕನ್ನಡ", htmlLang: "kn-IN", fontVar: "font-knda" },
  te: { label: "తెలుగు", htmlLang: "te-IN", fontVar: "font-telu" },
  bn: { label: "বাংলা", htmlLang: "bn-IN", fontVar: "font-beng" },
  ta: { label: "தமிழ்", htmlLang: "ta-IN", fontVar: "font-taml" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** The locale an address is in: its prefix when it has one, otherwise English. */
export function localeOfPath(pathname: string): Locale {
  const [, first = ""] = pathname.split("/");
  return isLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

/** The English address of a page: the address with its locale prefix taken off, without a trailing slash. */
export function basePath(pathname: string): string {
  const [, first = "", ...rest] = pathname.split("/");
  const stripped = isLocale(first) && first !== DEFAULT_LOCALE ? `/${rest.join("/")}` : pathname;
  return stripped.replace(/\/+$/, "") || "/";
}

/**
 * Whether the page at an English address is also published in `locale`: the home page in the main
 * languages, the driver pages and the blog index in every one. Blog posts are checked one by one.
 */
export function existsIn(locale: Locale, path: string): boolean {
  if (locale === DEFAULT_LOCALE) return true;
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/") return isMainLocale(locale);
  return clean === "/drive-with-us" || clean.startsWith("/drive-with-us/") || clean === "/blog";
}

/** The page in `locale` when it is published there, otherwise the English page. */
export function hrefIn(locale: Locale, path: string): string {
  return existsIn(locale, path) ? localePath(locale, path) : path;
}

/** Copy with `{name}`-style tokens filled in from `values`. */
export function fill(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (whole, key: string) => (key in values ? String(values[key]) : whole));
}

/** English lives at the root. Everything else is prefixed. */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return locale === DEFAULT_LOCALE ? clean : `/${locale}${clean}`;
}

/**
 * The address as it is actually served. Next is configured with trailing slashes, so a
 * canonical without one points at a redirect rather than at the page.
 */
export function canonical(locale: Locale, path: string): string {
  const full = localePath(locale, path);
  return full.endsWith("/") ? full : `${full}/`;
}

/**
 * Every locale variant of a path, for the alternates block.
 * Search engines need each version to point at every other version, including itself,
 * or they treat the Hindi and English pages as competitors for the same query.
 */
export function alternatesFor(path: string, locales: readonly Locale[] = LOCALES): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[LOCALE_META[locale].htmlLang] = canonical(locale, path);
  }
  languages["x-default"] = canonical(DEFAULT_LOCALE, path);
  return languages;
}
