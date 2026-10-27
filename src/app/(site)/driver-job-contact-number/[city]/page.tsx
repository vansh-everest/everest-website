import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { DocumentsAndHubs, formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, SectionHead, band, wrap } from "@/components/driver/driver-ui";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import {
  APPLY_POINTS,
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
import { SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { findCity } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { CONTACT_ROOT, contactPath, fleetPath, rentPath } from "@/lib/search-pages";
import { cityFacts, docName, hubHours, listNames, type CityFacts } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ city: string }> };

export const revalidate = 3600;

/** WhatsApp's number as people read it: "91262 14248". */
const WHATSAPP_DISPLAY = (() => {
  const local = WHATSAPP_HREF.replace(/\D/g, "").replace(/^91/, "");
  return `${local.slice(0, 5)} ${local.slice(5)}`;
})();

export async function generateStaticParams() {
  const content = await getContent();
  return content.cities.map((c) => ({ city: c.slug }));
}

async function load(slug: string) {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, city: findCity(content, slug), facts: cityFacts(content, live, slug) };
}

const callOf = (f: CityFacts) => f.phone ?? { href: PHONE_HREF, display: PHONE_DISPLAY };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const { facts } = await load(slug);
  if (!facts) return {};
  const call = callOf(facts);
  return {
    title: `${facts.name} Driver Job Contact Number: ${call.display}`,
    description: `Driver job in ${facts.name} with a car included: call Everest Fleet on ${call.display} or WhatsApp ${WHATSAPP_DISPLAY}. Hub addresses, timings and documents to bring.`,
    alternates: { canonical: `${contactPath(slug)}/` },
  };
}

function faqs(f: CityFacts): QA[] {
  const dict = getDictionary("en");
  const call = callOf(f);
  const hours = f.hubs.map(hubHours).find(Boolean);
  return [
    { q: `What is the driver job contact number in ${f.name}?`, a: `Call Everest Fleet's ${f.name} hiring line on ${call.display}, or WhatsApp ${WHATSAPP_DISPLAY}.` },
    { q: "Can I apply on WhatsApp?", a: `Yes. Message ${WHATSAPP_DISPLAY} with your name and city, or fill the form on this page and the team calls you back.` },
    ...(hours ? [{ q: `What are the hub timings in ${f.name}?`, a: `${hours}. Each hub's timings are listed on this page.` }] : []),
    { q: "What should I bring to the hub?", a: `Your ${listNames(dict.documents.map(docName))}.` },
    { q: "Is this an Uber driver job?", a: `Yes. You drive an Everest Fleet car on Uber in ${f.name}, with insurance and permit included and weekly payouts.` },
    ...dict.faq,
  ];
}

const card = "flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition hover:border-brand lg:p-6";
const cardLabel = "text-xs font-semibold uppercase tracking-[0.8px] text-ink-soft";
const cardValue = "mt-1 text-[22px] font-bold leading-8 text-navy";

