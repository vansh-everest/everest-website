import type { SiteContent } from "@/lib/content";
import { cityOptions, planCardsByCity } from "@/lib/plan-view";
import { PlanGrid } from "./plan-grid";

export function Plans({ content }: { content: SiteContent }) {
  return (
    <section id="plans" className="relative bg-fog pb-16 pt-12 lg:pb-20 lg:pt-[52px]">
      <div className="px-6 text-center">
        <h2 className="text-[26px] font-bold leading-tight tracking-[-0.5px] text-navy sm:text-[34px] lg:text-[64px] lg:leading-[72px]">
          We have plans for everyone
        </h2>
      </div>
      <PlanGrid cities={cityOptions(content)} cards={planCardsByCity(content)} />
    </section>
  );
}
