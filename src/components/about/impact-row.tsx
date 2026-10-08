"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The IMPACTT letter cards. The first time the row scrolls into view each card lifts a little and
 * settles, one after another, and its letter and icon turn from grey to their own colour as it does;
 * it does not repeat. The site-wide reveal skips the row (data-no-reveal) so the cards are never hidden.
 * Each card is marked data-lit="off" only once the script runs, so without it the colours show as is.
 */
export function ImpactRow({ className, children }: { className: string; children: ReactNode }) {
  const row = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = row.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(list.children) as HTMLElement[];
    cards.forEach((card) => (card.dataset.lit = "off"));
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        cards.forEach((card, i) => {
          card.animate(
            [{ transform: "translateY(0)" }, { transform: "translateY(-14px)", offset: 0.4 }, { transform: "translateY(0)" }],
            { duration: 700, delay: i * 110, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
          // The colour arrives as the card reaches the top of its lift.
          timers.push(window.setTimeout(() => (card.dataset.lit = "on"), i * 110 + 200));
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(list);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      cards.forEach((card) => delete card.dataset.lit);
    };
  }, []);

  return (
    <ul ref={row} data-no-reveal className={className}>
      {children}
    </ul>
  );
}
