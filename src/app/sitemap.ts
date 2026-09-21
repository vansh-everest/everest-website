import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { postsFor } from "@/lib/content";
import { DEFAULT_LOCALE, LOCALES, alternatesFor, localePath } from "@/lib/i18n";
import { getContent } from "@/lib/store";

type Entry = MetadataRoute.Sitemap[number];
type Freq = Entry["changeFrequency"];

/** Next serves every address with a trailing slash, so the sitemap must list it that way. */
function url(path: string): string {
  return `${SITE_URL}${path.endsWith("/") ? path : `${path}/`}`;
}

/** A sitemap hreflang has to be an absolute address; the metadata block may be relative. */
function absoluteAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(alternatesFor(path)).map(([lang, href]) => [lang, `${SITE_URL}${href}`])
  );
}

/**
 * Routes are listed here rather than discovered, so a page cannot ship without a deliberate
 * decision about whether search engines should see it.
 *
 * The driver addresses match the live WordPress property exactly, because those are the only
 * pages the company currently ranks for and the paths must survive the migration.
 */
const fixed: Array<{ path: string; priority: number; changeFrequency: Freq }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/own-now", priority: 0.9, changeFrequency: "weekly" },
  { path: "/our-services", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about-us", priority: 0.5, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const content = await getContent();
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority, changeFrequency } of fixed) {
    entries.push({ url: url(path), lastModified, changeFrequency, priority });
  }

  // Driver pages and the blog index exist in every locale, each declaring the other two.
  const translated: Array<{ path: string; priority: number; changeFrequency: Freq }> = [
    { path: "/drive-with-us", priority: 1, changeFrequency: "weekly" },
    ...content.cities.map((city) => ({
      path: cityPath(city.slug),
      priority: 0.9,
      changeFrequency: "weekly" as const,
    })),
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  ];

  for (const { path, priority, changeFrequency } of translated) {
    for (const locale of LOCALES) {
      entries.push({
        url: url(localePath(locale, path)),
        lastModified,
        changeFrequency,
        priority,
        alternates: { languages: absoluteAlternates(path) },
      });
    }
  }

  for (const locale of LOCALES) {
    for (const post of postsFor(content, locale)) {
      entries.push({
        url: url(localePath(locale, `/blog/${post.slug}`)),
        lastModified: new Date(post.date || lastModified),
        changeFrequency: "monthly",
        priority: locale === DEFAULT_LOCALE ? 0.6 : 0.5,
      });
    }
  }

  return entries;
}
