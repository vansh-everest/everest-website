import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Testimonials } from "@/components/home/testimonials";
import { calculatorFor, PlanCalculator } from "@/components/own-now/plan-calculator";
import { StartDriving } from "@/components/site/start-driving";
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

/**
 * What each page adds after the calculator, as the designs lay them out: where the plan's cars are
 * listed, and whether the driver stories come before the form on a desktop. Phones always show the
 * stories first, and the Drive to Own phone design has no car list.
 */
const LAYOUT: Record<PlanPagePath, { cars: "none" | "desktop" | "all"; storiesFirst: boolean }> = {
  "/own-now": { cars: "none", storiesFirst: true },
  "/drive-to-own": { cars: "desktop", storiesFirst: false },
  "/drive-to-earn": { cars: "none", storiesFirst: false },
  "/revenue-share": { cars: "all", storiesFirst: false },
};

export async function PlanPage({ path }: { path: PlanPagePath }) {
  const { content, plan } = await offered(path);
  if (!plan) notFound();
  const view = planPage(plan);
  const calculator = calculatorFor(content, plan.id);
  const { cars, storiesFirst } = LAYOUT[path];
  return (
    <>
      <PlanHero view={view} startHref={calculator ? "#calculator" : "#apply"} />
      <PlanWhy view={view} />
      {calculator ? <PlanCalculator data={calculator} /> : null}
      {/* One copy of each section; the order moves with CSS, so #cars and #apply stay unique. */}
      <div className="flex flex-col">
        {cars === "none" ? null : (
          <div className={cars === "desktop" ? "hidden lg:block" : ""}>
            <PickYourCar content={content} plan={plan} />
          </div>
        )}
        <div className={storiesFirst ? "" : "lg:order-last"}>
          <Testimonials variant="page" title={view.storiesTitle} />
        </div>
        <StartDriving source={`plan:${plan.id}`} eyebrow="phone" />
      </div>
    </>
  );
}
