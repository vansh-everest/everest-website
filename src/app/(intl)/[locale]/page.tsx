import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage, homeMetadata } from "@/components/home/home-page";
import { DEFAULT_LOCALE, MAIN_LOCALES, isMainLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

/** The home page in Hindi and Kannada. The other languages have their driver pages only. */
const HOME_LOCALES = MAIN_LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export function generateStaticParams() {
  return HOME_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isMainLocale(locale) || locale === DEFAULT_LOCALE) return {};
  return homeMetadata(locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isMainLocale(locale) || locale === DEFAULT_LOCALE) notFound();
  return <HomePage locale={locale} />;
}