export default async function Page({ params }: Props) {
  const { city: slug } = await params;
  const { content, city, facts } = await load(slug);
  if (!city || !facts) notFound();
  const dict = getDictionary("en");
  const name = facts.name;
  const call = callOf(facts);
  const items = faqs(facts);
  const source = `guide/contact/${slug}`;
  const firstHub = facts.hubs[0];

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Everest Fleet",
            url: SITE_URL,
            contactPoint: [
              { "@type": "ContactPoint", telephone: call.href.replace("tel:", ""), contactType: "driver recruitment", areaServed: name, availableLanguage: ["English", "Hindi"] },
            ],
            ...(facts.hubs.length
              ? { location: facts.hubs.map((h) => ({ "@type": "Place", name: `Everest Fleet ${h.name}`, address: { "@type": "PostalAddress", streetAddress: h.address, addressLocality: name, addressRegion: facts.state, addressCountry: "IN" } })) }
              : {}),
          },
          faqLd(items),
          crumbsLd([
            { name: "Driver job contact numbers", path: `${CONTACT_ROOT}/` },
            { name, path: `${contactPath(slug)}/` },
          ]),
        ]}
      />
      <SearchHero
        chip={<BackChip href={`${CONTACT_ROOT}/`} label="All Cities" />}
        title={`Driver Job Contact Number In ${name}`}
        intro={`Call, WhatsApp or visit a hub to start driving on Uber in ${name}, car included.`}
        facts={[{ label: "Call", value: call.display }, ...(facts.hubs.length ? [{ label: "Hubs", value: String(facts.hubs.length) }] : [])]}
        phone={call}
        form={<SearchForm content={content} source={source} placement="hero" defaultCity={slug} callHref={call.href} />}
      />

      <AnswerBox title="In Short">
        Everest Fleet&apos;s driver hiring number in {name} is <strong>{call.display}</strong>, and WhatsApp is <strong>{WHATSAPP_DISPLAY}</strong>.
        {firstHub ? ` To apply in person, visit ${listNames(facts.hubs.map((h) => h.name))}${hubHours(firstHub) ? ` (${hubHours(firstHub)})` : ""}.` : ""} The
        job comes with a car, insurance and permit, and payouts every week.
      </AnswerBox>

      <section aria-labelledby="contact-ways" className={band}>
        <div className={wrap}>
          <SectionHead id="contact-ways" title={`Reach Everest Fleet In ${name}`} />
          <ul className="mt-8 grid gap-3 sm:grid-cols-3 lg:mt-10 lg:gap-5">
            <li>
              <a href={call.href} className={card}>
                <Phone aria-hidden size={22} className="text-brand" />
                <span className={`mt-3 ${cardLabel}`}>Call</span>
                <span className={cardValue}>{call.display}</span>
              </a>
            </li>
            <li>
              <a href={WHATSAPP_HREF} className={card}>
                <WhatsappLogo aria-hidden size={24} weight="fill" className="text-whatsapp" />
                <span className={`mt-3 ${cardLabel}`}>WhatsApp</span>
                <span className={cardValue}>{WHATSAPP_DISPLAY}</span>
              </a>
            </li>
            <li>
              <a href={firstHub?.mapUrl || "#city-documents"} {...(firstHub?.mapUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={card}>
                <MapPin aria-hidden size={22} className="text-brand" />
                <span className={`mt-3 ${cardLabel}`}>Visit</span>
                <span className={cardValue}>{firstHub ? firstHub.name : `${facts.hubs.length} hubs`}</span>
                {firstHub && hubHours(firstHub) ? <span className="mt-1 text-sm text-ink-soft">{hubHours(firstHub)}</span> : null}
              </a>
            </li>
          </ul>
        </div>
      </section>

      <FormBand id="contact-apply" title="Or Apply Here In A Minute" points={APPLY_POINTS} form={<SearchForm content={content} source={source} placement="middle" defaultCity={slug} callHref={call.href} />} />

      <DocumentsAndHubs city={city} locale="en" dict={dict} />

      <GuideSection id="contact-next" title="What Happens After You Call">
        <ol>
          <li>The {name} team takes your name and checks your licence type.</li>
          <li>You visit a hub with your documents.</li>
          <li>You pick a plan and collect a CNG or EV car.</li>
          <li>You start driving on Uber, with payouts every week.</li>
        </ol>
      </GuideSection>

      <SeoFaq id="contact-faq" title={`Questions About Driver Jobs In ${name}`} items={items} />

      <RelatedLinks
        id="contact-more"
        title="Keep Reading"
        links={[
          { href: `${cityPath(slug)}/`, label: `Driver Jobs In ${name}`, note: "Plans and documents" },
          { href: `${rentPath(slug)}/`, label: `Car On Rent In ${name}`, note: "Cars and plans" },
          { href: `${fleetPath(slug)}/`, label: `Uber Fleet In ${name}`, note: "Everest Fleet in the city" },
          ...content.cities
            .filter((c) => c.slug !== slug)
            .slice(0, 3)
            .map((c) => ({ href: `${contactPath(c.slug)}/`, label: `Contact Number, ${c.name.en}` })),
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} defaultCity={slug} source={source} placement="bottom" callHref={call.href} />

      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} callHref={call.href} />
    </>
  );
}
