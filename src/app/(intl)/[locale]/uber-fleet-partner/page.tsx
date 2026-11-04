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
import { FLEET_ROOT, fleetPath } from "@/lib/search-pages";
import { allCityFacts, listNames } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, HI_DRIVE_CRUMB, hiAlternates, hiDocuments, hiFaq, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

const PATH = `${FLEET_ROOT}/`;

export function generateStaticParams() {
  return [{ locale: "hi" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isHindi(locale)) return {};
  return {
    title: "भारत में Uber फ़्लीट पार्टनर: गाड़ी के साथ Uber फ़्लीट से जुड़िए",
    description: `Everest Fleet ${COMPANY.cities} शहरों में Uber फ़्लीट पार्टनर है, जो ड्राइवरों को बीमा और परमिट वाली गाड़ी, हर हफ़्ते पेमेंट और गाड़ी अपनी करने के प्लान देता है।`,
    alternates: hiAlternates(PATH),
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isHindi(locale)) notFound();
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("hi");
  const cities = allCityFacts(content, live, undefined, "hi");
  const hubs = cities.reduce((s, c) => s + c.hubs.length, 0);
  const cityNames = listNames(cities.map((c) => c.name), "और");
  const source = "guide/uber-fleet-partner";

  const items: QA[] = [
    {
      q: "Uber फ़्लीट पार्टनर क्या होता है?",
      a: "ऐसी कंपनी जिसकी अपनी गाड़ियाँ होती हैं, जो उनका रजिस्ट्रेशन, बीमा और परमिट रखती है, और जिसकी गाड़ियाँ ड्राइवर Uber पर चलाते हैं। Uber इसे non-driving partner कहता है।",
    },
    {
      q: "क्या Everest Fleet एक Uber फ़्लीट पार्टनर है?",
      a: `हाँ। Everest Fleet ${cityNames} में Uber पर गाड़ियाँ चलाता है।`,
    },
    {
      q: "फ़्लीट पार्टनर के साथ गाड़ी चलाने के लिए क्या चाहिए?",
      a: `आपका ${hiDocuments()}। गाड़ी, उसका बीमा और परमिट Everest Fleet देता है।`,
    },
    ...hiFaq(),
  ];

  return (
    <>
      <JsonLd
        blocks={[
          inHindi(faqLd(items)),
          crumbsLd([HI_DRIVE_CRUMB, { name: "Uber फ़्लीट पार्टनर", path: hiPath(PATH) }]),
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Everest Fleet",
            url: SITE_URL,
            description: `${cityNames} में Uber फ़्लीट पार्टनर।`,
            areaServed: cities.map((c) => ({ "@type": "City", name: c.name })),
          },
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={HI_DRIVE_CRUMB.path} label={HI_DRIVE_CRUMB.name} />}
        title={`${cities.length} शहरों में Uber फ़्लीट पार्टनर`}
        intro="Everest Fleet की गाड़ी Uber पर चलाइए, बीमा और परमिट शामिल।"
        facts={[
          { label: HI.cities, value: String(cities.length) },
          ...(hubs ? [{ label: HI.hubs, value: String(hubs) }] : []),
        ]}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" />}
      />

      <AnswerBox title={HI.inShort}>
        Uber फ़्लीट पार्टनर के पास गाड़ियाँ और उनके कागज़ होते हैं; ड्राइवर उन्हें Uber पर चलाते हैं। Everest Fleet {cityNames} में फ़्लीट पार्टनर है{hubs ? `, जिसके ${hubCount(hubs)} हैं` : ""}। ड्राइवर अपने कागज़ लाते हैं, CNG या EV गाड़ी ले जाते हैं, और
        उन्हें हर हफ़्ते पेमेंट मिलती है।
      </AnswerBox>

      <GuideSection id="how" title="फ़्लीट पार्टनर के साथ गाड़ी चलाने का तरीका">
        <ol>
          <li>इस पेज पर अप्लाई कीजिए या कॉल कीजिए, Everest Fleet की टीम आपको वापस कॉल करेगी।</li>
          <li>अपने कागज़ लेकर Everest Fleet के हब पर आइए।</li>
          <li>प्लान चुनिए: गाड़ी चलाकर लौटा दीजिए, या अवधि पूरी होने पर उसे अपना बना लीजिए।</li>
          <li>गाड़ी ले जाइए और Uber पर चलाइए, हर हफ़्ते पेमेंट सीधे बैंक खाते में।</li>
        </ol>
        <p>
          प्लान: <Link href="/drive-to-earn/">Drive To Earn</Link> (वापस मिलने वाला डिपॉज़िट), <Link href="/drive-to-own/">Drive To Own</Link> (वापस मिलने वाला
          डिपॉज़िट, अवधि पूरी होने पर गाड़ी आपकी) और <Link href="/own-now/">Own Now</Link> (शुरुआती रकम, अवधि पूरी होने पर गाड़ी आपकी)।
        </p>
      </GuideSection>

      <FormBand id="partner-apply" title="Uber फ़्लीट पार्टनर के साथ गाड़ी चलाइए" points={APPLY_POINTS_HI} form={<SearchForm locale="hi" content={content} source={source} placement="middle" />} />

      <RelatedLinks
        id="partner-cities"
        title="शहर के हिसाब से Uber फ़्लीट"
        links={cities.map((c) => ({
          href: hiPath(fleetPath(c.slug)),
          label: `${c.name} में Uber फ़्लीट`,
          note: c.hubs.length ? hubCount(c.hubs.length) : undefined,
        }))}
      />

      <SeoFaq id="partner-faq" title="फ़्लीट पार्टनर: सवाल-जवाब" items={items} />

      <RelatedLinks
        id="partner-more"
        title={HI.keepReading}
        links={[
          { href: hiPath("/fleet-management-company/"), label: "फ़्लीट मैनेजमेंट कंपनी", note: HI.everestAcrossIndia },
          { href: hiPath("/uber-driver-requirements/"), label: HI.requirements, note: HI.docsAndLicence },
          { href: hiPath("/drive-for-uber-without-a-car/"), label: "बिना अपनी गाड़ी के Uber चलाइए", note: HI.carIncluded },
        ]}
      />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} />
    </>
  );
}
