import type { Metadata } from "next";
import { COMPANY, COMPANY_BLURB, SITE_URL } from "@/lib/company";
import { Hero } from "@/components/home/hero";
import { HeadlineBand } from "@/components/home/headline-band";
import { StatsBand } from "@/components/home/stats-band";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { CitiesStrip } from "@/components/home/cities-strip";
import { Plans } from "@/components/home/plans";
import { OwnNowBanner } from "@/components/home/own-now-banner";
import { CarShowcase } from "@/components/home/car-showcase";
import { EvBanner } from "@/components/home/ev-banner";
import { FleetApp } from "@/components/home/fleet-app";
import { DostApp } from "@/components/home/dost-app";
import { ApplySteps } from "@/components/home/apply-steps";
import { Testimonials } from "@/components/home/testimonials";
import { jsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Drive an Uber without owning a car | Everest Fleet",
  description:
    `Rent or own a car to drive on Uber across ${COMPANY.cities} Indian cities. ` +
    "Low deposit, weekly payouts, maintenance and insurance included.",
  alternates: { canonical: "/" },
};

// Organization markup gives search engines and AI assistants one set of company facts to
// quote. It reads from the same source as the page, so the two can never disagree.
const organisation = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Everest Fleet",
  url: SITE_URL,
  foundingDate: String(COMPANY.founded),
  description: COMPANY_BLURB,
  areaServed: "India",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: COMPANY.phone,
    contactType: "sales",
    areaServed: "IN",
    availableLanguage: ["en", "hi"],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organisation) }}
      />
      <Hero />
      <HeadlineBand />
      <StatsBand />
      <WhyChooseUs />
      <CitiesStrip />
      <Plans />
      <OwnNowBanner />
      <CarShowcase />
      <EvBanner />
      <FleetApp />
      <DostApp />
      <ApplySteps />
      <Testimonials />
    </>
  );
}
