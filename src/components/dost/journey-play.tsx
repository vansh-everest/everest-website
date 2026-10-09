"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Play } from "@/components/fx/play-in-view";

/** Fine steps, so the checks below run often enough while the block scrolls. */
const STEPS = Array.from({ length: 21 }, (_, i) => i / 20);

/**
 * When the last movement has ended (05's second pulse), in seconds after the play starts (row) or
 * the card arrives (card). The play marker comes off then, so the steps go back to exactly how the
 * server drew them.
 */
const ROW_DONE = 4.6;
const CARD_DONE = 2.7;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The five steps in a row (wide screens). The first time the row comes into view it plays as one
 * journey: the dotted line draws from 01 to 05 and each step arrives as the line reaches it. The
 * motion lives in globals.css under "Dost journey (batch 10)", keyed on `data-play`.
 *
 * It waits until the numbers are on screen (or the whole row is), so the line is seen drawing; on
 * a screen too short for that, it starts once the row's top is 70% of the way up. Until then the
 * phones wait as faint outlines. Without script, with reduced motion, or when the row is already
 * on screen as the page opens, the steps simply sit in place.
 */
export function JourneyRow({ className, children }: { className: string; children: ReactNode }) {
  const row = useRef<HTMLOListElement>(null);
  const [play, setPlay] = useState<Play>("idle");

  useEffect(() => {
    const el = row.current;
    if (!el || reduced()) return;

    let observer: IntersectionObserver | undefined;
    let done = 0;
    const frame = requestAnimationFrame(() => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      setPlay("armed");
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          if (!entry.isIntersecting) return;
          const badge = el.querySelector(".dj-badge")?.getBoundingClientRect();
          const box = entry.boundingClientRect;
          // How far below the row's top the numbers end.
          const numbers = badge ? badge.bottom - box.top : box.height * 0.75;
          const view = window.innerHeight;
          const whole = entry.intersectionRatio > 0.97;
          if (!whole && box.top > Math.max(view - 12 - numbers, view * 0.3)) return;
          observer?.disconnect();
          setPlay("on");
          done = window.setTimeout(() => setPlay("idle"), ROW_DONE * 1000);
        },
        { threshold: STEPS }
      );
      observer.observe(el);
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      clearTimeout(done);
    };
  }, []);

  return (
    <ol ref={row} data-no-reveal data-play={play === "idle" ? undefined : play} className={`dj-play ${className}`}>
      {children}
    </ol>
  );
}

/**
 * The step cards in the phone carousel. Each card arrives on its own as it comes into view, down
 * the page or swiped in from the side; cards that come in together follow one another left to
 * right. A card already on screen as the page opens stays as it is.
 */
export function JourneyCards({ className, children }: { className: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = box.current;
    if (!root || reduced()) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-dj-card]"));

    let observer: IntersectionObserver | undefined;
    const timers: number[] = [];
    const frame = requestAnimationFrame(() => {
      const view = { w: window.innerWidth, h: window.innerHeight };
      const waiting = cards.filter((card) => {
        const r = card.getBoundingClientRect();
        if (r.width === 0) return false;
        return !(r.top < view.h * 0.92 && r.bottom > 0 && r.left < view.w && r.right > 0);
      });
      if (waiting.length === 0) return;
      for (const card of waiting) card.dataset.play = "armed";

      observer = new IntersectionObserver(
        (entries) => {
          const arriving = entries
            .filter((e) => {
              if (!e.isIntersecting) return false;
              const seen = e.intersectionRect;
              const full = e.boundingClientRect;
              // A third of its height up the screen and a quarter of its width in from the side.
              return seen.height >= Math.min(full.height, window.innerHeight) * 0.33 && seen.width >= full.width * 0.25;
            })
            .sort((a, b) => a.boundingClientRect.left - b.boundingClientRect.left);
          arriving.forEach((entry, i) => {
            const card = entry.target as HTMLElement;
            observer?.unobserve(card);
            const t = i * 0.3;
            card.style.setProperty("--t", `${t}s`);
            card.dataset.play = "on";
            timers.push(
              window.setTimeout(() => {
                delete card.dataset.play;
                card.style.removeProperty("--t");
              }, (t + CARD_DONE) * 1000)
            );
          });
        },
        { threshold: STEPS, rootMargin: "0px 0px -6% 0px" }
      );
      for (const card of waiting) observer.observe(card);
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      timers.forEach(clearTimeout);
      for (const card of cards) {
        delete card.dataset.play;
        card.style.removeProperty("--t");
      }
    };
  }, []);

  return (
    <div ref={box} data-no-reveal className={className}>
      {children}
    </div>
  );
}
