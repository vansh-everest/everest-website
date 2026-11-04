import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StickyBar } from "@/components/driver/sticky-bar";
import { BackChip, SearchForm, SearchHero } from "@/components/seo/seo-ui";
import { getDictionary } from "@/content/dictionary";
import { getLiveData } from "@/lib/fleet-data";
import { allCityFacts, readyTotal } from "@/lib/seo-data";
import { getContent } from "@/lib/store";

/**
 * The page behind each social profile's link: the form the profile used to send people to, on the
 * site. Its form names the social, and Unify puts each social's leads on that social's CRM channel
 * (lib/crm/rules.ts there), so a lead stays attributed with or without the link's UTM tags. Reached
 * only from the profiles: not indexed, and not in the search-page registry or the sitemap.
 */

const SOCIALS = ["instagram", "facebook"];

type Props = { params: Promise<{ social: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return SOCIALS.map((social) => ({ social }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { social } = await params;
  if (!SOCIALS.includes(social)) return {};
  return {
    title: "Driver Job Available",
    description: "Apply for a driver job at Everest Fleet: car, insurance and permit included, weekly payouts.",
    alternates: { canonical: `/apply/${social}/` },
    robots: { index: false, follow: true },
  };
}

export default async function SocialApplyPage({ params }: Props) {
  const { social } = await params;
  if (!SOCIALS.includes(social)) notFound();

  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("en");
  const source = `social/${social}`;
  const ready = readyTotal(allCityFacts(content, live));

  return (
    <>
      <SearchHero
        chip={<BackChip href="/drive-with-us/" label={dict.hub.eyebrow} />}
        title="Driver Job Available"
        intro="Drive an Everest Fleet car. Insurance and permit included, weekly payouts."
        facts={[
          ...(ready ? [{ label: "Cars ready", value: ready.toLocaleString("en-IN") }] : []),
          { label: "Cities", value: String(content.cities.length) },
        ]}
        form={<SearchForm content={content} source={source} placement="hero" />}
      />
      <StickyBar call={dict.cta.call} apply={dict.cta.apply} />
    </>
  );
}
