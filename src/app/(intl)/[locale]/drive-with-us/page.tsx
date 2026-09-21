import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DriverHub } from "@/components/driver/driver-pages";
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
    title: dict.hub.metaTitle,
    description: dict.hub.metaDescription,
    alternates: {
      canonical: canonical(locale, "/drive-with-us"),
      languages: alternatesFor("/drive-with-us"),
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return <DriverHub locale={locale as ExtraLocale} content={await getContent()} />;
}
