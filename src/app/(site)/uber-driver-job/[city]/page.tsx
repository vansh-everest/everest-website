import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { findCity } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { UBER_JOB_ROOT, contactPath, fleetPath, hubPath, uberJobPath, vacancyPath } from "@/lib/search-pages";
import { allCityFacts, cityFacts, docName, listNames, planLines, type CityFacts } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

/**
 * "Uber driver job in <city>": the steps from applying to going online on Uber with an Everest
 * Fleet car, with the city's hubs, plans and number.
 */

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
  const { city, facts } = await load(slug);
  if (!city || !facts) return {};
  const name = city.name.en;
  return {
    title: `Uber Driver Job in ${name}: Start With an Everest Fleet Car`,
    description: `Uber driver job in ${name} with an Everest Fleet car: ${facts.hubs.length ? `${facts.hubs.length} hubs, ` : ""}insurance and permit included, weekly payouts and the steps to start.`,
    alternates: { canonical: `${uberJobPath(slug)}/` },
  };
}

function faqs(f: CityFacts): QA[] {
  const dict = getDictionary("en");
  const items: QA[] = [
    { q: `Can I drive for Uber in ${f.name} without my own car?`, a: `Yes. Everest Fleet, an Uber fleet partner, gives you the car with its insurance and permit in ${f.name}.` },
    { q: "What documents do I need?", a: `Your ${listNames(dict.documents.map(docName))}. Some cities ask for a commercial badge on the licence.` },
  ];
  const lines = planLines(f.plans);
  if (lines.length) items.push({ q: `Which plans are there in ${f.name}?`, a: `${lines.join(". ")}.` });
  if (f.hubs.length) items.push({ q: `Where do I collect the car in ${f.name}?`, a: `At an Everest Fleet hub: ${listNames(f.hubs.map((h) => h.name))}.` });
  if (f.phone) items.push({ q: `Who do I call about an Uber driver job in ${f.name}?`, a: `Everest Fleet on ${f.phone.display}, or apply on this page for a call back.` });
  return [...items, ...dict.faq];
}

export default async function Page({ params }: Props) {
  const { city: slug } = await params;
  const { content, live, city, facts } = await load(slug);
  if (!city || !facts) notFound();
  const dict = getDictionary("en");
  const name = city.name.en;
  const items = faqs(facts);
  const url = `${SITE_URL}${uberJobPath(slug)}/`;
  const others = allCityFacts(content, live).filter((c) => c.slug !== slug);
  const documents = listNames(dict.documents.map(docName));
  const source = `uber-job/${slug}`;

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `How to get an Uber driver job in ${name}`,
            author: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            mainEntityOfPage: url,
          },
          faqLd(items),
          crumbsLd([
            { name: "Uber driver job", path: `${UBER_JOB_ROOT}/` },
            { name, path: `${uberJobPath(slug)}/` },
          ]),
        ]}
      />
      <SearchHero
        chip={<BackChip href={`${UBER_JOB_ROOT}/`} label="All Cities" />}
        title={`Uber Driver Job In ${name}`}
        intro={`Drive on Uber in ${name} with an Everest Fleet car, insurance and permit included.`}
        facts={[
          ...(facts.readyCars ? [{ label: "Cars Ready", value: facts.readyCars.toLocaleString("en-IN") }] : []),
          ...(facts.hubs.length ? [{ label: "Hubs", value: String(facts.hubs.length) }] : []),
        ]}
        phone={facts.phone}
        form={<SearchForm content={content} source={source} placement="hero" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <AnswerBox title="In Short">
        To get an Uber driver job in {name}, drive under Everest Fleet, an Uber fleet partner. Apply here, bring your {documents} to a hub in {name}, pick a plan
        and go online on the Uber Driver app in your Everest Fleet car, with weekly payouts.
      </AnswerBox>

      <GuideSection id="uberjob-steps" title={`Steps To Start In ${name}`}>
        <ol>
          <li>Apply on this page{facts.phone ? <>, or call {facts.phone.display}</> : null}.</li>
          <li>Visit a hub{facts.hubs.length ? ` (${listNames(facts.hubs.map((h) => h.name))})` : ""} with your documents.</li>
          <li>Pick a plan and collect your car, with its insurance and permit.</li>
          <li>Log in to the Uber Driver app and start taking trips, with weekly payouts.</li>
        </ol>
      </GuideSection>

      {facts.plans.length ? <PlanCards id="uberjob-plans" title={`Plans In ${name}`} plans={facts.plans} /> : null}

      <FormBand
        id="uberjob-apply"
        title={`Start Driving On Uber In ${name}`}
        points={APPLY_POINTS}
        form={<SearchForm content={content} source={source} placement="middle" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <GuideSection id="uberjob-docs" title="What You Need" shaded>
        <ul>
          {dict.documents.map((d) => (
            <li key={d}>{d}</li>
          ))}
          <li>A commercial badge on your licence, where your city asks for one</li>
        </ul>
      </GuideSection>

      <SeoFaq id="uberjob-faq" title={`Questions About Uber Driver Jobs In ${name}`} items={items} />

      <RelatedLinks
        id="uberjob-more"
        title="Keep Reading"
        links={[
          { href: `${cityPath(slug)}/`, label: `Driver Jobs In ${name}`, note: "Plans and documents" },
          { href: `${vacancyPath(slug)}/`, label: `Driver Vacancy In ${name}`, note: "Cars waiting for drivers" },
          { href: `${fleetPath(slug)}/`, label: `Uber Fleet In ${name}`, note: "Everest Fleet in the city" },
          { href: `${contactPath(slug)}/`, label: `Driver Job Contact Number, ${name}`, note: "Number and hubs" },
          ...facts.hubs.slice(0, 2).map((h) => ({ href: `${hubPath(city, h)}/`, label: `Driver Job In ${h.name}`, note: h.fuel ? `${h.fuel} hub` : "Everest Fleet hub" })),
          ...others.slice(0, 2).map((o) => ({ href: `${uberJobPath(o.slug)}/`, label: `Uber Driver Job In ${o.name}`, note: `${o.hubs.length} hubs` })),
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} defaultCity={slug} source={source} placement="bottom" callHref={facts.phone?.href} />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} callHref={facts.phone?.href} />
    </>
  );
}
