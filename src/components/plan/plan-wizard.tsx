"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check, IndianRupee, Key } from "lucide-react";
import { reducedMotion } from "@/components/fx/count-up";
import type { PlanWizardView } from "@/lib/plan-view";
import { WIZARD_COPY } from "./wizard-copy";
import { enterStep, keepInView, leaveStep, nudgeSlider, playIntro, resizeCard, useTapInvite } from "./wizard-motion";
import { ResultStep } from "./wizard-result";
import { CarStep, CityStep, MoneyStep } from "./wizard-steps";
import { figuresFor, StepFooter } from "./wizard-ui";

/**
 * Desktop: numbered circles joined by lines; the last circle carries the plan's mark. A line fills
 * as the visitor reaches the step it leads to, and a glint runs along the one to the next step.
 */
function Stepper({ steps, step, mark, onGo }: { steps: readonly string[]; step: number; mark: "rupee" | "key"; onGo: (i: number) => void }) {
  const last = steps.length - 1;
  const Mark = mark === "key" ? Key : IndianRupee;
  return (
    <ol data-wz-anchor className="mt-8 hidden items-center justify-center lg:flex">
      {steps.map((name, i) => {
        const done = i < step;
        const on = i === step;
        const circle = done
          ? "border-navy bg-navy text-white"
          : on
            ? "wz-pulse border-sun bg-sun text-navy"
            : "border-[#d5dbe1] bg-white text-ink-soft";
        const body = (
          <>
            <span
              className={`grid size-9 place-items-center rounded-full border-[1.5px] text-[15px] font-semibold ${circle}`}
            >
              {done ? (
                <Check size={17} strokeWidth={2.75} className="wz-check" />
              ) : i === last ? (
                <Mark size={15} strokeWidth={2.25} className={mark === "key" ? "rotate-180" : ""} />
              ) : (
                i + 1
              )}
            </span>
            <span className={`text-base leading-6 ${on ? "font-bold text-navy" : done ? "font-medium text-navy" : "font-medium text-ink-soft"}`}>{name}</span>
          </>
        );
        return (
          <li key={name} className="wz-step flex items-center" aria-current={on ? "step" : undefined}>
            {i > 0 ? (
              <span aria-hidden className="relative mx-3 h-0.5 w-14 overflow-hidden">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#d5dbe1]" />
                <span
                  className={`absolute inset-0 origin-left bg-navy motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out ${
                    done || on ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                {i === step + 1 ? <span className="wz-comet absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-sun to-transparent" /> : null}
              </span>
            ) : null}
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

/** Phone: one bar per step, then "Step 1 of 2 · City" (the plan itself is not counted). The bar in hand fills from the left. */
function Progress({ steps, step }: { steps: readonly string[]; step: number }) {
  const last = steps.length - 1;
  return (
    <div data-wz-anchor className="wz-step mt-[18px] lg:hidden">
      <div aria-hidden className="flex gap-[7px]">
        {steps.map((name, i) => (
          <span key={name} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#dfe4e8]">
            <span
              className={`absolute inset-0 origin-left rounded-full motion-safe:transition-[scale] motion-safe:duration-500 motion-safe:ease-out ${
                i < step ? "bg-navy" : i === step ? "wz-bar-on bg-sun" : "scale-x-0 bg-sun"
              }`}
            />
          </span>
        ))}
      </div>
      <p key={step} className="wz-swap mt-[11px] text-[13px] font-medium leading-4 text-ink-soft">
        {step < last ? `Step ${step + 1} of ${last} · ${steps[step]}` : steps[last]}
      </p>
    </div>
  );
}

/**
 * The plan picker: city, then car and model year, then (where the plan has a money step) what is
 * paid first: Own Now's tenure and upfront, Drive to Earn's model year and deposit. Then the plan
 * those choices come to.
 *
 * It guides without words: the title and steps rise in when it scrolls into view, the choices
 * land one by one and then shimmer to show they can be tapped, the way forward wakes up once a
 * choice is made, and each step slides in from the side the visitor is heading to.
 */
export function PlanWizard({ view }: { view: PlanWizardView }) {
  const copy = WIZARD_COPY[view.kind];
  const money = copy.money;
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

  // Steps the visitor has made a choice on (or moved on from): their way forward is awake.
  const [chosen, setChosen] = useState<readonly number[]>([]);
  const choose = (i: number) => setChosen((list) => (list.includes(i) ? list : [...list, i]));
  // The picker has been seen (its intro has started), and its choices have landed.
  const [live, setLive] = useState(false);
  const [landed, setLanded] = useState(false);

  const section = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const leaving = useRef(false);
  const target = useRef(0);
  const before = useRef<{ dir: number; width: number; height: number } | null>(null);
  const hinted = useRef(false);

  // Before the picker scrolls into view its title, steps and card wait unseen; then they play in.
  useEffect(() => {
    const el = section.current;
    if (!el || reducedMotion()) return;
    if (el.getBoundingClientRect().top > window.innerHeight * 0.8) el.dataset.wz = "wait";
    let timer = 0;
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        watch.disconnect();
        const waited = el.dataset.wz === "wait";
        delete el.dataset.wz;
        setLive(true);
        timer = window.setTimeout(() => setLanded(true), waited ? playIntro(el) : 0);
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    watch.observe(el);
    return () => {
      watch.disconnect();
      clearTimeout(timer);
      delete el.dataset.wz;
    };
  }, []);

  // A new step slides in, the card eases to its size, the steps above it stay in view, and the
  // heading takes focus. On a money step with a slider, it shows once that it can be dragged.
  useLayoutEffect(() => {
    if (!moved.current) return;
    const box = card.current;
    const body = stage.current;
    const from = before.current;
    before.current = null;
    if (!box || !body) return;
    const arrive = enterStep(body, from?.dir ?? 1);
    if (from && window.matchMedia("(min-width: 1024px)").matches) resizeCard(box, from);
    const anchor = [...(section.current?.querySelectorAll<HTMLElement>("[data-wz-anchor]") ?? [])].find((el) => el.offsetHeight > 0);
    keepInView(anchor ?? box);
    document.getElementById(headingId)?.focus({ preventScroll: true });
    const slider = body.querySelector<HTMLInputElement>('input[type="range"]');
    if (slider && !hinted.current) {
      hinted.current = true;
      nudgeSlider(slider, arrive + 250);
    }
  }, [step, headingId]);

  function go(to: number) {
    const next = Math.max(0, Math.min(last, to));
    if (next === step && !leaving.current) return;
    moved.current = true;
    // Moving on counts as a choice: coming back, that step's way forward is already awake.
    if (next > step) choose(step);
    target.current = next;
    const box = card.current;
    const body = stage.current;
    if (leaving.current) return;
    if (!box || !body || reducedMotion()) {
      setStep(next);
      return;
    }
    before.current = { dir: next > step ? 1 : -1, width: box.offsetWidth, height: box.offsetHeight };
    leaving.current = true;
    leaveStep(body, before.current.dir).then(() => {
      leaving.current = false;
      if (target.current !== step) {
        setStep(target.current);
        return;
      }
      // Sent back to the step it was leaving: it simply stays.
      before.current = null;
      body.getAnimations().forEach((a) => a.cancel());
    });
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
  // Only a money step with a tenure asks for one; the others use the plan's own term.
  const figures = figuresFor(view, car, city, money?.tenure ? tenure : "", index);
  const carLabel = year ? `${car.name} ${year}` : car.name;
  const name = copy.steps[step];

  // A step with only one way to answer is awake from the start.
  const yearsOnCar = !money?.years;
  const single = [
    view.cities.length < 2,
    cars.length < 2 && (!yearsOnCar || car.years.length < 2),
    (!money?.tenure || view.tenures.length < 2) && (yearsOnCar || car.years.length < 2) && car.options.length < 2,
  ];
  const awake = chosen.includes(step) || Boolean(single[step]);
  // The first step is cued as soon as the intro has landed; a later one once its choices have.
  useTapInvite(stage, live && landed && !awake && step < last, step, step === 0 ? 250 : 900);

  return (
    <section
      ref={section}
      id="plan"
      data-no-reveal
      data-wz-live={live || undefined}
      aria-label={copy.title}
      className="scroll-mt-20 overflow-x-clip bg-[#f5f8fb] px-4 pt-[30px] sm:px-6 lg:pb-[72px] lg:pt-[73px]"
    >
      <div className="scroll-mt-20 text-center">
        <p className="wz-eyebrow hidden text-[13px] font-medium uppercase leading-4 tracking-[1.3px] text-brand lg:block">{view.name}</p>
        <h2 className="text-2xl font-bold leading-[30px] tracking-[-0.3px] text-navy lg:mt-[10px] lg:text-[41px] lg:leading-[48px] lg:tracking-[-0.5px]">
          {copy.title.split(" ").map((word, i) => (
            <span key={i}>
              {i ? " " : null}
              <span className="wz-word inline-block">{word}</span>
            </span>
          ))}
        </h2>
      </div>
      <Stepper steps={copy.steps} step={step} mark={copy.mark} onGo={go} />
      <Progress steps={copy.steps} step={step} />

      <div
        ref={card}
        className={`wz-card mt-[19px] lg:mx-auto lg:mt-[33px] lg:rounded-3xl lg:border lg:border-[#dfe4e8] lg:bg-white lg:px-10 lg:pt-10 ${
          money && step === 2 ? "lg:max-w-[1040px]" : "lg:max-w-[880px]"
        } ${step === last ? "pb-7 lg:pb-10" : step === 0 ? "lg:pb-16" : "lg:pb-10"}`}
      >
        <div ref={stage} className="wz-stage" data-wz-picked={chosen.includes(step) || undefined}>
          {step === 0 ? (
            <CityStep
              question={copy.city}
              cities={view.cities}
              value={city}
              onChange={(slug) => {
                choose(0);
                pickCity(slug);
              }}
              headingId={headingId}
            />
          ) : null}

          {step === 1 ? (
            <CarStep
              question={copy.car}
              yearLabel={copy.year}
              cars={cars}
              value={car.id}
              onChange={(id) => {
                choose(1);
                pickCar(id);
              }}
              year={year}
              onYear={(y) => {
                choose(1);
                pickYear(y);
              }}
              showYears={yearsOnCar}
              headingId={headingId}
            />
          ) : null}

          {money && step === 2 ? (
            <MoneyStep
              copy={money}
              car={car}
              carLabel={carLabel}
              cityName={cityName}
              perks={view.perks}
              tenures={view.tenures}
              tenure={tenure}
              onTenure={(m) => {
                choose(2);
                setTenure(m);
              }}
              year={year}
              onYear={(y) => {
                choose(2);
                pickYear(y);
              }}
              index={index}
              onIndex={(i) => {
                choose(2);
                setIndex(i);
              }}
              figures={figures}
              headingId={headingId}
            />
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

        {step === 0 ? <StepFooter className="mt-[92px] lg:mt-[51px] lg:justify-end" next="Next: Choose Car" awake={awake} onNext={() => go(1)} /> : null}

        {step === 1 ? (
          <StepFooter
            className="mt-12 lg:mt-7"
            summary={cityName}
            onBack={() => go(0)}
            next={money ? money.next : "See My Plan"}
            awake={awake}
            onNext={() => go(2)}
          />
        ) : null}

        {money && step === 2 ? (
          <StepFooter
            className="mt-12 lg:mt-7"
            summary={`${cityName} · ${carLabel}`}
            onBack={() => go(1)}
            next="See My Plan"
            awake={awake}
            onNext={() => go(3)}
          />
        ) : null}
      </div>
      <p className="sr-only" aria-live="polite">
        {name}
      </p>
    </section>
  );
}
