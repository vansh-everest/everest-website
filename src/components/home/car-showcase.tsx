import type { SiteContent } from "@/lib/content";
import { carCard } from "@/lib/plan-view";
import { CarGrid } from "./car-grid";

export function CarShowcase({ content }: { content: SiteContent }) {
  const cars = content.cars.filter((c) => c.visible).map((car) => carCard(content, car));
  return (
    <section id="fleet" className="relative scroll-mt-20 bg-mist px-6 pb-16 pt-16 lg:pb-20 lg:pt-24">
      <div className="text-center">
        <h2 className="text-[28px] font-bold leading-tight tracking-[-0.5px] text-navy sm:text-[34px] lg:text-[64px] lg:leading-[72px]">
          Car that earns for you
        </h2>
        <p className="mt-2 text-base text-ink-soft/70">Drive India&apos;s most trusted and well-maintained fleet</p>
      </div>
      <CarGrid cars={cars} />
    </section>
  );
}
