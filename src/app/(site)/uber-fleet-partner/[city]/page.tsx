import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentsAndHubs, formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand } from "@/components/driver/driver-ui";
import {
  APPLY_POINTS,
  AnswerBox,
  BackChip,
  CarsTable,
  FormBand,
  GuideSection,
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
import { getDictionary } from "@/content/dictionary";
import { COMPANY, SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { findCity } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { FLEET_ROOT, contactPath, fleetPath, rentPath } from "@/lib/search-pages";
import { allCityFacts, cityFacts, docName, listNames, type CityFacts } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ city: string }> };

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
  const { facts } = await load(slug);
  if (!facts) return {};
  return {
    title: `Uber Fleet in ${facts.name}: Uber Fleet Operator${facts.readyCars ? ` With ${facts.readyCars.toLocaleString("en-IN")} Cars Ready` : ""}`,
    description: `Everest Fleet runs an Uber fleet in ${facts.name}${facts.readyCars ? ` with ${facts.readyCars.toLocaleString("en-IN")} cars ready` : ""} across ${facts.hubs.length} hubs. Drive one of its cars on Uber, insurance and permit included.`,
    alternates: { canonical: `${fleetPath(slug)}/` },
  };
}

function answer(f: CityFacts): string {
  const models = listNames(f.cars.map((c) => c.name));
  return [
    `Everest Fleet is an Uber fleet partner in ${f.name}`,
    f.readyCars ? `, with ${f.readyCars.toLocaleString("en-IN")} cars ready across ${f.hubs.length} hubs` : f.hubs.length ? `, with ${f.hubs.length} hubs` : "",
    models ? `. It runs the ${models} on Uber.` : ".",
    " Drivers bring their documents and drive an Everest Fleet car, with its insurance, permit and maintenance held by the fleet, and are paid every week.",
  ].join("");
}

function faqs(f: CityFacts): QA[] {
  const dict = getDictionary("en");
  const items: QA[] = [
    { q: `Is Everest Fleet an Uber fleet partner in ${f.name}?`, a: `Yes. Everest Fleet has run cars on Uber since ${COMPANY.founded} and is a fleet partner in ${f.name}.` },
  ];
  if (f.readyCars) items.push({ q: `How many cars does Everest Fleet have in ${f.name}?`, a: `${f.readyCars.toLocaleString("en-IN")} cars are ready to drive today, across ${f.hubs.length} hubs.` });
  if (f.cars.length) items.push({ q: `Which cars does Everest Fleet run in ${f.name}?`, a: `${listNames(f.cars.map((c) => `${c.name} (${c.fuel})`))}.` });
  if (f.hubs.length) items.push({ q: `Where are Everest Fleet's hubs in ${f.name}?`, a: f.hubs.map((h) => `${h.name}: ${h.address}`).join(". ") + "." });
  items.push({ q: `How do I join Everest Fleet in ${f.name}?`, a: `Apply on this page${f.phone ? ` or call ${f.phone.display}` : ""}, then visit a hub with your ${listNames(dict.documents.map(docName))}.` });
  return [...items, ...dict.faq];
}

export default async function Page({ params }: Props) {
  const { city: slug } = await params;
  const { content, live, city, facts } = await load(slug);
  if (!city || !facts) notFound();
  const dict = getDictionary("en");
  const name = facts.name;
  const items = faqs(facts);
  const others = allCityFacts(content, live).filter((c) => c.slug !== slug);
  const source = `guide/uber-fleet-partner/${slug}`;

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Everest Fleet",
            url: SITE_URL,
            description: `Uber fleet partner in ${name}.`,
            areaServed: { "@type": "City", name },
            ...(facts.hubs.length
              ? { location: facts.hubs.map((h) => ({ "@type": "Place", name: `Everest Fleet ${h.name}`, address: { "@type": "PostalAddress", streetAddress: h.address, addressLocality: name, addressRegion: facts.state, addressCountry: "IN" } })) }
              : {}),
            ...(facts.phone ? { contactPoint: { "@type": "ContactPoint", telephone: facts.phone.href.replace("tel:", ""), contactType: "driver recruitment", areaServed: name } } : {}),
          },
          faqLd(items),
          crumbsLd([
            { name: "Uber fleet partner", path: `${FLEET_ROOT}/` },
            { name, path: `${fleetPath(slug)}/` },
          ]),
        ]}
      />
      <SearchHero
        chip={<BackChip href={`${FLEET_ROOT}/`} label="All Cities" />}
        title={`Uber Fleet In ${name}`}
        intro={`Everest Fleet's cars on Uber in ${name}: drive one, insurance and permit included.`}
        facts={[
          ...(facts.readyCars ? [{ label: "Cars Ready", value: facts.readyCars.toLocaleString("en-IN") }] : []),
          ...(facts.hubs.length ? [{ label: "Hubs", value: String(facts.hubs.length) }] : []),
          { label: "On Uber Since", value: String(COMPANY.founded) },
        ]}
        phone={facts.phone}
        form={<SearchForm content={content} source={source} placement="hero" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <AnswerBox title="In Short">{answer(facts)}</AnswerBox>

      {facts.cars.length ? <CarsTable id="fleet-cars" title={`The Fleet In ${name}`} sub="Each car and the plans it comes on" cars={facts.cars} plans={facts.plans} /> : null}

      <GuideSection id="fleet-how" title={`Driving With Everest Fleet In ${name}`} shaded>
        <ol>
          <li>Apply on this page{facts.phone ? ` or call ${facts.phone.display}` : ""}, and the {name} team calls you back.</li>
          <li>Visit a hub in {name} with your documents.</li>
          <li>Pick a plan and collect your CNG or EV car.</li>
          <li>Drive on Uber, with weekly payouts to your bank account.</li>
        </ol>
      </GuideSection>

      {facts.plans.length ? <PlanCards id="fleet-plans" title={`Plans In ${name}`} plans={facts.plans} /> : null}

      <FormBand id="fleet-apply" title={`Join The Uber Fleet In ${name}`} points={APPLY_POINTS} form={<SearchForm content={content} source={source} placement="middle" defaultCity={slug} callHref={facts.phone?.href} />} />

      <DocumentsAndHubs city={city} locale="en" dict={dict} />

      <SeoFaq id="fleet-faq" title={`Questions About Everest Fleet In ${name}`} items={items} />

      <RelatedLinks
        id="fleet-more"
        title="Keep Reading"
        links={[
          { href: `${cityPath(slug)}/`, label: `Driver Jobs In ${name}`, note: "Car included" },
          { href: `${contactPath(slug)}/`, label: `Driver Job Contact Number, ${name}`, note: "Number and hubs" },
          { href: `${rentPath(slug)}/`, label: `Car On Rent In ${name}`, note: "Cars and plans" },
          { href: "/fleet-management-company/", label: "Fleet Management Company", note: "Everest Fleet across India" },
          ...others.slice(0, 2).map((o) => ({ href: `${fleetPath(o.slug)}/`, label: `Uber Fleet In ${o.name}`, note: `${o.hubs.length} hubs` })),
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} defaultCity={slug} source={source} placement="bottom" callHref={facts.phone?.href} />

      <StickyBar call={dict.cta.call} callHref={facts.phone?.href} />
    </>
  );
}
