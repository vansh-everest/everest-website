import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formCities } from "@/components/driver/driver-pages";
import { DriverHero } from "@/components/driver/driver-hero";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, HeroActions, HeroChip } from "@/components/driver/driver-ui";
import { AnswerBox, GuideSection, JsonLd, RelatedLinks, SeoFaq, crumbsLd, faqLd, type QA } from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { getLiveData } from "@/lib/fleet-data";
import { cheapest, inr, listNames, rentCities, rentPath, docName } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

const PATH = "/uber-fleet-partner/";

export const metadata: Metadata = {
  title: "Uber Fleet Partner: Drive an Everest Fleet Car on Uber",
  description: "Everest Fleet is an Uber fleet partner in 7 cities, giving drivers a car with insurance and permit, weekly payouts and plans to own the car.",
  alternates: { canonical: PATH },
};

export default async function Page() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("en");
  const cities = rentCities(content, live);
  const ready = content.cities.reduce((s, c) => s + c.readyCars, 0);
  const hubs = content.cities.reduce((s, c) => s + c.hubs.length, 0);
  const lows = cities.flatMap((c) => (cheapest(c.from)?.rent ? [cheapest(c.from)!.rent!] : []));
  const low = lows.length ? Math.min(...lows) : null;
  const cityNames = listNames(content.cities.map((c) => c.name.en));

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
    ...(low ? [{ q: "How much does a fleet partner car cost?", a: `From ${inr(low)} a day with Everest Fleet, depending on the city, car and plan.` }] : []),
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
            areaServed: content.cities.map((c) => ({ "@type": "City", name: c.name.en })),
          },
        ]}
      />
      <DriverHero
        photo={content.cities[0]?.heroImage}
        top={null}
        chip={
          <Link href="/drive-with-us/" className="transition hover:opacity-85">
            <HeroChip>
              <ArrowLeft aria-hidden size={14} strokeWidth={2.25} />
              {dict.hub.eyebrow}
            </HeroChip>
          </Link>
        }
        title={`Uber Fleet Partner In ${content.cities.length} Cities`}
        intro="Drive an Everest Fleet car on Uber, insurance and permit included."
        figure={ready ? { label: "Cars Ready", value: ready.toLocaleString("en-IN") } : undefined}
        actions={<HeroActions cta={dict.cta} />}
      />

      <AnswerBox title="In Short">
        An Uber fleet partner owns the cars and holds their papers; drivers drive them on Uber. Everest Fleet is a fleet partner in {cityNames}
        {ready ? `, with ${ready.toLocaleString("en-IN")} cars ready across ${hubs} hubs` : ""}. Drivers bring their documents, collect a CNG or EV car, and are
        paid every week{low ? `, with cars from ${inr(low)} a day` : ""}.
      </AnswerBox>

      <GuideSection id="how" title="How Driving With A Fleet Partner Works">
        <ol>
          <li>Apply below or call us, and we call you back.</li>
          <li>Visit an Everest Fleet hub with your documents.</li>
          <li>Pick a plan: rent the car, or own it at the end of the term.</li>
          <li>Collect the car and drive on Uber, with weekly payouts to your bank.</li>
        </ol>
        <p>
          Plans: <Link href="/drive-to-earn/">Drive To Earn</Link> (rent, refundable deposit), <Link href="/drive-to-own/">Drive To Own</Link> (refundable
          deposit, the car is yours at the end) and <Link href="/own-now/">Own Now</Link> (upfront, the car is yours at the end).
        </p>
      </GuideSection>

      <RelatedLinks
        id="partner-cities"
        title="Cars And Prices By City"
        links={cities.map((c) => {
          const b = cheapest(c.from);
          return { href: `${rentPath(c.slug)}/`, label: `Everest Fleet In ${c.name}`, note: [b?.rent ? `From ${inr(b.rent)}/day` : "", `${c.hubs.length} hubs`].filter(Boolean).join(" · ") };
        })}
      />

      <SeoFaq id="partner-faq" title="Questions About Fleet Partners" items={items} />

      <RelatedLinks
        id="partner-more"
        title="Keep Reading"
        links={[
          { href: "/uber-driver-requirements/", label: "Uber Driver Requirements", note: "Documents and licence" },
          { href: "/car-on-rent-for-uber/", label: "Car On Rent For Uber", note: "Prices by city" },
          { href: "/ev-driver-jobs/", label: "EV Driver Jobs", note: "Electric cars on Uber" },
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source="guide/uber-fleet-partner" />

      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
    </>
  );
}
