import type { Metadata } from "next";
import { COMPANY, SITE_URL } from "@/lib/company";
import { AdHero } from "@/components/advertise/hero";
import { Reach } from "@/components/advertise/reach";
import { Formats } from "@/components/advertise/formats";
import { AdSteps } from "@/components/advertise/steps";
import { Brands } from "@/components/advertise/brands";
import { Promises } from "@/components/advertise/promises";
import { AdEnquiry } from "@/components/advertise/enquiry";
import { JsonLd, crumbsLd } from "@/components/seo/seo-ui";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Cab Advertising: Car Branding Across India",
  description: `Cab advertising across ${COMPANY.vehicles} cabs in ${COMPANY.cities} cities: exterior and in-cab branding, with verified photos of every placement.`,
  alternates: { canonical: "/advertise-with-us/" },
};

const SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cab Advertisements",
  serviceType: "Cab advertising",
  description: metadata.description,
  url: `${SITE_URL}/advertise-with-us/`,
  areaServed: { "@type": "Country", name: "India" },
  provider: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
};

export default function AdvertiseWithUsPage() {
  return (
    <>
      <JsonLd blocks={[SERVICE_LD, crumbsLd([{ name: "Cab Advertisements", path: "/advertise-with-us/" }])]} />
      <AdHero />
      <Reach />
      <Formats />
      <AdSteps />
      <Brands />
      <Promises />
      <AdEnquiry />
    </>
  );
}
