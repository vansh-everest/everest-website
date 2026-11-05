import type { Metadata } from "next";
import { formCities } from "@/components/driver/driver-pages";
import { ApplyBand } from "@/components/driver/driver-ui";
import { BenefitCards } from "@/components/careers/benefit-cards";
import { CareersHero } from "@/components/careers/careers-hero";
import { Culture } from "@/components/careers/culture";
import { EmployeeVideos } from "@/components/careers/employee-videos";
import { LifeAtEverest } from "@/components/careers/life-at-everest";
import { MoveIndia } from "@/components/careers/move-india";
import { getDictionary } from "@/content/dictionary";
import { getContent } from "@/lib/store";

export const revalidate = 3600;

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Careers",
  description: "Jobs at Everest Fleet: open roles, employee benefits, the IMPACTT values and interviews with the team.",
  alternates: { canonical: "/careers/" },
};

export default async function CareersPage() {
  // Drivers searching for "Everest Fleet jobs" land here, so the page ends with the driver form.
  const content = await getContent();
  return (
    <>
      <CareersHero />
      <MoveIndia />
      <Culture />
      <LifeAtEverest />
      <BenefitCards />
      <EmployeeVideos />
      <ApplyBand locale="en" dict={getDictionary("en")} cities={formCities(content, "en")} source="careers" placement="bottom" />
    </>
  );
}
