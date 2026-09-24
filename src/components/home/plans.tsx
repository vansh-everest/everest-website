import Image from "next/image";
import type { SiteContent } from "@/lib/content";
import { cityOptions, planCardsByCity } from "@/lib/plan-view";
import { PlanGrid } from "./plan-grid";

export function Plans({ content }: { content: SiteContent }) {
  return (
    <section id="plans" className="relative bg-fog pt-[60px]">
      <div className="px-6 text-center">
        <h2 className="text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[53px]">
          We have plans for everyone
        </h2>
        <p className="mt-6 text-lg text-ink-soft lg:text-xl">Pick the earning model that works best for you</p>
      </div>
      <PlanGrid cities={cityOptions(content)} cards={planCardsByCity(content)} />
      <div className="relative -mt-6 ml-auto aspect-[1355/500] w-[94.1%]">
        <Image src="/figma/plans-car.jpg" alt="White Everest Fleet sedan" fill sizes="95vw" className="object-cover" />
      </div>
    </section>
  );
}
