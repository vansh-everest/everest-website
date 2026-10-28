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
import { FLEET_ROOT, fleetPath } from "@/lib/search-pages";
import { allCityFacts, docName, listNames, readyTotal } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

const PATH = `${FLEET_ROOT}/`;

export const metadata: Metadata = {
  title: "Uber Fleet Partner: Drive an Everest Fleet Car on Uber",
  description: `Everest Fleet is an Uber fleet partner in ${COMPANY.cities} cities, giving drivers a car with insurance and permit, weekly payouts and plans to own the car.`,
  alternates: { canonical: PATH },
};

export default async function Page() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("en");
  const cities = allCityFacts(content, live);
  const ready = readyTotal(cities);
  const hubs = cities.reduce((s, c) => s + c.hubs.length, 0);
  const cityNames = listNames(cities.map((c) => c.name));
  const source = "guide/uber-fleet-partner";

  const items: QA[] = [
    {
      q: "What is an Uber fleet partner?",
      a: "A company that owns cars, holds their registration, insurance and permit, and has drivers drive them on Uber. Uber calls this a non-driving partner.",
    },
    {
      q: "Is Everest Fleet an Uber fleet partner?",
      a: `Yes. Everest Fleet runs cars on Uber in ${cityNames}${ready ? `, with ${ready.toLocaleString("en-IN")} cars ready to drive today` : ""}.`,
    },
    {
      q: "What do I need to drive with a fleet partner?",
      a: `Your ${listNames(dict.documents.map(docName))}. The car, its insurance and permit come from Everest Fleet.`,
    },
    ...dict.faq,
  ];

  return (
    <>
      <JsonLd
        blocks={[
          faqLd(items),
          crumbsLd([
            { name: "Drive with us", path: "/drive-with-us/" },
            { name: "Uber fleet partner", path: PATH },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Everest Fleet",
            url: SITE_URL,
            description: `Uber fleet partner in ${cityNames}.`,
            areaServed: cities.map((c) => ({ "@type": "City", name: c.name })),
          },
        ]}
      />
      <SearchHero
        chip={<BackChip href="/drive-with-us/" label={dict.hub.eyebrow} />}
        title={`Uber Fleet Partner In ${cities.length} Cities`}
        intro="Drive an Everest Fleet car on Uber, insurance and permit included."
        facts={[
          ...(ready ? [{ label: "Cars Ready", value: ready.toLocaleString("en-IN") }] : []),
          { label: "Cities", value: String(cities.length) },
          ...(hubs ? [{ label: "Hubs", value: String(hubs) }] : []),
        ]}
        form={<SearchForm content={content} source={source} placement="hero" />}
      />

      <AnswerBox title="In Short">
        An Uber fleet partner owns the cars and holds their papers; drivers drive them on Uber. Everest Fleet is a fleet partner in {cityNames}
        {ready ? `, with ${ready.toLocaleString("en-IN")} cars ready across ${hubs} hubs` : ""}. Drivers bring their documents, collect a CNG or EV car, and are
        paid every week.
      </AnswerBox>

      <GuideSection id="how" title="How Driving With A Fleet Partner Works">
        <ol>
          <li>Apply on this page or call us, and we call you back.</li>
          <li>Visit an Everest Fleet hub with your documents.</li>
          <li>Pick a plan: rent the car, or own it at the end of the term.</li>
          <li>Collect the car and drive on Uber, with weekly payouts to your bank.</li>
        </ol>
        <p>
          Plans: <Link href="/drive-to-earn/">Drive To Earn</Link> (refundable deposit), <Link href="/drive-to-own/">Drive To Own</Link> (refundable deposit,
          the car is yours at the end) and <Link href="/own-now/">Own Now</Link> (upfront, the car is yours at the end).
        </p>
      </GuideSection>

      <FormBand id="partner-apply" title="Drive With An Uber Fleet Partner" points={APPLY_POINTS} form={<SearchForm content={content} source={source} placement="middle" />} />

      <RelatedLinks
        id="partner-cities"
        title="Uber Fleet By City"
        links={cities.map((c) => ({
          href: `${fleetPath(c.slug)}/`,
          label: `Uber Fleet In ${c.name}`,
          note: [c.readyCars ? `${c.readyCars.toLocaleString("en-IN")} cars ready` : "", c.hubs.length ? `${c.hubs.length} hubs` : ""].filter(Boolean).join(" · ") || undefined,
        }))}
      />

      <SeoFaq id="partner-faq" title="Questions About Fleet Partners" items={items} />

      <RelatedLinks
        id="partner-more"
        title="Keep Reading"
        links={[
          { href: "/fleet-management-company/", label: "Fleet Management Company", note: "Everest Fleet across India" },
          { href: "/uber-driver-requirements/", label: "Uber Driver Requirements", note: "Documents and licence" },
          { href: "/drive-for-uber-without-a-car/", label: "Drive For Uber Without A Car", note: "Car included" },
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} />
    </>
  );
}
