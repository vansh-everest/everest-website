import type { Metadata } from "next";
import { homeCopy } from "@/content/home-copy";
import { COMPANY, COMPANY_BLURB, SITE_URL } from "@/lib/company";
import { LOCALES, LOCALE_META, MAIN_LOCALES, alternatesFor, canonical, fill, type MainLocale } from "@/lib/i18n";
import { jsonLd } from "@/lib/json-ld";
import { getContent } from "@/lib/store";
import { StartDriving } from "@/components/site/start-driving";
import { CarShowcase } from "./car-showcase";
import { CitiesStrip } from "./cities-strip";
import { DostApp } from "./dost-app";
import { FleetApp } from "./fleet-app";
import { HeadlineBand } from "./headline-band";
import { Hero } from "./hero";
import { OwnNowBanner } from "./own-now-banner";
import { Plans } from "./plans";
import { Testimonials } from "./testimonials";
import { WhyChooseUs } from "./why-choose-us";

/** The home page's title, description and language versions, in `locale`. */
export function homeMetadata(locale: MainLocale): Metadata {
  const { title, description } = homeCopy(locale).meta;
  const text = fill(description, { cities: COMPANY.cities });
  const url = canonical(locale, "/");
  return {
    // Absolute, so the layout's "| Everest Fleet" is not added twice.
    title: { absolute: title },
    description: text,
    alternates: { canonical: url, languages: alternatesFor("/", MAIN_LOCALES) },
    // The English layout carries its own card; the other languages get theirs here.
    ...(locale === "en"
      ? {}
      : {
          openGraph: {
            type: "website",
            siteName: "Everest Fleet",
            locale: LOCALE_META[locale].htmlLang.replace("-", "_"),
            url,
            title,
            description: text,
          },
        }),
  };
}

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

/** The home page, the same sections in each of the main languages. */
export async function HomePage({ locale }: { locale: MainLocale }) {
  const content = await getContent();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd([organisation, website]) }}
      />
      <Hero locale={locale} />
      <HeadlineBand />
      <WhyChooseUs />
      <CitiesStrip locale={locale} />
      <Plans content={content} locale={locale} />
      <OwnNowBanner locale={locale} />
      <CarShowcase content={content} />
      <FleetApp />
      <DostApp />
      {/* Phones show the form before the stories; the desktop design puts the stories first. */}
      <div className="flex flex-col">
        <div className="lg:order-2">
          <StartDriving source="home" eyebrow locale={locale} />
        </div>
        <div className="lg:order-1">
          <Testimonials locale={locale} />
        </div>
      </div>
    </>
  );
}
