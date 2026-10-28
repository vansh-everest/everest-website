import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, SectionHead, band, wrap } from "@/components/driver/driver-ui";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/home/ui";
import {
  APPLY_POINTS,
  AnswerBox,
  BackChip,
  FormBand,
  JsonLd,
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
import { CONTACT_ROOT, contactPath } from "@/lib/search-pages";
import { allCityFacts, hubHours } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

const PATH = `${CONTACT_ROOT}/`;

export const metadata: Metadata = {
  title: "Driver Job Contact Number: Everest Fleet Hiring Lines by City",
  description: "Driver job contact numbers for Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune, Kolkata and Chennai: call Everest Fleet for an Uber driver job with a car.",
  alternates: { canonical: PATH },
};

export default async function Page() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("en");
  const cities = allCityFacts(content, live);
  const source = "guide/contact";
  const rows = cities.map((c) => ({ ...c, call: c.phone ?? { href: PHONE_HREF, display: PHONE_DISPLAY } }));

  const items: QA[] = [
    {
      q: "What is the driver job contact number?",
      a: `Each city has its own hiring line: ${rows.map((r) => `${r.name} ${r.call.display}`).join(", ")}.`,
    },
    {
      q: "What is the Uber driver job contact number?",
      a: "To drive on Uber in an Everest Fleet car, call the hiring line for your city on this page, or apply with the form and the team calls you back.",
    },
    ...dict.faq,
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
          faqLd(items),
          crumbsLd([{ name: "Driver job contact numbers", path: PATH }]),
        ]}
      />
      <SearchHero
        chip={<BackChip href="/drive-with-us/" label={dict.hub.eyebrow} />}
        title="Driver Job Contact Number"
        intro="Call your city's hiring line for an Uber driver job with a car included."
        facts={[{ label: "Cities", value: String(rows.length) }]}
        form={<SearchForm content={content} source={source} placement="hero" />}
      />

      <AnswerBox title="In Short">
        Everest Fleet hires drivers in {rows.length} cities, each with its own number. Call your city below, then visit a hub
        with your documents and collect a car to drive on Uber.
      </AnswerBox>

      <section aria-labelledby="contact-cities" className={band}>
        <div className={wrap}>
          <SectionHead id="contact-cities" title="Numbers By City" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {rows.map((r) => (
              <li key={r.slug} className="flex h-full flex-col rounded-2xl border border-line bg-white p-5">
                <Link href={`${contactPath(r.slug)}/`} className="group flex items-center justify-between gap-3 text-lg font-bold text-navy hover:text-brand">
                  {r.name}
                  <ArrowRight aria-hidden size={18} className="text-brand transition group-hover:translate-x-0.5" />
                </Link>
                <a href={r.call.href} className="mt-1 text-[22px] font-bold leading-8 text-brand">
                  {r.call.display}
                </a>
                <span className="mt-1 text-sm text-ink-soft">
                  {[r.hubs.length ? `${r.hubs.length} hubs` : "", r.hubs.map(hubHours).find(Boolean) ?? ""].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FormBand id="contact-apply" title="Or Apply Here In A Minute" points={APPLY_POINTS} form={<SearchForm content={content} source={source} placement="middle" />} />

      <SeoFaq id="contact-faq" title="Questions About Driver Jobs" items={items} />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source={source} placement="bottom" />

      <StickyBar call={dict.cta.call} />
    </>
  );
}
