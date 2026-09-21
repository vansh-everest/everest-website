import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityPage, cityJsonLd } from "@/components/driver/driver-pages";
import { fill, getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { citySegment, citySlugFrom, cityPath } from "@/lib/city-route";
import { findCity } from "@/lib/content";
import { EXTRA_LOCALES, alternatesFor, canonical, isLocale, localePath, type ExtraLocale } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import { jsonLd } from "@/lib/json-ld";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const content = await getContent();
  return EXTRA_LOCALES.flatMap((locale) =>
    content.cities.map((c) => ({ locale, slug: citySegment(c.slug) }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug: segment } = await params;
  if (!isLocale(locale) || locale === "en") return {};

  const slug = citySlugFrom(segment);
  const city = slug ? findCity(await getContent(), slug) : undefined;
  if (!city) return {};

  const dict = getDictionary(locale);
  const vars = { city: city.name[locale] };
  const path = cityPath(city.slug);
  return {
    title: fill(dict.city.metaTitle, vars),
    description: fill(dict.city.metaDescription, vars),
    alternates: { canonical: canonical(locale, path), languages: alternatesFor(path) },
  };
}

export default async function Page({ params }: Props) {
  const { locale, slug: segment } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  const slug = citySlugFrom(segment);
  const content = await getContent();
  if (!slug || !findCity(content, slug)) notFound();

  const url = `${SITE_URL}${localePath(locale, cityPath(slug))}`;
  const blocks = cityJsonLd({ locale: locale as ExtraLocale, slug, content, url }) ?? [];

  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(block) }}
        />
      ))}
      <CityPage locale={locale as ExtraLocale} slug={slug} content={content} />
    </>
  );
}
