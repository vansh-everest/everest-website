"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { CitySelect } from "@/components/home/city-select";
import { PHONE_HREF } from "@/components/home/ui";
import { rupees, type DepositOption, type ImageSlot } from "@/lib/content";
import type { CityOption } from "@/lib/plan-view";

export type CalculatorCarView = {
  id: string;
  make: string;
  name: string;
  condition: string;
  modelYears: string[];
  image: ImageSlot;
  options: DepositOption[];
  defaultOption: number;
};

const field = "h-12 w-full appearance-none rounded-md border border-line bg-white px-4 pr-12 text-base text-navy outline-none focus:border-brand";

function Picker({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-[13px] font-medium leading-4 text-navy">
      {label}
      <span className="relative mt-2 block">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={field}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={22} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy" />
      </span>
    </label>
  );
}

export function CalculatorView({
  cities,
  cars,
  tenures,
  perks,
}: {
  cities: CityOption[];
  cars: CalculatorCarView[];
  tenures: string[];
  perks: string[];
}) {
  const [city, setCity] = useState(cities[0]?.slug ?? "");
  const [carId, setCarId] = useState(cars[0].id);
  const car = cars.find((c) => c.id === carId) ?? cars[0];
  const [year, setYear] = useState(car.modelYears[0] ?? "");
  const [tenure, setTenure] = useState(tenures[0] ?? "");
  const [index, setIndex] = useState(car.defaultOption);

  function pickCar(id: string) {
    const next = cars.find((c) => c.id === id) ?? cars[0];
    setCarId(next.id);
    setYear(next.modelYears[0] ?? "");
    setIndex(next.defaultOption);
  }

  const cityName = cities.find((c) => c.slug === city)?.name ?? "";
  const option = car.options[Math.min(index, car.options.length - 1)];
  const first = car.options[0];
  const last = car.options[car.options.length - 1];

  return (
    <>
      <div className="mt-8 text-center">
        <CitySelect cities={cities} value={city} onChange={setCity} size="lg" />
        <p className="mt-3 text-[13px] leading-4 text-ink-soft/60">Vehicle availability varies by city</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-[1184px] overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(6,47,80,0.08)] lg:mt-12 lg:grid-cols-[520px_1fr]">
        <div className="border-line p-5 sm:p-8 lg:border-r">
          <div className="relative aspect-[456/280] overflow-hidden rounded-lg bg-mist">
            {car.image.url ? (
              <Image src={car.image.url} alt={car.image.alt} fill sizes="(min-width: 1024px) 456px, 100vw" className="object-cover" />
            ) : null}
            {car.condition ? (
              <span className="absolute left-3 top-3 flex h-[21px] items-center rounded-full bg-sun px-3 text-[11px] font-bold uppercase text-navy">
                {car.condition}
              </span>
            ) : null}
          </div>
          <p className="mt-6 text-xl leading-7 text-ink-soft/70">{[car.make, year].filter(Boolean).join(" · ")}</p>
          <h3 className="mt-1 text-[34px] font-bold leading-[42px] text-navy lg:text-[40px] lg:leading-[48px]">{car.name}</h3>
          {cityName ? (
            <p className="mt-3 flex items-center gap-1.5 text-xl leading-7 text-navy">
              <MapPin size={18} className="text-brand" />
              {cityName}
            </p>
          ) : null}
          <ul className="mt-4 space-y-2.5">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-[15px] leading-5 text-navy">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-leaf text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                {perk.replaceAll("{months}", tenure)}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid content-start gap-6 p-5 sm:p-8">
          <Picker label="Select car" value={car.id} onChange={pickCar} options={cars.map((c) => ({ value: c.id, label: c.name }))} />
          {car.modelYears.length ? (
            <Picker label="Model Year" value={year} onChange={setYear} options={car.modelYears.map((y) => ({ value: y, label: y }))} />
          ) : null}
          {tenures.length ? (
            <Picker label="Tenure" value={tenure} onChange={setTenure} options={tenures.map((t) => ({ value: t, label: `${t} Months` }))} />
          ) : null}

          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-lg text-navy lg:text-xl">Upfront payment</p>
              <p className="text-2xl font-bold text-navy">{rupees(option.deposit)}</p>
            </div>
            {car.options.length > 1 ? (
              <>
                <input
                  type="range"
                  min={0}
                  max={car.options.length - 1}
                  step={1}
                  value={index}
                  onChange={(e) => setIndex(Number(e.target.value))}
                  aria-label="Upfront payment"
                  aria-valuetext={rupees(option.deposit)}
                  style={{ "--fill": `${(index / (car.options.length - 1)) * 100}%` } as React.CSSProperties}
                  className="range-slider mt-5 w-full"
                />
                <div className="mt-3 flex justify-between gap-3 text-xs text-ink-soft/80">
                  <span>{rupees(first.deposit)}</span>
                  <span className="text-center">Higher deposit → lower daily</span>
                  <span>{rupees(last.deposit)}</span>
                </div>
              </>
            ) : null}
          </div>

          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
            <div>
              <p className="text-sm leading-[21px] text-ink-soft">You pay each day</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-3">
                <span className="text-5xl font-extrabold leading-[64px] text-navy lg:text-[56px]">{rupees(option.daily)}</span>
                {tenure ? <span className="whitespace-nowrap text-xl text-ink-soft">for {tenure} months</span> : null}
              </p>
            </div>
            <div>
              <p className="text-sm leading-[21px] text-ink-soft">Joining deposit</p>
              <p className="mt-1 text-5xl font-extrabold leading-[64px] text-navy lg:text-[56px]">{rupees(option.deposit)}</p>
            </div>
          </div>

          <div>
            <div className="flex gap-4">
              <a
                href={PHONE_HREF}
                className="flex h-14 w-24 shrink-0 items-center justify-center rounded-full border-[1.5px] border-navy text-base font-bold text-navy"
              >
                Call
              </a>
              <Link href="#apply" className="flex h-14 flex-1 items-center justify-center rounded-full bg-brand text-base font-bold text-white transition hover:brightness-110">
                Apply for this car
              </Link>
            </div>
            <p className="mt-4 text-center text-xs leading-[17px] text-ink-soft">Plans, fees and deductions subject to terms and conditions.</p>
          </div>
        </div>
      </div>
    </>
  );
}
