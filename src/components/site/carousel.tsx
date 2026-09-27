"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GAP = 24;

const arrow =
  "absolute z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-[0_6px_18px_rgba(6,47,80,0.18)] transition disabled:opacity-0 md:grid";

/**
 * A row of cards that swipes on a phone and steps with the arrows on a wide screen. `item`
 * sets each card's width, so a caller decides how many show at once.
 */
export function Carousel({
  children,
  item,
  label,
  arrowTop = "50%",
  resetKey,
  dots = true,
}: {
  children: ReactNode;
  item: string;
  label: string;
  /** Where the arrows sit, measured from the top of the row. */
  arrowTop?: string;
  /** A change here (a new city or filter) sends the row back to its first card. */
  resetKey?: string;
  dots?: boolean;
}) {
  const items = Children.toArray(children);
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true, index: 0 });

  function measure() {
    const el = track.current;
    if (!el) return;
    const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth;
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      index: Math.round(el.scrollLeft / (step + GAP)),
    });
  }

  // Whether the arrows are needed depends on the row's width, which only the browser knows.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    track.current?.scrollTo({ left: 0 });
    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [resetKey]);

  function step(direction: 1 | -1) {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (el && card) el.scrollBy({ left: direction * (card.offsetWidth + GAP), behavior: "smooth" });
  }

  return (
    <div role="region" aria-label={label}>
      <div className="relative">
        <button type="button" aria-label="Previous" disabled={edges.start} onClick={() => step(-1)} className={`${arrow} -left-6`} style={{ top: arrowTop }}>
          <ChevronLeft size={22} />
        </button>
        <div
          ref={track}
          onScroll={measure}
          className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((child, i) => (
            <div key={i} className={`shrink-0 snap-start ${item}`}>
              {child}
            </div>
          ))}
        </div>
        <button type="button" aria-label="Next" disabled={edges.end} onClick={() => step(1)} className={`${arrow} -right-6`} style={{ top: arrowTop }}>
          <ChevronRight size={22} />
        </button>
      </div>
      {dots && items.length > 1 ? (
        <div aria-hidden className="mt-4 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${i === edges.index ? "w-6 bg-navy" : "w-2 bg-navy/15"}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
