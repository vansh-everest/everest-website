"use client";

import Link from "next/link";
import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import type { CarCardView, CityOption } from "@/lib/plan-view";
import { CarCard } from "./car-card";
import { CitySelect } from "./city-select";

const arrow =
  "absolute top-[578px] hidden size-12 place-items-center rounded-full bg-white text-navy shadow-[0_4px_12px_rgba(6,47,80,0.15)] lg:grid";

export function CarGrid({ cities, cards }: { cities: CityOption[]; cards: Record<string, CarCardView[]> }) {
  const [city, setCity] = useState(cities[0]?.slug ?? "");
  const cars = cards[city] ?? [];
  const name = cities.find((c) => c.slug === city)?.name ?? "";

  return (
    <>
      <div className="mt-[26px] text-center">
        <CitySelect cities={cities} value={city} onChange={setCity} />
        <p className="mt-3 text-[11px] text-ink-soft/60">Vehicle availability varies by city</p>
      </div>
      <div className="mx-auto mt-[10px] grid max-w-[1184px] gap-10 lg:grid-cols-2 lg:gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} city={name} variant="home" />
        ))}
      </div>
      <button type="button" aria-label="Previous vehicle" className={`${arrow} left-24`}>
        <CaretLeft size={20} weight="bold" />
      </button>
      <button type="button" aria-label="Next vehicle" className={`${arrow} right-[46px]`}>
        <CaretRight size={20} weight="bold" />
      </button>
      <div aria-hidden className="mt-[75px] flex justify-center gap-1.5">
        <span className="h-[7px] w-6 rounded-full bg-navy" />
        <span className="size-[7px] rounded-full bg-navy/20" />
        <span className="size-[7px] rounded-full bg-navy/20" />
      </div>
      <p className="mt-4 text-center text-xs text-ink-soft">
        {cars.length} {cars.length === 1 ? "vehicle" : "vehicles"} in {name}{" "}
        <Link href="/own-now/#calculator" className="ml-1 font-semibold text-brand">
          View full fleet
        </Link>
      </p>
    </>
  );
}
