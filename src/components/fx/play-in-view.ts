"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * "idle": leave the block as the server drew it. "armed": hold its parts in their start state.
 * "on": play the entrance.
 */
export type Play = "idle" | "armed" | "on";

/**
 * Runs a block's entrance once, as it scrolls into view.
 *
 * The server HTML is the finished state, so visitors without script or with reduced motion, and
 * blocks already on screen when the page opens, stay settled ("idle"). A block that starts below
 * the fold is "armed" and turns "on" once enough of it is visible. Put the returned value on the
 * block as `data-play` and key the CSS on it, or read it to drive a script.
 */
export function usePlayInView(ref: RefObject<Element | null>, threshold = 0.35): Play {
  const [play, setPlay] = useState<Play>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | undefined;
    const frame = requestAnimationFrame(() => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      setPlay("armed");
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting && e.intersectionRatio >= threshold - 0.01)) return;
          observer?.disconnect();
          setPlay("on");
        },
        { threshold, rootMargin: "0px 0px -8% 0px" }
      );
      observer.observe(el);
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [ref, threshold]);

  return play;
}
