"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";

/** The running inertia scroll, for links that move the page without changing it. */
let running: Lenis | null = null;

/** Scrolls to the top: through the inertia scroll when it runs, otherwise natively. */
export function scrollToTop() {
  if (running) {
    running.scrollTo(0);
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

/**
 * The logo takes the reader to the top of the page they are on rather than away from it, and
 * drops any #anchor from the address. New-tab and modified clicks still follow the link.
 */
export function toTopInstead(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (window.location.hash) {
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  }
  requestAnimationFrame(scrollToTop);
}

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const historyMove = useRef(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let destroy = () => {};
    let cancelled = false;
    const onPopState = () => {
      historyMove.current = true;
    };
    window.addEventListener("popstate", onPopState);
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
      lenisRef.current = lenis;
      running = lenis;
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      destroy = () => lenis.destroy();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("popstate", onPopState);
      cancelAnimationFrame(raf);
      destroy();
      lenisRef.current = null;
      running = null;
    };
  }, []);

  // A link clicked while the old page is still gliding would carry that glide onto the new page,
  // undoing Next's scroll: the new page stayed at the bottom, and "/#apply" missed the form. Land
  // where the link points instead: the #anchor it names, or the top. Back and forward keep the
  // position the browser restores.
  useLayoutEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (historyMove.current) {
      historyMove.current = false;
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      return;
    }
    const id = decodeURIComponent(window.location.hash.slice(1));
    const anchor = id ? document.getElementById(id) : null;
    lenis.scrollTo(anchor ?? 0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
