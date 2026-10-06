import type { Metadata } from "next";
import { COMPANY_BLURB } from "@/lib/company";
import { InvestorContact } from "@/components/investors/contact";
import { InvestorHero } from "@/components/investors/hero";
import { Leadership } from "@/components/investors/leadership";
import { NewsAndReports } from "@/components/investors/news-reports";
import { BusinessModel, Growth, Impact, Opportunity } from "@/components/investors/sections";

export const metadata: Metadata = {
  title: "For investors",
  description: COMPANY_BLURB,
  alternates: { canonical: "/investors/" },
};

/**
 * Every figure on this page comes from COMPANY or from a slot in components/investors/data.ts.
 * Slots without a sourced value are not rendered; see data.ts for what is still pending.
 */
export default function Page() {
  return (
    <>
      <InvestorHero />
      <Opportunity />
      <BusinessModel />
      <Growth />
      <Impact />
      <Leadership />
      <NewsAndReports />
      <InvestorContact />
    </>
  );
}
