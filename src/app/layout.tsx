import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
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
  title: "Everest Fleet | Drive, Earn and Own",
  description: "India's largest fleet partner with 35,000+ cars and 50,000+ drivers across 7 cities",
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
