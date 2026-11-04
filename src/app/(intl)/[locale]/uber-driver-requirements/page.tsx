import type { Metadata } from "next";
import Link from "next/link";
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
  RelatedLinks,
  SearchForm,
  SearchHero,
  SeoFaq,
  crumbsLd,
  faqLd,
  type QA,
} from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { COMPANY, SITE_URL } from "@/lib/company";
import { getLiveData } from "@/lib/fleet-data";
import { allCityFacts, listNames, rentPath } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, HI_DRIVE_CRUMB, hiAlternates, hiCityPath, hiDocuments, hiFaq, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

const PATH = "/uber-driver-requirements/";
/** Uber's own page for the roles and documents below. */
const UBER_SOURCE = "https://www.uber.com/in/en/drive/requirements/";
const UPDATED = "2026-10-27";

export function generateStaticParams() {
  return [{ locale: "hi" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isHindi(locale)) return {};
  return {
    title: "भारत में Uber ड्राइवर की शर्तें 2026: कागज़ात, लाइसेंस, गाड़ी",
    description:
      "भारत में Uber ड्राइवर की शर्तें: ड्राइविंग लाइसेंस, अपनी गाड़ी के लिए RC, बीमा और कमर्शियल परमिट, या फ़्लीट पार्टनर के साथ बिना अपनी गाड़ी के Uber चलाने का तरीका।",
    alternates: hiAlternates(PATH),
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isHindi(locale)) notFound();
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("hi");
  const cities = allCityFacts(content, live, undefined, "hi");
  const source = "guide/uber-driver-requirements";
  const documents = hiDocuments();
  const cityNames = listNames(content.cities.map((c) => c.name.hi || c.name.en), "और");

  const items: QA[] = [
    {
      q: "भारत में Uber चलाने के लिए कौन-से कागज़ात चाहिए?",
      a: "एक वैध ड्राइविंग लाइसेंस। अपनी गाड़ी चलाते हैं तो उसका रजिस्ट्रेशन सर्टिफ़िकेट, बीमा और कमर्शियल परमिट भी। कुछ शहर कमर्शियल बैज वाला लाइसेंस, गाड़ी का फ़िटनेस सर्टिफ़िकेट और पुलिस वेरिफ़िकेशन माँगते हैं, इसलिए Uber पर अपने शहर का पेज देखिए।",
    },
    {
      q: "क्या अपनी गाड़ी के बिना Uber चला सकते हैं?",
      a: `हाँ। किसी फ़्लीट पार्टनर के साथ चलाइए, जो गाड़ी देता है। Everest Fleet के साथ आप अपना ${documents} लाते हैं; ${cityNames} में गाड़ी, बीमा और परमिट Everest Fleet का।`,
    },
    {
      q: "क्या Uber चलाने के लिए कमर्शियल लाइसेंस चाहिए?",
      a: "यह शहर पर निर्भर है। Uber की शर्तें हर शहर में अलग हैं, और कुछ शहर कमर्शियल बैज वाला लाइसेंस माँगते हैं। अप्लाई करने पर Everest Fleet की टीम आपका लाइसेंस देखती है और बताती है कि आपके शहर में क्या चाहिए।",
    },
    {
      q: "Uber फ़्लीट पार्टनर क्या होता है?",
      a: `Uber इन्हें non-driving partner कहता है: इनकी अपनी गाड़ियाँ होती हैं, ये रजिस्ट्रेशन, बीमा और परमिट रखते हैं, और ड्राइवर इनकी गाड़ियाँ Uber पर चलाते हैं। Everest Fleet ${COMPANY.cities} शहरों में फ़्लीट पार्टनर है।`,
    },
    ...hiFaq((q) => /paid|fuel/i.test(q)),
  ];

  return (
    <>
      <JsonLd
        blocks={[
          inHindi({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "भारत में Uber ड्राइवर की शर्तें: कागज़ात और लाइसेंस",
            dateModified: UPDATED,
            datePublished: UPDATED,
            author: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}${hiPath(PATH)}`,
          }),
          inHindi(faqLd(items)),
          crumbsLd([HI_DRIVE_CRUMB, { name: HI.requirements, path: hiPath(PATH) }]),
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={HI_DRIVE_CRUMB.path} label={HI_DRIVE_CRUMB.name} />}
        title="भारत में Uber ड्राइवर की शर्तें"
        intro="Uber जो कागज़ात माँगता है, और बिना अपनी गाड़ी के सबसे जल्दी शुरू करने का तरीका।"
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" />}
      />

      <AnswerBox title={HI.inShort}>
        भारत में Uber चलाने के लिए वैध ड्राइविंग लाइसेंस चाहिए। अपनी गाड़ी लाते हैं तो उसका रजिस्ट्रेशन सर्टिफ़िकेट, बीमा और कमर्शियल परमिट भी चाहिए, और कुछ
        शहर कमर्शियल बैज वाला लाइसेंस और पुलिस वेरिफ़िकेशन माँगते हैं। बिना अपनी गाड़ी के, Everest Fleet जैसे फ़्लीट पार्टनर के साथ चलाइए: अपना {documents}{" "}
        लाइए, गाड़ी, बीमा और परमिट Everest Fleet का।
      </AnswerBox>

      <GuideSection id="ways" title="Uber चलाने के तीन तरीके">
        <p>
          Uber तीन भूमिकाएँ बताता है, हर एक के अपने कागज़ात (
          <a href={UBER_SOURCE} target="_blank" rel="noopener noreferrer">
            Uber का शर्तों वाला पेज
          </a>
          ):
        </p>
        <ul>
          <li>
            <strong>अपनी गाड़ी वाला ड्राइवर।</strong> आपका ड्राइविंग लाइसेंस, साथ में गाड़ी का रजिस्ट्रेशन, बीमा और परमिट।
          </li>
          <li>
            <strong>फ़्लीट पार्टनर के साथ ड्राइवर।</strong> आपका ड्राइविंग लाइसेंस; गाड़ी के कागज़ पार्टनर के पास रहते हैं।
          </li>
          <li>
            <strong>फ़्लीट पार्टनर।</strong> गाड़ियों का मालिक, जो ड्राइवरों को संभालता है और हर गाड़ी का बीमा, रजिस्ट्रेशन और परमिट रखता है।
          </li>
        </ul>
        <p>शर्तें हर शहर में अलग हैं, इसलिए नीचे दिया लाइसेंस का टाइप और जाँच आपके शहर पर निर्भर है।</p>
      </GuideSection>

      <GuideSection id="documents" title="कागज़ात की लिस्ट" shaded>
        <p>
          <strong>आपके लिए</strong>
        </p>
        <ul>
          <li>ड्राइविंग लाइसेंस (कुछ शहरों में कमर्शियल बैज के साथ)</li>
          <li>आधार कार्ड और पैन कार्ड</li>
          <li>पते का प्रमाण और पेमेंट के लिए बैंक खाता</li>
          <li>पुलिस वेरिफ़िकेशन, जहाँ आपका शहर माँगे</li>
        </ul>
        <p>
          <strong>अपनी गाड़ी के लिए</strong> (सिर्फ़ अपनी गाड़ी चलाने पर)
        </p>
        <ul>
          <li>कमर्शियल इस्तेमाल का रजिस्ट्रेशन सर्टिफ़िकेट (RC)</li>
          <li>कमर्शियल बीमा</li>
          <li>शहर का परमिट, और जहाँ ज़रूरी हो वहाँ फ़िटनेस सर्टिफ़िकेट</li>
        </ul>
      </GuideSection>

      <GuideSection id="without-car" title="बिना अपनी गाड़ी के Uber चलाइए">
        <p>
          Everest Fleet {cityNames} में फ़्लीट पार्टनर है। आप अपना {documents} लाते हैं; Everest Fleet आपको बीमा और परमिट के साथ CNG या EV गाड़ी देता है,
          और हर हफ़्ते पेमेंट करता है।
        </p>
        <ol>
          <li>नीचे अप्लाई कीजिए या कॉल कीजिए, Everest Fleet की टीम आपको वापस कॉल करेगी।</li>
          <li>अपने कागज़ लेकर Everest Fleet के सबसे पास वाले हब पर आइए।</li>
          <li>प्लान चुनिए और अपनी गाड़ी ले जाइए।</li>
          <li>उसी हफ़्ते Uber पर गाड़ी चलाना शुरू कीजिए।</li>
        </ol>
        <p>
          Own Now और Drive To Own में अवधि पूरी होने पर गाड़ी आपकी हो जाती है। पूरी जानकारी:{" "}
          <Link href={hiPath("/drive-for-uber-without-a-car/")}>बिना अपनी गाड़ी के Uber चलाना</Link>।
        </p>
      </GuideSection>

      <FormBand id="req-apply" title="इसी हफ़्ते Uber चलाना शुरू कीजिए" points={APPLY_POINTS_HI} form={<SearchForm locale="hi" content={content} source={source} placement="middle" />} />

      <RelatedLinks
        id="by-city"
        title={HI.startInCity}
        links={cities.map((c) => ({
          href: hiCityPath(c.slug),
          label: `${c.name} में ड्राइवर की नौकरी`,
          note: c.hubs.length ? hubCount(c.hubs.length) : undefined,
        }))}
      />

      <SeoFaq id="req-faq" title="Uber की शर्तें: सवाल-जवाब" items={items} />

      <RelatedLinks
        id="req-more"
        title={HI.keepReading}
        links={[
          { href: hiPath("/uber-fleet-partner/"), label: "Uber फ़्लीट पार्टनर", note: "ड्राइवरों के लिए इसका मतलब" },
          { href: hiPath("/drive-for-uber-without-a-car/"), label: "बिना अपनी गाड़ी के Uber चलाइए", note: HI.carIncluded },
          { href: hiPath("/car-on-rent-for-uber/"), label: "Uber के लिए किराये पर कार", note: "शहर के हिसाब से गाड़ियाँ" },
          { href: hiPath("/ev-driver-jobs/"), label: "EV ड्राइवर की नौकरी", note: "Uber पर इलेक्ट्रिक गाड़ियाँ" },
          ...(cities[0] ? [{ href: hiPath(rentPath(cities[0].slug)), label: `${cities[0].name} में किराये पर कार` }] : []),
        ]}
      />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} />
    </>
  );
}
