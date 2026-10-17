import Image from "next/image";
import { Check, CircleCheck, MapPin } from "lucide-react";
import { CountUp } from "@/components/fx/count-up";
import { rupees } from "@/lib/content";
import type { CityOption, WizardCar } from "@/lib/plan-view";
import type { MoneyStepCopy, Said } from "./wizard-copy";
import { Say, StepHeading, type Figures } from "./wizard-ui";

const box = "rounded-xl border border-[#dfe4e8] bg-white";

/** A choice that invites a tap: the cue's light sweeps across it (wizard-motion.ts) and it gives under the finger. */
const tap = "wz-tap relative overflow-hidden motion-safe:active:scale-[0.97]";
const Sheen = () => <span aria-hidden className="wz-sheen" />;

export function CityStep({
  question,
  cities,
  value,
  onChange,
  headingId,
}: {
  question: Said;
  cities: CityOption[];
  value: string;
  onChange: (slug: string) => void;
  headingId: string;
}) {
  return (
    <>
      <StepHeading id={headingId}>
        <Say text={question} />
      </StepHeading>
      {/* Centred rows, so two cities or seven sit evenly in the card. */}
      <div role="radiogroup" aria-labelledby={headingId} className="mt-[18px] flex flex-wrap justify-center gap-x-3 gap-y-2.5 lg:mt-[26px] lg:gap-x-3.5 lg:gap-y-[15px]">
        {cities.map((city) => {
          const on = city.slug === value;
          return (
            <button
              key={city.slug}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(city.slug)}
              className={`${tap} flex h-[57px] w-[calc(50%-6px)] items-center gap-3 rounded-xl border px-[19px] text-left text-[17px] font-semibold leading-5 transition sm:w-[calc(33.333%-8px)] lg:h-[67px] lg:w-[187px] lg:px-5 ${
                on ? "border-navy bg-navy text-white" : "border-[#dfe4e8] bg-white text-navy hover:border-brand"
              }`}
            >
              <MapPin size={19} strokeWidth={2} className={`shrink-0 ${on ? "text-sun" : "text-brand"}`} />
              {city.name}
              {on ? (
                <span aria-hidden className="wz-check absolute right-2 top-2 grid size-[18px] place-items-center rounded-full bg-sun text-navy">
                  <Check size={11} strokeWidth={3.5} />
                </span>
              ) : null}
              <Sheen />
            </button>
          );
        })}
      </div>
    </>
  );
}

/** Model years oldest first, whichever order the admin or Jarvis gives them in. */
const sortedYears = (car: WizardCar) => [...car.years].sort();

