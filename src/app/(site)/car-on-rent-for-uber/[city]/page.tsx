import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DocumentsAndHubs, formCities } from "@/components/driver/driver-pages";
import { DriverHero } from "@/components/driver/driver-hero";
import { StickyBar } from "@/components/driver/sticky-bar";
import { ApplyBand, HeroActions, HeroChip } from "@/components/driver/driver-ui";
import { AnswerBox, JsonLd, PriceTable, RelatedLinks, SeoFaq, crumbsLd, faqLd, type QA } from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { findCity } from "@/lib/content";
import { getLiveData } from "@/lib/fleet-data";
import { RENT_ROOT, cheapest, docName, inr, lead, listNames, rentCities, rentCity, rentPath, type RentCity } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

type Props = { params: Promise<{ city: string }> };

// Live prices: hourly, so a rate change in Jarvis reaches the page the same day.
export const revalidate = 3600;

export async function generateStaticParams() {
  const content = await getContent();
  return content.cities.map((c) => ({ city: c.slug }));
}

async function load(slug: string) {
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  return { content, live, city: findCity(content, slug), rent: rentCity(content, live, slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const { city, rent } = await load(slug);
  if (!city) return {};
  const name = city.name.en;
  const best = rent ? cheapest(rent.from) : null;
  return {
    title: `Car on Rent for Uber in ${name}: Today's Prices`,
    description: best
      ? `Cars for Uber drivers in ${name} from ${inr(best.rent!)} a day, with deposit, upfront and hub addresses from Everest Fleet's live rates. Insurance and permit included.`
      : `Cars for Uber drivers in ${name} from Everest Fleet, with insurance and permit included. Hub addresses and how to apply.`,
    alternates: { canonical: `${rentPath(slug)}/` },
  };
}

function answer(r: RentCity): string {
  const best = cheapest(r.from);
  const own = r.from.find((f) => f.planId === "drive-to-own" && f.deposit);
  const fuels = listNames(r.cars.map((c) => c.fuel), "or");
  const parts = [
    best ? `In ${r.name}, Everest Fleet rents Uber drivers a ${fuels} car from ${inr(best.rent!)} a day on ${best.name}` : `In ${r.name}, Everest Fleet gives Uber drivers a ${fuels} car`,
    own ? `, or one you own at the end of the term on Drive To Own with a ${inr(own.deposit!)} refundable deposit.` : ".",
    r.readyCars ? ` ${r.readyCars} cars are ready across ${r.hubs.length} hubs.` : r.hubs.length ? ` Collect it from ${r.hubs.length} hubs.` : "",
    " Insurance, permit and maintenance are included; you pay for fuel.",
  ];
  return parts.join("");
}

function faqs(r: RentCity | null, name: string): QA[] {
  const dict = getDictionary("en");
  const items: QA[] = [];
  if (r) {
    const best = cheapest(r.from);
    if (best) {
      items.push({
        q: `How much does a car on rent for Uber cost in ${name}?`,
        a: `From ${inr(best.rent!)} a day on ${best.name}. ${r.from.map((f) => `${f.name}: from ${lead(f)}`).join(". ")}. These are Everest Fleet's live rates for ${name}.`,
      });
    }
    items.push({ q: `Which cars can I rent for Uber in ${name}?`, a: `${listNames(r.cars.map((c) => c.name))}. Each comes with insurance and a permit to drive on Uber.` });
    const deposits = r.from.filter((f) => f.deposit || f.upfront);
    if (deposits.length) {
      items.push({
        q: `How much deposit do I need in ${name}?`,
        a: deposits.map((f) => (f.deposit ? `${f.name}: from ${inr(f.deposit)}, refundable` : `${f.name}: from ${inr(f.upfront!)} upfront`)).join(". ") + ".",
      });
    }
    if (r.hubs.length) {
      items.push({
        q: `Where do I collect the car in ${name}?`,
        a: `At an Everest Fleet hub: ${listNames(r.hubs.map((h) => h.name))}. Bring your ${listNames(dict.documents.map(docName))}.`,
      });
    }
  }
  return [...items, ...dict.faq];
}

export default async function Page({ params }: Props) {
  const { city: slug } = await params;
  const { content, live, city, rent } = await load(slug);
  if (!city) notFound();
  const dict = getDictionary("en");
  const name = city.name.en;
  const best = rent ? cheapest(rent.from) : null;
  const items = faqs(rent, name);
  const url = `${SITE_URL}${rentPath(slug)}/`;
  const others = rentCities(content, live).filter((c) => c.slug !== slug);

  const service = rent && best
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `Car on rent for Uber drivers in ${name}`,
        serviceType: "Car rental for ride-hailing drivers",
        url,
        areaServed: { "@type": "City", name },
        provider: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: best.rent,
          highPrice: Math.max(...rent.cars.flatMap((c) => c.plans.map((p) => p.rent ?? 0))),
          offerCount: rent.cars.length,
          description: "Daily rent per car",
        },
      }
    : null;

  return (
    <>
      <JsonLd
        blocks={[
          ...(service ? [service] : []),
          faqLd(items),
          crumbsLd([
            { name: "Car on rent for Uber", path: `${RENT_ROOT}/` },
            { name, path: `${rentPath(slug)}/` },
          ]),
        ]}
      />
      <DriverHero
        photo={city.heroImage}
        top={null}
        chip={
          <Link href={`${RENT_ROOT}/`} className="transition hover:opacity-85">
            <HeroChip>
              <ArrowLeft aria-hidden size={14} strokeWidth={2.25} />
              All Cities
            </HeroChip>
          </Link>
        }
        title={`Car On Rent For Uber In ${name}`}
        intro={`Drive on Uber in ${name} with an Everest Fleet car, insurance and permit included.`}
        figure={best ? { label: "From", value: `${inr(best.rent!)}/day` } : undefined}
        actions={<HeroActions cta={dict.cta} />}
      />

      {rent ? <AnswerBox title="In Short">{answer(rent)}</AnswerBox> : null}

      {rent ? (
        <PriceTable
          id="rent-prices"
          title={`Cars And Prices In ${name}`}
          sub="Daily rent, deposit and upfront by plan"
          cars={rent.cars}
          plans={rent.from}
        />
      ) : null}

      <DocumentsAndHubs city={city} locale="en" dict={dict} />

      <SeoFaq id="rent-faq" title={`Questions About Renting In ${name}`} items={items} />

      <RelatedLinks
        id="rent-more"
        title="Keep Reading"
        links={[
          { href: `${cityPath(slug)}/`, label: `Driver Jobs In ${name}`, note: "Car included" },
          { href: "/uber-driver-requirements/", label: "Uber Driver Requirements", note: "Documents and licence" },
          ...others.slice(0, 4).map((o) => {
            const b = cheapest(o.from);
            return { href: `${rentPath(o.slug)}/`, label: `Car On Rent In ${o.name}`, note: b ? `From ${inr(b.rent!)}/day` : undefined };
          }),
        ]}
      />

      <ApplyBand locale="en" dict={dict} cities={formCities(content, "en")} defaultCity={slug} source={`rent/${slug}`} />

      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
    </>
  );
}
