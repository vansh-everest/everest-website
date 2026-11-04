import type { Metadata } from "next";
import { LogisticsHero } from "@/components/logistics/hero";
import { Services } from "@/components/logistics/services";
import { FleetBands } from "@/components/logistics/fleet";
import { Operations } from "@/components/logistics/operations";
import { ClientQuotes, Clients } from "@/components/logistics/clients";
import { Owners } from "@/components/logistics/owners";
import { Contact } from "@/components/logistics/contact";
import { Faq } from "@/components/logistics/faq";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Fleet Logistics",
  description:
    "Chilled, frozen and ambient delivery vans for cloud kitchens, dairy, produce and bakeries in Mumbai and Bengaluru, tracked live on every trip.",
  alternates: { canonical: "/fleet-logistics/" },
};

export default function FleetLogisticsPage() {
  return (
    <>
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