export function CarStep({
  question,
  yearLabel,
  cars,
  value,
  onChange,
  year,
  onYear,
  showYears = true,
  headingId,
}: {
  question: Said;
  yearLabel: Said;
  cars: WizardCar[];
  value: string;
  onChange: (id: string) => void;
  year: string;
  onYear: (year: string) => void;
  /** Off where the model year is chosen on the next step instead. */
  showYears?: boolean;
  headingId: string;
}) {
  const car = cars.find((c) => c.id === value) ?? cars[0];
  const years = showYears ? sortedYears(car) : [];
  return (
    <>
      <StepHeading id={headingId}>
        <Say text={question} />
      </StepHeading>
      <div role="radiogroup" aria-labelledby={headingId} className="mt-[18px] flex flex-wrap justify-center gap-x-[11px] gap-y-3 lg:mt-[30px] lg:gap-4">
        {cars.map((c) => {
          const on = c.id === value;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(c.id)}
              className={`${tap} w-[calc(50%-6px)] rounded-[14px] border p-[11px] text-left transition sm:w-[calc(33.333%-8px)] lg:w-[calc(33.333%-11px)] lg:p-3 ${
                on ? "border-brand bg-[#eaf3fb] ring-1 ring-inset ring-brand" : "border-[#dfe4e8] bg-white hover:border-brand"
              }`}
            >
              <span className="relative block aspect-[163/96] overflow-hidden rounded-lg bg-mist lg:aspect-[228/140]">
                {c.image.url ? (
                  <Image src={c.image.url} alt={c.image.alt} fill sizes="(min-width: 1024px) 230px, 45vw" className="object-cover" />
                ) : null}
              </span>
              <span className="mt-2.5 flex min-h-6 items-center justify-between gap-2 lg:mt-[11px]">
                <span className="text-[17px] font-bold leading-6 text-navy">{c.name}</span>
                {on ? (
                  <span aria-hidden className="wz-check grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <Check size={14} strokeWidth={3} />
                  </span>
                ) : null}
              </span>
              <Sheen />
            </button>
          );
        })}
      </div>

      {years.length ? (
        <div className="mt-[22px] lg:mt-7 lg:flex lg:items-center lg:justify-center lg:gap-5">
          <p id={`${headingId}-year`} className="text-[17px] font-semibold leading-6 text-navy lg:text-lg lg:font-bold">
            <Say text={yearLabel} />
          </p>
          <div
            role="radiogroup"
            aria-labelledby={`${headingId}-year`}
            className="mt-2.5 flex rounded-full bg-[#e9eef3] p-1 lg:mt-0 lg:inline-flex"
          >
            {years.map((y) => {
              const on = y === year;
              return (
                <button
                  key={y}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => onYear(y)}
                  className={`${tap} h-[46px] min-w-0 flex-1 rounded-full px-2 text-base font-semibold transition lg:h-[42px] lg:flex-none lg:px-[25px] ${
                    on ? "bg-navy text-white" : "text-navy hover:bg-white/60"
                  }`}
                >
                  {y}
                  <Sheen />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

/** A white box with a small blue label over a row of round choices (tenure, model year). */
function ChoiceBox({ id, label, children, className = "" }: { id: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-4 pb-4 pt-[15px] lg:rounded-2xl lg:px-6 lg:pb-5 lg:pt-[19px] ${box} ${className}`}>
      <p id={id} className="text-xs font-semibold uppercase leading-4 tracking-[1px] text-brand">
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={id} className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 lg:mt-[13px] lg:gap-2.5">
        {children}
      </div>
    </div>
  );
}

/**
 * The step between the car and the plan: the car on the left, then the choices (Own Now's tenure,
 * Drive to Earn's model year) and what is paid first for them.
 */
export function MoneyStep({
  copy,
  car,
  carLabel,
  cityName,
  perks,
  tenures,
  tenure,
  onTenure,
  year,
  onYear,
  figures,
  headingId,
}: {
  copy: MoneyStepCopy;
  car: WizardCar;
  carLabel: string;
  cityName: string;
  perks: string[];
  tenures: string[];
  tenure: string;
  onTenure: (months: string) => void;
  year: string;
  onYear: (year: string) => void;
  figures: Figures;
  headingId: string;
}) {
  const lines = perks.map((p) => p.replace("{months}", tenure)).filter((p) => !p.includes("{"));
  const months = copy.tenure ? tenures : [];
  const years = copy.years && car.years.length > 1 ? sortedYears(car) : [];
  return (
    <>
      <StepHeading id={headingId}>{copy.title}</StepHeading>
      <div className="lg:mt-[30px] lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-8">
        <div className="mt-[18px] flex items-center gap-4 lg:mt-0 lg:block">
          <span className="relative block aspect-[456/280] w-[44%] shrink-0 overflow-hidden rounded-2xl bg-mist lg:w-full">
            {car.image.url ? <Image src={car.image.url} alt={car.image.alt} fill sizes="(min-width: 1024px) 360px, 45vw" className="object-cover" /> : null}
          </span>
          <span className="block min-w-0 lg:mt-5">
            <span className="block text-xl font-extrabold leading-7 text-navy lg:text-[28px] lg:leading-9">{carLabel}</span>
            <span className="mt-1 flex items-center gap-1.5 text-[15px] leading-5 text-navy lg:mt-1.5 lg:text-base">
              <MapPin aria-hidden size={16} className="shrink-0 text-brand" />
              {cityName}
            </span>
            {lines.length ? (
              <span className="mt-4 hidden space-y-2.5 lg:block">
                {lines.map((p) => (
                  <span key={p} className="flex items-center gap-2.5 text-[15px] leading-5 text-navy">
                    <CircleCheck aria-hidden size={20} className="shrink-0 fill-leaf text-white" />
                    {p}
                  </span>
                ))}
              </span>
            ) : null}
          </span>
        </div>
        <div>
          {years.length ? (
            <ChoiceBox id={`${headingId}-year`} label="Model Year" className="mt-[18px] lg:mt-0">
              {years.map((y) => {
                const on = y === year;
                return (
                  <button
                    key={y}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onYear(y)}
                    // Shares the row evenly, so five years fit a phone without scrolling.
                    className={`${tap} h-11 min-w-0 flex-1 rounded-full border px-2 text-base font-semibold tabular-nums transition ${
                      on ? "border-navy bg-navy text-white" : "border-[#dfe4e8] bg-white text-navy hover:border-brand"
                    }`}
                  >
                    {y}
                    <Sheen />
                  </button>
                );
              })}
            </ChoiceBox>
          ) : null}

          {months.length ? (
            <ChoiceBox id={`${headingId}-tenure`} label="Tenure" className={years.length ? "mt-3 lg:mt-4" : "mt-[18px] lg:mt-0"}>
              {months.map((m) => {
                const on = m === tenure;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onTenure(m)}
                    className={`${tap} flex h-[54px] w-[60px] shrink-0 flex-col items-center justify-center rounded-xl border text-navy transition lg:h-11 lg:w-auto lg:flex-row lg:gap-1 lg:rounded-full lg:px-[22px] ${
                      on ? "border-navy bg-navy text-white" : "border-[#dfe4e8] bg-white hover:border-brand"
                    }`}
                  >
                    <span className="text-lg font-bold leading-5 lg:text-base lg:font-semibold">{m}</span>
                    <span className={`text-[11px] leading-3 lg:text-base lg:font-semibold lg:leading-5 ${on ? "" : "text-ink-soft lg:text-navy"}`}>Months</span>
                    <Sheen />
                  </button>
                );
              })}
            </ChoiceBox>
          ) : null}

          {figures.money ? (
            <div className={`${years.length || months.length ? "mt-3 lg:mt-4" : "mt-[18px] lg:mt-0"} px-4 pb-[15px] pt-[19px] lg:rounded-2xl lg:px-6 lg:pb-[17px] lg:pt-[23px] ${box}`}>
              <p className="text-xs font-semibold uppercase leading-4 tracking-[1px] text-brand">{copy.label}</p>
              <p className="mt-1.5 flex items-baseline gap-2 text-navy lg:mt-2">
                <CountUp
                  value={rupees(figures.money)}
                  duration={380}
                  className="text-[30px] font-extrabold leading-9 tracking-[-0.5px] tabular-nums lg:text-[40px] lg:leading-[48px]"
                />
                {figures.onwards ? <span className="text-[15px] font-semibold lg:text-[17px]">onwards</span> : null}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
