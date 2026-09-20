import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { COMPANY_BLURB, SITE_URL } from "@/lib/company";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
});

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} antialiased`}>
      <body className="font-sans">
        <TopBar />
        <SiteHeader />
        <main className="overflow-x-clip">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
