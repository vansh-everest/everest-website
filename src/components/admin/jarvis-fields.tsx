"use client";

import { useState } from "react";
import { ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { rupees, type Hub, type Price } from "@/lib/content";
import { Text } from "./fields";
import { PRICE_LABELS } from "./price-fields";
import type { JarvisCalculatorCity, JarvisPrice, JarvisPriced } from "./shared";

/*
 * Figures the site takes from Jarvis, shown read only where the editable fields would be.
 */

const DASH = "–";
const money = (digits: string) => rupees(digits) || DASH;

export function FromJarvis() {
  return <span className="ml-2 inline-flex h-4 items-center rounded bg-brand/10 px-1.5 text-[11px] font-semibold leading-none text-brand">From Jarvis</span>;
}

/** A label and its value in a box the size of a field, so it lines up with the inputs beside it. */
export function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 content-start gap-1.5">
      <span className="flex items-center text-[13px] font-medium leading-4 text-navy">
        {label}
        <FromJarvis />
      </span>
      <span className="flex h-10 min-w-0 items-center rounded-lg border border-line bg-mist px-3 text-sm font-semibold tabular-nums text-navy">
        <span className="truncate">{value || DASH}</span>
      </span>
    </div>
  );
}

type PriceField = keyof JarvisPrice;

const LABELS: Record<PriceField, string> = { amount: "Rent", unit: "Unit", deposit: "Deposit", upfront: "Upfront" };
const LIVE: readonly string[] = ["amount", "unit", "deposit", "upfront"] satisfies PriceField[];
const show = (price: JarvisPrice | undefined, field: PriceField) => (field === "unit" ? price?.unit || "" : money(price?.[field] ?? ""));

/** Jarvis's fields among `fields`, in their order. */
export const liveFields = (fields: readonly (keyof Price)[]): PriceField[] => fields.filter((f): f is PriceField => LIVE.includes(f));

/** "₹650/day", or blank. */
export const jarvisHeadline = (price: JarvisPrice | undefined) => (price?.amount ? `${rupees(price.amount)}${price.unit}` : "");

/**
 * The national figures: Jarvis's as the site prints them, read only, and the admin's own
 * (tenure months) editable beside them.
 */
export function JarvisPriceGrid({
  figures,
  value,
  fields,
  onChange,
  disabled,
}: {
  figures: JarvisPrice | undefined;
  value: Price;
  fields: readonly (keyof Price)[];
  onChange: (next: Price) => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      {fields.map((f) =>
        LIVE.includes(f) ? (
          <ReadOnly key={f} label={LABELS[f as PriceField]} value={show(figures, f as PriceField)} />
        ) : (
          <Text
            key={f}
            label={PRICE_LABELS[f]}
            value={value[f]}
            numeric={f !== "unit"}
            placeholder="Blank hides it"
            disabled={disabled}
            onChange={(v) => onChange({ ...value, [f]: v })}
          />
        )
      )}
    </div>
  );
}

