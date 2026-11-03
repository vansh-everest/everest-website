import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, SectionHead, band, wrap } from "@/components/driver/driver-ui";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/home/ui";
import { AnswerBox, BackChip, FormBand, JsonLd, SearchForm, SearchHero, SeoFaq, crumbsLd, faqLd, type QA } from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { getLiveData } from "@/lib/fleet-data";
import { CONTACT_ROOT, contactPath } from "@/lib/search-pages";
import { allCityFacts, listNames } from "@/lib/seo-data";
import { APPLY_POINTS_HI, HI, HI_DRIVE_CRUMB, hiAlternates, hiFaq, hiHubHours, hiPath, hubCount, inHindi, isHindi } from "@/lib/seo-hi";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 3600;

const PATH = `${CONTACT_ROOT}/`;

export function generateStaticParams() {
  return [{ locale: "hi" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isHindi(locale)) return {};
  const content = await getContent();
  return {
    title: "ड्राइवर जॉब कॉन्टैक्ट नंबर: शहर के हिसाब से Everest Fleet के नंबर",
    description: `${listNames(content.cities.map((c) => c.name.hi), "और")} के लिए ड्राइवर जॉब कॉन्टैक्ट नंबर: गाड़ी के साथ Uber ड्राइवर की नौकरी के लिए Everest Fleet को कॉल कीजिए।`,
    alternates: hiAlternates(PATH),
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isHindi(locale)) notFound();
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("hi");
  const cities = allCityFacts(content, live, undefined, "hi");
  const source = "guide/contact";
  const rows = cities.map((c) => ({ ...c, call: c.phone ?? { href: PHONE_HREF, display: PHONE_DISPLAY } }));

  const items: QA[] = [
    {
      q: "ड्राइवर जॉब का कॉन्टैक्ट नंबर क्या है?",
      a: `हर शहर की अपनी हायरिंग लाइन है: ${rows.map((r) => `${r.name} ${r.call.display}`).join(", ")}।`,
    },
    {
      q: "Uber ड्राइवर जॉब का कॉन्टैक्ट नंबर क्या है?",
      a: "Everest Fleet की गाड़ी से Uber चलाने के लिए इस पेज पर अपने शहर की हायरिंग लाइन पर कॉल कीजिए, या फ़ॉर्म भरिए और टीम आपको कॉल करेगी।",
    },
    ...hiFaq(),
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
            contactPoint: rows.map((r) => ({ "@type": "ContactPoint", telephone: r.call.href.replace("tel:", ""), contactType: "driver recruitment", areaServed: r.name })),
          },
          inHindi(faqLd(items)),
          crumbsLd([{ name: "ड्राइवर जॉब कॉन्टैक्ट नंबर", path: hiPath(PATH) }]),
        ]}
      />
      <SearchHero
        locale="hi"
        chip={<BackChip href={HI_DRIVE_CRUMB.path} label={HI_DRIVE_CRUMB.name} />}
        title="ड्राइवर जॉब कॉन्टैक्ट नंबर"
        intro="गाड़ी के साथ Uber ड्राइवर की नौकरी के लिए अपने शहर की हायरिंग लाइन पर कॉल कीजिए।"
        facts={[{ label: HI.cities, value: String(rows.length) }]}
        form={<SearchForm locale="hi" content={content} source={source} placement="hero" />}
      />

      <AnswerBox title={HI.inShort}>
        Everest Fleet {rows.length} शहरों में ड्राइवरों की भर्ती करता है, हर शहर का अपना नंबर है। नीचे अपने शहर के नंबर पर कॉल कीजिए, फिर कागज़ लेकर हब पर आइए और Uber
        चलाने के लिए गाड़ी ले जाइए।
      </AnswerBox>

      <section aria-labelledby="contact-cities" className={band}>
        <div className={wrap}>
          <SectionHead id="contact-cities" title="शहर के हिसाब से नंबर" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {rows.map((r) => (
              <li key={r.slug} className="flex h-full flex-col rounded-2xl border border-line bg-white p-5">
                <Link href={hiPath(contactPath(r.slug))} className="group flex items-center justify-between gap-3 text-lg font-bold text-navy hover:text-brand">
                  {r.name}
                  <ArrowRight aria-hidden size={18} className="text-brand transition group-hover:translate-x-0.5" />
                </Link>
                <a href={r.call.href} className="mt-1 text-[22px] font-bold leading-8 text-brand">
                  {r.call.display}
                </a>
                <span className="mt-1 text-sm text-ink-soft">
                  {[r.hubs.length ? hubCount(r.hubs.length) : "", r.hubs.map(hiHubHours).find(Boolean) ?? ""].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FormBand id="contact-apply" title="या यहाँ एक मिनट में अप्लाई कीजिए" points={APPLY_POINTS_HI} form={<SearchForm locale="hi" content={content} source={source} placement="middle" />} />

      <SeoFaq id="contact-faq" title="ड्राइवर की नौकरी: सवाल-जवाब" items={items} />

      <ApplyBand locale="hi" dict={dict} cities={formCities(content, "hi")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} />
    </>
  );
}
