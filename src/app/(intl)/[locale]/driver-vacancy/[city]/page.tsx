import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, SectionHead, band, wrap } from "@/components/driver/driver-ui";
import {
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
import { findCity, type Hub } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { contactPath, uberJobPath, vacancyPath } from "@/lib/search-pages";
import { allCityFacts, cityFacts, listNames, type CityFacts } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, HI_DRIVE_CRUMB, hiAlternates, hiCityPath, hiDocuments, hiFaq, hiHubHours, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

/**
 * The Hindi "driver vacancy in <city>" page: the English page's hubs, cars and form, in Hindi.
 * The all-cities page above it is English only, so the chip and crumbs lead to the Hindi driver jobs page.
 */

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
  const name = facts.name;
  return {
    title: `${name} में ड्राइवर वैकेंसी: गाड़ी के साथ कैब ड्राइवर की नौकरी`,
    description: `Everest Fleet में ${name} की ड्राइवर वैकेंसी: ${facts.hubs.length ? `${hubCount(facts.hubs.length)}, ` : ""}बीमा और परमिट शामिल, हर हफ़्ते पेमेंट।`,
    alternates: hiAlternates(`${vacancyPath(slug)}/`),
  };
}

function faqs(f: CityFacts): QA[] {
  const items: QA[] = [];
  if (f.hubs.length) items.push({ q: `${f.name} में वैकेंसी कहाँ हैं?`, a: `Everest Fleet के इन हब पर: ${listNames(f.hubs.map((h) => h.name), "और")}।` });
  items.push({ q: "कौन अप्लाई कर सकता है?", a: `कोई भी, जिसके पास ${hiDocuments()} हों। कुछ शहर कमर्शियल बैज वाला लाइसेंस माँगते हैं।` });
  if (f.phone) {
    items.push({ q: `${f.name} में ड्राइवर वैकेंसी का नंबर क्या है?`, a: `${f.phone.display} पर कॉल कीजिए, या इस पेज पर अप्लाई कीजिए और ${f.name} की टीम आपको कॉल करेगी।` });
  }
  return [...items, ...hiFaq()];
}

function HubTable({ hubs }: { hubs: Hub[] }) {
  return (
    <section aria-labelledby="vacancy-hubs" className={band}>
      <div className={wrap}>
        <SectionHead id="vacancy-hubs" title="हब के हिसाब से वैकेंसी" sub="अपने सबसे पास के हब से गाड़ी लीजिए" />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white lg:mt-10">
          <table className="w-full min-w-[560px] text-left text-[15px] leading-6">
            <thead>
              <tr className="border-b border-line bg-[#f5f8fc]">
                <th className="px-4 py-3 text-sm font-semibold text-navy">{HI.hubs}</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">गाड़ियाँ</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">समय</th>
              </tr>
            </thead>
            <tbody>
              {hubs.map((h) => (
                <tr key={`${h.name}|${h.address}`} className="border-b border-line align-top last:border-0">
                  <td className="px-4 py-3">
                    {/* The hub pages are English only, so the Hindi table names the hub without a link. */}
                    <span className="font-semibold text-navy">{h.name}</span>
                    <span className="block text-sm text-ink-soft">{h.address}</span>
                  </td>
                  <td className="px-4 py-3 text-navy">{h.fuel || "–"}</td>
                  <td className="px-4 py-3 text-ink-soft">{hiHubHours(h) || "–"}</td>
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
  const { locale, city: slug } = await params;
  if (!isHindi(locale)) notFound();
  const { content, live, city, facts } = await load(slug);
  if (!city || !facts) notFound();
  const dict = getDictionary("hi");
  const name = facts.name;
  const items = faqs(facts);
  const others = allCityFacts(content, live, undefined, "hi").filter((c) => c.slug !== slug);
  // The English page's source, so the lead reaches the CRM the same way; the form sends the language beside it.
  const source = `vacancy/${slug}`;

  return (
    <>
      <JsonLd
        blocks={[
          inHindi(faqLd(items)),
          crumbsLd([HI_DRIVE_CRUMB, { name: `${name} में ड्राइवर वैकेंसी`, path: hiPath(vacancyPath(slug)) }]),
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={HI_DRIVE_CRUMB.path} label={HI_DRIVE_CRUMB.name} />}
        title={`${name} में ड्राइवर वैकेंसी`}
        intro={`${name} में Everest Fleet की गाड़ी के साथ कैब ड्राइवर की नौकरी, बीमा और परमिट शामिल।`}
        facts={[
          ...(facts.hubs.length ? [{ label: HI.hubs, value: String(facts.hubs.length) }] : []),
          ...(facts.cars.length ? [{ label: HI.models, value: String(facts.cars.length) }] : []),
        ]}
        phone={facts.phone}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <AnswerBox title={HI.inShort}>
        Everest Fleet {name} में{facts.hubs.length ? ` ${hubCount(facts.hubs.length)} पर` : ""} कैब ड्राइवरों की भर्ती कर रहा है। यहाँ अप्लाई कीजिए, अपने कागज़ लेकर सबसे
        पास के हब पर आइए और Uber पर गाड़ी चलाइए। पेमेंट हर हफ़्ते मिलती है।
      </AnswerBox>

      {facts.hubs.length ? <HubTable hubs={facts.hubs} /> : null}

      {facts.cars.length ? (
        <CarsTable id="vacancy-cars" title={`${name} की गाड़ियाँ`} sub={HI.eachCar} carLabel={HI.car} cars={facts.cars} plans={facts.plans} />
      ) : null}

      <FormBand
        id="vacancy-apply"
        title={`${name} में वैकेंसी के लिए अप्लाई कीजिए`}
        points={APPLY_POINTS_HI}
        form={<SearchForm locale="hi" content={content} source={source} placement="middle" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <GuideSection id="vacancy-docs" title="कौन अप्लाई कर सकता है" shaded>
        <ul>
          {dict.documents.map((d) => (
            <li key={d}>{d}</li>
          ))}
          <li>लाइसेंस पर कमर्शियल बैज, अगर आपका शहर माँगता है</li>
        </ul>
      </GuideSection>

      <SeoFaq id="vacancy-faq" title={`${name} में ड्राइवर वैकेंसी: सवाल-जवाब`} items={items} />

      <RelatedLinks
        id="vacancy-more"
        title={HI.keepReading}
        links={[
          { href: hiCityPath(slug), label: `${name} में ड्राइवर की नौकरी`, note: "प्लान और कागज़ात" },
          { href: hiPath(uberJobPath(slug)), label: `${name} में Uber ड्राइवर की नौकरी`, note: "शुरू करने के कदम" },
          { href: hiPath(contactPath(slug)), label: `ड्राइवर जॉब कॉन्टैक्ट नंबर, ${name}`, note: HI.numberAndHubs },
          ...others.slice(0, 3).map((o) => ({ href: hiPath(vacancyPath(o.slug)), label: `${o.name} में ड्राइवर वैकेंसी`, note: hubCount(o.hubs.length) })),
        ]}
      />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} defaultCity={slug} source={source} placement="bottom" callHref={facts.phone?.href} />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} callHref={facts.phone?.href} />
    </>
  );
}
