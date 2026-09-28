"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ChevronDown, MapPin, Phone } from "lucide-react";
import { CitySelect } from "@/components/home/city-select";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import { rupees, type DepositOption, type ImageSlot } from "@/lib/content";
import type { CityOption } from "@/lib/plan-view";

export type CalculatorCarView = {
  id: string;
  name: string;
  condition: string;
  modelYears: string[];
  image: ImageSlot;
  options: DepositOption[];
  defaultOption: number;
};

const field =
  "h-[51px] w-full appearance-none rounded-lg border border-line bg-white pl-4 pr-8 text-base font-bold tracking-normal text-navy outline-none focus:border-brand lg:h-12 lg:font-semibold";

function Picker({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <label className={`block text-[11px] font-semibold uppercase leading-4 tracking-[1px] text-navy lg:text-xs ${className}`}>
      {label}
      <span className="relative mt-1 block lg:mt-2">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={field}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy" />
      </span>
    </label>
  );
}

function Perks({ perks, tenure, className }: { perks: string[]; tenure: string; className: string }) {
  if (!perks.length) return null;
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {perks.map((perk) => (
        <li key={perk} className="flex items-center gap-3 text-[15px] leading-5 text-navy lg:text-base">
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-leaf text-white">
            <Check size={12} strokeWidth={3} />
          </span>
          {perk.replaceAll("{months}", tenure)}
        </li>
      ))}
    </ul>
  );
}

