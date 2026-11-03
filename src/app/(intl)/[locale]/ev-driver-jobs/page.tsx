import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand } from "@/components/driver/driver-ui";
import { AnswerBox, BackChip, CarsTable, FormBand, JsonLd, RelatedLinks, SearchForm, SearchHero, SeoFaq, crumbsLd, faqLd, type QA } from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { getLiveData } from "@/lib/fleet-data";
import { allCityFacts, listNames, type CityCar, type PlanRef } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, HI_DRIVE_CRUMB, hiAlternates, hiCityPath, hiFaq, hiPath, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

const PATH = "/ev-driver-jobs/";
const EV = /\bev\b|electric/i;

export function generateStaticParams() {
  return [{ locale: "hi" }];
}

async function load() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, cities: allCityFacts(content, live, EV, "hi") };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isHindi(locale)) return {};
  const { cities } = await load();
  const names = listNames(cities.map((c) => c.name), "और");
  return {
    title: "EV ड्राइवर जॉब: Uber पर इलेक्ट्रिक गाड़ी ड्राइवर की नौकरी",
    description: `Everest Fleet के साथ ${names || "भारत के शहरों"} में EV ड्राइवर की नौकरी: बीमा और परमिट वाली इलेक्ट्रिक गाड़ी, हर हफ़्ते पेमेंट, एक मिनट में अप्लाई।`,
    alternates: hiAlternates(PATH),
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isHindi(locale)) notFound();
  const { content, cities } = await load();
  const dict = getDictionary("hi");
  const names = listNames(cities.map((c) => c.name), "और");
  const models = listNames(cities.flatMap((c) => c.cars.map((x) => x.name)), "और");
  const hubs = cities.reduce((s, c) => s + c.hubs.length, 0);
  const source = "guide/ev-driver-jobs";

  // One table: each city's EV, with the city in the car column.
  const rows: CityCar[] = cities.flatMap((c) => c.cars.map((car) => ({ ...car, name: `${car.name}, ${c.name}` })));
  const plans: PlanRef[] = [...new Map(rows.flatMap((r) => r.plans).map((p) => [p.planId, p])).values()];

  const items: QA[] = [
    ...(cities.length ? [{ q: "EV ड्राइवर की नौकरी कहाँ मिलती है?", a: `${names} में, Everest Fleet की इलेक्ट्रिक ${models} के साथ।` }] : []),
    { q: "चार्जिंग का खर्च कौन उठाता है?", a: "चार्जिंग का खर्च ड्राइवर का होता है, जैसे CNG गाड़ी में ईंधन का; बीमा और मेंटेनेंस कवर है।" },
    ...hiFaq((q) => !/fuel/i.test(q)),
  ];

  return (
    <>
      <JsonLd blocks={[inHindi(faqLd(items)), crumbsLd([HI_DRIVE_CRUMB, { name: "EV ड्राइवर की नौकरी", path: hiPath(PATH) }])]} />
      <SearchHero
        locale="hi"
        chip={<BackChip href={HI_DRIVE_CRUMB.path} label={HI_DRIVE_CRUMB.name} />}
        title="Uber पर EV ड्राइवर की नौकरी"
        intro={cities.length ? `${names} में Uber पर इलेक्ट्रिक गाड़ी चलाइए।` : "Everest Fleet के साथ Uber पर इलेक्ट्रिक गाड़ी चलाइए।"}
        facts={[
          ...(cities.length ? [{ label: "EV शहर", value: String(cities.length) }] : []),
          ...(hubs ? [{ label: "EV हब", value: String(hubs) }] : []),
        ]}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" />}
      />

      {cities.length ? (
        <AnswerBox title={HI.inShort}>
          Everest Fleet के पास {names} में Uber पर EV ड्राइवर की नौकरियाँ हैं, इलेक्ट्रिक {models} के साथ। बीमा, परमिट और मेंटेनेंस शामिल है, चार्जिंग का खर्च
          आपका, और पेमेंट हर हफ़्ते मिलती है।
        </AnswerBox>
      ) : null}

      {rows.length ? <CarsTable id="ev-cars" title="शहर के हिसाब से इलेक्ट्रिक गाड़ियाँ" sub={HI.eachCar} carLabel={HI.car} cars={rows} plans={plans} /> : null}

      <FormBand id="ev-apply" title="Uber पर EV चलाइए" points={APPLY_POINTS_HI} form={<SearchForm locale="hi" content={content} source={source} placement="middle" />} />

      <SeoFaq id="ev-faq" title="EV ड्राइवर की नौकरी: सवाल-जवाब" items={items} />

      <RelatedLinks
        id="ev-cities"
        title="शहर के हिसाब से EV नौकरियाँ"
        links={[
          ...cities.map((c) => ({ href: hiCityPath(c.slug), label: `${c.name} में ड्राइवर की नौकरी`, note: `${listNames(c.cars.map((x) => x.name), "और")} · ${c.hubs.length} EV हब` })),
          { href: hiPath("/uber-driver-requirements/"), label: HI.requirements, note: HI.docsAndLicence },
        ]}
      />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} />
    </>
  );
}
