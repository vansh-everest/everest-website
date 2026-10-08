"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-driven arrival for a block that starts below the fold. While the block scrolls into view
 * it sets --arrive from 0 to 1 (eased, and only ever forwards, so once landed it stays); at 1 it
 * sets data-arrive="done" so follow-on moves can play. CSS in globals.css ("Home sections") turns
 * --arrive into motion, under prefers-reduced-motion: no-preference only.
 *
 * Without script, with reduced motion, or when the block is already on screen, nothing is set and
 * the block simply sits in place.
 */
export function ArriveOnScroll({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.dataset.arrive = "pending";
    el.style.setProperty("--arrive", "0");
    let target = 0;
    let shown = 0;
    let last = 0;
    let frame = 0;

    const measure = () => {
      const box = el.getBoundingClientRect();
      const view = window.innerHeight;
      // From the block's top edge entering, to most of it (or most of the screen) being in view.
      const start = view * 0.98;
      const span = Math.min(box.height * 0.9, view * 0.7);
      const progress = Math.min(1, Math.max(0, (start - box.top) / span));
      target = Math.max(target, progress);
    };

    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      // Chase the scroll position smoothly, so coarse wheel steps still glide.
      shown += (target - shown) * (1 - Math.exp(-dt / 120));
      if (target >= 1 && shown > 0.995) shown = 1;
      // Ease in and out: little travel while the block is still at the screen's edge, a soft landing.
      const eased = shown * shown * (3 - 2 * shown);
      el.style.setProperty("--arrive", eased.toFixed(4));
      if (shown >= 1) {
        frame = 0;
        el.dataset.arrive = "done";
        stop();
        return;
      }
      frame = target - shown > 0.0005 ? requestAnimationFrame(tick) : 0;
    };

    function onScroll() {
      measure();
      if (!frame && target > shown) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      cancelAnimationFrame(frame);
      stop();
      delete el.dataset.arrive;
      el.style.removeProperty("--arrive");
    };
  }, []);

  return (
    <div ref={ref} className={className} data-no-reveal>
      {children}
    </div>
  );
}
