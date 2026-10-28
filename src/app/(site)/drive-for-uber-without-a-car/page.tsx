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
import { cityPath } from "@/lib/city-route";
import { getLiveData } from "@/lib/fleet-data";
import { allCityFacts, docName, listNames, planRefs, readyTotal } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

const PATH = "/drive-for-uber-without-a-car/";

export const metadata: Metadata = {
  title: "Drive for Uber Without a Car: Get a Car From Everest Fleet",
  description:
    "Drive for Uber without your own car: an Everest Fleet CNG or EV car with insurance and permit, weekly payouts and plans to own it.",
  alternates: { canonical: PATH },
};

export default async function Page() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("en");
  const cities = allCityFacts(content, live);
  const ready = readyTotal(cities);
  const cityNames = listNames(cities.map((c) => c.name));
  const documents = listNames(dict.documents.map(docName));
  const source = "guide/drive-without-car";

  const items: QA[] = [
    { q: "Can I drive for Uber without a car?", a: `Yes. Drive under a fleet partner such as Everest Fleet, which gives you the car, its insurance and permit, in ${cityNames}.` },
    { q: "What documents do I need?", a: `Your ${documents}. Some cities ask for a licence with a commercial badge.` },
    { q: "Do I have to buy the car?", a: "On Drive To Earn you drive the car and return it. On Drive To Own and Own Now it becomes yours at the end of the term." },
    { q: "How soon can I start?", a: "Most drivers collect a car within the week of applying, once their documents are checked at the hub." },
    ...dict.faq.filter((f) => !/own car/i.test(f.q)),
  ];

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "How to drive for Uber without a car",
            author: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}${PATH}`,
          },
          faqLd(items),
          crumbsLd([
            { name: "Drive with us", path: "/drive-with-us/" },
            { name: "Drive for Uber without a car", path: PATH },
          ]),
        ]}
      />
      <SearchHero
        chip={<BackChip href="/drive-with-us/" label={dict.hub.eyebrow} />}
        title="Drive For Uber Without A Car"
        intro="Everest Fleet gives you the car, insurance and permit. You bring your licence."
        facts={[...(ready ? [{ label: "Cars Ready", value: ready.toLocaleString("en-IN") }] : []), { label: "Cities", value: String(cities.length) }]}
        form={<SearchForm content={content} source={source} placement="hero" />}
      />

      <AnswerBox title="In Short">
        You can drive for Uber without owning a car by driving under a fleet partner. Everest Fleet gives you a CNG or EV car with its insurance and permit in{" "}
        {cityNames}; you bring your {documents} and are paid every week. On Drive To Own or Own Now the car becomes yours at the end of the term.
      </AnswerBox>

      <GuideSection id="nocar-how" title="How It Works">
        <ol>
          <li>Apply on this page or call your city&apos;s number.</li>
          <li>Visit an Everest Fleet hub with your documents.</li>
          <li>Pick a plan and collect your car.</li>
          <li>Log in to Uber and start driving, with weekly payouts.</li>
        </ol>
      </GuideSection>

      <PlanCards id="nocar-plans" title="Pick How You Drive" plans={planRefs(content)} />

      <FormBand id="nocar-apply" title="Get Your Car This Week" points={APPLY_POINTS} form={<SearchForm content={content} source={source} placement="middle" />} />

      <GuideSection id="nocar-docs" title="What You Need" shaded>
        <ul>
          {dict.documents.map((d) => (
            <li key={d}>{d}</li>
          ))}
          <li>A commercial badge on your licence, where your city asks for one</li>
        </ul>
      </GuideSection>

      <RelatedLinks
        id="nocar-cities"
        title="Start In Your City"
        links={cities.map((c) => ({
          href: `${cityPath(c.slug)}/`,
          label: `Driver Jobs In ${c.name}`,
          note: [c.readyCars ? `${c.readyCars.toLocaleString("en-IN")} cars ready` : "", c.hubs.length ? `${c.hubs.length} hubs` : ""].filter(Boolean).join(" · ") || undefined,
        }))}
      />

      <SeoFaq id="nocar-faq" title="Questions About Driving Without A Car" items={items} />

      <RelatedLinks
        id="nocar-more"
        title="Keep Reading"
        links={[
          { href: "/uber-driver-requirements/", label: "Uber Driver Requirements", note: "Documents and licence" },
          { href: "/uber-fleet-partner/", label: "Uber Fleet Partner", note: "How driving with a fleet works" },
          { href: "/driver-job-contact-number/", label: "Driver Job Contact Number", note: "Every city's number" },
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} />
    </>
  );
}
