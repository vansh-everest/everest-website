import type { Metadata } from "next";
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
import { getLiveData } from "@/lib/fleet-data";
import { UBER_JOB_ROOT, uberJobPath } from "@/lib/search-pages";
import { allCityFacts, docName, listNames, planRefs, readyTotal } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

const PATH = `${UBER_JOB_ROOT}/`;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: "Uber Driver Job: Drive on Uber With an Everest Fleet Car",
    description: `Uber driver job with an Everest Fleet car in ${content.cities.length} cities: insurance and permit included, weekly payouts and plans to own the car.`,
    alternates: { canonical: PATH },
  };
}

export default async function Page() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("en");
  const cities = allCityFacts(content, live);
  const ready = readyTotal(cities);
  const cityNames = listNames(cities.map((c) => c.name));
  const documents = listNames(dict.documents.map(docName));
  const source = "uber-job/all";
  const items: QA[] = [
    { q: "How do I get an Uber driver job?", a: `Drive under an Uber fleet partner such as Everest Fleet, which gives you the car, insurance and permit in ${cityNames}.` },
    { q: "What documents do I need?", a: `Your ${documents}. Some cities ask for a commercial badge on the licence.` },
    ...dict.faq,
  ];

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "How to get an Uber driver job",
            author: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}${PATH}`,
          },
          faqLd(items),
          crumbsLd([{ name: "Uber driver job", path: PATH }]),
        ]}
      />
      <SearchHero
        chip={<BackChip href="/drive-with-us/" label={dict.hub.eyebrow} />}
        title="Uber Driver Job"
        intro="Drive on Uber with an Everest Fleet car, insurance and permit included."
        facts={[...(ready ? [{ label: "Cars Ready", value: ready.toLocaleString("en-IN") }] : []), { label: "Cities", value: String(cities.length) }]}
        form={<SearchForm content={content} source={source} placement="hero" />}
      />

      <AnswerBox title="In Short">
        An Uber driver job without your own car runs through an Uber fleet partner. Everest Fleet gives you the car with insurance and permit in {cityNames}; you bring your{" "}
        {documents}, go online on the Uber Driver app and are paid every week.
      </AnswerBox>

      <GuideSection id="uberjob-steps" title="Steps To Start">
        <ol>
          <li>Apply on this page or call your city&apos;s number.</li>
          <li>Visit an Everest Fleet hub with your documents.</li>
          <li>Pick a plan and collect your car.</li>
          <li>Log in to the Uber Driver app and start taking trips, with weekly payouts.</li>
        </ol>
      </GuideSection>

      <PlanCards id="uberjob-plans" title="Pick How You Drive" plans={planRefs(content)} />

      <FormBand id="uberjob-apply" title="Start Driving On Uber" points={APPLY_POINTS} form={<SearchForm content={content} source={source} placement="middle" />} />

      <RelatedLinks
        id="uberjob-cities"
        title="Uber Driver Jobs By City"
        links={cities.map((c) => ({
          href: `${uberJobPath(c.slug)}/`,
          label: `Uber Driver Job In ${c.name}`,
          note: [c.readyCars ? `${c.readyCars.toLocaleString("en-IN")} cars ready` : "", c.hubs.length ? `${c.hubs.length} hubs` : ""].filter(Boolean).join(" · ") || undefined,
        }))}
      />

      <SeoFaq id="uberjob-faq" title="Questions About Uber Driver Jobs" items={items} />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} />
    </>
  );
}
