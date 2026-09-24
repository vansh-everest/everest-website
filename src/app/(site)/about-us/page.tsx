import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { Founder } from "@/components/about/founder";
import { Milestones } from "@/components/about/milestones";
import { Values } from "@/components/about/values";
import { StartDriving } from "@/components/site/start-driving";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "About Us",
  description: "Everest Fleet values, journey since 2016 and founder Siddharth Ladsariya.",
  alternates: { canonical: "/about-us/" },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Values />
      <Milestones />
      <Founder />
      <StartDriving />
    </>
  );
}
