import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplySteps } from "@/components/home/apply-steps";
import { Testimonials } from "@/components/home/testimonials";
import { headline, planFor } from "@/lib/content";
import { planIdFor, type PlanPagePath } from "@/lib/plan-pages";
import { planPage } from "@/lib/plan-view";
import { getContent } from "@/lib/store";
import { PickYourCar } from "./pick-your-car";
import { PlanHero } from "./plan-hero";
import { PlanWhy } from "./plan-why";

/** A plan that is switched off in the admin has no page, rather than a page with no plan. */
export async function offered(path: PlanPagePath) {
  const content = await getContent();
  const plan = planFor(content, planIdFor(path));
  return { content, plan: plan?.visible ? plan : undefined };
}

export async function planMetadata(path: PlanPagePath): Promise<Metadata> {
  const { plan } = await offered(path);
  if (!plan) return {};
  const from = headline(plan.price);
  return {
    title: plan.name.en,
    description: plan.summary.en || `${plan.name.en} plan from Everest Fleet${from ? `, starting at ${from}` : ""}`,
    alternates: { canonical: `${path}/` },
  };
}

export async function PlanPage({ path }: { path: PlanPagePath }) {
  const { content, plan } = await offered(path);
  if (!plan) notFound();
  const view = planPage(plan);
  return (
    <>
      <PlanHero view={view} calculateHref="#cars" />
      <PlanWhy view={view} />
      <PickYourCar content={content} plan={plan} />
      <ApplySteps variant="page" />
      <Testimonials variant="page" title={view.storiesTitle} />
    </>
  );
}
