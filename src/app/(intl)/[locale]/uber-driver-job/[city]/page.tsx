import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand } from "@/components/driver/driver-ui";
import {
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
import { fill, getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { findCity } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { contactPath, fleetPath, uberJobPath, vacancyPath } from "@/lib/search-pages";
import { allCityFacts, cityFacts, listNames, planLines, type CityFacts } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, HI_DRIVE_CRUMB, hiAlternates, hiCityPath, hiDocuments, hiFaq, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

/**
 * The Hindi "Uber driver job in <city>" page: the English page's steps, plans and form, in Hindi.
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
    title: `${name} में Uber ड्राइवर की नौकरी: Everest Fleet की गाड़ी से शुरू कीजिए`,
    description: `${name} में Everest Fleet की गाड़ी के साथ Uber ड्राइवर की नौकरी: ${facts.hubs.length ? `${hubCount(facts.hubs.length)}, ` : ""}बीमा और परमिट शामिल, हर हफ़्ते पेमेंट और शुरू करने के कदम।`,
    alternates: hiAlternates(`${uberJobPath(slug)}/`),
  };
}

function faqs(f: CityFacts): QA[] {
  const items: QA[] = [
    { q: `क्या ${f.name} में बिना अपनी गाड़ी के Uber चला सकते हैं?`, a: `हाँ। Uber फ़्लीट पार्टनर Everest Fleet ${f.name} में गाड़ी देता है, उसके बीमा और परमिट के साथ।` },
    { q: "कौन-से कागज़ात चाहिए?", a: `आपका ${hiDocuments()}। कुछ शहर कमर्शियल बैज वाला लाइसेंस माँगते हैं।` },
  ];
  const lines = planLines(f.plans, "hi");
  if (lines.length) items.push({ q: `${f.name} में कौन-से प्लान हैं?`, a: `${lines.join("। ")}।` });
  if (f.hubs.length) items.push({ q: `${f.name} में गाड़ी कहाँ से मिलती है?`, a: `Everest Fleet के हब से: ${listNames(f.hubs.map((h) => h.name), "और")}।` });
  if (f.phone) {
    items.push({ q: `${f.name} में Uber ड्राइवर की नौकरी के लिए किसे कॉल करें?`, a: `Everest Fleet को ${f.phone.display} पर कॉल कीजिए, या कॉल बैक के लिए इस पेज पर अप्लाई कीजिए।` });
  }
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
  const url = `${SITE_URL}${hiPath(uberJobPath(slug))}`;
  const others = allCityFacts(content, live, undefined, "hi").filter((c) => c.slug !== slug);
  const documents = hiDocuments();
  // The English page's source, so the lead reaches the CRM the same way; the form sends the language beside it.
  const source = `uber-job/${slug}`;

  return (
    <>
      <JsonLd
        blocks={[
          inHindi({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${name} में Uber ड्राइवर की नौकरी कैसे पाएँ`,
            author: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            mainEntityOfPage: url,
          }),
          inHindi(faqLd(items)),
          crumbsLd([HI_DRIVE_CRUMB, { name: `${name} में Uber ड्राइवर की नौकरी`, path: hiPath(uberJobPath(slug)) }]),
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={HI_DRIVE_CRUMB.path} label={HI_DRIVE_CRUMB.name} />}
        title={`${name} में Uber ड्राइवर की नौकरी`}
        intro={`${name} में Everest Fleet की गाड़ी से Uber चलाइए, बीमा और परमिट शामिल।`}
        facts={[...(facts.hubs.length ? [{ label: HI.hubs, value: String(facts.hubs.length) }] : [])]}
        phone={facts.phone}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <AnswerBox title={HI.inShort}>
        {name} में Uber ड्राइवर की नौकरी के लिए Uber फ़्लीट पार्टनर Everest Fleet के साथ गाड़ी चलाइए। यहाँ अप्लाई कीजिए, अपना {documents} लेकर {name} के किसी हब पर
        आइए, प्लान चुनिए और अपनी Everest Fleet गाड़ी में Uber Driver ऐप पर ऑनलाइन हो जाइए। पेमेंट हर हफ़्ते मिलती है।
      </AnswerBox>

      <GuideSection id="uberjob-steps" title={`${name} में शुरू करने के कदम`}>
        <ol>
          <li>इस पेज पर अप्लाई कीजिए{facts.phone ? `, या ${facts.phone.display} पर कॉल कीजिए` : ""}।</li>
          <li>अपने कागज़ लेकर किसी हब पर आइए{facts.hubs.length ? ` (${listNames(facts.hubs.map((h) => h.name), "या")})` : ""}।</li>
          <li>प्लान चुनिए और अपनी गाड़ी ले जाइए, बीमा और परमिट के साथ।</li>
          <li>Uber Driver ऐप में लॉग इन कीजिए और ट्रिप लेना शुरू कीजिए। पेमेंट हर हफ़्ते मिलती है।</li>
        </ol>
      </GuideSection>

      {facts.plans.length ? <PlanCards locale="hi" id="uberjob-plans" title={fill(dict.city.plansHeading, { city: name })} plans={facts.plans} /> : null}

      <FormBand
        id="uberjob-apply"
        title={`${name} में Uber पर गाड़ी चलाना शुरू कीजिए`}
        points={APPLY_POINTS_HI}
        form={<SearchForm locale="hi" content={content} source={source} placement="middle" defaultCity={slug} callHref={facts.phone?.href} />}
      />

      <GuideSection id="uberjob-docs" title="क्या चाहिए" shaded>
        <ul>
          {dict.documents.map((d) => (
            <li key={d}>{d}</li>
          ))}
          <li>लाइसेंस पर कमर्शियल बैज, अगर आपका शहर माँगता है</li>
        </ul>
      </GuideSection>

      <SeoFaq id="uberjob-faq" title={`${name} में Uber ड्राइवर की नौकरी: सवाल-जवाब`} items={items} />

      <RelatedLinks
        id="uberjob-more"
        title={HI.keepReading}
        links={[
          { href: hiCityPath(slug), label: `${name} में ड्राइवर की नौकरी`, note: "प्लान और कागज़ात" },
          { href: hiPath(vacancyPath(slug)), label: `${name} में ड्राइवर वैकेंसी`, note: "हब और गाड़ियाँ" },
          { href: hiPath(fleetPath(slug)), label: `${name} में Uber फ़्लीट`, note: HI.fleetInCity },
          { href: hiPath(contactPath(slug)), label: `ड्राइवर जॉब कॉन्टैक्ट नंबर, ${name}`, note: HI.numberAndHubs },
          ...others.slice(0, 2).map((o) => ({ href: hiPath(uberJobPath(o.slug)), label: `${o.name} में Uber ड्राइवर की नौकरी`, note: hubCount(o.hubs.length) })),
        ]}
      />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} defaultCity={slug} source={source} placement="bottom" callHref={facts.phone?.href} />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} callHref={facts.phone?.href} />
    </>
  );
}
