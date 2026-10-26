"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, CircleCheck, MapPin, Phone } from "lucide-react";
import { CountUp } from "@/components/fx/count-up";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import { rupees } from "@/lib/content";
import type { PublicCalculatorView } from "@/lib/fleet-data";
import { useTapInvite } from "./wizard-motion";
import { CarPlaceholder } from "./car-placeholder";

/** "Wagon R - 2025" reads as 2025 in the Model year picker; a car Jarvis prices without years reads "Any Year". */
const yearLabel = (name: string) => (name ? (/(\d{4})\s*$/.exec(name)?.[1] ?? name) : "Any Year");

const money = (n: number) => rupees(String(n));

function Picker({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`min-w-0 flex-1 ${className}`}>
      <label htmlFor={id} className="block text-xs font-semibold uppercase leading-4 tracking-[1px] text-navy">
        {label}
      </label>
      {/* The tap cue (wizard-motion.ts) lifts the box and sweeps its light across it. */}
      <div className="wz-tap relative mt-2 overflow-hidden rounded-xl lg:mt-2.5">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-xl border border-line bg-white pl-4 pr-10 text-base font-semibold text-navy outline-none focus-visible:border-brand"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-navy" />
        <span aria-hidden className="wz-sheen" />
      </div>
    </div>
  );
}

/** The figure tile: compact on phones, larger from lg. */
const tile = "rounded-xl border border-line bg-[#f7f9fb] px-3 py-2.5 lg:rounded-2xl lg:bg-transparent lg:px-5 lg:py-4";
const tileLabel = "text-xs leading-4 text-ink-soft lg:text-sm lg:leading-5";
const tileValue = "text-lg font-bold leading-6 tabular-nums lg:text-[32px] lg:font-extrabold lg:leading-10";

/**
 * A plan's calculator: city, car, model year and tenure, then the lowest that is paid first for
 * them ("onwards" where Jarvis lets more be paid on top).
 */
