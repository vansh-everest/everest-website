import type { Metadata } from "next";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand } from "@/components/driver/driver-ui";
import {
  APPLY_POINTS,
  AnswerBox,
  BackChip,
  FormBand,
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
import { SITE_URL } from "@/lib/company";
import { getLiveData } from "@/lib/fleet-data";
import { RENT_ROOT, allCityFacts, listNames, readyTotal, rentPath } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

async function load() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, cities: allCityFacts(content, live) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { cities } = await load();
  return {
    title: "Car on Rent for Uber Drivers: Cars and Hubs in Every City",
    description: `Car on rent for Uber drivers in ${listNames(cities.map((c) => c.name))}. CNG and EV cars with insurance and permit, weekly payouts. Apply in a minute.`,
    alternates: { canonical: `${RENT_ROOT}/` },
  };
}

export default async function Page() {
  const { content, cities } = await load();
  const dict = getDictionary("en");
  const ready = readyTotal(cities);
  const hubs = cities.reduce((s, c) => s + c.hubs.length, 0);
  const cars = listNames(cities.flatMap((c) => c.cars.map((x) => x.name)));
  const source = "rent/all";

  const items: QA[] = [
    ...(cars ? [{ q: "Which cars can I rent for Uber?", a: `${cars}. Every car comes with insurance and a permit to drive on Uber.` }] : []),
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
      <SearchHero
        chip={<BackChip href="/drive-with-us/" label={dict.hub.eyebrow} />}
        title="Car On Rent For Uber Drivers"
        intro={`Rent a car to drive on Uber in ${cities.length} cities, insurance and permit included.`}
        facts={[
          ...(ready ? [{ label: "Cars Ready", value: ready.toLocaleString("en-IN") }] : []),
          { label: "Cities", value: String(cities.length) },
          ...(hubs ? [{ label: "Hubs", value: String(hubs) }] : []),
        ]}
        form={<SearchForm content={content} source={source} placement="hero" />}
      />

      <AnswerBox title="In Short">
        Everest Fleet rents CNG and EV cars to Uber drivers in {listNames(cities.map((c) => c.name))}
        {ready ? `, with ${ready.toLocaleString("en-IN")} cars ready` : ""}. Insurance, permit and maintenance are included and you pay for fuel. On Drive To
        Own or Own Now the car becomes yours at the end of the term.
      </AnswerBox>

      <RelatedLinks
        id="rent-cities"
        title="Pick Your City"
        links={cities.map((c) => ({
          href: `${rentPath(c.slug)}/`,
          label: `Car On Rent In ${c.name}`,
          note: [c.cars.length ? `${c.cars.length} models` : "", c.hubs.length ? `${c.hubs.length} hubs` : ""].filter(Boolean).join(" · ") || undefined,
        }))}
      />

      <FormBand id="rent-apply" title="Get Your Car This Week" points={APPLY_POINTS} form={<SearchForm content={content} source={source} placement="middle" />} />

      <SeoFaq id="rent-faq" title="Questions About Renting A Car For Uber" items={items} />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} />
    </>
  );
}
