import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { DocumentsAndHubs, formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, SectionHead, band, wrap } from "@/components/driver/driver-ui";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/home/ui";
import {
  AnswerBox,
  BackChip,
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
import { SITE_URL } from "@/lib/company";
import { findCity } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { CONTACT_ROOT, contactPath, fleetPath, rentPath } from "@/lib/search-pages";
import { cityFacts, listNames, type CityFacts } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, hiAlternates, hiCityPath, hiDocuments, hiFaq, hiHubHours, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string; city: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  const content = await getContent();
  return content.cities.map((c) => ({ locale: "hi", city: c.slug }));
}

async function load(slug: string) {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, city: findCity(content, slug), facts: cityFacts(content, live, slug, undefined, "hi") };
}

const callOf = (f: CityFacts) => f.phone ?? { href: PHONE_HREF, display: PHONE_DISPLAY };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city: slug } = await params;
  if (!isHindi(locale)) return {};
  const { facts } = await load(slug);
  if (!facts) return {};
  const call = callOf(facts);
  return {
    title: `${facts.name} ड्राइवर जॉब कॉन्टैक्ट नंबर: ${call.display}`,
    description: `${facts.name} में गाड़ी के साथ ड्राइवर की नौकरी के लिए Everest Fleet को ${call.display} पर कॉल कीजिए, और हब के पते, समय और साथ लाने वाले कागज़ यहाँ देखिए।`,
    alternates: hiAlternates(`${contactPath(slug)}/`),
  };
}

function faqs(f: CityFacts): QA[] {
  const call = callOf(f);
  const hours = f.hubs.map(hiHubHours).find(Boolean);
  return [
    { q: `${f.name} में ड्राइवर जॉब का कॉन्टैक्ट नंबर क्या है?`, a: `Everest Fleet की ${f.name} हायरिंग लाइन: ${call.display} पर कॉल कीजिए।` },
    ...(hours ? [{ q: `${f.name} में हब का समय क्या है?`, a: `${hours}। हर हब का समय इस पेज पर दिया है।` }] : []),
    { q: "हब पर क्या लेकर आना है?", a: `अपना ${hiDocuments()}।` },
    { q: "क्या यह Uber ड्राइवर की नौकरी है?", a: `हाँ। आप ${f.name} में Everest Fleet की गाड़ी Uber पर चलाते हैं, बीमा और परमिट शामिल है और पेमेंट हर हफ़्ते मिलती है।` },
    ...hiFaq(),
  ];
}

const card = "flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition hover:border-brand lg:p-6";
const cardLabel = "text-xs font-semibold uppercase tracking-[0.8px] text-ink-soft";
const cardValue = "mt-1 text-[22px] font-bold leading-8 text-navy";

