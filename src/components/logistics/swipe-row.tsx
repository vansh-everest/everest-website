"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Tone = "navy" | "sun";

/**
 * A row of cards that scroll-snaps with the next card in view. Below lg it shows dots, one per
 * stop; `arrows` adds previous and next buttons above the row on a desktop. Both stay away when
 * the cards all fit, so the controls always match what can be scrolled.
 */
export function SwipeRow({
  label,
  children,
  track,
  className = "",
  arrows = false,
  dots = "navy",
}: {
  label: string;
  children: ReactNode;
  /** Layout of the row itself; a page can turn it into a plain grid at lg. */
  track: string;
  className?: string;
  arrows?: boolean;
  dots?: Tone;
}) {
  const row = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  // Several cards start out scrollable, so the dots are in the first paint and nothing shifts.
  const [at, setAt] = useState({ start: true, end: count < 2, index: 0 });

  const measure = useCallback(() => {
    const el = row.current;
    const first = el?.firstElementChild as HTMLElement | null;
    const second = first?.nextElementSibling as HTMLElement | null;
    if (!el || !first) return;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setAt({ start: el.scrollLeft <= 2, end, index: end ? count - 1 : Math.round(el.scrollLeft / (step || 1)) });
  }, [count]);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  function step(direction: 1 | -1) {
    const el = row.current;
    const first = el?.firstElementChild as HTMLElement | null;
    const second = first?.nextElementSibling as HTMLElement | null;
    if (!el || !first) return;
    const distance = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  const scrollable = !(at.start && at.end);

  return (
    <div role="region" aria-label={label} className={className}>
      {arrows && scrollable ? (
        <div className="mb-10 hidden justify-end gap-3 lg:flex">
          <button
            type="button"
            aria-label="Previous"
            disabled={at.start}
            onClick={() => step(-1)}
            className="grid size-11 place-items-center rounded-full bg-navy text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:border disabled:border-[#e4e9ef] disabled:bg-white disabled:text-[#93a3b3]"
          >
            <ChevronLeft aria-hidden size={18} />
          </button>
          <button
            type="button"
            aria-label="Next"
            disabled={at.end}
            onClick={() => step(1)}
            className="grid size-11 place-items-center rounded-full bg-navy text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:border disabled:border-[#e4e9ef] disabled:bg-white disabled:text-[#93a3b3]"
          >
            <ChevronRight aria-hidden size={18} />
          </button>
        </div>
      ) : null}
      <div
        ref={row}
        onScroll={measure}
        className={`snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${track}`}
      >
        {children}
      </div>
      {count > 1 && scrollable ? (
        <div aria-hidden className="mt-5 flex justify-center gap-1.5 lg:hidden">
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === at.index ? `w-[18px] ${dots === "sun" ? "bg-sun" : "bg-navy"}` : "w-1.5 bg-navy/15"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
