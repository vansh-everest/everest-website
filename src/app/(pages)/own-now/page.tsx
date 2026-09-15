import type { Metadata } from "next";
import { OwnHero } from "@/components/own-now/own-hero";
import { OwnBenefits } from "@/components/own-now/own-benefits";
import { PlanCalculator } from "@/components/own-now/plan-calculator";
import { Faq } from "@/components/own-now/faq";
import { ApplySteps } from "@/components/home/apply-steps";
import { Testimonials } from "@/components/home/testimonials";

export const metadata: Metadata = {
  title: "Own Now | Everest Fleet",
  description: "Own Now plan from Everest Fleet, starting at ₹650 a day",
};

export default function OwnNowPage() {
  return (
    <>
      <OwnHero />
      <OwnBenefits />
      <PlanCalculator />
      <ApplySteps variant="page" />
      <Testimonials variant="page" />
      <Faq />
    </>
  );
}
