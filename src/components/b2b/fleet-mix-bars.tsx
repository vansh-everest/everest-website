"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayInView } from "@/components/fx/play-in-view";

export type MixRow = { label: string; count: number; tone?: "brand" | "lime" };

/** Each bar takes GROW ms to fill; the next one starts STAGGER ms after it. */
const GROW = 900;
const STAGGER = 280;

const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * The vehicle-mix bars. As the list scrolls into view the bars fill one after another and each
 * count runs up with its bar, once.
 */
export function FleetMixBars({ rows }: { rows: MixRow[] }) {
  const list = useRef<HTMLUListElement>(null);
  const play = usePlayInView(list, 0.4);
  // Milliseconds since the bars started; null until the first frame and once they have finished.
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const max = Math.max(...rows.map((r) => r.count));

  useEffect(() => {
    if (play !== "on") return;
    const total = GROW + STAGGER * (rows.length - 1);
    let start = 0;
    let frame = requestAnimationFrame(function tick(now) {
      start ||= now;
      const t = now - start;
      if (t >= total) {
        setElapsed(null);
        setDone(true);
        return;
      }
      setElapsed(t);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [play, rows.length]);

  const progress = (i: number) => {
    if (play === "armed") return 0;
    if (play === "idle" || done) return 1;
    return easeOut(Math.min(Math.max(((elapsed ?? 0) - i * STAGGER) / GROW, 0), 1));
  };

  return (
    <ul ref={list} data-no-reveal className="mt-[14px] grid gap-3 lg:mt-[21px] lg:gap-[21px]">
      {rows.map((row, i) => {
        const lime = row.tone === "lime";
        const p = progress(i);
        return (
          <li key={row.label}>
            <p className="flex items-baseline justify-between text-sm font-semibold leading-[18px] text-navy lg:text-[15px]">
              {row.label}
              <span className={`font-bold tabular-nums ${lime ? "text-lime" : "text-brand"}`}>
                <span aria-hidden>{Math.round(row.count * p)}</span>
                <span className="sr-only">{row.count}</span>
              </span>
            </p>
            <span aria-hidden className="mt-1 block h-2 overflow-hidden rounded-full bg-[#e8eef4] lg:mt-2 lg:h-2.5">
              <span
                className={`block h-full rounded-full ${lime ? "bg-lime" : "bg-brand"}`}
                style={{ width: `${Math.max((row.count / max) * 100, 2) * p}%` }}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
