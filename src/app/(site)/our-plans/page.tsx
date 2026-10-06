import type { Metadata } from "next";
import { Testimonials } from "@/components/home/testimonials";
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
      <div className="lg:space-y-40 lg:px-10 lg:pb-16 lg:pt-20">
        {plans.map((plan) => (
          <PlanBlock key={plan.id} plan={plan} />
        ))}
      </div>
      {/* Only the phone design has the driver stories here. */}
      <div className="lg:hidden">
        <Testimonials variant="page" />
      </div>
      <StartDriving source="our-plans" eyebrow />
    </>
  );
}
