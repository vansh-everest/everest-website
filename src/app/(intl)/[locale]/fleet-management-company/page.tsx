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
import { fleetPath } from "@/lib/search-pages";
import { allCityFacts, listNames } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, hiAlternates, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

const PATH = "/fleet-management-company/";

export function generateStaticParams() {
  return [{ locale: "hi" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isHindi(locale)) return {};
  return {
    title: `भारत में फ़्लीट मैनेजमेंट कंपनी: ${COMPANY.cities} शहरों में ${COMPANY.vehicles} गाड़ियाँ`,
    description: `Everest Fleet भारत की सबसे बड़ी फ़्लीट मैनेजमेंट कंपनी है: ${COMPANY.cities} शहरों में ${COMPANY.vehicles} CNG और इलेक्ट्रिक गाड़ियाँ, ${COMPANY.founded} से Uber पर, और ड्राइवरों और कंपनियों के लिए फ़्लीट सेवाएँ।`,
    alternates: hiAlternates(PATH),
  };
}

/** The business pages are in English only, so these link to them as they are. */
const SERVICES = [
  { href: "/employee-mobility/", label: "एम्प्लॉई मोबिलिटी", note: "टीमों के लिए ऑफ़िस ट्रांसपोर्ट" },
  { href: "/fleet-logistics/", label: "फ़्लीट लॉजिस्टिक्स", note: "डिलीवरी के लिए गाड़ियाँ" },
  { href: "/intercity/", label: "इंटरसिटी", note: "शहरों के बीच सफ़र" },
  { href: "/advertise-with-us/", label: "कैब पर विज्ञापन", note: "फ़्लीट पर ब्रांड" },
];

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isHindi(locale)) notFound();
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("hi");
  const cities = allCityFacts(content, live, undefined, "hi");
  const hubs = cities.reduce((s, c) => s + c.hubs.length, 0);
  const cityNames = listNames(cities.map((c) => c.name), "और");
  const source = "guide/fleet-management-company";

  const items: QA[] = [
    { q: "भारत की सबसे बड़ी फ़्लीट मैनेजमेंट कंपनी कौन-सी है?", a: `Everest Fleet, ${COMPANY.cities} शहरों में ${COMPANY.vehicles} गाड़ियों के साथ: ${cityNames}।` },
    {
      q: "फ़्लीट मैनेजमेंट कंपनी क्या करती है?",
      a: "यह गाड़ियों का फ़्लीट रखती या चलाती है और उनसे जुड़ा सारा काम संभालती है: रजिस्ट्रेशन, परमिट, बीमा, सर्विसिंग, ड्राइवर और पेमेंट।",
    },
    { q: "Everest Fleet किन शहरों में है?", a: `${cityNames}${hubs ? `, ${hubCount(hubs)} के साथ` : ""}।` },
    { q: "क्या Everest Fleet एक Uber फ़्लीट पार्टनर है?", a: `हाँ। Everest Fleet ${COMPANY.founded} से Uber India नेटवर्क पर गाड़ियाँ चला रहा है।` },
    { q: "Everest Fleet के साथ गाड़ी कैसे चलाएँ?", a: "इस पेज पर अप्लाई कीजिए या अपने शहर के नंबर पर कॉल कीजिए, फिर कागज़ लेकर हब पर आइए और गाड़ी ले जाइए।" },
    { q: "क्या Everest Fleet कंपनियों के साथ काम करता है?", a: "हाँ: एम्प्लॉई मोबिलिटी, फ़्लीट लॉजिस्टिक्स, इंटरसिटी सफ़र और इसकी कैब पर विज्ञापन।" },
  ];

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Everest Fleet",
            url: SITE_URL,
            logo: `${SITE_URL}/figma/logo.png`,
            foundingDate: String(COMPANY.founded),
            description: `भारत की सबसे बड़ी फ़्लीट मैनेजमेंट कंपनी: ${COMPANY.cities} शहरों में ${COMPANY.vehicles} गाड़ियाँ।`,
            areaServed: cities.map((c) => ({ "@type": "City", name: c.name })),
            email: COMPANY.email,
            telephone: COMPANY.phone.replace(/\s/g, ""),
          },
          inHindi(faqLd(items)),
          crumbsLd([{ name: "फ़्लीट मैनेजमेंट कंपनी", path: hiPath(PATH) }]),
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={hiPath("/")} label="Everest Fleet" />}
        title="भारत की सबसे बड़ी फ़्लीट मैनेजमेंट कंपनी"
        intro={`${COMPANY.cities} शहरों में ${COMPANY.vehicles} CNG और इलेक्ट्रिक गाड़ियाँ, ${COMPANY.founded} से Uber पर।`}
        facts={[
          { label: "गाड़ियाँ", value: COMPANY.vehicles },
          { label: HI.cities, value: String(COMPANY.cities) },
          ...(hubs ? [{ label: HI.hubs, value: String(hubs) }] : []),
        ]}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" />}
      />

      <AnswerBox title={HI.inShort}>
        Everest Fleet भारत की सबसे बड़ी फ़्लीट मैनेजमेंट कंपनी है। इसके पास {cityNames} में {COMPANY.vehicles} CNG और इलेक्ट्रिक गाड़ियाँ हैं, जो {COMPANY.founded}{" "}
        से Uber India नेटवर्क पर चल रही हैं, और यह उनके परमिट, बीमा, सर्विसिंग और ड्राइवर संभालता है। कंपनियाँ इस फ़्लीट को एम्प्लॉई मोबिलिटी, लॉजिस्टिक्स,
        इंटरसिटी सफ़र और कैब पर विज्ञापन के लिए इस्तेमाल करती हैं।
      </AnswerBox>

      <GuideSection id="fleet-what" title="Everest Fleet का काम">
        <ul>
          <li>
            <strong>गाड़ियाँ।</strong> हर गाड़ी का रजिस्ट्रेशन, कमर्शियल परमिट, बीमा और सर्विसिंग।
          </li>
          <li>
            <strong>ड्राइवर।</strong> भर्ती, शहर के हब पर ऑनबोर्डिंग और हर हफ़्ते पेमेंट।
          </li>
          <li>
            <strong>काम।</strong> Uber पर राइड, साथ में <Link href="/our-services/">कंपनियों के लिए सेवाएँ</Link>।
          </li>
          <li>
            <strong>मालिकाना हक।</strong> <Link href="/drive-to-own/">Drive To Own</Link> और <Link href="/own-now/">Own Now</Link> वाले ड्राइवर अवधि पूरी होने पर
            गाड़ी के मालिक बन जाते हैं।
          </li>
        </ul>
      </GuideSection>

      <RelatedLinks
        id="fleet-cities"
        title="शहर के हिसाब से फ़्लीट"
        links={cities.map((c) => ({
          href: hiPath(fleetPath(c.slug)),
          label: `${c.name} में Everest Fleet`,
          note: c.hubs.length ? hubCount(c.hubs.length) : undefined,
        }))}
      />

      <FormBand id="fleet-apply" title="भारत के सबसे बड़े फ़्लीट के साथ गाड़ी चलाइए" points={APPLY_POINTS_HI} form={<SearchForm locale="hi" content={content} source={source} placement="middle" />} />

      <RelatedLinks id="fleet-business" title="कंपनियों के लिए" links={SERVICES} />

      <SeoFaq id="fleet-faq" title="Everest Fleet: सवाल-जवाब" items={items} />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} />
    </>
  );
}
