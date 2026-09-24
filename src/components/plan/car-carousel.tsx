"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarCard } from "@/components/home/car-card";
import { CitySelect } from "@/components/home/city-select";
import type { CarCardView, CityOption } from "@/lib/plan-view";

const FILTERS = ["All", "Pre-owned", "Brand New"] as const;
type Filter = (typeof FILTERS)[number];

const matches = (filter: Filter, condition: string) =>
  filter === "All" || condition.toLowerCase() === filter.toLowerCase();

const arrow =
  "absolute top-[260px] z-10 hidden size-12 place-items-center rounded-full bg-white text-navy shadow-[0_6px_18px_rgba(6,47,80,0.18)] transition disabled:opacity-0 md:grid";

/** Two cars a view on a desktop, one on a phone, swiped or stepped with the arrows. */
export function CarCarousel({ cities, cards }: { cities: CityOption[]; cards: Record<string, CarCardView[]> }) {
  const [city, setCity] = useState(cities[0]?.slug ?? "");
  const [filter, setFilter] = useState<Filter>("All");
  const [edges, setEdges] = useState({ start: true, end: true, index: 0 });
  const track = useRef<HTMLDivElement>(null);

  const cityName = cities.find((c) => c.slug === city)?.name ?? "";
  const cars = (cards[city] ?? []).filter((c) => matches(filter, c.condition));

  function measure() {
    const el = track.current;
    if (!el) return;
    const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth;
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      index: Math.round(el.scrollLeft / (step + 24)),
    });
  }

  // The arrows depend on the track's width, which only the browser knows.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function step(direction: 1 | -1) {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (el && card) el.scrollBy({ left: direction * (card.offsetWidth + 24), behavior: "smooth" });
  }

  /** A new city or filter changes the cars, so the arrows are measured again once they render. */
  function restart(update: () => void) {
    update();
    track.current?.scrollTo({ left: 0 });
    requestAnimationFrame(() => requestAnimationFrame(measure));
  }

  return (
    <>
      <div className="text-center">
        <div className="mt-8">
          <CitySelect cities={cities} value={city} onChange={(slug) => restart(() => setCity(slug))} />
        </div>
        <p className="mt-3 text-[13px] leading-4 text-ink-soft/60">Vehicle availability varies by city</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={f === filter}
              onClick={() => restart(() => setFilter(f))}
              className={`h-9 rounded-full px-5 text-sm font-medium transition ${
                f === filter ? "bg-brand text-white" : "border-[1.5px] border-brand text-brand hover:bg-brand/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-[1184px]">
        <button type="button" aria-label="Previous cars" disabled={edges.start} onClick={() => step(-1)} className={`${arrow} -left-6`}>
          <ChevronLeft size={22} />
        </button>
        <div
          ref={track}
          onScroll={measure}
          className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {cars.map((car) => (
            <div key={car.id} className="w-[86%] shrink-0 snap-start md:w-[calc((100%-24px)/2)]">
              <CarCard car={car} city={cityName} variant="plan" />
            </div>
          ))}
          {cars.length === 0 ? (
            <p className="w-full py-16 text-center text-base text-ink-soft">No cars match in {cityName}.</p>
          ) : null}
        </div>
        <button type="button" aria-label="Next cars" disabled={edges.end} onClick={() => step(1)} className={`${arrow} -right-6`}>
          <ChevronRight size={22} />
        </button>
      </div>

      {cars.length > 1 ? (
        <div aria-hidden className="mt-6 flex justify-center gap-1.5">
          {cars.map((car, i) => (
            <span key={car.id} className={`h-2 rounded-full transition-all ${i === edges.index ? "w-6 bg-navy" : "w-2 bg-navy/15"}`} />
          ))}
        </div>
      ) : null}
      <p className="mt-6 text-center text-[15px] text-ink-soft">
        Showing {cars.length} {cars.length === 1 ? "vehicle" : "vehicles"} available in {cityName}
      </p>
    </>
  );
}
