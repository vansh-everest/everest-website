import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { formCities } from "@/components/driver/driver-pages";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand } from "@/components/driver/driver-ui";
import {
  APPLY_POINTS,
  AnswerBox,
  BackChip,
  CarsTable,
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
import { citySegment, citySlugFrom, cityPath } from "@/lib/city-route";
import { findCity, type City, type Hub } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { contactPath, hubPath, hubSegment, hubSlugs, vacancyPath } from "@/lib/search-pages";
import { cityFacts, docName, hubHours, listNames } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

/**
 * One page per hub, under its city page: /drive-with-us/driver-job-in-mumbai/thane/. It answers
 * "driver job in <area>" and "near me" searches with the hub's own address, timings and cars, and
 * carries a JobPosting at that address, so Google's job search shows the hub for nearby searches.
 */

type Props = { params: Promise<{ slug: string; hub: string }> };

// Hubs come from the admin and cars from Jarvis: hourly, like the other search pages.
export const revalidate = 3600;

export async function generateStaticParams() {
  const content = await getContent();
  return content.cities.flatMap((c) => hubSlugs(c.hubs).map((hub) => ({ slug: citySegment(c.slug), hub })));
}

/** A hub's cars by fuel: an EV hub hands out EVs, a CNG hub CNG cars, a mixed hub both. */
function fuelFilter(hub: Hub): RegExp | undefined {
  const fuel = hub.fuel ?? "";
  if (/cng/i.test(fuel) && /ev/i.test(fuel)) return undefined;
  if (/ev/i.test(fuel)) return /ev|electric/i;
  if (/cng/i.test(fuel)) return /cng/i;
  return undefined;
}

async function load(segment: string, slug: string) {
  const citySlug = citySlugFrom(segment);
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const city = citySlug ? findCity(content, citySlug) : undefined;
  const hub = city ? city.hubs[hubSlugs(city.hubs).indexOf(slug)] : undefined;
  const facts = city && hub ? cityFacts(content, live, city.slug, fuelFilter(hub)) : null;
  return { content, city, hub, facts };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, hub: hubParam } = await params;
  const { city, hub } = await load(slug, hubParam);
  if (!city || !hub) return {};
  const fuel = hub.fuel ? `${hub.fuel} cars, ` : "";
  return {
    title: `Driver Job in ${hub.name}, ${city.name.en}: Everest Fleet Hub`,
    description: `Driver job in ${hub.name}, ${city.name.en}, with an Everest Fleet car: ${fuel}the hub's address and timings, documents and a form to apply.`,
    alternates: { canonical: `${hubPath(city, hub)}/` },
  };
}

function faqs(city: City, hub: Hub, cars: string[], phone: { display: string } | null): QA[] {
  const dict = getDictionary("en");
  const hours = hubHours(hub);
  const items: QA[] = [{ q: `Where is the Everest Fleet hub in ${hub.name}?`, a: `${hub.address}.${hours ? ` Open ${hours}.` : ""}` }];
  if (cars.length) items.push({ q: `Which cars does the ${hub.name} hub give out?`, a: `${listNames(cars)}, each with insurance and a permit for Uber.` });
  items.push({ q: "What do I bring to the hub?", a: `Your ${listNames(dict.documents.map(docName))}.` });
  items.push({
    q: `How do I get a driver job in ${hub.name}?`,
    a: `Apply on this page${phone ? ` or call ${phone.display}` : ""}. The ${city.name.en} team calls you back, checks your documents at the hub and hands over the car.`,
  });
  return items;
}

