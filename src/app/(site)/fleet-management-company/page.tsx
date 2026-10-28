import type { Metadata } from "next";
import Link from "next/link";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand } from "@/components/driver/driver-ui";
import {
  APPLY_POINTS,
  AnswerBox,
  BackChip,
  FormBand,
  GuideSection,
  JsonLd,
  RelatedLinks,
  SearchForm,
  SearchHero,
  SeoFaq,
  crumbsLd,
  faqLd,
  type QA,
} from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { COMPANY, SITE_URL } from "@/lib/company";
import { getLiveData } from "@/lib/fleet-data";
import { fleetPath } from "@/lib/search-pages";
import { allCityFacts, listNames } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

const PATH = "/fleet-management-company/";

export const metadata: Metadata = {
  title: `Fleet Management Company in India: ${COMPANY.vehicles} Cars in ${COMPANY.cities} Cities`,
  description: `Everest Fleet is India's largest fleet management company: ${COMPANY.vehicles} CNG and electric cars in ${COMPANY.cities} cities, on Uber since ${COMPANY.founded}. Fleet services for drivers and businesses.`,
  alternates: { canonical: PATH },
};

const SERVICES = [
  { href: "/employee-mobility/", label: "Employee Mobility", note: "Office transport for teams" },
  { href: "/fleet-logistics/", label: "Fleet Logistics", note: "Vehicles for deliveries" },
  { href: "/intercity/", label: "Intercity", note: "Trips between cities" },
  { href: "/advertise-with-us/", label: "Cab Advertising", note: "Brand on the fleet" },
];

export default async function Page() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("en");
  const cities = allCityFacts(content, live);
  const hubs = cities.reduce((s, c) => s + c.hubs.length, 0);
  const cityNames = listNames(cities.map((c) => c.name));
  const source = "guide/fleet-management-company";

  const items: QA[] = [
    { q: "Which is the largest fleet management company in India?", a: `Everest Fleet, with ${COMPANY.vehicles} cars in ${COMPANY.cities} cities: ${cityNames}.` },
    {
      q: "What does a fleet management company do?",
      a: "It owns or runs a fleet of vehicles and handles everything around them: registration, permits, insurance, servicing, drivers and payouts.",
    },
    { q: "Which cities does Everest Fleet operate in?", a: `${cityNames}${hubs ? `, with ${hubs} hubs` : ""}.` },
    { q: "Is Everest Fleet an Uber fleet partner?", a: `Yes. Everest Fleet has run cars on the Uber India network since ${COMPANY.founded}.` },
    { q: "How do I drive for Everest Fleet?", a: "Apply on this page or call your city's number, then visit a hub with your documents and collect a car." },
    { q: "Does Everest Fleet work with businesses?", a: "Yes: employee mobility, fleet logistics, intercity trips and advertising on its cabs." },
  ];

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Everest Fleet",
            url: SITE_URL,
            logo: `${SITE_URL}/figma/logo.png`,
            foundingDate: String(COMPANY.founded),
            description: `India's largest fleet management company: ${COMPANY.vehicles} cars in ${COMPANY.cities} cities.`,
            areaServed: cities.map((c) => ({ "@type": "City", name: c.name })),
            email: COMPANY.email,
            telephone: COMPANY.phone.replace(/\s/g, ""),
          },
          faqLd(items),
          crumbsLd([{ name: "Fleet management company", path: PATH }]),
        ]}
      />
      <SearchHero
        chip={<BackChip href="/" label="Everest Fleet" />}
        title="India's Largest Fleet Management Company"
        intro={`${COMPANY.vehicles} CNG and electric cars in ${COMPANY.cities} cities, on Uber since ${COMPANY.founded}.`}
        facts={[
          { label: "Cars", value: COMPANY.vehicles },
          { label: "Cities", value: String(COMPANY.cities) },
          ...(hubs ? [{ label: "Hubs", value: String(hubs) }] : []),
        ]}
        form={<SearchForm content={content} source={source} placement="hero" />}
      />

      <AnswerBox title="In Short">
        Everest Fleet is India&apos;s largest fleet management company. It owns {COMPANY.vehicles} CNG and electric cars in {cityNames}, runs them on the Uber
        India network since {COMPANY.founded}, and handles their permits, insurance, servicing and drivers. Businesses use the fleet for employee mobility,
        logistics, intercity trips and cab advertising.
      </AnswerBox>

      <GuideSection id="fleet-what" title="What Everest Fleet Manages">
        <ul>
          <li>
            <strong>The cars.</strong> Registration, commercial permits, insurance and servicing for every vehicle.
          </li>
          <li>
            <strong>The drivers.</strong> Hiring, onboarding at city hubs and weekly payouts.
          </li>
          <li>
            <strong>The work.</strong> Rides on Uber, plus <Link href="/our-services/">services for businesses</Link>.
          </li>
          <li>
            <strong>Ownership.</strong> Drivers on <Link href="/drive-to-own/">Drive To Own</Link> and <Link href="/own-now/">Own Now</Link> own the car at the
            end of the term.
          </li>
        </ul>
      </GuideSection>

      <RelatedLinks
        id="fleet-cities"
        title="The Fleet By City"
        links={cities.map((c) => ({
          href: `${fleetPath(c.slug)}/`,
          label: `Everest Fleet In ${c.name}`,
          note: [c.readyCars ? `${c.readyCars.toLocaleString("en-IN")} cars ready` : "", c.hubs.length ? `${c.hubs.length} hubs` : ""].filter(Boolean).join(" · ") || undefined,
        }))}
      />

      <FormBand id="fleet-apply" title="Drive With India's Largest Fleet" points={APPLY_POINTS} form={<SearchForm content={content} source={source} placement="middle" />} />

      <RelatedLinks id="fleet-business" title="For Businesses" links={SERVICES} />

      <SeoFaq id="fleet-faq" title="Questions About Everest Fleet" items={items} />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} />
    </>
  );
}