/** One row per city with Jarvis's figures there. */
export function JarvisCityPrices({
  cities,
  priced,
  fields,
}: {
  cities: { slug: string; name: string }[];
  priced: JarvisPriced | undefined;
  fields: PriceField[];
}) {
  const count = cities.filter((c) => priced?.cities[c.slug]?.amount).length;
  return (
    <details className="group min-w-0 rounded-xl border border-line bg-paper">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-navy [&::-webkit-details-marker]:hidden">
        <ChevronRight size={16} className="text-ink-soft transition group-open:rotate-90" />
        City prices
        <span className="font-normal text-ink-soft">
          {count} of {cities.length} priced
        </span>
        <FromJarvis />
      </summary>
      <div className="overflow-x-auto px-4 pb-4">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-ink-soft">
              <th className="w-28 py-1.5 pr-3 font-medium">City</th>
              {fields.map((f) => (
                <th key={f} className="py-1.5 pr-3 font-medium">
                  {LABELS[f]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cities.map((c) => (
              <tr key={c.slug} className="border-t border-line">
                <td className="py-2 pr-3 text-[13px] font-semibold text-navy">{c.name}</td>
                {fields.map((f) => (
                  <td key={f} className="py-2 pr-3 tabular-nums text-navy">
                    {show(priced?.cities[c.slug], f) || DASH}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/** "Wagon R - 2025" shows as 2025, as the picker offers it; a name without a year stays whole. */
const yearOf = (name: string) => /(\d{4})\s*$/.exec(name)?.[1] ?? name;

const range = (low: number | null, high: number | null) => {
  if (low === null) return DASH;
  const from = rupees(String(low));
  return high !== null && high > low ? `${from} – ${rupees(String(high))}` : from;
};

/** A plan picker's figures: per city, each car's model years with rent and money paid first. */
export function JarvisYears({ cities, moneyLabel }: { cities: JarvisCalculatorCity[]; moneyLabel: string }) {
  const [picked, setPicked] = useState(cities[0]?.slug ?? "");
  const city = cities.find((c) => c.slug === picked) ?? cities[0];
  if (!city) return <p className="text-[13px] text-ink-soft">No Jarvis figures for this plan</p>;
  const stepped = city.cars.some((car) => car.years.some((y) => y.moneyStep));

  return (
    <div className="grid min-w-0 gap-3">
      <div role="tablist" aria-label="City" className="flex flex-wrap gap-1.5">
        {cities.map((c) => (
          <button
            key={c.slug}
            type="button"
            role="tab"
            aria-selected={c.slug === city.slug}
            onClick={() => setPicked(c.slug)}
            className={`flex h-8 items-center rounded-lg px-3 text-[13px] font-medium ${
              c.slug === city.slug ? "bg-navy text-white" : "border border-line bg-white text-navy"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-ink-soft">
              <th className="py-1.5 pr-3 font-medium">Car</th>
              <th className="py-1.5 pr-3 font-medium">Model year</th>
              <th className="py-1.5 pr-3 font-medium">Rent per day</th>
              <th className="py-1.5 pr-3 font-medium">{moneyLabel}</th>
              {stepped ? <th className="py-1.5 pr-3 font-medium">Per step</th> : null}
            </tr>
          </thead>
          <tbody>
            {city.cars.flatMap((car) =>
              car.years.map((year, i) => (
                <tr key={`${car.name}|${year.name}|${i}`} className="border-t border-line">
                  <td className="py-2 pr-3 text-[13px] font-semibold text-navy">{i === 0 ? car.name : ""}</td>
                  <td className="py-2 pr-3 text-ink-soft">{yearOf(year.name) || DASH}</td>
                  <td className="py-2 pr-3 tabular-nums text-navy">{range(year.rent, year.rentMax)}</td>
                  <td className="py-2 pr-3 tabular-nums text-navy">{range(year.money, year.maxMoney)}</td>
                  {stepped ? (
                    <td className="py-2 pr-3 tabular-nums text-ink-soft">
                      {year.moneyStep ? `+${rupees(String(year.moneyStep))} → −${rupees(String(year.rentStep))}/day` : DASH}
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** A city's hubs as Jarvis lists them. */
export function JarvisHubs({ hubs }: { hubs: Hub[] }) {
  return (
    <div className="grid gap-2">
      <p className="flex items-center text-[13px] font-medium text-navy">
        {hubs.length === 1 ? "1 hub" : `${hubs.length} hubs`}
        <FromJarvis />
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {hubs.map((hub) => (
          <li key={`${hub.name}|${hub.address}`} className="flex gap-2.5 rounded-xl border border-line bg-mist px-3 py-2.5 text-[13px]">
            <MapPin size={15} className="mt-0.5 shrink-0 text-ink-soft" />
            <div className="min-w-0">
              <p className="font-semibold text-navy">
                {hub.mapUrl ? (
                  <a href={hub.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                    {hub.name}
                    <ExternalLink size={12} className="text-ink-soft" />
                  </a>
                ) : (
                  hub.name
                )}
              </p>
              <p className="mt-0.5 leading-5 text-ink-soft">{hub.address}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
