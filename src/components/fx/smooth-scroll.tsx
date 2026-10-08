"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";

/** The running inertia scroll, for links that move the page without changing it. */
let running: Lenis | null = null;
/** How many overlays (the phone menu) are holding the page still. */
let holds = 0;
/** Until this time the page is moving because of a link or the logo, not the visitor. */
let quietUntil = 0;

/** The window event the header logo listens for: its mark bursts as it does on a click. */
export const LOGO_BURST = "everest:logo-burst";

/**
 * Touch: how quickly a flick's glide settles (Lenis lerp, per 60 Hz frame). Lower glides further.
 * 0.06 settles a strong flick in under two seconds, between Android's and iOS's own feel.
 */
const TOUCH_LERP = 0.06;
/** Lenis turns its velocity v into a glide of v ** this (its default). */
const TOUCH_INERTIA = 1.7;
/** Finger movement older than this at lift-off no longer counts: the finger had stopped. */
const FLICK_WINDOW_MS = 100;

/** Upward scrolling at least this fast (px/s), held for BURST_HOLD_MS, makes the logo burst. */
const BURST_SPEED = 2500;
const BURST_HOLD_MS = 90;
const BURST_GAP_MS = 2000;

const trimSlash = (path: string) => path.replace(/\/+$/, "") || "/";

/** Scrolls to the top: through the inertia scroll when it runs, otherwise natively. */
export function scrollToTop() {
  quietUntil = performance.now() + 1600;
  if (running) {
    running.scrollTo(0);
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

/**
 * The logo goes to the home page it links to. On that home page it glides to the top instead of
 * reloading it, and drops any #anchor from the address. New-tab and modified clicks follow the link.
 */
export function goHome(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const home = trimSlash(new URL(event.currentTarget.href).pathname);
  if (trimSlash(window.location.pathname) !== home) return;
  event.preventDefault();
  if (window.location.hash) {
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  }
  requestAnimationFrame(scrollToTop);
}

/** Holds the page still behind an overlay. Returns the release; the page moves again once every hold is released. */
export function holdScroll() {
  holds += 1;
  running?.stop();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holds -= 1;
    if (holds === 0) running?.start();
  };
}

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const historyMove = useRef(false);

  useEffect(() => {
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
      // The finger's recent positions, to measure a flick in px/s whatever the screen's frame rate.
      let trail: { t: number; y: number }[] = [];
      const lenis: Lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Phones: the page follows the finger one to one, then glides on after a flick.
        syncTouch: true,
        syncTouchLerp: TOUCH_LERP,
        touchInertiaExponent: TOUCH_INERTIA,
        anchors: true,
        // Dropdowns, the language panel, carousels and other scroll boxes keep scrolling on their own.
        allowNestedScroll: true,
        // A slider drags its thumb, not the page.
        prevent: (node) => node instanceof HTMLInputElement && node.type === "range",
        virtualScroll: ({ event }) => {
          if (!("touches" in event)) return true;
          if (event.type === "touchstart") trail = [];
          const touch = event.targetTouches[0];
          if (event.type === "touchmove" && touch) {
            trail.push({ t: event.timeStamp, y: touch.clientY });
            if (trail.length > 12) trail.shift();
          }
          if (event.type === "touchend") {
            // Lenis glides v ** TOUCH_INERTIA past the finger, v being its last per-frame step, so a
            // 120 Hz phone would get a third of a 60 Hz one's glide. Set v from the finger's speed
            // instead: the glide then starts at the speed the finger left off and eases out.
            // The finger's speed over its last moves; none if it had stopped before lifting.
            const last = trail[trail.length - 1];
            const moving = last && event.timeStamp - last.t <= FLICK_WINDOW_MS;
            const first = trail.find((p) => p !== last && last.t - p.t <= FLICK_WINDOW_MS) ?? trail[trail.length - 2];
            const speed = moving && first ? Math.abs(last.y - first.y) / Math.max(1, last.t - first.t) : 0;
            const lag = Math.abs(lenis.targetScroll - lenis.animatedScroll);
            const glide = Math.min(4000, Math.max(0, (speed * 1000) / (TOUCH_LERP * 60) - lag));
            lenis.velocity = glide ** (1 / TOUCH_INERTIA);
          }
          return true;
        },
      });
      lenisRef.current = lenis;
      running = lenis;
      if (holds > 0) lenis.stop();
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
    quietUntil = Math.max(quietUntil, performance.now() + 600);
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

  // A fast flick back up makes the header logo burst, at most once every BURST_GAP_MS. Jumps made
  // by links, the logo, and back and forward are not the visitor scrolling and never count.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let trail: { t: number; y: number }[] = [];
    let lastBurst = -Infinity;
    const quiet = () => {
      quietUntil = Math.max(quietUntil, performance.now() + 1500);
      trail = [];
    };
    const onClick = (event: Event) => {
      if (event.target instanceof Element && event.target.closest("a[href]")) quiet();
    };
    const onScroll = () => {
      const t = performance.now();
      const y = window.scrollY;
      const prev = trail[trail.length - 1];
      // Moving down, or a jump of most of a screen in one step, starts over.
      if (prev && (y >= prev.y || prev.y - y > window.innerHeight * 0.6)) trail = [];
      trail.push({ t, y });
      trail = trail.filter((p) => t - p.t <= BURST_HOLD_MS * 1.8);
      if (t < quietUntil || t - lastBurst < BURST_GAP_MS || trail.length < 4) return;
      const span = t - trail[0].t;
      if (span < BURST_HOLD_MS) return;
      if (((trail[0].y - y) / span) * 1000 < BURST_SPEED) return;
      lastBurst = t;
      trail = [];
      window.dispatchEvent(new Event(LOGO_BURST));
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", quiet);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", quiet);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