function Result({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border border-line bg-[#f8fafc] p-3 lg:px-5 lg:pb-[17px] lg:pt-[21px]">
      <p className="text-[13px] leading-4 text-ink-soft">{label}</p>
      <p className="lg:mt-1.5 lg:flex lg:flex-wrap lg:items-baseline lg:gap-x-2">
        <span className="block text-2xl font-extrabold leading-8 text-navy lg:text-[32px] lg:leading-10">{value}</span>
        {note ? <span className="block text-[13px] leading-4 text-ink-soft lg:text-xl lg:leading-7">{note}</span> : null}
      </p>
    </div>
  );
}

export function CalculatorView({
  cities,
  cars,
  depositLabel,
  tenures,
  perks,
}: {
  cities: CityOption[];
  cars: CalculatorCarView[];
  depositLabel: string;
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

  // Three pickers sit in one row on a desktop; below that the tenure takes the second row to itself.
  const pickers = 1 + (car.modelYears.length ? 1 : 0) + (tenures.length ? 1 : 0);
  const columns = pickers === 3 ? "grid-cols-2 lg:grid-cols-3" : pickers === 2 ? "grid-cols-2" : "grid-cols-1";

  return (
    <>
      <div className="mt-3 text-center lg:mt-[30px]">
        <CitySelect cities={cities} value={city} onChange={setCity} size="lg" filled />
        <p className="mt-3 hidden text-[13px] leading-4 text-ink-soft/60 lg:block">Vehicle availability varies by city</p>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1182px] overflow-hidden rounded-3xl border border-t-[3px] border-line border-t-sun bg-white shadow-[0_8px_30px_rgba(6,47,80,0.08)] lg:mt-[57px] lg:grid-cols-[518px_1fr] lg:border-0">
        <div className="border-line px-5 lg:border-r lg:p-8 lg:pb-10 lg:pt-[31px]">
          <div className="relative -mx-5 aspect-[378/220] overflow-hidden bg-mist lg:mx-0 lg:aspect-[456/280] lg:rounded-lg">
            {car.image.url ? (
              <Image src={car.image.url} alt={car.image.alt} fill sizes="(min-width: 1024px) 456px, 100vw" className="object-cover object-top lg:object-center" />
            ) : null}
            {car.condition ? (
              <span className="absolute left-[11px] top-2.5 flex h-[23px] items-center rounded-full bg-sun px-3 text-[13px] font-medium uppercase tracking-[0.5px] text-navy lg:left-3 lg:top-3 lg:h-[21px] lg:text-[11px] lg:font-bold lg:tracking-normal">
                {car.condition}
              </span>
            ) : null}
          </div>
          <h3 className="mt-5 text-[28px] font-bold leading-9 text-navy lg:mt-[29px] lg:text-[40px] lg:leading-[48px]">{car.name}</h3>
          {cityName ? (
            <p className="mt-2 hidden items-center gap-1.5 text-xl leading-7 text-navy lg:flex">
              <MapPin size={18} className="text-brand" />
              {cityName}
            </p>
          ) : null}
          <Perks perks={perks} tenure={tenure} className="mt-5 hidden lg:block" />
        </div>

        <div className="grid content-start gap-6 px-5 pb-5 pt-6 lg:gap-7 lg:p-8 lg:pb-7 lg:pt-[31px]">
          <div className={`grid gap-4 lg:rounded-2xl lg:border lg:border-line lg:p-6 ${columns}`}>
            <Picker label="Select car" value={car.id} onChange={pickCar} options={cars.map((c) => ({ value: c.id, label: c.name }))} />
            {car.modelYears.length ? (
              <Picker label="Model year" value={year} onChange={setYear} options={car.modelYears.map((y) => ({ value: y, label: y }))} />
            ) : null}
            {tenures.length ? (
              <Picker
                label="Tenure"
                value={tenure}
                onChange={setTenure}
                options={tenures.map((t) => ({ value: t, label: `${t} Months` }))}
                className={pickers === 3 ? "col-span-2 lg:col-span-1" : ""}
              />
            ) : null}
          </div>

          <div className="lg:mt-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-lg text-navy lg:text-xl">{depositLabel}</p>
              <p className="text-2xl font-bold text-navy lg:text-[26px]">{rupees(option.deposit)}</p>
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
                  aria-label={depositLabel}
                  aria-valuetext={rupees(option.deposit)}
                  style={{ "--fill": `${(index / (car.options.length - 1)) * 100}%` } as React.CSSProperties}
                  className="range-slider mt-1.5 w-full lg:mt-6"
                />
                <div className="mt-2.5 flex justify-between gap-3 text-xs text-ink-soft/80">
                  <span>{rupees(first.deposit)}</span>
                  <span className="text-center">Higher {depositLabel.toLowerCase()} → lower daily</span>
                  <span>{rupees(last.deposit)}</span>
                </div>
              </>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 lg:gap-4">
            <Result label="You pay each day" value={rupees(option.daily)} note={tenure ? `for ${tenure} months` : "/day"} />
            <Result label={depositLabel} value={rupees(option.deposit)} />
          </div>

          <Perks perks={perks} tenure={tenure} className="lg:hidden" />

          <div>
            {/* Call first on a desktop; on a phone the apply button leads, full width. */}
            <div className="flex flex-col-reverse gap-3 lg:grid lg:grid-cols-[auto_1fr] lg:gap-4">
              <a
                href={PHONE_HREF}
                className="flex h-14 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-line px-5 text-[17px] font-medium text-navy transition hover:border-navy lg:w-[163px]"
              >
                <Phone size={20} strokeWidth={1.75} />
                Call Now
              </a>
              <Link
                href="#apply"
                className="flex h-14 items-center justify-center rounded-full bg-brand text-[17px] font-medium text-white transition hover:brightness-110 lg:font-bold"
              >
                <span className="lg:hidden">Join Now</span>
                <span className="hidden lg:inline">Apply for this car</span>
              </Link>
            </div>
            <p className="mt-6 text-center text-[13px] leading-5 text-ink-soft lg:mt-4 lg:text-base lg:text-navy">
              Or reach us directly ·{" "}
              <a href={PHONE_HREF} className="font-medium hover:text-brand">
                <span aria-hidden>📞</span> {PHONE_DISPLAY}
              </a>{" "}
              ·{" "}
              <a href={WHATSAPP_HREF} className="font-medium hover:text-brand">
                <span aria-hidden>💬</span> WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