export default async function Page({ params }: Props) {
  const { locale, city: slug } = await params;
  if (!isHindi(locale)) notFound();
  const { content, city, facts } = await load(slug);
  if (!city || !facts) notFound();
  const dict = getDictionary("hi");
  const name = facts.name;
  const call = callOf(facts);
  const items = faqs(facts);
  const source = `guide/contact/${slug}`;
  const firstHub = facts.hubs[0];
  const firstHours = firstHub ? hiHubHours(firstHub) : "";

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Everest Fleet",
            url: SITE_URL,
            contactPoint: [
              { "@type": "ContactPoint", telephone: call.href.replace("tel:", ""), contactType: "driver recruitment", areaServed: name, availableLanguage: ["English", "Hindi"] },
            ],
            ...(facts.hubs.length
              ? {
                  location: facts.hubs.map((h) => ({
                    "@type": "Place",
                    name: `Everest Fleet ${h.name}`,
                    address: { "@type": "PostalAddress", streetAddress: h.address, addressLocality: city.name.en, addressRegion: facts.state, addressCountry: "IN" },
                  })),
                }
              : {}),
          },
          inHindi(faqLd(items)),
          crumbsLd([
            { name: "ड्राइवर जॉब कॉन्टैक्ट नंबर", path: hiPath(`${CONTACT_ROOT}/`) },
            { name, path: hiPath(contactPath(slug)) },
          ]),
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={hiPath(`${CONTACT_ROOT}/`)} label={HI.allCities} />}
        title={`${name} में ड्राइवर जॉब कॉन्टैक्ट नंबर`}
        intro={`${name} में Uber चलाना शुरू करने के लिए कॉल कीजिए या हब पर आइए, गाड़ी शामिल।`}
        facts={[{ label: "कॉल", value: call.display }, ...(facts.hubs.length ? [{ label: HI.hubs, value: String(facts.hubs.length) }] : [])]}
        phone={call}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" defaultCity={slug} callHref={call.href} />}
      />

      <AnswerBox title={HI.inShort}>
        {name} में Everest Fleet का ड्राइवर हायरिंग नंबर <strong>{call.display}</strong> है।
        {firstHub ? ` खुद आकर अप्लाई करने के लिए ${listNames(facts.hubs.map((h) => h.name), "या")}${firstHours ? ` (${firstHours})` : ""} पर आइए।` : ""} इस नौकरी में
        गाड़ी, बीमा और परमिट शामिल है, और पेमेंट हर हफ़्ते मिलती है।
      </AnswerBox>

      <section aria-labelledby="contact-ways" className={band}>
        <div className={wrap}>
          <SectionHead id="contact-ways" title={`${name} में Everest Fleet से संपर्क`} />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:gap-5">
            <li>
              <a href={call.href} className={card}>
                <Phone aria-hidden size={22} className="text-brand" />
                <span className={`mt-3 ${cardLabel}`}>कॉल</span>
                <span className={cardValue}>{call.display}</span>
              </a>
            </li>
            <li>
              <a href={firstHub?.mapUrl || "#city-documents"} {...(firstHub?.mapUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={card}>
                <MapPin aria-hidden size={22} className="text-brand" />
                <span className={`mt-3 ${cardLabel}`}>हब पर आइए</span>
                <span className={cardValue}>{firstHub ? firstHub.name : hubCount(facts.hubs.length)}</span>
                {firstHours ? <span className="mt-1 text-sm text-ink-soft">{firstHours}</span> : null}
              </a>
            </li>
          </ul>
        </div>
      </section>

      <FormBand
        id="contact-apply"
        title="या यहाँ एक मिनट में अप्लाई कीजिए"
        points={APPLY_POINTS_HI}
        form={<SearchForm locale="hi" content={content} source={source} placement="middle" defaultCity={slug} callHref={call.href} />}
      />

      <DocumentsAndHubs city={city} locale="hi" dict={dict} />

      <GuideSection id="contact-next" title="कॉल के बाद के कदम">
        <ol>
          <li>{name} की टीम आपका नाम लेती है और आपके लाइसेंस का टाइप देखती है।</li>
          <li>आप अपने कागज़ लेकर हब पर आते हैं।</li>
          <li>आप प्लान चुनते हैं और CNG या EV गाड़ी ले जाते हैं।</li>
          <li>आप Uber पर गाड़ी चलाना शुरू करते हैं, और पेमेंट हर हफ़्ते मिलती है।</li>
        </ol>
      </GuideSection>

      <SeoFaq id="contact-faq" title={`${name} में ड्राइवर की नौकरी: सवाल-जवाब`} items={items} />

      <RelatedLinks
        id="contact-more"
        title={HI.keepReading}
        links={[
          { href: hiCityPath(slug), label: `${name} में ड्राइवर की नौकरी`, note: "प्लान और कागज़ात" },
          { href: hiPath(rentPath(slug)), label: `${name} में किराये पर कार`, note: HI.carsAndPlans },
          { href: hiPath(fleetPath(slug)), label: `${name} में Uber फ़्लीट`, note: HI.fleetInCity },
          ...content.cities
            .filter((c) => c.slug !== slug)
            .slice(0, 3)
            .map((c) => ({ href: hiPath(contactPath(c.slug)), label: `कॉन्टैक्ट नंबर, ${c.name.hi || c.name.en}` })),
        ]}
      />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} defaultCity={slug} source={source} placement="bottom" callHref={call.href} />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} callHref={call.href} />
    </>
  );
}
