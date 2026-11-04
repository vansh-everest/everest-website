import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand } from "@/components/driver/driver-ui";
import { AnswerBox, BackChip, FormBand, JsonLd, RelatedLinks, SearchForm, SearchHero, SeoFaq, crumbsLd, faqLd, type QA } from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { getLiveData } from "@/lib/fleet-data";
import { RENT_ROOT, allCityFacts, listNames, rentPath } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, HI_DRIVE_CRUMB, hiAlternates, hiFaq, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ locale: "hi" }];
}

async function load() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, cities: allCityFacts(content, live, undefined, "hi") };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isHindi(locale)) return {};
  const { cities } = await load();
  return {
    title: "Uber ड्राइवरों के लिए किराये पर कार: हर शहर में गाड़ियाँ और हब",
    description: `${listNames(cities.map((c) => c.name), "और")} में Uber ड्राइवरों के लिए किराये पर CNG और EV कार, बीमा और परमिट के साथ, हर हफ़्ते पेमेंट, एक मिनट में अप्लाई।`,
    alternates: hiAlternates(`${RENT_ROOT}/`),
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isHindi(locale)) notFound();
  const { content, cities } = await load();
  const dict = getDictionary("hi");
  const hubs = cities.reduce((s, c) => s + c.hubs.length, 0);
  const cars = listNames(cities.flatMap((c) => c.cars.map((x) => x.name)), "और");
  const cityNames = listNames(cities.map((c) => c.name), "और");
  const source = "rent/all";

  const items: QA[] = [
    ...(cars ? [{ q: "Uber के लिए किराये पर कौन-सी गाड़ियाँ मिलती हैं?", a: `${cars}। हर गाड़ी के साथ बीमा और Uber पर चलाने का परमिट मिलता है।` }] : []),
    { q: "Uber के लिए किराये पर कार किन शहरों में मिलती है?", a: `${cityNames}।` },
    ...hiFaq(),
  ];

  return (
    <>
      <JsonLd
        blocks={[
          inHindi(faqLd(items)),
          crumbsLd([{ name: "Uber के लिए किराये पर कार", path: hiPath(`${RENT_ROOT}/`) }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: cities.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `${c.name} में Uber के लिए किराये पर कार`, url: `${SITE_URL}${hiPath(rentPath(c.slug))}` })),
          },
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={HI_DRIVE_CRUMB.path} label={HI_DRIVE_CRUMB.name} />}
        title="Uber ड्राइवरों के लिए किराये पर कार"
        intro={`${cities.length} शहरों में Uber चलाने के लिए गाड़ी पाइए, बीमा और परमिट शामिल।`}
        facts={[
          { label: HI.cities, value: String(cities.length) },
          ...(hubs ? [{ label: HI.hubs, value: String(hubs) }] : []),
        ]}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" />}
      />

      <AnswerBox title={HI.inShort}>
        Everest Fleet {cityNames} में Uber ड्राइवरों को CNG और EV गाड़ियाँ देता है। बीमा, परमिट और मेंटेनेंस शामिल है, ईंधन का खर्च आपका। Drive To Own या Own
        Now में अवधि पूरी होने पर गाड़ी आपकी हो जाती है।
      </AnswerBox>

      <RelatedLinks
        id="rent-cities"
        title={HI.pickCity}
        links={cities.map((c) => ({
          href: hiPath(rentPath(c.slug)),
          label: `${c.name} में किराये पर कार`,
          note: [c.cars.length ? `${c.cars.length} ${HI.models}` : "", c.hubs.length ? hubCount(c.hubs.length) : ""].filter(Boolean).join(" · ") || undefined,
        }))}
      />

      <FormBand id="rent-apply" title="इसी हफ़्ते अपनी गाड़ी पाइए" points={APPLY_POINTS_HI} form={<SearchForm locale="hi" content={content} source={source} placement="middle" />} />

      <SeoFaq id="rent-faq" title="Uber के लिए किराये पर कार: सवाल-जवाब" items={items} />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} />
    </>
  );
}
