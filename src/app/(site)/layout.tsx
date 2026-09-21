import type { Metadata } from "next";
import { RootShell } from "@/components/site/root-shell";
import { COMPANY_BLURB, SITE_URL } from "@/lib/company";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import "../globals.css";

export const metadata: Metadata = {
  // metadataBase makes canonical URLs and social preview images resolve absolutely.
  // Without it a link shared on WhatsApp renders with no preview card.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Everest Fleet | Drive, Earn and Own",
    template: "%s | Everest Fleet",
  },
  description: COMPANY_BLURB,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Everest Fleet",
    locale: "en_IN",
    url: "/",
    title: "Everest Fleet | Drive, Earn and Own",
    description: COMPANY_BLURB,
  },
  twitter: { card: "summary_large_image" },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale={DEFAULT_LOCALE}>{children}</RootShell>;
}
