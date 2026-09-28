import type { Metadata } from "next";
import { PlanBlock } from "@/components/our-plans/plan-block";
import { PlansHero } from "@/components/our-plans/plans-hero";
import { StartDriving } from "@/components/site/start-driving";
import { planOverviews } from "@/lib/plan-view";
import { getContent } from "@/lib/store";

export const metadata: Metadata = {
  // The site layout's title template appends " | Everest Fleet".
  title: "Our Plans",
  description: "Everest Fleet driver plans, from car ownership to renting, with the daily rent and deposit for each.",
  alternates: { canonical: "/our-plans/" },
};

export default async function OurPlansPage() {
  const content = await getContent();
  const plans = planOverviews(content);
  return (
    <>
      <PlansHero slot={content.images["our-plans-hero"]} />
      <div className="lg:space-y-[180px] lg:px-10 lg:pb-16 lg:pt-[100px]">
        {plans.map((plan, i) => (
          <PlanBlock key={plan.id} plan={plan} shade={i % 2 === 1} />
        ))}
      </div>
      <StartDriving source="our-plans" eyebrow="phone" />
    </>
  );
}
