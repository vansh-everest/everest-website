import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityPage, cityJsonLd } from "@/components/driver/driver-pages";
import { fill, getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { citySegment, citySlugFrom, cityPath } from "@/lib/city-route";
import { findCity } from "@/lib/content";
import { DEFAULT_LOCALE, alternatesFor, canonical } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import { jsonLd } from "@/lib/json-ld";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const content = await getContent();
  return content.cities.map((c) => ({ slug: citySegment(c.slug) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: segment } = await params;
  const slug = citySlugFrom(segment);
  const city = slug ? findCity(await getContent(), slug) : undefined;
  if (!city) return {};

  const dict = getDictionary(DEFAULT_LOCALE);
  const vars = { city: city.name[DEFAULT_LOCALE] };
  const path = cityPath(city.slug);
  return {
    title: fill(dict.city.metaTitle, vars),
    description: fill(dict.city.metaDescription, vars),
    alternates: { canonical: canonical(DEFAULT_LOCALE, path), languages: alternatesFor(path) },
  };
}

export default async function Page({ params }: Props) {
  const { slug: segment } = await params;
  const slug = citySlugFrom(segment);
  const content = await getContent();
  if (!slug || !findCity(content, slug)) notFound();

  const url = `${SITE_URL}${cityPath(slug)}`;
  const blocks = cityJsonLd({ locale: DEFAULT_LOCALE, slug, content, url }) ?? [];

  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(block) }}
        />
      ))}
      <CityPage locale={DEFAULT_LOCALE} slug={slug} content={content} />
    </>
  );
}
