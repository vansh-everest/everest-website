import Image from "next/image";
import { Check, MapPin } from "lucide-react";
import { rupees } from "@/lib/content";
import type { CityOption, WizardCar } from "@/lib/plan-view";
import type { Said } from "./wizard-copy";
import { rentLabel, Say, shortRupees, StepHeading, type Figures } from "./wizard-ui";

const box = "rounded-xl border border-[#dfe4e8] bg-white";

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
      <div role="radiogroup" aria-labelledby={headingId} className="mt-[18px] grid grid-cols-2 gap-x-3 gap-y-2.5 sm:grid-cols-3 lg:mt-[26px] lg:grid-cols-[repeat(4,187px)] lg:gap-x-3.5 lg:gap-y-[15px]">
        {cities.map((city) => {
          const on = city.slug === value;
          return (
            <button
              key={city.slug}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(city.slug)}
              className={`flex h-[57px] items-center gap-3 rounded-xl border px-[19px] text-left text-[17px] font-semibold leading-5 transition lg:h-[67px] lg:px-5 ${
                on ? "border-navy bg-navy text-white" : "border-[#dfe4e8] bg-white text-navy hover:border-brand"
              }`}
            >
              <MapPin size={19} strokeWidth={2} className={`shrink-0 ${on ? "text-sun" : "text-brand"}`} />
              {city.name}
            </button>
          );
        })}
      </div>
    </>
  );
}

