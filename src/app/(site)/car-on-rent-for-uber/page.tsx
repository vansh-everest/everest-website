import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formCities } from "@/components/driver/driver-pages";
import { DriverHero } from "@/components/driver/driver-hero";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, HeroActions, HeroChip } from "@/components/driver/driver-ui";
import { AnswerBox, JsonLd, RelatedLinks, SeoFaq, crumbsLd, faqLd, type QA } from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { getLiveData } from "@/lib/fleet-data";
import { RENT_ROOT, cheapest, inr, listNames, rentCities, rentPath } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

async function load() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, cities: rentCities(content, live) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { cities } = await load();
  const lows = cities.flatMap((c) => (cheapest(c.from)?.rent ? [cheapest(c.from)!.rent!] : []));
  const low = lows.length ? Math.min(...lows) : null;
  return {
    title: "Car on Rent for Uber Drivers: Prices in Every City",
    description: low
      ? `Cars on rent for Uber and Ola drivers in ${cities.length} cities from ${inr(low)} a day. Live rates, deposits and hubs from Everest Fleet. Insurance and permit included.`
      : "Cars on rent for Uber and Ola drivers from Everest Fleet, with insurance and permit included.",
    alternates: { canonical: `${RENT_ROOT}/` },
  };
}

export default async function Page() {
  const { content, cities } = await load();
  const dict = getDictionary("en");
  const lows = cities.flatMap((c) => {
    const b = cheapest(c.from);
    return b?.rent ? [{ city: c, rent: b.rent, plan: b.name }] : [];
  });
  const low = lows.length ? lows.reduce((a, b) => (b.rent < a.rent ? b : a)) : null;
  const ready = cities.reduce((s, c) => s + c.readyCars, 0);
  const cars = listNames(cities.flatMap((c) => c.cars.map((x) => x.name)));

  const items: QA[] = [
    ...(low
      ? [{ q: "How much is a car on rent for Uber?", a: `From ${inr(low.rent)} a day (${low.plan}, ${low.city.name}). Rates differ by city and car: ${lows.map((l) => `${l.city.name} from ${inr(l.rent)}`).join(", ")}.` }]
      : []),
    { q: "Which cars can I rent for Uber?", a: `${cars}. Every car comes with insurance and a permit to drive on Uber.` },
    { q: "Which cities can I rent a car for Uber in?", a: `${listNames(cities.map((c) => c.name))}.` },
    ...dict.faq,
  ];

  return (
    <>
      <JsonLd
        blocks={[
          faqLd(items),
          crumbsLd([{ name: "Car on rent for Uber", path: `${RENT_ROOT}/` }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: cities.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `Car on rent for Uber in ${c.name}`, url: `${SITE_URL}${rentPath(c.slug)}/` })),
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
        title="Car On Rent For Uber Drivers"
        intro={`Rent a car to drive on Uber in ${cities.length} cities, insurance and permit included.`}
        figure={low ? { label: "From", value: `${inr(low.rent)}/day` } : undefined}
        actions={<HeroActions cta={dict.cta} />}
      />

      <AnswerBox title="In Short">
        {low
          ? `Everest Fleet rents CNG and EV cars to Uber drivers in ${cities.length} cities from ${inr(low.rent)} a day, with ${ready ? `${ready.toLocaleString("en-IN")} cars ready and ` : ""}insurance, permit and maintenance included. You pay for fuel, and on Own Now or Drive To Own the car becomes yours at the end of the term.`
          : `Everest Fleet rents CNG and EV cars to Uber drivers in ${cities.length} cities, with insurance, permit and maintenance included.`}
      </AnswerBox>

      <RelatedLinks
        id="rent-cities"
        title="Prices By City"
        links={cities.map((c) => {
          const b = cheapest(c.from);
          return {
            href: `${rentPath(c.slug)}/`,
            label: `Car On Rent In ${c.name}`,
            note: [b?.rent ? `From ${inr(b.rent)}/day` : "", `${c.cars.length} cars`].filter(Boolean).join(" · "),
          };
        })}
      />

      <SeoFaq id="rent-faq" title="Questions About Renting A Car For Uber" items={items} />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source="rent/all" />

      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
    </>
  );
}
