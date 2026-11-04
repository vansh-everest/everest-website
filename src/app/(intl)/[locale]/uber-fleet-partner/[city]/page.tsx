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
import { fill, getDictionary } from "@/content/dictionary";
import { COMPANY, SITE_URL } from "@/lib/company";
import { findCity } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { FLEET_ROOT, contactPath, fleetPath, rentPath } from "@/lib/search-pages";
import { allCityFacts, cityFacts, listNames, type CityFacts } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, hiAlternates, hiCityPath, hiDocuments, hiFaq, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string; city: string }> };

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
  const { facts } = await load(slug);
  if (!facts) return {};
  return {
    title: `${facts.name} में Uber फ़्लीट: Uber फ़्लीट ऑपरेटर`,
    description: `Everest Fleet ${facts.name} में ${hubCount(facts.hubs.length)} पर Uber फ़्लीट चलाता है: इसकी गाड़ी Uber पर चलाइए, बीमा और परमिट शामिल।`,
    alternates: hiAlternates(`${fleetPath(slug)}/`),
  };
}

function answer(f: CityFacts): string {
  const models = listNames(f.cars.map((c) => c.name), "और");
  return [
    `${f.name} में Everest Fleet एक Uber फ़्लीट पार्टनर है`,
    f.hubs.length ? `, जिसके ${hubCount(f.hubs.length)} हैं` : "",
    models ? `। यह Uber पर ${models} चलाता है।` : "।",
    " ड्राइवर अपने कागज़ लाते हैं और Everest Fleet की गाड़ी चलाते हैं; बीमा, परमिट और मेंटेनेंस फ़्लीट संभालता है, और पेमेंट हर हफ़्ते मिलती है।",
  ].join("");
}

function faqs(f: CityFacts): QA[] {
  const items: QA[] = [
    { q: `क्या Everest Fleet ${f.name} में Uber फ़्लीट पार्टनर है?`, a: `हाँ। Everest Fleet ${COMPANY.founded} से Uber पर गाड़ियाँ चला रहा है और ${f.name} में फ़्लीट पार्टनर है।` },
  ];
  if (f.cars.length) items.push({ q: `${f.name} में Everest Fleet कौन-सी गाड़ियाँ चलाता है?`, a: `${listNames(f.cars.map((c) => `${c.name} (${c.fuel})`), "और")}।` });
  if (f.hubs.length) items.push({ q: `${f.name} में Everest Fleet के हब कहाँ हैं?`, a: f.hubs.map((h) => `${h.name}: ${h.address}`).join("। ") + "।" });
  items.push({
    q: `${f.name} में Everest Fleet से कैसे जुड़ें?`,
    a: `इस पेज पर अप्लाई कीजिए${f.phone ? ` या ${f.phone.display} पर कॉल कीजिए` : ""}, फिर अपना ${hiDocuments()} लेकर किसी हब पर आइए।`,
  });
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
  const others = allCityFacts(content, live, undefined, "hi").filter((c) => c.slug !== slug);
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
            description: `${name} में Uber फ़्लीट पार्टनर।`,
            areaServed: { "@type": "City", name },
            ...(facts.hubs.length
              ? {
                  location: facts.hubs.map((h) => ({
                    "@type": "Place",
                    name: `Everest Fleet ${h.name}`,
                    address: { "@type": "PostalAddress", streetAddress: h.address, addressLocality: city.name.en, addressRegion: facts.state, addressCountry: "IN" },
                  })),
                }
              : {}),
            ...(facts.phone ? { contactPoint: { "@type": "ContactPoint", telephone: facts.phone.href.replace("tel:", ""), contactType: "driver recruitment", areaServed: name } } : {}),
          },
          inHindi(faqLd(items)),
          crumbsLd([
            { name: "Uber फ़्लीट पार्टनर", path: hiPath(`${FLEET_ROOT}/`) },
            { name, path: hiPath(fleetPath(slug)) },
          ]),
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={hiPath(`${FLEET_ROOT}/`)} label={HI.allCities} />}
        title={`${name} में Uber फ़्लीट`}
        intro={`${name} में Uber पर Everest Fleet की गाड़ी चलाइए, बीमा और परमिट शामिल।`}
        facts={[
          ...(facts.hubs.length ? [{ label: HI.hubs, value: String(facts.hubs.length) }] : []),
          { label: "Uber पर शुरुआत", value: String(COMPANY.founded) },
        ]}
        phone={facts.phone}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <AnswerBox title={HI.inShort}>{answer(facts)}</AnswerBox>

      {facts.cars.length ? <CarsTable id="fleet-cars" title={`${name} में फ़्लीट`} sub={HI.eachCar} carLabel={HI.car} cars={facts.cars} plans={facts.plans} /> : null}

      <GuideSection id="fleet-how" title={`${name} में Everest Fleet के साथ ड्राइविंग`} shaded>
        <ol>
          <li>
            इस पेज पर अप्लाई कीजिए{facts.phone ? ` या ${facts.phone.display} पर कॉल कीजिए` : ""}, {name} की टीम आपको वापस कॉल करेगी।
          </li>
          <li>अपने कागज़ लेकर {name} के किसी हब पर आइए।</li>
          <li>प्लान चुनिए और अपनी CNG या EV गाड़ी ले जाइए।</li>
          <li>Uber पर चलाइए, हर हफ़्ते पेमेंट सीधे बैंक खाते में।</li>
        </ol>
      </GuideSection>

      {facts.plans.length ? <PlanCards locale="hi" id="fleet-plans" title={fill(dict.city.plansHeading, { city: name })} plans={facts.plans} /> : null}

      <FormBand
        id="fleet-apply"
        title={`${name} में Uber फ़्लीट से जुड़िए`}
        points={APPLY_POINTS_HI}
        form={<SearchForm locale="hi" content={content} source={source} placement="middle" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <DocumentsAndHubs city={city} locale="hi" dict={dict} />

      <SeoFaq id="fleet-faq" title={`${name} में Everest Fleet: सवाल-जवाब`} items={items} />

      <RelatedLinks
        id="fleet-more"
        title={HI.keepReading}
        links={[
          { href: hiCityPath(slug), label: `${name} में ड्राइवर की नौकरी`, note: HI.carIncluded },
          { href: hiPath(contactPath(slug)), label: `ड्राइवर जॉब कॉन्टैक्ट नंबर, ${name}`, note: HI.numberAndHubs },
          { href: hiPath(rentPath(slug)), label: `${name} में किराये पर कार`, note: HI.carsAndPlans },
          { href: hiPath("/fleet-management-company/"), label: "फ़्लीट मैनेजमेंट कंपनी", note: HI.everestAcrossIndia },
          ...others.slice(0, 2).map((o) => ({ href: hiPath(fleetPath(o.slug)), label: `${o.name} में Uber फ़्लीट`, note: hubCount(o.hubs.length) })),
        ]}
      />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} defaultCity={slug} source={source} placement="bottom" callHref={facts.phone?.href} />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} callHref={facts.phone?.href} />
    </>
  );
}
