import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, SectionHead, band, wrap } from "@/components/driver/driver-ui";
import {
  APPLY_POINTS,
  AnswerBox,
  BackChip,
  CarsTable,
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
import { cityPath } from "@/lib/city-route";
import { findCity, type City, type Hub } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { VACANCY_ROOT, contactPath, hubPath, uberJobPath, vacancyPath } from "@/lib/search-pages";
import { allCityFacts, cityFacts, docName, hubHours, listNames, type CityFacts } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

/**
 * "Driver vacancy in <city>": the page lists every hub to collect a car from.
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
    title: `Driver Vacancy in ${name}: Cab Driver Jobs With a Car`,
    description: `Driver vacancy in ${name} at Everest Fleet: ${facts.hubs.length ? `${facts.hubs.length} hubs, ` : ""}insurance and permit included, weekly payouts.`,
    alternates: { canonical: `${vacancyPath(slug)}/`, languages: { "en-IN": `${vacancyPath(slug)}/`, "hi-IN": `/hi${vacancyPath(slug)}/`, "x-default": `${vacancyPath(slug)}/` } },
  };
}

function faqs(f: CityFacts): QA[] {
  const dict = getDictionary("en");
  const items: QA[] = [];
  if (f.hubs.length) items.push({ q: `Where are the vacancies in ${f.name}?`, a: `At the Everest Fleet hubs in ${listNames(f.hubs.map((h) => h.name))}.` });
  items.push({ q: "Who can apply?", a: `Anyone with a valid driving licence and their ${listNames(dict.documents.map(docName))}. Some cities ask for a commercial badge on the licence.` });
  if (f.phone) items.push({ q: `What is the number for driver vacancies in ${f.name}?`, a: `Call ${f.phone.display}, or apply on this page and the ${f.name} team calls you back.` });
  return [...items, ...dict.faq];
}

function HubTable({ city, hubs }: { city: City; hubs: Hub[] }) {
  return (
    <section aria-labelledby="vacancy-hubs" className={band}>
      <div className={wrap}>
        <SectionHead id="vacancy-hubs" title="Vacancies By Hub" sub="Collect your car from the hub nearest you" />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white lg:mt-10">
          <table className="w-full min-w-[560px] text-left text-[15px] leading-6">
            <thead>
              <tr className="border-b border-line bg-[#f5f8fc]">
                <th className="px-4 py-3 text-sm font-semibold text-navy">Hub</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Cars</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Timings</th>
              </tr>
            </thead>
            <tbody>
              {hubs.map((h) => (
                <tr key={`${h.name}|${h.address}`} className="border-b border-line align-top last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`${hubPath(city, h)}/`} className="font-semibold text-brand hover:underline">
                      {h.name}
                    </Link>
                    <span className="block text-sm text-ink-soft">{h.address}</span>
                  </td>
                  <td className="px-4 py-3 text-navy">{h.fuel || "–"}</td>
                  <td className="px-4 py-3 text-ink-soft">{hubHours(h) || "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default async function Page({ params }: Props) {
  const { city: slug } = await params;
  const { content, live, city, facts } = await load(slug);
  if (!city || !facts) notFound();
  const dict = getDictionary("en");
  const name = city.name.en;
  const items = faqs(facts);
  const others = allCityFacts(content, live).filter((c) => c.slug !== slug);
  const source = `vacancy/${slug}`;

  return (
    <>
      <JsonLd
        blocks={[
          faqLd(items),
          crumbsLd([
            { name: "Driver vacancies", path: `${VACANCY_ROOT}/` },
            { name, path: `${vacancyPath(slug)}/` },
          ]),
        ]}
      />
      <SearchHero
        chip={<BackChip href={`${VACANCY_ROOT}/`} label="All Cities" />}
        title={`Driver Vacancy In ${name}`}
        intro={`Cab driver jobs in ${name} with an Everest Fleet car, insurance and permit included.`}
        facts={[
          ...(facts.hubs.length ? [{ label: "Hubs", value: String(facts.hubs.length) }] : []),
          ...(facts.cars.length ? [{ label: "Models", value: String(facts.cars.length) }] : []),
        ]}
        phone={facts.phone}
        form={<SearchForm content={content} source={source} placement="hero" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <AnswerBox title="In Short">
        Everest Fleet is hiring cab drivers in {name}
        {facts.hubs.length ? `, at ${facts.hubs.length} hubs` : ""}. Apply here, bring your documents to the nearest hub and drive on Uber with weekly payouts.
      </AnswerBox>

      {facts.hubs.length ? <HubTable city={city} hubs={facts.hubs} /> : null}

      {facts.cars.length ? (
        <CarsTable id="vacancy-cars" title={`Cars In ${name}`} sub="Each car and the plans it comes on" cars={facts.cars} plans={facts.plans} />
      ) : null}

      <FormBand
        id="vacancy-apply"
        title={`Apply For A Vacancy In ${name}`}
        points={APPLY_POINTS}
        form={<SearchForm content={content} source={source} placement="middle" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <GuideSection id="vacancy-docs" title="Who Can Apply" shaded>
        <ul>
          {dict.documents.map((d) => (
            <li key={d}>{d}</li>
          ))}
          <li>A commercial badge on your licence, where your city asks for one</li>
        </ul>
      </GuideSection>

      <SeoFaq id="vacancy-faq" title={`Questions About Vacancies In ${name}`} items={items} />

      <RelatedLinks
        id="vacancy-more"
        title="Keep Reading"
        links={[
          { href: `${cityPath(slug)}/`, label: `Driver Jobs In ${name}`, note: "Plans and documents" },
          { href: `${uberJobPath(slug)}/`, label: `Uber Driver Job In ${name}`, note: "Steps to start" },
          { href: `${contactPath(slug)}/`, label: `Driver Job Contact Number, ${name}`, note: "Number and hubs" },
          ...others.slice(0, 3).map((o) => ({
            href: `${vacancyPath(o.slug)}/`,
            label: `Driver Vacancy In ${o.name}`,
            note: `${o.hubs.length} hubs`,
          })),
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} defaultCity={slug} source={source} placement="bottom" callHref={facts.phone?.href} />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} callHref={facts.phone?.href} />
    </>
  );
}
