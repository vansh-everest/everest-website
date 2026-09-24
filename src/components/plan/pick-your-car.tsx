import type { Plan, SiteContent } from "@/lib/content";
import { planCarCards, planCities } from "@/lib/plan-view";
import { CarCarousel } from "./car-carousel";

export function PickYourCar({ content, plan }: { content: SiteContent; plan: Plan }) {
  return (
    <section id="cars" className="scroll-mt-20 bg-mist px-6 pb-16 pt-16 lg:pb-20 lg:pt-[72px]">
      <div className="text-center">
        <h2 className="text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[72px]">Pick Your Car</h2>
        <p className="mt-2 text-lg leading-[22px] text-ink-soft">Drive India&apos;s most trusted and well-maintained fleet</p>
      </div>
      <CarCarousel cities={planCities(content, plan.id)} cards={planCarCards(content, plan)} />
    </section>
  );
}
