import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Testimonials } from "@/components/home/testimonials";
import { StartDriving } from "@/components/site/start-driving";
import { headline, planFor } from "@/lib/content";
import { getLiveData, planCalculator, wizardCarPrices } from "@/lib/fleet-data";
import { planIdFor, wizardFor, type PlanPagePath } from "@/lib/plan-pages";
import { planPage, planWizard } from "@/lib/plan-view";
import { getContent } from "@/lib/store";
import { PlanBenefits } from "./plan-benefits";
import { PlanCalculator } from "./plan-calculator";
import { PlanHero } from "./plan-hero";
import { PlanWizard } from "./plan-wizard";

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

/** Hero, the plan picker, the benefit cards (phones only), driver stories, then the form. */
export async function PlanPage({ path }: { path: PlanPagePath }) {
  const { content, plan } = await offered(path);
  if (!plan) notFound();
  const view = planPage(plan);
  // The calculator priced by Jarvis when it has the plan's cars; otherwise, and on Revenue Share, the wizard.
  const live = await getLiveData();
  const calculator = plan.id === "revenue-share" ? null : planCalculator(content, live, plan.id);
  const wizard = calculator ? null : planWizard(content, plan, wizardFor(path), wizardCarPrices(content, live, plan.id));
  return (
    <>
      {/* Revenue Share has no edge-to-edge hero artwork yet; its photo is cropped for the split layout. */}
      <PlanHero view={view} startHref={calculator || wizard ? "#plan" : "#apply"} wide={path !== "/revenue-share"} />
      {calculator ? <PlanCalculator view={calculator} /> : wizard ? <PlanWizard view={wizard} /> : null}
      <PlanBenefits view={view} />
      <Testimonials variant="page" title={view.storiesTitle} />
      <StartDriving source={`plan/${plan.id}`} eyebrow />
    </>
  );
}
