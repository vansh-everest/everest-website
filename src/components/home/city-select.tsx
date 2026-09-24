"use client";

import { CaretDown, MapPin } from "@phosphor-icons/react/ssr";
import type { CityOption } from "@/lib/plan-view";

/** The city pill from the design, as a real select so prices follow the chosen city. */
export function CitySelect({
  cities,
  value,
  onChange,
  size = "sm",
}: {
  cities: CityOption[];
  value: string;
  onChange: (slug: string) => void;
  size?: "sm" | "lg";
}) {
  const big = size === "lg";
  return (
    <label
      className={`relative mx-auto flex w-fit items-center rounded-full border border-line bg-white font-medium text-navy focus-within:border-brand ${
        big ? "h-11 gap-2 pl-5 pr-4 text-[15px] font-semibold" : "h-[30px] gap-[5px] pl-[13px] pr-[11px] text-[13px]"
      }`}
    >
      <MapPin size={big ? 20 : 13} weight={big ? "regular" : "bold"} className="shrink-0 text-ink-soft" />
      <span className="sr-only">City</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-5 outline-none"
      >
        {cities.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <CaretDown
        size={big ? 18 : 12}
        weight="bold"
        className={`pointer-events-none absolute text-ink-soft ${big ? "right-4" : "right-[11px]"}`}
      />
    </label>
  );
}
