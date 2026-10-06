import type { Metadata } from "next";
import { DostApply } from "@/components/dost/dost-apply";
import { DostBenefits } from "@/components/dost/benefits";
import { DostHero } from "@/components/dost/dost-hero";
import { DostQuotes } from "@/components/dost/dost-quotes";
import { HowItWorks } from "@/components/dost/how-it-works";
import { WhoCanJoin } from "@/components/dost/who-can-join";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Everest Dost: Refer Drivers and Earn",
  description:
    "Refer drivers to Everest Fleet through the Everest Dost app and get paid at every milestone, from car allotted to trip targets.",
  alternates: { canonical: "/everest-dost/" },
};

export default function EverestDostPage() {
  return (
    <>
      <DostHero />
      <WhoCanJoin />
      <HowItWorks />
      <DostBenefits />
      <DostQuotes />
      <DostApply />
    </>
  );
}
