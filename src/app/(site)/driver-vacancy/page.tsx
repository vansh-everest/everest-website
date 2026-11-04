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
import { getLiveData } from "@/lib/fleet-data";
import { VACANCY_ROOT, vacancyPath } from "@/lib/search-pages";
import { allCityFacts, docName, listNames } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const cities = allCityFacts(content, live);
  return {
    title: `Driver Vacancy in ${cities.length} Cities: Cab Driver Jobs With a Car`,
    description: `Driver vacancies at Everest Fleet in ${listNames(cities.map((c) => c.name))}, with the car, insurance and permit included and weekly payouts.`,
    alternates: { canonical: `${VACANCY_ROOT}/` },
  };
}

export default async function Page() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("en");
  const cities = allCityFacts(content, live);
  const source = "vacancy/all";
  const items: QA[] = [
    { q: "What do I need to apply?", a: `A valid driving licence and your ${listNames(dict.documents.map(docName))}.` },
    ...dict.faq,
  ];

  return (
    <>
      <JsonLd blocks={[faqLd(items), crumbsLd([{ name: "Driver vacancies", path: `${VACANCY_ROOT}/` }])]} />
      <SearchHero
        chip={<BackChip href="/drive-with-us/" label={dict.hub.eyebrow} />}
        title="Driver Vacancy"
        intro="Cab driver vacancies with an Everest Fleet car, insurance and permit included, in every city below."
        facts={[{ label: "Cities", value: String(cities.length) }]}
        form={<SearchForm content={content} source={source} placement="hero" />}
      />

      <AnswerBox title="In Short">
        Everest Fleet is hiring cab drivers in {listNames(cities.map((c) => c.name))}. Pick your city, apply and
        collect your car from the nearest hub.
      </AnswerBox>

      <RelatedLinks
        id="vacancy-cities"
        title="Vacancies By City"
        links={cities.map((c) => ({
          href: `${vacancyPath(c.slug)}/`,
          label: `Driver Vacancy In ${c.name}`,
          note: c.hubs.length ? `${c.hubs.length} hubs` : undefined,
        }))}
      />

      <FormBand id="vacancy-apply" title="Apply For A Vacancy" points={APPLY_POINTS} form={<SearchForm content={content} source={source} placement="middle" />} />

      <SeoFaq id="vacancy-faq" title="Questions About Driver Vacancies" items={items} />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} />
    </>
  );
}
