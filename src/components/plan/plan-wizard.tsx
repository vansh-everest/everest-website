"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, IndianRupee, Key } from "lucide-react";
import type { PlanWizardView } from "@/lib/plan-view";
import { WIZARD_COPY } from "./wizard-copy";
import { ResultStep } from "./wizard-result";
import { CarStep, CityStep, UpfrontStep } from "./wizard-steps";
import { figuresFor, StepFooter } from "./wizard-ui";

/** Desktop: numbered circles joined by lines; the last circle carries the plan's mark. */
function Stepper({ steps, step, mark, onGo }: { steps: readonly string[]; step: number; mark: "rupee" | "key"; onGo: (i: number) => void }) {
  const last = steps.length - 1;
  const Mark = mark === "key" ? Key : IndianRupee;
  return (
    <ol className="mt-8 hidden items-center justify-center lg:flex">
      {steps.map((name, i) => {
        const done = i < step;
        const on = i === step;
        const circle = done
          ? "bg-navy text-white"
          : on
            ? "bg-sun text-navy"
            : "border-[1.5px] border-[#d5dbe1] bg-white text-ink-soft";
        const body = (
          <>
            <span className={`grid size-9 place-items-center rounded-full text-[15px] font-semibold ${circle}`}>
              {done ? <Check size={17} strokeWidth={2.75} /> : i === last ? <Mark size={15} strokeWidth={2.25} className={mark === "key" ? "rotate-180" : ""} /> : i + 1}
            </span>
            <span className={`text-base leading-6 ${on ? "font-bold text-navy" : done ? "font-medium text-navy" : "font-medium text-ink-soft"}`}>{name}</span>
          </>
        );
        return (
          <li key={name} className="flex items-center" aria-current={on ? "step" : undefined}>
            {i > 0 ? <span aria-hidden className={`mx-3 w-14 ${done || on ? "h-0.5 bg-navy" : "h-px bg-[#d5dbe1]"}`} /> : null}
            {done ? (
              <button type="button" onClick={() => onGo(i)} className="flex items-center gap-[11px] rounded-full hover:opacity-80">
                {body}
              </button>
            ) : (
              <span className="flex items-center gap-[11px]">{body}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Phone: one bar per step, then "Step 1 of 2 · City" (the plan itself is not counted). */
function Progress({ steps, step }: { steps: readonly string[]; step: number }) {
  const last = steps.length - 1;
  return (
    <div className="mt-[18px] lg:hidden">
      <div aria-hidden className="flex gap-[7px]">
        {steps.map((name, i) => (
          <span key={name} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-navy" : i === step ? "bg-sun" : "bg-[#dfe4e8]"}`} />
        ))}
      </div>
      <p className="mt-[11px] text-[13px] font-medium leading-4 text-ink-soft">
        {step < last ? `Step ${step + 1} of ${last} · ${steps[step]}` : steps[last]}
      </p>
    </div>
  );
}

/**
 * The plan picker: city, then car and model year, then (on ownership plans with an upfront) the
 * tenure and upfront, then the plan those choices come to.
 */
export function PlanWizard({ view }: { view: PlanWizardView }) {
  const copy = WIZARD_COPY[view.kind];
  const last = copy.steps.length - 1;
  const uid = useId();
  const headingId = `${uid}-step`;

  const [step, setStep] = useState(0);
  const [city, setCity] = useState(view.cities[0].slug);
  const cars = view.byCity?.[city] ?? view.cars;
  const [carId, setCarId] = useState(cars[0].id);
  const picked = cars.find((c) => c.id === carId) ?? cars[0];
  const [year, setYear] = useState(picked.years[0] ?? "");
  // A car priced per model year slides along that year's points.
  const car = { ...picked, options: picked.yearOptions?.[year] ?? picked.options };
  const [tenure, setTenure] = useState(view.tenures[0] ?? "");
  const [index, setIndex] = useState(picked.defaultOption);

  const top = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    // A shorter step can leave the reader below it; bring its heading back and give it focus.
    const box = top.current;
    if (box && box.getBoundingClientRect().top < 0) box.scrollIntoView({ block: "start" });
    document.getElementById(headingId)?.focus({ preventScroll: true });
  }, [step, headingId]);

  function go(to: number) {
    moved.current = true;
    setStep(Math.max(0, Math.min(last, to)));
  }

  function pickCar(id: string, from = cars) {
    const next = from.find((c) => c.id === id) ?? from[0];
    setCarId(next.id);
    setYear(next.years[0] ?? "");
    setIndex(next.defaultOption);
  }

  function pickCity(slug: string) {
    setCity(slug);
    const offered = view.byCity?.[slug] ?? view.cars;
    // Keep the car when the new city has it too; otherwise start from that city's first car.
    if (!offered.some((c) => c.id === carId)) pickCar(offered[0].id, offered);
  }

  function pickYear(next: string) {
    setYear(next);
    setIndex(0);
  }

  const cityName = view.cities.find((c) => c.slug === city)?.name ?? "";
  // Only the ownership picker asks for a tenure; the others use the plan's own term.
  const figures = figuresFor(view, car, city, copy.upfront ? tenure : "", index);
  const carLabel = year ? `${car.name} ${year}` : car.name;
  const name = copy.steps[step];

  return (
    <section id="plan" data-no-reveal aria-label={copy.title} className="scroll-mt-20 bg-[#f5f8fb] px-4 pt-[30px] sm:px-6 lg:pb-[72px] lg:pt-[73px]">
      <div ref={top} className="scroll-mt-20 text-center">
        <p className="hidden text-[13px] font-medium uppercase leading-4 tracking-[1.3px] text-brand lg:block">{view.name}</p>
        <h2 className="text-2xl font-bold leading-[30px] tracking-[-0.3px] text-navy lg:mt-[10px] lg:text-[41px] lg:leading-[48px] lg:tracking-[-0.5px]">
          {copy.title}
        </h2>
      </div>
      <Stepper steps={copy.steps} step={step} mark={copy.mark} onGo={go} />
      <Progress steps={copy.steps} step={step} />

      <div
        className={`mt-[19px] lg:mx-auto lg:mt-[33px] lg:rounded-3xl lg:border lg:border-[#dfe4e8] lg:bg-white lg:px-10 lg:pt-10 ${
          copy.upfront && step === 2 ? "lg:max-w-[1040px]" : "lg:max-w-[880px]"
        } ${
          step === last ? "pb-7 lg:pb-10" : step === 0 ? "lg:pb-16" : "lg:pb-10"
        }`}
      >
        {step === 0 ? (
          <>
            <CityStep question={copy.city} cities={view.cities} value={city} onChange={pickCity} headingId={headingId} />
            <StepFooter className="mt-[92px] lg:mt-[51px] lg:justify-end" next="Next: Choose Car" onNext={() => go(1)} />
          </>
        ) : null}

        {step === 1 ? (
          <>
            <CarStep
              question={copy.car}
              yearLabel={copy.year}
              cars={cars}
              value={car.id}
              onChange={(id) => pickCar(id)}
              year={year}
              onYear={pickYear}
              headingId={headingId}
            />
            <StepFooter
              className="mt-12 lg:mt-7"
              summary={cityName}
              onBack={() => go(0)}
              next={copy.upfront ? "Next: Choose Upfront" : "See My Plan"}
              onNext={() => go(2)}
            />
          </>
        ) : null}

        {copy.upfront && step === 2 ? (
          <>
            <UpfrontStep
              car={car}
              carLabel={carLabel}
              cityName={cityName}
              perks={view.perks}
              tenures={view.tenures}
              tenure={tenure}
              onTenure={setTenure}
              index={index}
              onIndex={setIndex}
              figures={figures}
              headingId={headingId}
            />
            <StepFooter
              className="mt-12 lg:mt-7"
              summary={`${cityName} · ${carLabel}`}
              onBack={() => go(1)}
              next="See My Plan"
              onNext={() => go(3)}
            />
          </>
        ) : null}

        {step === last ? (
          <ResultStep
            view={view}
            car={car}
            year={year}
            cityName={cityName}
            figures={figures}
            apply={copy.apply}
            onChange={() => go(0)}
            headingId={headingId}
          />
        ) : null}
      </div>
      <p className="sr-only" aria-live="polite">
        {name}
      </p>
    </section>
  );
}