export function PlanCalculator({ view, id = "plan" }: { view: PublicCalculatorView; /** The section's anchor. */ id?: string }) {
  const cityId = useId();
  const [citySlug, setCitySlug] = useState(view.cities[0].slug);
  const city = view.cities.find((c) => c.slug === citySlug) ?? view.cities[0];
  const [carKey, setCarKey] = useState(city.cars[0].key);
  const car = city.cars.find((c) => c.key === carKey) ?? city.cars[0];
  const [yearIndex, setYearIndex] = useState(0);
  const year = car.years[yearIndex] ?? car.years[0];
  const [tenure, setTenure] = useState(view.tenures[0] ?? "");
  const onwards = year.money !== null && (year.maxMoney ?? year.money) > year.money;

  const pickCity = (slug: string) => {
    const next = view.cities.find((c) => c.slug === slug) ?? view.cities[0];
    setCitySlug(next.slug);
    setCarKey(next.cars[0].key);
    setYearIndex(0);
  };
  const pickCar = (key: string) => {
    const next = city.cars.find((c) => c.key === key) ?? city.cars[0];
    setCarKey(next.key);
    setYearIndex(0);
  };

  const perks = view.perks.map((p) => p.replace("{months}", tenure)).filter((p) => !p.includes("{"));

  // Until the visitor touches the calculator, its pickers are cued once in view (and once more
  // after a quiet spell).
  const [touched, setTouched] = useState(false);
  const pickers = useRef<HTMLDivElement>(null);
  useTapInvite(pickers, !touched, 0, 500, 1);

  return (
    <section id={id} data-no-reveal className="scroll-mt-24 bg-[#eef2f6] px-4 py-14 lg:py-[72px]">
      <div className="mx-auto max-w-[1182px]">
        <p className="text-center text-xs font-bold uppercase leading-5 tracking-[1.5px] text-brand lg:text-sm lg:font-semibold">
          <span aria-hidden className="mr-2 inline-block h-0.5 w-5 rounded-full bg-brand align-middle lg:hidden" />
          Plan calculator
        </p>
        <h2 className="mt-2 text-center text-2xl font-bold leading-8 tracking-[-0.3px] text-navy lg:mt-3 lg:text-[56px] lg:font-extrabold lg:leading-[64px] lg:tracking-[-0.5px]">
          Choose Your Car &amp; Model
        </h2>
        <p className="mt-1.5 text-center text-sm leading-5 text-ink-soft lg:mt-3 lg:text-lg lg:leading-6">Drive India&apos;s most trusted and well-maintained fleet</p>

        <div className="mt-5 flex flex-col items-center lg:mt-8">
          <label htmlFor={cityId} className="sr-only">
            City
          </label>
          <div className="relative">
            <MapPin aria-hidden size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white" />
            <select
              id={cityId}
              value={city.slug}
              onChange={(e) => pickCity(e.target.value)}
              className="h-10 appearance-none rounded-full bg-brand pl-10 pr-10 text-base font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
              {view.cities.map((c) => (
                <option key={c.slug} value={c.slug} className="text-navy">
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white" />
          </div>
          <p className="mt-3.5 hidden text-sm leading-5 text-ink-soft lg:block">Vehicle availability varies by city</p>
        </div>

        <div
          // A tap or a change counts; a finger scrolling past the card does not.
          onClickCapture={() => setTouched(true)}
          onChangeCapture={() => setTouched(true)}
          onKeyDownCapture={() => setTouched(true)}
          className="mt-6 grid overflow-hidden rounded-2xl border-t-[3px] border-sun bg-white shadow-[0_10px_40px_rgb(6_47_80/0.08)] lg:mt-11 lg:grid-cols-[519px_1fr] lg:rounded-[24px] lg:border-t-0"
        >
          <div className="border-line lg:border-r lg:p-8">
            <div className="relative aspect-[456/280] overflow-hidden bg-mist lg:rounded-2xl">
              {car.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={car.photo.url} src={car.photo.url} alt={car.photo.alt || car.name} className="wz-swap size-full object-cover" />
              ) : (
                <CarPlaceholder size={80} />
              )}
            </div>
            <h3 key={car.key} className="wz-swap mx-5 mt-5 text-[22px] font-bold leading-7 tracking-[-0.3px] text-navy lg:mx-0 lg:mt-8 lg:text-[44px] lg:font-extrabold lg:leading-[52px] lg:tracking-[-0.5px]">
              {car.name}
            </h3>
            <p className="mt-2 hidden items-center gap-2 text-lg leading-6 text-navy lg:flex">
              <MapPin aria-hidden size={18} className="text-brand" />
              {city.name}
            </p>
            {perks.length ? (
              <ul className="mt-5 hidden space-y-3 lg:block">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-base leading-6 text-navy">
                    <CircleCheck aria-hidden size={22} className="shrink-0 fill-leaf text-white" />
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="px-5 pb-5 pt-4 lg:p-8">
            <div ref={pickers} className="grid grid-cols-2 gap-x-3 gap-y-4 lg:flex lg:flex-row lg:gap-4 lg:rounded-2xl lg:border lg:border-line lg:p-6">
              <Picker label="Select car" value={car.key} onChange={pickCar} options={city.cars.map((c) => ({ value: c.key, label: c.name }))} />
              <Picker
                label="Model year"
                value={String(yearIndex)}
                onChange={(v) => setYearIndex(Number(v))}
                options={car.years.map((y, i) => ({ value: String(i), label: yearLabel(y.name) }))}
              />
              {view.tenures.length ? (
                <Picker
                  label="Tenure"
                  value={tenure}
                  onChange={setTenure}
                  options={view.tenures.map((m) => ({ value: m, label: `${m} Months` }))}
                  className="col-span-2"
                />
              ) : null}
            </div>

            {year.money !== null ? (
              <div className={`mt-4 lg:mt-8 ${tile}`}>
                <p className={tileLabel}>{view.label}</p>
                <p className="mt-1 text-navy lg:mt-1.5">
                  <CountUp value={money(year.money)} duration={380} className={tileValue} />
                  {onwards ? <span className="ml-1.5 text-xs leading-4 lg:ml-2 lg:text-xl lg:leading-7">onwards</span> : null}
                </p>
              </div>
            ) : null}

            {perks.length ? (
              <ul className="mt-4 space-y-2 lg:hidden">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm leading-5 text-navy">
                    <CircleCheck aria-hidden size={20} className="shrink-0 fill-leaf text-white" />
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Phones: Apply on top, both full width. */}
            <div className="mt-5 flex flex-col-reverse gap-3 lg:mt-8 lg:flex-row">
              <a
                href={PHONE_HREF}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-line px-4 text-base font-medium text-navy transition hover:bg-navy/5 lg:h-14 lg:px-6 lg:text-lg"
              >
                <Phone aria-hidden size={20} strokeWidth={1.75} />
                Call Now
              </a>
              <Link
                href="#apply"
                className="flex h-12 flex-none items-center justify-center whitespace-nowrap rounded-full bg-brand px-4 text-base font-bold text-white transition hover:brightness-110 lg:h-14 lg:flex-1 lg:px-6 lg:text-lg"
              >
                Apply For This Car
              </Link>
            </div>
            <p className="mt-4 text-center text-[13px] leading-5 text-navy lg:mt-5 lg:text-base lg:leading-6">
              Or reach us directly ·{" "}
              <a href={PHONE_HREF} className="hover:underline">
                {PHONE_DISPLAY}
              </a>{" "}
              ·{" "}
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="hover:underline">
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
