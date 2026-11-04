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
import { getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { getLiveData } from "@/lib/fleet-data";
import { allCityFacts, listNames, planRefs } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, HI_DRIVE_CRUMB, hiAlternates, hiCityPath, hiDocuments, hiFaq, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

const PATH = "/drive-for-uber-without-a-car/";

export function generateStaticParams() {
  return [{ locale: "hi" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isHindi(locale)) return {};
  return {
    title: "बिना अपनी गाड़ी के Uber: Everest Fleet से गाड़ी पाइए",
    description: "बिना अपनी गाड़ी के Uber चलाइए: Everest Fleet की CNG या EV गाड़ी, बीमा और परमिट के साथ, हर हफ़्ते पेमेंट और गाड़ी अपनी करने के प्लान।",
    alternates: hiAlternates(PATH),
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isHindi(locale)) notFound();
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("hi");
  const cities = allCityFacts(content, live, undefined, "hi");
  const cityNames = listNames(cities.map((c) => c.name), "और");
  const documents = hiDocuments();
  const source = "guide/drive-without-car";

  const items: QA[] = [
    { q: "क्या बिना गाड़ी के Uber चला सकते हैं?", a: `हाँ। Everest Fleet जैसे फ़्लीट पार्टनर के साथ चलाइए, जो ${cityNames} में आपको गाड़ी, उसका बीमा और परमिट देता है।` },
    { q: "कौन-से कागज़ात चाहिए?", a: `आपका ${documents}। कुछ शहर कमर्शियल बैज वाला लाइसेंस माँगते हैं।` },
    { q: "क्या गाड़ी खरीदनी पड़ती है?", a: "Drive To Earn में आप गाड़ी चलाते हैं और लौटा देते हैं। Drive To Own और Own Now में अवधि पूरी होने पर गाड़ी आपकी हो जाती है।" },
    { q: "कितनी जल्दी शुरू कर सकते हैं?", a: "हब पर कागज़ों की जाँच के बाद ज़्यादातर ड्राइवर अप्लाई करने के उसी हफ़्ते गाड़ी ले जाते हैं।" },
    ...hiFaq((q) => !/own car/i.test(q)),
  ];

  return (
    <>
      <JsonLd
        blocks={[
          inHindi({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "बिना अपनी गाड़ी के Uber चलाने का तरीका",
            author: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}${hiPath(PATH)}`,
          }),
          inHindi(faqLd(items)),
          crumbsLd([HI_DRIVE_CRUMB, { name: "बिना अपनी गाड़ी के Uber", path: hiPath(PATH) }]),
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={HI_DRIVE_CRUMB.path} label={HI_DRIVE_CRUMB.name} />}
        title="बिना अपनी गाड़ी के Uber चलाइए"
        intro="गाड़ी, बीमा और परमिट Everest Fleet का। आप अपना लाइसेंस लाइए।"
        facts={[{ label: HI.cities, value: String(cities.length) }]}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" />}
      />

      <AnswerBox title={HI.inShort}>
        किसी फ़्लीट पार्टनर के साथ आप बिना अपनी गाड़ी के Uber चला सकते हैं। Everest Fleet {cityNames} में आपको बीमा और परमिट के साथ CNG या EV गाड़ी देता है;
        आप अपना {documents} लाते हैं और हर हफ़्ते पेमेंट पाते हैं। Drive To Own या Own Now में अवधि पूरी होने पर गाड़ी आपकी हो जाती है।
      </AnswerBox>

      <GuideSection id="nocar-how" title="शुरू करने का तरीका">
        <ol>
          <li>इस पेज पर अप्लाई कीजिए या अपने शहर के नंबर पर कॉल कीजिए।</li>
          <li>अपने कागज़ लेकर Everest Fleet के हब पर आइए।</li>
          <li>प्लान चुनिए और अपनी गाड़ी ले जाइए।</li>
          <li>Uber ऐप में लॉग इन कीजिए और गाड़ी चलाना शुरू कीजिए, पेमेंट हर हफ़्ते।</li>
        </ol>
      </GuideSection>

      <PlanCards locale="hi" id="nocar-plans" title="अपना प्लान चुनिए" plans={planRefs(content, "hi")} />

      <FormBand id="nocar-apply" title="इसी हफ़्ते अपनी गाड़ी पाइए" points={APPLY_POINTS_HI} form={<SearchForm locale="hi" content={content} source={source} placement="middle" />} />

      <GuideSection id="nocar-docs" title="ज़रूरी कागज़ात" shaded>
        <ul>
          {dict.documents.map((d) => (
            <li key={d}>{d}</li>
          ))}
          <li>लाइसेंस पर कमर्शियल बैज, जहाँ आपका शहर माँगे</li>
        </ul>
      </GuideSection>

      <RelatedLinks
        id="nocar-cities"
        title={HI.startInCity}
        links={cities.map((c) => ({
          href: hiCityPath(c.slug),
          label: `${c.name} में ड्राइवर की नौकरी`,
          note: c.hubs.length ? hubCount(c.hubs.length) : undefined,
        }))}
      />

      <SeoFaq id="nocar-faq" title="बिना गाड़ी के Uber: सवाल-जवाब" items={items} />

      <RelatedLinks
        id="nocar-more"
        title={HI.keepReading}
        links={[
          { href: hiPath("/uber-driver-requirements/"), label: HI.requirements, note: HI.docsAndLicence },
          { href: hiPath("/uber-fleet-partner/"), label: "Uber फ़्लीट पार्टनर", note: "फ़्लीट के साथ ड्राइविंग का तरीका" },
          { href: hiPath("/driver-job-contact-number/"), label: "ड्राइवर जॉब कॉन्टैक्ट नंबर", note: "हर शहर का नंबर" },
        ]}
      />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} />
    </>
  );
}
