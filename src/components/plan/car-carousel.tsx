"use client";

import Link from "next/link";
import { useState } from "react";
import { CarCard } from "@/components/home/car-card";
import { CitySelect } from "@/components/home/city-select";
import { Carousel } from "@/components/site/carousel";
import type { CarCardView, CityOption } from "@/lib/plan-view";

const FILTERS = ["All", "Pre-owned", "Brand New"] as const;
type Filter = (typeof FILTERS)[number];

const matches = (filter: Filter, condition: string) =>
  filter === "All" || condition.toLowerCase() === filter.toLowerCase();

/** Two cars a view on a desktop, one on a phone, for the chosen city and filter. */
export function CarCarousel({ cities, cards }: { cities: CityOption[]; cards: Record<string, CarCardView[]> }) {
  const [city, setCity] = useState(cities[0]?.slug ?? "");
  const [filter, setFilter] = useState<Filter>("All");

  const cityName = cities.find((c) => c.slug === city)?.name ?? "";
  const cars = (cards[city] ?? []).filter((c) => matches(filter, c.condition));

  return (
    <>
      <div className="text-center">
        <div className="mt-8">
          <CitySelect cities={cities} value={city} onChange={setCity} />
        </div>
        <p className="mt-3 text-[13px] leading-4 text-ink-soft/60">Vehicle availability varies by city</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={f === filter}
              onClick={() => setFilter(f)}
              className={`h-9 rounded-full px-5 text-sm font-medium transition ${
                f === filter ? "bg-brand text-white" : "border-[1.5px] border-brand text-brand hover:bg-brand/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1184px]">
        {cars.length ? (
          <Carousel label={`Cars in ${cityName}`} item="w-[86%] md:w-[calc((100%-24px)/2)]" arrowTop="260px" resetKey={`${city}|${filter}`}>
            {cars.map((car) => (
              <CarCard key={car.id} car={car} city={cityName} variant="plan" />
            ))}
          </Carousel>
        ) : (
          <p className="py-16 text-center text-base text-ink-soft">No cars match in {cityName}.</p>
        )}
      </div>

      <p className="mt-5 text-center text-[13px] text-ink-soft">
        Showing {cars.length} {cars.length === 1 ? "vehicle" : "vehicles"} available in {cityName}
        <Link href="/#fleet" className="ml-2 font-semibold text-brand hover:underline">
          View full fleet →
        </Link>
      </p>
    </>
  );
}
