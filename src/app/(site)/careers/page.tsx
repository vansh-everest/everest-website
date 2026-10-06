import type { Metadata } from "next";
import { BenefitCards } from "@/components/careers/benefit-cards";
import { CareersHero } from "@/components/careers/careers-hero";
import { Culture } from "@/components/careers/culture";
import { EmployeeVideos } from "@/components/careers/employee-videos";
import { MoveIndia } from "@/components/careers/move-india";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Careers",
  description: "Jobs at Everest Fleet: open roles, employee benefits, the IMPACTT values and interviews with the team.",
  alternates: { canonical: "/careers/" },
};

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <MoveIndia />
      <Culture />
      <BenefitCards />
      <EmployeeVideos />
    </>
  );
}
