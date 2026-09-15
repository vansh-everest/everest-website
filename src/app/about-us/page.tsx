import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { Impact } from "@/components/about/impact";
import { Leadership } from "@/components/about/leadership";
import { Values } from "@/components/about/values";
import { Milestones } from "@/components/about/milestones";
import { Difference } from "@/components/about/difference";
import { JoinCta } from "@/components/about/join-cta";

export const metadata: Metadata = {
  title: "About Us | Everest Fleet",
  description: "Everest Fleet story, leadership, values and milestones since 2016",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Impact />
      <Leadership />
      <Values />
      <Milestones />
      <Difference />
      <JoinCta />
    </>
  );
}
