import type { Metadata } from "next";
import { COMPANY, SITE_URL } from "@/lib/company";
import { Handled } from "@/components/mobility/handled";
import { MobilityHero, Stats, Trusted } from "@/components/mobility/hero";
import { Quote } from "@/components/mobility/quote";
import { Road } from "@/components/mobility/road";
import { Service } from "@/components/mobility/service";
import { WhyEverest } from "@/components/mobility/why";
import { JsonLd, crumbsLd } from "@/components/seo/seo-ui";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Employee Transport Services: Office Cabs and Electric Fleet",
  description: `Employee transport for offices in ${COMPANY.cities} cities: certified drivers, electric cabs, live tracking and backup cabs under one contract.`,
  alternates: { canonical: "/employee-mobility/" },
};

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Employee Mobility",
  serviceType: "Employee transportation",
  description: metadata.description,
  url: `${SITE_URL}/employee-mobility/`,
  areaServed: { "@type": "Country", name: "India" },
  provider: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
};

export default function EmployeeMobilityPage() {
  return (
    <>
      <JsonLd blocks={[SERVICE_LD, crumbsLd([{ name: "Employee Mobility", path: "/employee-mobility/" }])]} />
      <MobilityHero />
      <Stats />
      <Trusted />
      <Handled />
      <WhyEverest />
      <Road />
      <Service />
      <Quote />
    </>
  );
}
