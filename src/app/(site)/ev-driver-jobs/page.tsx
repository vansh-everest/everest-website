import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formCities } from "@/components/driver/driver-pages";
import { DriverHero } from "@/components/driver/driver-hero";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, HeroActions, HeroChip } from "@/components/driver/driver-ui";
import { AnswerBox, JsonLd, PriceTable, RelatedLinks, SeoFaq, crumbsLd, faqLd, type QA } from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { cityPath } from "@/lib/city-route";
import { getLiveData } from "@/lib/fleet-data";
import { cheapest, inr, listNames, rentCities, type PlanFigure, type RentCar } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

const PATH = "/ev-driver-jobs/";
const EV = /\bev\b|electric/i;

async function load() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, cities: rentCities(content, live, EV) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { cities } = await load();
  const names = listNames(cities.map((c) => c.name));
  return {
    title: "EV Driver Jobs: Electric Car Driver Jobs on Uber",
    description: `EV car driver jobs in ${names || "Indian cities"} with Everest Fleet: an electric car with insurance and permit, weekly payouts and live daily rates.`,
    alternates: { canonical: PATH },
  };
}

export default async function Page() {
  const { content, cities } = await load();
  const dict = getDictionary("en");
  const names = listNames(cities.map((c) => c.name));
  const models = listNames(cities.flatMap((c) => c.cars.map((x) => x.name)));
  const lows = cities.flatMap((c) => (cheapest(c.from)?.rent ? [{ city: c.name, rent: cheapest(c.from)!.rent! }] : []));
  const low = lows.length ? lows.reduce((a, b) => (b.rent < a.rent ? b : a)) : null;

  // One table: each city's EV, with the city in the car column.
  const rows: RentCar[] = cities.flatMap((c) => c.cars.map((car) => ({ ...car, name: `${car.name}, ${c.name}` })));
  const plans: PlanFigure[] = [...new Map(cities.flatMap((c) => c.from).map((f) => [f.planId, f])).values()];

  const items: QA[] = [
    ...(cities.length ? [{ q: "Where can I get an EV driver job?", a: `${names}, with Everest Fleet's electric ${models}.` }] : []),
    ...(low ? [{ q: "How much does an EV on rent for Uber cost?", a: `From ${inr(low.rent)} a day (${low.city}). ${lows.map((l) => `${l.city} from ${inr(l.rent)}`).join(", ")}.` }] : []),
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
        title="EV Driver Jobs On Uber"
        intro={cities.length ? `Drive an electric car on Uber in ${names}.` : "Drive an electric car on Uber with Everest Fleet."}
        figure={low ? { label: "From", value: `${inr(low.rent)}/day` } : undefined}
        actions={<HeroActions cta={dict.cta} />}
      />

      {cities.length ? (
        <AnswerBox title="In Short">
          Everest Fleet has EV driver jobs on Uber in {names}, driving the electric {models}
          {low ? `, from ${inr(low.rent)} a day` : ""}. Insurance, permit and maintenance are included, you pay for charging, and payouts come every week.
        </AnswerBox>
      ) : null}

      {rows.length ? <PriceTable id="ev-prices" title="EV Prices By City" sub="Daily rent, deposit and upfront by plan" cars={rows} plans={plans} /> : null}

      <SeoFaq id="ev-faq" title="Questions About EV Driver Jobs" items={items} />

      <RelatedLinks
        id="ev-cities"
        title="EV Jobs By City"
        links={[
          ...cities.map((c) => ({ href: `${cityPath(c.slug)}/`, label: `Driver Jobs In ${c.name}`, note: `${listNames(c.cars.map((x) => x.name))} · ${c.hubs.length} EV hubs` })),
          { href: "/uber-driver-requirements/", label: "Uber Driver Requirements", note: "Documents and licence" },
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source="guide/ev-driver-jobs" />

      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
    </>
  );
}
