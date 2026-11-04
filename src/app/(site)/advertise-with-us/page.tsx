import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";
import { AdHero } from "@/components/advertise/hero";
import { Reach } from "@/components/advertise/reach";
import { Formats } from "@/components/advertise/formats";
import { AdSteps } from "@/components/advertise/steps";
import { Brands } from "@/components/advertise/brands";
import { Promises } from "@/components/advertise/promises";
import { AdEnquiry } from "@/components/advertise/enquiry";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Advertise With Us",
  description: `Cab advertising across ${COMPANY.vehicles} cabs in ${COMPANY.cities} cities: in-cab branding, cab branding and in-cab sampling, with photo proof of every placement.`,
  alternates: { canonical: "/advertise-with-us/" },
};

export default function AdvertiseWithUsPage() {
  return (
    <>
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
