"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown, CircleCheck, MapPin, Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import { rupees } from "@/lib/content";
import type { OwnNowCalculatorView, OwnNowYear } from "@/lib/fleet-data";

/** Jarvis's rule: the rent at the lowest upfront, less one step for every step paid on top. */
function dailyRent(year: OwnNowYear, upfront: number): number {
  if (!year.upfrontStep || !year.rentStep) return year.rent;
  const steps = Math.round((upfront - year.minUpfront) / year.upfrontStep);
  return Math.max(0, year.rent - steps * year.rentStep);
}

/** "Wagon R - 2025" reads as 2025 in the Model year picker; any other name stays whole. */
const yearLabel = (name: string) => /(\d{4})\s*$/.exec(name)?.[1] ?? name;

const money = (n: number) => rupees(String(n));

function Picker({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const id = useId();
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="block text-xs font-semibold uppercase leading-4 tracking-[1px] text-navy">
        {label}
      </label>
      <div className="relative mt-2.5">
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
      </div>
    </div>
  );
}

/** The Own Now plan calculator: city, car, model year and tenure, then the upfront slider. */
export function OwnNowCalculator({ view }: { view: OwnNowCalculatorView }) {
  const cityId = useId();
  const [citySlug, setCitySlug] = useState(view.cities[0].slug);
  const city = view.cities.find((c) => c.slug === citySlug) ?? view.cities[0];
  const [carKey, setCarKey] = useState(city.cars[0].key);
  const car = city.cars.find((c) => c.key === carKey) ?? city.cars[0];
  const [yearIndex, setYearIndex] = useState(0);
  const year = car.years[yearIndex] ?? car.years[0];
  const [tenure, setTenure] = useState(view.tenures[0] ?? "");
  const [upfront, setUpfront] = useState(year.minUpfront);
  const paid = Math.min(Math.max(upfront, year.minUpfront), year.maxUpfront);
  const daily = dailyRent(year, paid);
  const slides = year.maxUpfront > year.minUpfront && year.upfrontStep > 0;
  const fill = slides ? ((paid - year.minUpfront) / (year.maxUpfront - year.minUpfront)) * 100 : 0;

  const pickCity = (slug: string) => {
    const next = view.cities.find((c) => c.slug === slug) ?? view.cities[0];
    setCitySlug(next.slug);
    setCarKey(next.cars[0].key);
    setYearIndex(0);
    setUpfront(next.cars[0].years[0].minUpfront);
  };
  const pickCar = (key: string) => {
    const next = city.cars.find((c) => c.key === key) ?? city.cars[0];
    setCarKey(next.key);
    setYearIndex(0);
    setUpfront(next.years[0].minUpfront);
  };
  const pickYear = (i: number) => {
    setYearIndex(i);
    setUpfront((car.years[i] ?? car.years[0]).minUpfront);
  };

  const perks = view.perks.map((p) => p.replace("{months}", tenure)).filter((p) => !p.includes("{"));

  return (
    <section id="plan" className="scroll-mt-24 bg-[#eef2f6] px-4 py-14 lg:py-[72px]">
      <div className="mx-auto max-w-[1182px]">
        <p className="text-center text-sm font-semibold uppercase leading-5 tracking-[1.5px] text-brand">Plan calculator</p>
        <h2 className="mt-3 text-center text-[32px] font-extrabold leading-10 tracking-[-0.5px] text-navy lg:text-[56px] lg:leading-[64px]">
          Choose Your Car &amp; Model
        </h2>
        <p className="mt-3 text-center text-base leading-6 text-ink-soft lg:text-lg">Drive India&apos;s most trusted and well-maintained fleet</p>

        <div className="mt-8 flex flex-col items-center">
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
          <p className="mt-3.5 text-sm leading-5 text-ink-soft">Vehicle availability varies by city</p>
        </div>

        <div className="mt-11 grid overflow-hidden rounded-[24px] bg-white shadow-[0_10px_40px_rgb(6_47_80/0.08)] lg:grid-cols-[519px_1fr]">
          <div className="border-line p-5 lg:border-r lg:p-8">
            <div className="aspect-[456/280] overflow-hidden rounded-2xl bg-mist">
              {car.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={car.photo.url} alt={car.photo.alt || car.name} className="size-full object-cover" />
              ) : null}
            </div>
            <h3 className="mt-6 text-[32px] font-extrabold leading-10 tracking-[-0.5px] text-navy lg:mt-8 lg:text-[44px] lg:leading-[52px]">{car.name}</h3>
            <p className="mt-2 flex items-center gap-2 text-lg leading-6 text-navy">
              <MapPin aria-hidden size={18} className="text-brand" />
              {city.name}
            </p>
            {perks.length ? (
              <ul className="mt-5 space-y-3">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-base leading-6 text-navy">
                    <CircleCheck aria-hidden size={22} className="shrink-0 fill-leaf text-white" />
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="p-5 lg:p-8">
            <div className="flex flex-col gap-4 rounded-2xl border border-line p-5 sm:flex-row lg:p-6">
              <Picker label="Select car" value={car.key} onChange={pickCar} options={city.cars.map((c) => ({ value: c.key, label: c.name }))} />
              <Picker
                label="Model year"
                value={String(yearIndex)}
                onChange={(v) => pickYear(Number(v))}
                options={car.years.map((y, i) => ({ value: String(i), label: yearLabel(y.name) }))}
              />
              {view.tenures.length ? (
                <Picker label="Tenure" value={tenure} onChange={setTenure} options={view.tenures.map((m) => ({ value: m, label: `${m} Months` }))} />
              ) : null}
            </div>

            <div className="mt-9 flex items-baseline justify-between gap-4">
              <p className="text-lg leading-6 text-navy">{view.label}</p>
              <p className="text-[28px] font-extrabold leading-8 text-navy">{money(paid)}</p>
            </div>
            {slides ? (
              <>
                <input
                  type="range"
                  min={year.minUpfront}
                  max={year.maxUpfront}
                  step={year.upfrontStep}
                  value={paid}
                  onChange={(e) => setUpfront(Number(e.target.value))}
                  aria-label={view.label}
                  aria-valuetext={money(paid)}
                  style={{ "--fill": `${fill}%` } as React.CSSProperties}
                  className="range-slider mt-6 w-full"
                />
                <div className="mt-3 flex justify-between gap-3 text-xs leading-4 text-ink-soft lg:text-[13px]">
                  <span>{money(year.minUpfront)}</span>
                  <span className="hidden sm:inline">Higher {view.label.toLowerCase()} → lower daily</span>
                  <span>{money(year.maxUpfront)}</span>
                </div>
              </>
            ) : null}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line px-5 py-4">
                <p className="text-sm leading-5 text-ink-soft">You pay each day</p>
                <p className="mt-1.5 text-navy">
                  <span className="text-[32px] font-extrabold leading-10">{money(daily)}</span>
                  {tenure ? <span className="ml-2 text-xl leading-7">for {tenure} months</span> : null}
                </p>
              </div>
              <div className="rounded-2xl border border-line px-5 py-4">
                <p className="text-sm leading-5 text-ink-soft">{view.label}</p>
                <p className="mt-1.5 text-[32px] font-extrabold leading-10 text-navy">{money(paid)}</p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <a
                href={PHONE_HREF}
                className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-line px-4 text-base font-medium text-navy transition hover:bg-navy/5 lg:px-6 lg:text-lg"
              >
                <Phone aria-hidden size={20} strokeWidth={1.75} />
                Call Now
              </a>
              <Link
                href="#apply"
                className="flex h-14 flex-1 items-center justify-center whitespace-nowrap rounded-full bg-brand px-4 text-base font-bold text-white transition hover:brightness-110 lg:px-6 lg:text-lg"
              >
                Apply for this car
              </Link>
            </div>
            <p className="mt-5 text-center text-base leading-6 text-navy">
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
