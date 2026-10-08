"use client";

import { useEffect, useRef } from "react";

type Card = { tone: "light" | "dark"; radius: string } | null;

const MAX_DEPTH = 8;

/** A card is a rounded, framed surface between a chip and a whole section in size. */
function readCard(el: HTMLElement): Card {
  if (el.matches("input, select, textarea, option")) return null;
  const style = getComputedStyle(el);
  const radius = parseFloat(style.borderTopLeftRadius);
  if (!(radius >= 10)) return null;
  const box = el.getBoundingClientRect();
  if (box.width < 90 || box.height < 56 || box.width > 1000 || box.height > 760) return null;
  // Pills and circles are buttons and badges, not cards.
  if (radius >= box.height / 2 - 1) return null;

  const [r = 0, g = 0, b = 0, a = 1] = (style.backgroundColor.match(/[\d.]+/g) ?? []).map(Number);
  const solid = a >= 0.6;
  const framed = style.boxShadow !== "none" || parseFloat(style.borderTopWidth) > 0;
  if (!framed && !solid) return null;

  const light = solid && style.backgroundImage === "none" && (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
  return { tone: light ? "light" : "dark", radius: style.borderRadius };
}

/**
 * Argo's spotlight cards, applied to every card on the site at once: a soft light follows the
 * cursor across the card and its edge lights up in the Everest colours near the pointer.
 *
 * One overlay is laid over whichever card is under the pointer, so no card needs changing.
 * Pointer devices only; touch and reduced motion get nothing.
 */
export function CardSpotlight() {
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const box = overlay.current;
    if (!fine || reduce || !box) return;

    let cache = new WeakMap<Element, Card>();
    let x = -1;
    let y = -1;
    let frame = 0;

    const find = (start: Element | null) => {
      let el = start as HTMLElement | null;
      for (let depth = 0; el && depth < MAX_DEPTH; depth++, el = el.parentElement) {
        if (el.matches("main, body, header, footer, nav")) return null;
        let card = cache.get(el);
        if (card === undefined) {
          card = readCard(el);
          cache.set(el, card);
        }
        if (card) return { el, card };
      }
      return null;
    };

    const paint = () => {
      frame = 0;
      const hit = x < 0 ? null : find(document.elementFromPoint(x, y));
      if (!hit || !hit.el.closest("main")) {
        box.style.opacity = "0";
        return;
      }
      const r = hit.el.getBoundingClientRect();
      box.dataset.tone = hit.card.tone;
      box.style.borderRadius = hit.card.radius;
      box.style.width = `${r.width}px`;
      box.style.height = `${r.height}px`;
      box.style.transform = `translate3d(${r.left}px, ${r.top}px, 0)`;
      box.style.setProperty("--mx", `${x - r.left}px`);
      box.style.setProperty("--my", `${y - r.top}px`);
      box.style.opacity = "1";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      schedule();
    };
    const leave = () => {
      x = -1;
      schedule();
    };
    const resize = () => {
      cache = new WeakMap();
      schedule();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={overlay}
      aria-hidden
      className="fx-spot pointer-events-none fixed left-0 top-0 z-40 opacity-0 transition-opacity duration-300"
    >
      <span className="fx-spot-glow" />
      <span className="fx-spot-ring" />
    </div>
  );
}
