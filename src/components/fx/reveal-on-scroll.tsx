"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The blocks that rise into place: headings, copy, list items, cards, media and forms. A marquee
 * rises as one strip; its items slide in on their own and never reveal one by one.
 */
const TARGETS = "h2, h3, p, li, article, figure, form, img, picture, video, iframe, dl, blockquote, table, :has(> .animate-marquee)";
const SKIP = "header, footer, nav, dialog, [role=dialog], [data-no-reveal], .animate-marquee";
const STAGGER_MS = 70;
const MAX_STEPS = 7;

function paints(el: Element) {
  const style = getComputedStyle(el);
  return style.backgroundImage !== "none" || !/rgba\(.*,\s*0\)|transparent/.test(style.backgroundColor);
}

/**
 * Blur-and-rise reveals for every page, without touching each component.
 *
 * On each page it marks the outermost matching blocks that start below the fold; anything already
 * on screen is left alone, so nothing that was painted ever disappears. Blocks that enter together
 * cascade in reading order. Once a block has settled its markers are removed, so its own
 * transitions and transforms behave as before.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main) return;

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
        entering.forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          const delay = Math.min(i, MAX_STEPS) * STAGGER_MS;
          el.style.setProperty("--fx-delay", `${delay}ms`);
          el.dataset.fx = "in";
          timers.push(
            window.setTimeout(() => {
              delete el.dataset.fx;
              el.style.removeProperty("--fx-delay");
            }, 1000 + delay)
          );
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );

    const frame = requestAnimationFrame(() => {
      const fold = window.innerHeight * 0.92;
      const considered = new Set<Element>();
      for (const el of main.querySelectorAll<HTMLElement>(TARGETS)) {
        if (el.closest(SKIP)) continue;
        let ancestor = el.parentElement;
        let nested = false;
        while (ancestor && ancestor !== main) {
          if (considered.has(ancestor)) {
            nested = true;
            break;
          }
          ancestor = ancestor.parentElement;
        }
        if (nested) continue;
        const box = el.getBoundingClientRect();
        // A full-width band with its own colour is page structure: fading it shows a grey slab.
        // Its contents can still rise, so it is not marked as considered.
        if (box.width >= window.innerWidth * 0.9 && paints(el)) continue;
        considered.add(el);
        // Hidden variants for other screen sizes, and anything the visitor can already see.
        if (box.width === 0 && box.height === 0) continue;
        if (box.top < fold) continue;
        el.dataset.fx = "out";
        observer.observe(el);
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      timers.forEach(clearTimeout);
      main.querySelectorAll<HTMLElement>("[data-fx]").forEach((el) => {
        delete el.dataset.fx;
        el.style.removeProperty("--fx-delay");
      });
    };
  }, [pathname]);

  return null;
}
