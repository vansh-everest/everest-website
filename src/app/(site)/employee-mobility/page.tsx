import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";
import { Handled } from "@/components/mobility/handled";
import { MobilityHero, Stats, Trusted } from "@/components/mobility/hero";
import { Quote } from "@/components/mobility/quote";
import { Road } from "@/components/mobility/road";
import { Service } from "@/components/mobility/service";
import { WhyEverest } from "@/components/mobility/why";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Employee Mobility",
  description: `Electric office cabs with certified drivers, route planning, backup cabs and full compliance, across ${COMPANY.cities} metro cities.`,
  alternates: { canonical: "/employee-mobility/" },
};

export default function EmployeeMobilityPage() {
  return (
    <>
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
