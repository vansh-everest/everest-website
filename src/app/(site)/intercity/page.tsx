import type { Metadata } from "next";
import { IntercityHero } from "@/components/intercity/hero";
import { Stories } from "@/components/intercity/stories";
import { TopRoutes } from "@/components/intercity/top-routes";
import { WhyEverest } from "@/components/intercity/why";
import { JsonLd, crumbsLd } from "@/components/seo/seo-ui";
import { SITE_URL } from "@/lib/company";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Intercity Cabs: Fixed Fares, One Way and Round Trip",
  description: "Book an intercity cab one way, round trip or multi-way, with fixed fares on top routes such as Mumbai to Pune and Delhi to Jaipur.",
  alternates: { canonical: "/intercity/" },
};

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Everest Intercity Rides",
  serviceType: "Intercity cab service",
  description: metadata.description,
  url: `${SITE_URL}/intercity/`,
  areaServed: { "@type": "Country", name: "India" },
  provider: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
};

export default function IntercityPage() {
  return (
    <>
      <JsonLd blocks={[SERVICE_LD, crumbsLd([{ name: "Everest Intercity Rides", path: "/intercity/" }])]} />
      <IntercityHero />
      <WhyEverest />
      <TopRoutes />
      <Stories />
    </>
  );
}
