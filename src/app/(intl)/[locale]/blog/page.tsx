import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/driver/blog-pages";
import { getDictionary } from "@/content/dictionary";
import { EXTRA_LOCALES, alternatesFor, canonical, isLocale, type ExtraLocale } from "@/lib/i18n";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return EXTRA_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.blog.title,
    description: dict.blog.metaDescription,
    alternates: { canonical: canonical(locale, "/blog"), languages: alternatesFor("/blog") },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return <BlogIndex locale={locale as ExtraLocale} content={await getContent()} />;
}
