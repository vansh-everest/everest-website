import { notFound } from "next/navigation";
import { ApplySteps } from "@/components/home/apply-steps";
import { Testimonials } from "@/components/home/testimonials";
import { PlanCalculator } from "@/components/own-now/plan-calculator";
import { PlanHero } from "@/components/plan/plan-hero";
import { offered, planMetadata } from "@/components/plan/plan-page";
import { PlanWhy } from "@/components/plan/plan-why";
import { planPage } from "@/lib/plan-view";

export const generateMetadata = () => planMetadata("/own-now");

export default async function OwnNowPage() {
  const { content, plan } = await offered("/own-now");
  if (!plan) notFound();
  const view = planPage(plan);
  return (
    <>
      <PlanHero view={view} calculateHref="#calculator" />
      <PlanWhy view={view} />
      <PlanCalculator content={content} />
      <Testimonials variant="page" title={view.storiesTitle} />
      <ApplySteps variant="page" />
    </>
  );
}
