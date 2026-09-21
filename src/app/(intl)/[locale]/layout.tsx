import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RootShell } from "@/components/site/root-shell";
import { COMPANY_BLURB, SITE_URL } from "@/lib/company";
import { EXTRA_LOCALES, isLocale, type ExtraLocale } from "@/lib/i18n";
import "../../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Everest Fleet", template: "%s | Everest Fleet" },
  description: COMPANY_BLURB,
  twitter: { card: "summary_large_image" },
};

export function generateStaticParams() {
  return EXTRA_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return <RootShell locale={locale as ExtraLocale}>{children}</RootShell>;
}
