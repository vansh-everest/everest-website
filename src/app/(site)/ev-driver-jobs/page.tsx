import type { Metadata } from "next";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand } from "@/components/driver/driver-ui";
import {
  APPLY_POINTS,
  AnswerBox,
  BackChip,
  CarsTable,
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
import { cityPath } from "@/lib/city-route";
import { getLiveData } from "@/lib/fleet-data";
import { allCityFacts, listNames, type CityCar, type PlanRef } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

const PATH = "/ev-driver-jobs/";
const EV = /\bev\b|electric/i;

async function load() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, cities: allCityFacts(content, live, EV) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { cities } = await load();
  const names = listNames(cities.map((c) => c.name));
  return {
    title: "EV Driver Jobs: Electric Car Driver Jobs on Uber",
    description: `EV car driver jobs in ${names || "Indian cities"} with Everest Fleet: an electric car with insurance and permit, weekly payouts. Apply in a minute.`,
    alternates: { canonical: PATH },
  };
}

export default async function Page() {
  const { content, cities } = await load();
  const dict = getDictionary("en");
  const names = listNames(cities.map((c) => c.name));
  const models = listNames(cities.flatMap((c) => c.cars.map((x) => x.name)));
  const hubs = cities.reduce((s, c) => s + c.hubs.length, 0);
  const source = "guide/ev-driver-jobs";

  // One table: each city's EV, with the city in the car column.
  const rows: CityCar[] = cities.flatMap((c) => c.cars.map((car) => ({ ...car, name: `${car.name}, ${c.name}` })));
  const plans: PlanRef[] = [...new Map(rows.flatMap((r) => r.plans).map((p) => [p.planId, p])).values()];

  const items: QA[] = [
    ...(cities.length ? [{ q: "Where can I get an EV driver job?", a: `${names}, with Everest Fleet's electric ${models}.` }] : []),
    { q: "Who pays for charging?", a: "The driver pays for charging, as for fuel on a CNG car; insurance and maintenance are covered." },
    ...dict.faq.filter((f) => !/fuel/i.test(f.q)),
  ];

  return (
    <>
      <JsonLd
        blocks={[
          faqLd(items),
          crumbsLd([
            { name: "Drive with us", path: "/drive-with-us/" },
            { name: "EV driver jobs", path: PATH },
          ]),
        ]}
      />
      <SearchHero
        chip={<BackChip href="/drive-with-us/" label={dict.hub.eyebrow} />}
        title="EV Driver Jobs On Uber"
        intro={cities.length ? `Drive an electric car on Uber in ${names}.` : "Drive an electric car on Uber with Everest Fleet."}
        facts={[
          ...(cities.length ? [{ label: "EV Cities", value: String(cities.length) }] : []),
          ...(hubs ? [{ label: "EV Hubs", value: String(hubs) }] : []),
        ]}
        form={<SearchForm content={content} source={source} placement="hero" />}
      />

      {cities.length ? (
        <AnswerBox title="In Short">
          Everest Fleet has EV driver jobs on Uber in {names}, driving the electric {models}. Insurance, permit and maintenance are included, you pay for
          charging, and payouts come every week.
        </AnswerBox>
      ) : null}

      {rows.length ? <CarsTable id="ev-cars" title="Electric Cars By City" sub="Each car and the plans it comes on" cars={rows} plans={plans} /> : null}

      <FormBand id="ev-apply" title="Drive An EV On Uber" points={APPLY_POINTS} form={<SearchForm content={content} source={source} placement="middle" />} />

      <SeoFaq id="ev-faq" title="Questions About EV Driver Jobs" items={items} />

      <RelatedLinks
        id="ev-cities"
        title="EV Jobs By City"
        links={[
          ...cities.map((c) => ({ href: `${cityPath(c.slug)}/`, label: `Driver Jobs In ${c.name}`, note: `${listNames(c.cars.map((x) => x.name))} · ${c.hubs.length} EV hubs` })),
          { href: "/uber-driver-requirements/", label: "Uber Driver Requirements", note: "Documents and licence" },
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} />
    </>
  );
}
