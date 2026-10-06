import type { SiteContent } from "@/lib/content";
import { cityOptions, planCardsByCity } from "@/lib/plan-view";
import { PlanGrid } from "./plan-grid";

export function Plans({ content }: { content: SiteContent }) {
  return (
    <section id="plans" className="relative bg-[#f7f9fc] pb-5 pt-[22px] sm:pb-16 sm:pt-12 lg:bg-fog lg:pb-20 lg:pt-[52px]">
      <div className="px-6 text-center">
        <h2 className="text-[25px] font-bold leading-tight tracking-[-0.5px] text-navy sm:text-[34px] lg:text-[64px] lg:leading-[72px]">
          <span className="sm:hidden">We Have Plans For Everyone</span>
          <span className="hidden sm:inline">We have plans for everyone</span>
        </h2>
      </div>
      <PlanGrid cities={cityOptions(content)} cards={planCardsByCity(content)} />
    </section>
  );
}
