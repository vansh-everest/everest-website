import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/services-hero";
import { HowItWorks } from "@/components/services/how-it-works";
import { BenefitRows } from "@/components/services/benefit-rows";

export const metadata: Metadata = {
  // The layout appends "| Everest Fleet" through its title template.
  title: "Our Services",
  alternates: { canonical: "/our-services/" },
  description: "Everest Fleet driver services: register, pick a vehicle, start earning with weekly payouts",
};

export default function OurServicesPage() {
  return (
    <>
      <ServicesHero />
      <HowItWorks />
      <BenefitRows />
    </>
  );
}
