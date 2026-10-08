"use client";

import { useRef, type CSSProperties } from "react";
import { usePlayInView } from "@/components/fx/play-in-view";

export type Milestone = { year: string; text: string; current?: boolean };

/**
 * The milestones as one line of dots: across the card on a desktop, down it on a phone.
 *
 * Scrolling it into view draws the line from the first dot to the last; each dot pops as the line
 * reaches it, its year and line rise after it, and the current year pulses once. The motion lives
 * in globals.css under "B2B and Investors (batch 9)", keyed on `data-play`.
 */
export function MilestoneLine({ items }: { items: Milestone[] }) {
  const list = useRef<HTMLOListElement>(null);
  const play = usePlayInView(list);

  return (
    <ol
      ref={list}
      data-no-reveal
      data-play={play === "idle" ? undefined : play}
      className="fx-ms mt-5 lg:mt-9 lg:grid lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
      style={{ "--n": items.length } as CSSProperties}
    >
      {items.map((m, i) => (
        <li
          key={m.year}
          className="relative flex gap-4 pb-6 last:pb-0 lg:block lg:px-3 lg:pb-0 lg:text-center"
          style={{ "--i": i } as CSSProperties}
        >
          {/* The stretch of line from this dot to the next. */}
          {i < items.length - 1 ? (
            <span
              aria-hidden
              className="fx-ms-seg absolute left-[5px] top-3 h-full w-0.5 origin-top bg-brand/25 lg:left-1/2 lg:top-[5px] lg:h-0.5 lg:w-full lg:origin-left"
            />
          ) : null}
          <span
            aria-hidden
            className={`fx-ms-dot relative z-10 mt-1.5 size-3 shrink-0 rounded-full lg:mx-auto lg:mt-0 lg:block ${
              m.current ? "fx-ms-now bg-sun" : "bg-brand"
            }`}
          />
          <div className="fx-ms-copy">
            <p className="text-[17px] font-bold leading-6 text-navy lg:mt-4 lg:text-xl lg:leading-7">{m.year}</p>
            <p className="mt-0.5 text-sm leading-5 text-ink-soft lg:mx-auto lg:mt-1.5 lg:max-w-[230px] lg:text-[15px] lg:leading-[22px] lg:text-balance">
              {m.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
