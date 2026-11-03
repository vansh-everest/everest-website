import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentsAndHubs, formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand } from "@/components/driver/driver-ui";
import {
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
import { fill, getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { findCity } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { contactPath, fleetPath } from "@/lib/search-pages";
import { RENT_ROOT, allCityFacts, cityFacts, listNames, planLines, rentPath, type CityFacts } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, hiAlternates, hiCityPath, hiDocuments, hiFaq, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string; city: string }> };

// The car list follows Jarvis: hourly, so a new model reaches the page the same day.
export const revalidate = 3600;

export async function generateStaticParams() {
  const content = await getContent();
  return content.cities.map((c) => ({ locale: "hi", city: c.slug }));
}

async function load(slug: string) {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, live, city: findCity(content, slug), facts: cityFacts(content, live, slug, undefined, "hi") };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city: slug } = await params;
  if (!isHindi(locale)) return {};
  const { city, facts } = await load(slug);
  if (!city || !facts) return {};
  const name = facts.name;
  const cars = listNames(facts.cars.map((c) => c.name), "और");
  return {
    title: `${name} में Uber के लिए किराये पर कार: गाड़ियाँ, प्लान और हब`,
    description: `${name} में Uber ड्राइवरों के लिए किराये पर कार${cars ? ` (${cars})` : ""}, बीमा और परमिट शामिल, ${hubCount(facts.hubs.length)}, हर हफ़्ते पेमेंट, एक मिनट में अप्लाई।`,
    alternates: hiAlternates(`${rentPath(slug)}/`),
  };
}

function answer(f: CityFacts): string {
  const fuels = listNames(f.cars.map((c) => c.fuel), "या");
  return [
    `${f.name} में Everest Fleet Uber ड्राइवरों को Drive To Earn पर ${fuels || "CNG या EV"} गाड़ी देता है, या Drive To Own और Own Now पर ऐसी गाड़ी जो अवधि पूरी होने पर उनकी हो जाती है।`,
    f.readyCars ? ` ${hubCount(f.hubs.length)} पर ${f.readyCars.toLocaleString("en-IN")} गाड़ियाँ तैयार हैं।` : f.hubs.length ? ` गाड़ी ${hubCount(f.hubs.length)} में से किसी एक से ले जाइए।` : "",
    " बीमा, परमिट और मेंटेनेंस शामिल है; ईंधन का खर्च आपका।",
  ].join("");
}

function faqs(f: CityFacts): QA[] {
  const items: QA[] = [];
  if (f.cars.length) {
    items.push({ q: `${f.name} में Uber के लिए किराये पर कौन-सी गाड़ियाँ मिलती हैं?`, a: `${listNames(f.cars.map((c) => c.name), "और")}। हर गाड़ी के साथ बीमा और Uber पर चलाने का परमिट मिलता है।` });
  }
  const lines = planLines(f.plans, "hi");
  if (lines.length) items.push({ q: `${f.name} में कितना डिपॉज़िट लगता है?`, a: `${lines.join("। ")}।` });
  if (f.hubs.length) {
    items.push({
      q: `${f.name} में गाड़ी कहाँ से मिलती है?`,
      a: `Everest Fleet के हब से: ${listNames(f.hubs.map((h) => h.name), "और")}। साथ में अपना ${hiDocuments()} लाइए।`,
    });
  }
  if (f.phone) items.push({ q: `${f.name} में Everest Fleet का नंबर क्या है?`, a: `${f.phone.display} पर कॉल कीजिए, या इस पेज पर अप्लाई कीजिए और ${f.name} की टीम आपको कॉल करेगी।` });
  return [...items, ...hiFaq()];
}

export default async function Page({ params }: Props) {
  const { locale, city: slug } = await params;
  if (!isHindi(locale)) notFound();
  const { content, live, city, facts } = await load(slug);
  if (!city || !facts) notFound();
  const dict = getDictionary("hi");
  const name = facts.name;
  const items = faqs(facts);
  const url = `${SITE_URL}${hiPath(rentPath(slug))}`;
  const others = allCityFacts(content, live, undefined, "hi").filter((c) => c.slug !== slug);
  const source = `rent/${slug}`;

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${name} में Uber ड्राइवरों के लिए किराये पर कार`,
            serviceType: "कैब ड्राइवरों के लिए गाड़ियाँ",
            url,
            areaServed: { "@type": "City", name },
            provider: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
          },
          inHindi(faqLd(items)),
          crumbsLd([
            { name: "Uber के लिए किराये पर कार", path: hiPath(`${RENT_ROOT}/`) },
            { name, path: hiPath(rentPath(slug)) },
          ]),
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={hiPath(`${RENT_ROOT}/`)} label={HI.allCities} />}
        title={`${name} में Uber के लिए किराये पर कार`}
        intro={`${name} में Everest Fleet की गाड़ी से Uber चलाइए, बीमा और परमिट शामिल।`}
        facts={[
          ...(facts.readyCars ? [{ label: HI.carsReady, value: facts.readyCars.toLocaleString("en-IN") }] : []),
          ...(facts.hubs.length ? [{ label: HI.hubs, value: String(facts.hubs.length) }] : []),
          ...(facts.cars.length ? [{ label: HI.models, value: String(facts.cars.length) }] : []),
        ]}
        phone={facts.phone}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <AnswerBox title={HI.inShort}>{answer(facts)}</AnswerBox>

      {facts.cars.length ? (
        <CarsTable id="rent-cars" title={`${name} की गाड़ियाँ`} sub={HI.eachCar} carLabel={HI.car} cars={facts.cars} plans={facts.plans} />
      ) : null}

      {facts.plans.length ? <PlanCards locale="hi" id="rent-plans" title={fill(dict.city.plansHeading, { city: name })} plans={facts.plans} /> : null}

      <FormBand
        id="rent-apply"
        title={`${name} में अपनी गाड़ी पाइए`}
        points={APPLY_POINTS_HI}
        form={<SearchForm locale="hi" content={content} source={source} placement="middle" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <DocumentsAndHubs city={city} locale="hi" dict={dict} />

      <SeoFaq id="rent-faq" title={`${name} में किराये पर कार: सवाल-जवाब`} items={items} />

      <RelatedLinks
        id="rent-more"
        title={HI.keepReading}
        links={[
          { href: hiCityPath(slug), label: `${name} में ड्राइवर की नौकरी`, note: HI.carIncluded },
          { href: hiPath(contactPath(slug)), label: `ड्राइवर जॉब कॉन्टैक्ट नंबर, ${name}`, note: HI.numberAndHubs },
          { href: hiPath(fleetPath(slug)), label: `${name} में Uber फ़्लीट`, note: HI.fleetInCity },
          { href: hiPath("/uber-driver-requirements/"), label: HI.requirements, note: HI.docsAndLicence },
          ...others.slice(0, 2).map((o) => ({ href: hiPath(rentPath(o.slug)), label: `${o.name} में किराये पर कार`, note: hubCount(o.hubs.length) })),
        ]}
      />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} defaultCity={slug} source={source} placement="bottom" callHref={facts.phone?.href} />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} callHref={facts.phone?.href} />
    </>
  );
}
