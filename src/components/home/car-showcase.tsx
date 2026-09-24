import type { SiteContent } from "@/lib/content";
import { carCardsByCity, cityOptions } from "@/lib/plan-view";
import { CarGrid } from "./car-grid";

export function CarShowcase({ content }: { content: SiteContent }) {
  return (
    <section className="relative bg-mist px-6 pb-[31px] pt-24">
      <div className="text-center">
        <h2 className="text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[60px]">
          Car that earns for you
        </h2>
        <p className="mt-2 text-sm text-ink-soft/70">Drive India&apos;s most trusted and well-maintained fleet</p>
      </div>
      <CarGrid cities={cityOptions(content)} cards={carCardsByCity(content)} />
    </section>
  );
}
