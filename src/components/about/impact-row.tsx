"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The IMPACTT letter cards. The first time the row scrolls into view each card lifts a little and
 * settles, one after another; it does not repeat. The site-wide reveal skips the row (data-no-reveal)
 * so the cards are never hidden.
 */
export function ImpactRow({ className, children }: { className: string; children: ReactNode }) {
  const row = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = row.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        Array.from(list.children).forEach((card, i) =>
          card.animate(
            [{ transform: "translateY(0)" }, { transform: "translateY(-14px)", offset: 0.4 }, { transform: "translateY(0)" }],
            { duration: 700, delay: i * 110, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          )
        );
      },
      { threshold: 0.5 }
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={row} data-no-reveal className={className}>
      {children}
    </ul>
  );
}
