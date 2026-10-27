import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formCities } from "@/components/driver/driver-pages";
import { DriverHero } from "@/components/driver/driver-hero";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, HeroActions, HeroChip } from "@/components/driver/driver-ui";
import { AnswerBox, GuideSection, JsonLd, RelatedLinks, SeoFaq, crumbsLd, faqLd, type QA } from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { getLiveData } from "@/lib/fleet-data";
import { cheapest, inr, listNames, rentCities, rentPath, docName } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

const PATH = "/uber-driver-requirements/";
/** Uber's own page for the roles and documents below. */
const UBER_SOURCE = "https://www.uber.com/in/en/drive/requirements/";
const UPDATED = "2026-10-27";

export const metadata: Metadata = {
  title: "Uber Driver Requirements in India (2026): Documents and Licence",
  description:
    "Uber driver requirements in India: driving licence, plus RC, insurance and commercial permit for your own car, or drive under a fleet partner with no car of your own.",
  alternates: { canonical: PATH },
};

export default async function Page() {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("en");
  const cities = rentCities(content, live);
  const lows = cities.flatMap((c) => (cheapest(c.from)?.rent ? [cheapest(c.from)!.rent!] : []));
  const low = lows.length ? Math.min(...lows) : null;
  const documents = listNames(dict.documents.map(docName));
  const cityNames = listNames(content.cities.map((c) => c.name.en));

  const items: QA[] = [
    {
      q: "What documents do I need to drive for Uber in India?",
      a: "A valid driving licence. If you drive your own car, also its registration certificate, insurance and a commercial permit. Some cities ask for a licence with a commercial badge, a fitness certificate for the car and police verification, so check your city's page on Uber.",
    },
    {
      q: "Can I drive for Uber without my own car?",
      a: `Yes. Drive under a fleet partner, who provides the car. With Everest Fleet you bring your ${documents}; the car, insurance and permit are ours, in ${cityNames}.`,
    },
    {
      q: "Do I need a commercial licence to drive for Uber?",
      a: "It depends on the city. Uber's requirements vary by city, and some ask for a licence with a commercial badge. Everest Fleet's team checks your licence when you apply and tells you what your city needs.",
    },
    {
      q: "What is an Uber fleet partner?",
      a: "Uber calls them non-driving partners: they own cars, keep the registration, insurance and permit, and drivers drive them on Uber. Everest Fleet is a fleet partner in 7 cities.",
    },
    ...(low ? [{ q: "How much does it cost to start driving on Uber without a car?", a: `With Everest Fleet, cars start from ${inr(low)} a day. Rates, deposits and upfront amounts differ by city and plan, and every city page lists them.` }] : []),
    ...dict.faq.filter((f) => /paid|fuel/i.test(f.q)),
  ];

  return (
    <>
      <JsonLd
        blocks={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Uber Driver Requirements in India: Documents and Licence",
            dateModified: UPDATED,
            datePublished: UPDATED,
            author: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}${PATH}`,
          },
          faqLd(items),
          crumbsLd([
            { name: "Drive with us", path: "/drive-with-us/" },
            { name: "Uber driver requirements", path: PATH },
          ]),
        ]}
      />
      <DriverHero
        photo={content.cities[0]?.heroImage}
        top={null}
        chip={
          <Link href="/drive-with-us/" className="transition hover:opacity-85">
            <HeroChip>
              <ArrowLeft aria-hidden size={14} strokeWidth={2.25} />
              {dict.hub.eyebrow}
            </HeroChip>
          </Link>
        }
        title="Uber Driver Requirements In India"
        intro="The documents Uber asks for, and the fastest way to start without a car."
        actions={<HeroActions cta={dict.cta} />}
      />

      <AnswerBox title="In Short">
        To drive on Uber in India you need a valid driving licence. If you bring your own car, you also need its registration certificate, insurance and a
        commercial permit, and some cities ask for a licence with a commercial badge and police verification. Without a car, drive under a fleet partner such
        as Everest Fleet: bring your {documents}, and the car, insurance and permit are ours.
      </AnswerBox>

      <GuideSection id="ways" title="Three Ways To Drive On Uber">
        <p>
          Uber lists three roles, each with its own documents (
          <a href={UBER_SOURCE} target="_blank" rel="noopener noreferrer">
            Uber&apos;s requirements page
          </a>
          ):
        </p>
        <ul>
          <li>
            <strong>Driver with your own car.</strong> Your driving licence, plus the car&apos;s registration, insurance and permit.
          </li>
          <li>
            <strong>Driver under a fleet partner.</strong> Your driving licence, with the car&apos;s papers held by the partner.
          </li>
          <li>
            <strong>Fleet partner.</strong> Owns cars and manages drivers, with each car&apos;s insurance, registration and permit.
          </li>
        </ul>
        <p>Requirements vary by city, so the licence type and checks below depend on where you drive.</p>
      </GuideSection>

      <GuideSection id="documents" title="Documents Checklist" shaded>
        <p>
          <strong>For you</strong>
        </p>
        <ul>
          <li>Driving licence (a commercial badge in some cities)</li>
          <li>Aadhaar card and PAN card</li>
          <li>Proof of address and a bank account for payouts</li>
          <li>Police verification, where your city asks for it</li>
        </ul>
        <p>
          <strong>For your own car</strong> (not needed with a fleet partner)
        </p>
        <ul>
          <li>Registration certificate (RC) for commercial use</li>
          <li>Commercial insurance</li>
          <li>Permit for the city, and a fitness certificate where required</li>
        </ul>
      </GuideSection>

      <GuideSection id="without-car" title="Drive On Uber Without A Car">
        <p>
          Everest Fleet is a fleet partner in {cityNames}. You bring your {documents}; we give you a CNG or EV car with its insurance and permit, and pay you every
          week.
        </p>
        <ol>
          <li>Apply below or call us, and we call you back.</li>
          <li>Visit your nearest Everest Fleet hub with your documents.</li>
          <li>Pick a plan and collect your car.</li>
          <li>Start driving on Uber the same week.</li>
        </ol>
        {low ? (
          <p>
            Cars start from <strong>{inr(low)} a day</strong>. On Own Now and Drive To Own the car becomes yours at the end of the term. See{" "}
            <Link href="/car-on-rent-for-uber/">car on rent prices in every city</Link>.
          </p>
        ) : null}
      </GuideSection>

      <RelatedLinks
        id="by-city"
        title="Start In Your City"
        links={cities.map((c) => {
          const b = cheapest(c.from);
          return { href: `${cityPath(c.slug)}/`, label: `Driver Jobs In ${c.name}`, note: [b?.rent ? `Cars from ${inr(b.rent)}/day` : "", `${c.hubs.length} hubs`].filter(Boolean).join(" · ") };
        })}
      />

      <SeoFaq id="req-faq" title="Questions About Uber Requirements" items={items} />

      <RelatedLinks
        id="req-more"
        title="Keep Reading"
        links={[
          { href: "/uber-fleet-partner/", label: "Uber Fleet Partner", note: "What it means for drivers" },
          { href: "/car-on-rent-for-uber/", label: "Car On Rent For Uber", note: "Prices by city" },
          { href: "/ev-driver-jobs/", label: "EV Driver Jobs", note: "Electric cars on Uber" },
          ...(cities[0] ? [{ href: `${rentPath(cities[0].slug)}/`, label: `Car On Rent In ${cities[0].name}` }] : []),
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} source="guide/uber-driver-requirements" />

      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
    </>
  );
}
