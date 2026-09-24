import type { SiteContent } from "@/lib/content";
import { planCities } from "@/lib/plan-view";
import { CalculatorView, type CalculatorCarView } from "./calculator-view";

export function PlanCalculator({ content }: { content: SiteContent }) {
  const calc = content.calculator;
  const cars = calc.cars.flatMap((entry): CalculatorCarView[] => {
    const car = content.cars.find((c) => c.id === entry.carId);
    if (!car || !entry.options.length) return [];
    return [
      {
        id: car.id,
        make: car.make,
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

  return (
    <section id="calculator" className="scroll-mt-20 bg-[#f0f4f8] px-4 pb-20 pt-16 sm:px-6 lg:pb-[100px]">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase leading-4 tracking-[1.5px] text-brand">Plan calculator</p>
        <h2 className="mt-2 text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[72px]">
          Choose Your Car &amp; Model
        </h2>
        <p className="mt-2 text-lg leading-[22px] text-ink-soft">Drive India&apos;s most trusted and well-maintained fleet</p>
      </div>
      <CalculatorView cities={planCities(content, calc.planId)} cars={cars} tenures={calc.tenures} perks={calc.perks} />
    </section>
  );
}
