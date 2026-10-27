import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentsAndHubs } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand } from "@/components/driver/driver-ui";
import {
  APPLY_POINTS,
  AnswerBox,
  BackChip,
  CarsTable,
  FormBand,
  JsonLd,
  PlanCards,
  RelatedLinks,
  SearchForm,
  SearchHero,
  SeoFaq,
  crumbsLd,
  faqLd,
  type QA,
} from "@/components/seo/seo-ui";
import { formCities } from "@/components/driver/driver-pages";
import { getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { findCity } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { contactPath, fleetPath } from "@/lib/search-pages";
import { RENT_ROOT, allCityFacts, cityFacts, docName, listNames, planLines, rentPath, type CityFacts } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ city: string }> };

// The car list follows Jarvis: hourly, so a new model reaches the page the same day.
export const revalidate = 3600;

export async function generateStaticParams() {
  const content = await getContent();
  return content.cities.map((c) => ({ city: c.slug }));
}

async function load(slug: string) {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, live, city: findCity(content, slug), facts: cityFacts(content, live, slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const { city, facts } = await load(slug);
  if (!city || !facts) return {};
  const name = city.name.en;
  const cars = listNames(facts.cars.map((c) => c.name));
  return {
    title: `Car on Rent for Uber in ${name}: Cars, Plans and Hubs`,
    description: `Car on rent for Uber drivers in ${name}${cars ? `: ${cars}` : ""}. Insurance and permit included, ${facts.hubs.length} hubs, weekly payouts. Apply in a minute.`,
    alternates: { canonical: `${rentPath(slug)}/` },
  };
}

function answer(f: CityFacts): string {
  const fuels = listNames(f.cars.map((c) => c.fuel), "or");
  return [
    `In ${f.name}, Everest Fleet gives Uber drivers a ${fuels || "CNG or EV"} car on Drive To Earn, or one that becomes theirs at the end of the term on Drive To Own or Own Now.`,
    f.readyCars ? ` ${f.readyCars.toLocaleString("en-IN")} cars are ready across ${f.hubs.length} hubs.` : f.hubs.length ? ` Collect it from ${f.hubs.length} hubs.` : "",
    " Insurance, permit and maintenance are included; you pay for fuel.",
  ].join("");
}

function faqs(f: CityFacts): QA[] {
  const dict = getDictionary("en");
  const items: QA[] = [];
  if (f.cars.length) items.push({ q: `Which cars can I rent for Uber in ${f.name}?`, a: `${listNames(f.cars.map((c) => c.name))}. Each comes with insurance and a permit to drive on Uber.` });
  const lines = planLines(f.plans);
  if (lines.length) items.push({ q: `How much deposit do I need in ${f.name}?`, a: `${lines.join(". ")}.` });
  if (f.hubs.length) {
    items.push({
      q: `Where do I collect the car in ${f.name}?`,
      a: `At an Everest Fleet hub: ${listNames(f.hubs.map((h) => h.name))}. Bring your ${listNames(dict.documents.map(docName))}.`,
    });
  }
  if (f.phone) items.push({ q: `What is Everest Fleet's number in ${f.name}?`, a: `Call ${f.phone.display}, or apply on this page and the ${f.name} team calls you back.` });
  return [...items, ...dict.faq];
}

export default async function Page({ params }: Props) {
  const { city: slug } = await params;
  const { content, live, city, facts } = await load(slug);
  if (!city || !facts) notFound();
  const dict = getDictionary("en");
  const name = city.name.en;
  const items = faqs(facts);
  const url = `${SITE_URL}${rentPath(slug)}/`;
  const others = allCityFacts(content, live).filter((c) => c.slug !== slug);
  const source = `rent/${slug}`;

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Car on rent for Uber drivers in ${name}`,
            serviceType: "Cars for ride-hailing drivers",
            url,
            areaServed: { "@type": "City", name },
            provider: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
          },
          faqLd(items),
          crumbsLd([
            { name: "Car on rent for Uber", path: `${RENT_ROOT}/` },
            { name, path: `${rentPath(slug)}/` },
          ]),
        ]}
      />
      <SearchHero
        chip={<BackChip href={`${RENT_ROOT}/`} label="All Cities" />}
        title={`Car On Rent For Uber In ${name}`}
        intro={`Drive on Uber in ${name} with an Everest Fleet car, insurance and permit included.`}
        facts={[
          ...(facts.readyCars ? [{ label: "Cars Ready", value: facts.readyCars.toLocaleString("en-IN") }] : []),
          ...(facts.hubs.length ? [{ label: "Hubs", value: String(facts.hubs.length) }] : []),
          ...(facts.cars.length ? [{ label: "Models", value: String(facts.cars.length) }] : []),
        ]}
        phone={facts.phone}
        form={<SearchForm content={content} source={source} placement="hero" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <AnswerBox title="In Short">{answer(facts)}</AnswerBox>

      {facts.cars.length ? (
        <CarsTable id="rent-cars" title={`Cars In ${name}`} sub="Each car and the plans it comes on" cars={facts.cars} plans={facts.plans} />
      ) : null}

      {facts.plans.length ? <PlanCards id="rent-plans" title={`Plans In ${name}`} plans={facts.plans} /> : null}

      <FormBand
        id="rent-apply"
        title={`Get Your Car In ${name}`}
        points={APPLY_POINTS}
        form={<SearchForm content={content} source={source} placement="middle" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <DocumentsAndHubs city={city} locale="en" dict={dict} />

      <SeoFaq id="rent-faq" title={`Questions About Renting In ${name}`} items={items} />

      <RelatedLinks
        id="rent-more"
        title="Keep Reading"
        links={[
          { href: `${cityPath(slug)}/`, label: `Driver Jobs In ${name}`, note: "Car included" },
          { href: `${contactPath(slug)}/`, label: `Driver Job Contact Number, ${name}`, note: "Call, WhatsApp, hubs" },
          { href: `${fleetPath(slug)}/`, label: `Uber Fleet In ${name}`, note: "Everest Fleet in the city" },
          { href: "/uber-driver-requirements/", label: "Uber Driver Requirements", note: "Documents and licence" },
          ...others.slice(0, 2).map((o) => ({ href: `${rentPath(o.slug)}/`, label: `Car On Rent In ${o.name}`, note: `${o.hubs.length} hubs` })),
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} defaultCity={slug} source={source} placement="bottom" callHref={facts.phone?.href} />

      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} callHref={facts.phone?.href} />
    </>
  );
}
