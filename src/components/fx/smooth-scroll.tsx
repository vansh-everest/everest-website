"use client";

import { useEffect } from "react";
import "lenis/dist/lenis.css";

/**
 * Inertia scrolling for wheel and trackpad. Phones keep native scrolling and never download the
 * library; reduced motion skips it too.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let destroy = () => {};
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        anchors: true,
        // Dropdowns, the language panel and other scroll boxes keep scrolling on their own.
        allowNestedScroll: true,
      });
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      destroy = () => lenis.destroy();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      destroy();
    };
  }, []);

  return null;
}
