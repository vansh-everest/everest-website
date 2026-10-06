import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/services-hero";
import { ServiceList } from "@/components/services/service-list";
import { Enquiry } from "@/components/services/enquiry";

export const metadata: Metadata = {
  // The layout appends "| Everest Fleet" through its title template.
  title: "Our Services",
  alternates: { canonical: "/our-services/" },
  description: "Everest Fleet services for business: fleet logistics, employee mobility, intercity travel and advertising on cars.",
};

export default function OurServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceList />
      <Enquiry source="our-services" />
    </>
  );
}
