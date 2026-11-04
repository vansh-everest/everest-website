import type { Metadata } from "next";
import { LogisticsHero } from "@/components/logistics/hero";
import { Services } from "@/components/logistics/services";
import { FleetBands } from "@/components/logistics/fleet";
import { Operations } from "@/components/logistics/operations";
import { ClientQuotes, Clients } from "@/components/logistics/clients";
import { Owners } from "@/components/logistics/owners";
import { Contact } from "@/components/logistics/contact";
import { Faq } from "@/components/logistics/faq";
import { JsonLd, crumbsLd, faqLd } from "@/components/seo/seo-ui";
import { SITE_URL } from "@/lib/company";
import { FAQS } from "@/components/logistics/data";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Cold Chain Logistics: Frozen, Chilled and Ambient Transport",
  description: "Freezer, chiller and ambient transport with live tracking and temperature logs, plus vehicle attachment for truck, reefer and EV 3-wheeler owners.",
  alternates: { canonical: "/fleet-logistics/" },
};

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Everest Fleet Logistics",
  serviceType: "Cold chain and temperature-controlled logistics",
  description: metadata.description,
  url: `${SITE_URL}/fleet-logistics/`,
  areaServed: { "@type": "Country", name: "India" },
  provider: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
};

export default function FleetLogisticsPage() {
  return (
    <>
      <JsonLd blocks={[SERVICE_LD, crumbsLd([{ name: "Everest Fleet Logistics", path: "/fleet-logistics/" }]), faqLd(FAQS)]} />
      <LogisticsHero />
      <Services />
      <FleetBands />
      <Operations />
      <Clients />
      <ClientQuotes />
      <Owners />
      <Contact source="fleet-logistics" />
      <Faq />
    </>
  );
}
