/**
 * Locales for the driver pages.
 *
 * English is the default and carries no prefix, because the eight driver addresses on the
 * live property already rank and must not move. Hindi and Telugu are served under /hi and
 * /te. More locales are added by extending LOCALES and the dictionary; no routing changes.
 */
export const DEFAULT_LOCALE = "en" as const;
export const EXTRA_LOCALES = ["hi", "te"] as const;
export const LOCALES = [DEFAULT_LOCALE, ...EXTRA_LOCALES] as const;

export type Locale = (typeof LOCALES)[number];
export type ExtraLocale = (typeof EXTRA_LOCALES)[number];

export const LOCALE_META: Record<Locale, { label: string; htmlLang: string; fontVar: string }> = {
  en: { label: "English", htmlLang: "en-IN", fontVar: "font-sans" },
  hi: { label: "हिन्दी", htmlLang: "hi-IN", fontVar: "font-deva" },
  te: { label: "తెలుగు", htmlLang: "te-IN", fontVar: "font-telu" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
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
export function alternatesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[LOCALE_META[locale].htmlLang] = canonical(locale, path);
  }
  languages["x-default"] = canonical(DEFAULT_LOCALE, path);
  return languages;
}
