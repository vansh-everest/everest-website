import type { SiteContent } from "@/lib/content";
import { planCities, type CityOption } from "@/lib/plan-view";
import { CalculatorView, type CalculatorCarView } from "./calculator-view";

export type CalculatorData = {
  cities: CityOption[];
  cars: CalculatorCarView[];
  depositLabel: string;
  tenures: string[];
  perks: string[];
};

/** A plan's calculator ready to show, or null when the plan has none or none of its cars can be shown. */
export function calculatorFor(content: SiteContent, planId: string): CalculatorData | null {
  const calc = content.calculators.find((c) => c.planId === planId);
  if (!calc) return null;
  const cars = calc.cars.flatMap((entry): CalculatorCarView[] => {
    const car = content.cars.find((c) => c.id === entry.carId);
    if (!car || !entry.options.length) return [];
    return [
      {
        id: car.id,
        name: car.name,
        condition: car.condition,
        modelYears: car.modelYears.split(",").map((y) => y.trim()).filter(Boolean),
        image: entry.image.url ? entry.image : car.image,
        options: entry.options,
        defaultOption: entry.defaultOption,
      },
    ];
  });
  if (!cars.length) return null;
  return { cities: planCities(content, planId), cars, depositLabel: calc.depositLabel, tenures: calc.tenures, perks: calc.perks };
}

export function PlanCalculator({ data }: { data: CalculatorData }) {
  return (
    <section id="calculator" className="scroll-mt-20 bg-[#f0f4f8] px-4 pb-12 pt-12 sm:px-6 lg:pb-[145px] lg:pt-[62px]">
      <div className="text-center">
        <p className="inline-block rounded-full bg-sun px-[13px] py-[3px] text-xs font-medium uppercase leading-[17px] tracking-[1px] text-navy lg:block lg:bg-transparent lg:p-0 lg:text-sm lg:font-semibold lg:leading-4 lg:tracking-[1.5px] lg:text-brand">
          Plan calculator
        </p>
        <h2 className="mt-3 text-balance text-[28px] font-bold leading-[34px] tracking-[-0.5px] text-navy lg:text-[56px] lg:leading-[64px]">
          Choose Your Car &amp; Model
        </h2>
        <p className="mt-3.5 text-balance text-[13px] leading-4 text-ink-soft lg:mt-1 lg:text-lg lg:leading-[22px]">Drive India&apos;s most trusted and well-maintained fleet</p>
      </div>
      <CalculatorView {...data} />
    </section>
  );
}
