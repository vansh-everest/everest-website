import type { Metadata } from "next";
import { COMPANY, COMPANY_BLURB, SITE_URL } from "@/lib/company";
import { Hero } from "@/components/home/hero";
import { HeadlineBand } from "@/components/home/headline-band";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { CitiesStrip } from "@/components/home/cities-strip";
import { Plans } from "@/components/home/plans";
import { OwnNowBanner } from "@/components/home/own-now-banner";
import { CarShowcase } from "@/components/home/car-showcase";
import { FleetApp } from "@/components/home/fleet-app";
import { DostApp } from "@/components/home/dost-app";
import { Testimonials } from "@/components/home/testimonials";
import { StartDriving } from "@/components/site/start-driving";
import { LOCALES, LOCALE_META } from "@/lib/i18n";
import { jsonLd } from "@/lib/json-ld";
import { getContent } from "@/lib/store";

export const metadata: Metadata = {
  // Absolute, so the layout's "| Everest Fleet" is not added twice.
  title: { absolute: "Everest Fleet: Driver Jobs and Cars for Uber in India" },
  description:
    `Get a driver job with Everest Fleet: the car, insurance and permit to drive on Uber in ${COMPANY.cities} cities, ` +
    "weekly payouts, and plans to own the car. Apply in 30 seconds.",
  alternates: { canonical: "/" },
};

// Organization markup gives search engines and AI assistants one set of company facts to
// quote. It reads from the same source as the page, so the two can never disagree.
const organisation = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Everest Fleet",
  url: SITE_URL,
  logo: `${SITE_URL}/figma/logo.png`,
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

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Everest Fleet",
  url: SITE_URL,
  inLanguage: LOCALES.map((l) => LOCALE_META[l].htmlLang),
};

export default async function Home() {
  const content = await getContent();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd([organisation, website]) }}
      />
      <Hero />
      <HeadlineBand />
      <WhyChooseUs />
      <CitiesStrip />
      <Plans content={content} />
      <OwnNowBanner />
      <CarShowcase content={content} />
      <FleetApp />
      <DostApp />
      {/* Phones show the form before the stories; the desktop design puts the stories first. */}
      <div className="flex flex-col">
        <div className="lg:order-2">
          <StartDriving source="home" eyebrow />
        </div>
        <div className="lg:order-1">
          <Testimonials />
        </div>
      </div>
    </>
  );
}
