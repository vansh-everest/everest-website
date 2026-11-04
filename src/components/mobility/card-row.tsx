"use client";

import { Children, useRef, useState, type ReactNode } from "react";

/**
 * Three cards: a swipeable row on a phone, with the next card in view and a dot per card; a plain
 * grid from lg. The row runs off the phone's right edge, past the page margin.
 */
export function CardRow({ children, label }: { children: ReactNode; label: string }) {
  const items = Children.toArray(children);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setActive(end ? items.length - 1 : Math.round(el.scrollLeft / (card.offsetWidth + 20)));
  }

  return (
    <>
      <div
        ref={track}
        onScroll={onScroll}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-6 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, i) => (
          <div key={i} className="w-[292px] max-w-[82vw] shrink-0 snap-start lg:w-auto lg:max-w-none">
            {child}
          </div>
        ))}
      </div>
      <div aria-hidden className="mt-[29px] flex justify-center gap-1.5 lg:hidden">
        {items.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-[18px] bg-navy" : "w-1.5 bg-navy/15"}`} />
        ))}
      </div>
    </>
  );
}