export function CarStep({
  question,
  yearLabel,
  cars,
  value,
  onChange,
  year,
  onYear,
  headingId,
}: {
  question: Said;
  yearLabel: Said;
  cars: WizardCar[];
  value: string;
  onChange: (id: string) => void;
  year: string;
  onYear: (year: string) => void;
  headingId: string;
}) {
  const car = cars.find((c) => c.id === value) ?? cars[0];
  // Listed oldest first, whichever order the admin typed them in.
  const years = [...car.years].sort();
  return (
    <>
      <StepHeading id={headingId}>
        <Say text={question} />
      </StepHeading>
      <div role="radiogroup" aria-labelledby={headingId} className="mt-[18px] grid grid-cols-2 gap-x-[11px] gap-y-3 sm:grid-cols-3 lg:mt-[30px] lg:gap-4">
        {cars.map((c) => {
          const on = c.id === value;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(c.id)}
              className={`rounded-[14px] border p-[11px] text-left transition lg:p-3 ${
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
                  <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <Check size={14} strokeWidth={3} />
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {years.length ? (
        <div className="mt-[22px] lg:mt-7 lg:flex lg:items-center lg:gap-5">
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
                  className={`h-[46px] flex-1 rounded-full px-[22px] text-base font-semibold transition lg:h-[42px] lg:flex-none lg:px-[25px] ${
                    on ? "bg-navy text-white" : "text-navy hover:bg-white/60"
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

/** The navy strip with the daily figure, and a yellow note on the right. */
export function RentStrip({ figures, badge, children }: { figures: Figures; badge?: string; children?: React.ReactNode }) {
  if (!figures.amount) return null;
  return (
    <div className="rounded-2xl bg-navy px-4 pb-4 pt-3.5 text-white lg:px-6 lg:pt-4">
      <div className="flex items-center justify-between gap-3">
        <p>
          <span className="block text-xs leading-4 text-white/85 lg:text-[13px] lg:leading-5">{rentLabel(figures.unit)}</span>
          <span className="mt-1 flex items-baseline gap-1.5 lg:mt-0.5 lg:gap-2">
            <span className="text-[34px] font-bold leading-10 tracking-[-0.5px] lg:text-[42px] lg:leading-[48px]">{rupees(figures.amount)}</span>
            <span className="text-[15px] lg:text-[17px]">{figures.unit.replace(/^\+/, "")}</span>
          </span>
        </p>
        {badge ? (
          <span className="shrink-0 rounded-full bg-sun px-3 py-[7px] text-xs font-bold leading-4 text-navy lg:px-4 lg:py-[9px] lg:text-sm lg:leading-4">
            {badge}
          </span>
        ) : null}
      </div>
      {children ? <p className="mt-3 border-t border-white/15 pt-3 text-sm leading-5 text-white/90 lg:mt-[11px] lg:pt-[11px]">{children}</p> : null}
    </div>
  );
}

export function UpfrontStep({
  car,
  tenures,
  tenure,
  onTenure,
  index,
  onIndex,
  figures,
  headingId,
}: {
  car: WizardCar;
  tenures: string[];
  tenure: string;
  onTenure: (months: string) => void;
  index: number;
  onIndex: (i: number) => void;
  figures: Figures;
  headingId: string;
}) {
  const options = car.options;
  const point = options.length ? Math.min(index, options.length - 1) : 0;
  const ends = options.length > 1 ? [options[0], options.length > 2 ? options[Math.floor((options.length - 1) / 2)] : null, options[options.length - 1]] : [];
  return (
    <>
      <StepHeading id={headingId}>Choose your Tenure &amp; Upfront</StepHeading>

      {tenures.length ? (
        <div className={`mt-[18px] px-4 pb-4 pt-[15px] lg:mt-[30px] lg:rounded-2xl lg:px-6 lg:pb-5 lg:pt-[19px] ${box}`}>
          <p id={`${headingId}-tenure`} className="text-xs font-semibold uppercase leading-4 tracking-[1px] text-brand">
            Tenure
          </p>
          <div role="radiogroup" aria-labelledby={`${headingId}-tenure`} className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 lg:mt-[13px] lg:gap-2.5">
            {tenures.map((m) => {
              const on = m === tenure;
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => onTenure(m)}
                  className={`flex h-[54px] w-[60px] shrink-0 flex-col items-center justify-center rounded-xl border text-navy transition lg:h-11 lg:w-auto lg:flex-row lg:gap-1 lg:rounded-full lg:px-[22px] ${
                    on ? "border-navy bg-navy text-white" : "border-[#dfe4e8] bg-white hover:border-brand"
                  }`}
                >
                  <span className="text-lg font-bold leading-5 lg:text-base lg:font-semibold">{m}</span>
                  <span className={`text-[11px] leading-3 lg:text-base lg:font-semibold lg:leading-5 ${on ? "" : "text-ink-soft lg:text-navy"}`}>months</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {options.length ? (
        <div className={`mt-3 px-4 pb-[15px] pt-[19px] lg:mt-4 lg:rounded-2xl lg:px-6 lg:pb-[17px] lg:pt-[23px] ${box}`}>
          <p className="text-xs font-semibold uppercase leading-4 tracking-[1px] text-brand">Upfront · paid once</p>
          <p className="mt-1.5 text-[30px] font-extrabold leading-9 tracking-[-0.5px] text-navy lg:mt-2 lg:text-[40px] lg:leading-[48px]">
            {rupees(options[point].deposit)}
          </p>
          {ends.length ? (
            <>
              <input
                type="range"
                min={0}
                max={options.length - 1}
                step={1}
                value={point}
                onChange={(e) => onIndex(Number(e.target.value))}
                aria-label="Upfront"
                aria-valuetext={rupees(options[point].deposit)}
                style={{ "--fill": `${(point / (options.length - 1)) * 100}%` } as React.CSSProperties}
                className="range-slider mt-4 w-full lg:mt-5"
              />
              <div className="mt-3.5 flex justify-between text-xs leading-4 text-ink-soft lg:text-sm">
                {ends.map((o, i) =>
                  o ? (
                    <span key={i}>
                      <span className="hidden lg:inline">{rupees(o.deposit)}</span>
                      <span className="lg:hidden">{shortRupees(o.deposit)}</span>
                    </span>
                  ) : null
                )}
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="mt-3 lg:mt-4">
        <RentStrip figures={figures} badge={figures.months ? `Yours in month ${figures.months}` : undefined} />
      </div>
    </>
  );
}