export default async function Page({ params }: Props) {
  const { slug, hub: hubParam } = await params;
  const { content, city, hub, facts } = await load(slug, hubParam);
  if (!city || !hub || !facts) notFound();

  const dict = getDictionary("en");
  const name = city.name.en;
  const segment = hubSegment(city, hub);
  const path = `${hubPath(city, hub)}/`;
  const url = `${SITE_URL}${path}`;
  const hours = hubHours(hub);
  const cars = facts.cars.map((c) => c.name);
  const items = faqs(city, hub, cars, facts.phone);
  const source = `hub/${city.slug}/${segment}`;
  const siblings = city.hubs.filter((h) => h !== hub);

  const now = new Date();
  const posted = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const validThrough = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0, 23, 59, 59));
  const pin = /\b\d{6}\b/.exec(hub.address)?.[0];
  const address = { "@type": "PostalAddress", streetAddress: hub.address, addressLocality: name, addressRegion: city.state, ...(pin ? { postalCode: pin } : {}), addressCountry: "IN" };

  return (
    <>
      <JsonLd
        blocks={[
          {
            // Renewed monthly like the city pages' posting, so it never reads as reposted daily.
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: `Cab Driver, ${hub.name}`,
            description: `<p>Drive on Uber with an Everest Fleet car from the ${hub.name} hub in ${name}.${cars.length ? ` Cars: ${listNames(cars)}.` : ""} Insurance and permit included, weekly payouts.</p><p><strong>Documents</strong>: ${dict.documents.join(", ")}</p>`,
            identifier: { "@type": "PropertyValue", name: "Everest Fleet", value: `driver-${city.slug}-${segment}` },
            datePosted: posted.toISOString().slice(0, 10),
            validThrough: validThrough.toISOString(),
            employmentType: ["FULL_TIME", "CONTRACTOR"],
            directApply: true,
            hiringOrganization: { "@type": "Organization", name: "Everest Fleet", sameAs: SITE_URL, logo: `${SITE_URL}/figma/logo.png` },
            jobLocation: { "@type": "Place", address },
            url,
          },
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: `Everest Fleet, ${hub.name} hub`,
            address,
            url,
            ...(facts.phone ? { telephone: facts.phone.display } : {}),
            ...(hub.mapUrl ? { hasMap: hub.mapUrl } : {}),
            parentOrganization: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
          },
          faqLd(items),
          crumbsLd([
            { name: "Drive with us", path: "/drive-with-us/" },
            { name, path: `${cityPath(city.slug)}/` },
            { name: hub.name, path },
          ]),
        ]}
      />
      <SearchHero
        chip={<BackChip href={`${cityPath(city.slug)}/`} label={`Driver Jobs In ${name}`} />}
        title={`Driver Job In ${hub.name}`}
        intro={`Collect an Everest Fleet car at the ${hub.name} hub in ${name} and drive on Uber, insurance and permit included.`}
        facts={[
          ...(hub.fuel ? [{ label: "Cars", value: hub.fuel }] : []),
          ...(hub.hours ? [{ label: "Hub Hours", value: hub.hours }] : []),
        ]}
        phone={facts.phone}
        form={<SearchForm content={content} source={source} placement="hero" defaultCity={city.slug} callHref={facts.phone?.href} />}
      />

      <AnswerBox title="In Short">
        The Everest Fleet hub in {hub.name} is at {hub.address}
        {hours ? `, open ${hours}` : ""}. Apply here, bring your documents to the hub and collect your car, usually within the week.
      </AnswerBox>

      <GuideSection id="hub-visit" title="Visit The Hub">
        <ul>
          <li className="flex items-start gap-2">
            <MapPin aria-hidden size={18} className="mt-1 shrink-0 text-brand" />
            <span>
              <strong>Address</strong>: {hub.address}
            </span>
          </li>
          {hours ? (
            <li className="flex items-start gap-2">
              <Clock aria-hidden size={18} className="mt-1 shrink-0 text-brand" />
              <span>
                <strong>Timings</strong>: {hours}
              </span>
            </li>
          ) : null}
          {facts.phone ? (
            <li className="flex items-start gap-2">
              <Phone aria-hidden size={18} className="mt-1 shrink-0 text-brand" />
              <span>
                <strong>Phone</strong>: <a href={facts.phone.href}>{facts.phone.display}</a>
              </span>
            </li>
          ) : null}
          {hub.mapUrl ? (
            <li className="flex items-start gap-2">
              <ArrowUpRight aria-hidden size={18} className="mt-1 shrink-0 text-brand" />
              <a href={hub.mapUrl} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </li>
          ) : null}
        </ul>
      </GuideSection>

      {facts.cars.length ? (
        <CarsTable id="hub-cars" title={`Cars At ${hub.name}`} sub="Each car and the plans it comes on" cars={facts.cars} plans={facts.plans} />
      ) : null}

      {facts.plans.length ? <PlanCards id="hub-plans" title={`Plans In ${name}`} plans={facts.plans} /> : null}

      <FormBand
        id="hub-apply"
        title={`Start Driving From ${hub.name}`}
        points={APPLY_POINTS}
        form={<SearchForm content={content} source={source} placement="middle" defaultCity={city.slug} callHref={facts.phone?.href} />}
      />

      <GuideSection id="hub-docs" title="What To Bring" shaded>
        <ul>
          {dict.documents.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </GuideSection>

      <SeoFaq id="hub-faq" title={`Questions About The ${hub.name} Hub`} items={items} />

      <RelatedLinks
        id="hub-more"
        title={`More In ${name}`}
        links={[
          ...siblings.map((h) => ({ href: `${hubPath(city, h)}/`, label: `Driver Job In ${h.name}`, note: h.fuel ? `${h.fuel} hub` : "Everest Fleet hub" })),
          { href: `${cityPath(city.slug)}/`, label: `Driver Jobs In ${name}`, note: "Every hub and plan" },
          { href: `${vacancyPath(city.slug)}/`, label: `Driver Vacancy In ${name}`, note: "Cars waiting for drivers" },
          { href: `${contactPath(city.slug)}/`, label: `Driver Job Contact Number, ${name}`, note: "Number and hubs" },
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} defaultCity={city.slug} source={source} placement="bottom" callHref={facts.phone?.href} />

      <StickyBar call={dict.cta.call} apply={dict.cta.apply} callHref={facts.phone?.href} />
    </>
  );
}
