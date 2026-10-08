"use client";

import { useEffect, type RefObject } from "react";
import { reducedMotion } from "@/components/fx/count-up";

/*
 * The plan picker's guiding motion: the intro when it scrolls into view, choices that invite a
 * tap, steps that slide in the way the visitor is going, and the slider's one-time nudge. Every
 * move plays once, never holds up a tap, and nothing here runs under reduced motion. The few
 * looks that only need CSS live in the "Plan wizard (batch 9)" block of globals.css.
 */

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
/** How long a choice takes to land, and the gap between one landing and the next. */
const LAND_MS = 480;
const LAND_GAP_MS = 55;
/** With nothing tapped, the choices are cued again after this long, at most twice. */
const IDLE_MS = 6000;

/** Choices that are showing at this screen size; the other breakpoint's copies take no space. */
function taps(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(".wz-tap")].filter((el) => el.offsetWidth > 0);
}

/** The choices rise into place one after another, starting `start` ms from now. Returns when the last one lands. */
export function landChoices(root: HTMLElement, start = 0): number {
  if (reducedMotion()) return 0;
  const list = taps(root);
  list.forEach((el, i) =>
    el.animate([{ opacity: 0, transform: "translateY(14px) scale(0.97)" }, { opacity: 1, transform: "none" }], {
      duration: LAND_MS,
      delay: start + i * LAND_GAP_MS,
      easing: EASE_OUT,
      fill: "backwards",
    })
  );
  return start + Math.max(0, list.length - 1) * LAND_GAP_MS + LAND_MS;
}

/** Each choice lifts a little and a light passes across it, one after another. `soft` is the quieter reminder. */
export function cueChoices(root: HTMLElement, soft = false) {
  if (reducedMotion()) return;
  taps(root).forEach((el, i) => {
    const delay = i * (soft ? 90 : 120);
    el.animate([{ translate: "0 0" }, { translate: `0 ${soft ? -2 : -5}px`, offset: 0.4 }, { translate: "0 0" }], {
      duration: 640,
      delay,
      easing: "ease-in-out",
    });
    el.querySelector<HTMLElement>(":scope > .wz-sheen")?.animate([{ transform: "translateX(-110%)" }, { transform: "translateX(110%)" }], {
      duration: soft ? 900 : 760,
      delay: delay + 40,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    });
  });
}

/**
 * The first look at the picker: the title's words rise in, the steps follow, then the card and
 * its choices. Returns the time the last choice lands, when the first tap cue can start.
 */
export function playIntro(section: HTMLElement): number {
  if (reducedMotion()) return 0;
  const rise = (el: Element, delay: number, from: string, duration = 620) =>
    el.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: "none" }], { duration, delay, easing: EASE_OUT, fill: "backwards" });

  section.querySelectorAll(".wz-eyebrow").forEach((el) => rise(el, 0, "translateY(8px)"));
  section.querySelectorAll(".wz-word").forEach((el, i) => rise(el, 60 + i * 70, "translateY(0.55em)", 680));
  [...section.querySelectorAll<HTMLElement>(".wz-step")]
    .filter((el) => el.offsetWidth > 0)
    .forEach((el, i) => rise(el, 300 + i * 110, "translateY(8px) scale(0.92)", 520));
  // The bar for the step in hand fills from the left.
  section.querySelectorAll(".wz-bar-on").forEach((el) =>
    el.animate([{ scale: "0 1" }, { scale: "1 1" }], { duration: 700, delay: 520, easing: EASE_OUT, fill: "backwards" })
  );
  const card = section.querySelector(".wz-card");
  if (card) rise(card, 420, "translateY(22px)", 700);
  const stage = section.querySelector<HTMLElement>(".wz-stage");
  return stage ? landChoices(stage, 560) : 700;
}

/** The step in hand slides out against the way the visitor is going (forward is +1, back is -1). */
export function leaveStep(stage: HTMLElement, dir: number): Promise<void> {
  if (reducedMotion()) return Promise.resolve();
  const out = stage.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: `translateX(${-dir * 28}px)` }], {
    duration: 170,
    easing: "cubic-bezier(0.4, 0, 1, 1)",
    fill: "forwards",
  });
  return out.finished.then(
    () => undefined,
    () => undefined
  );
}

/** Blocks marked `data-wz-seq="n"` rise in n-th, this long after a step arrives and this far apart. */
export const SEQ_START_MS = 160;
export const SEQ_GAP_MS = 120;

/** The new step slides in from the side the visitor is heading to; its choices land in turn and its marked blocks rise in order. Returns when the choices have landed. */
export function enterStep(stage: HTMLElement, dir: number): number {
  // Drop the leaving slide's held last frame.
  stage.getAnimations().forEach((a) => a.cancel());
  if (reducedMotion()) return 0;
  stage.animate([{ opacity: 0, transform: `translateX(${dir * 36}px)` }, { opacity: 1, transform: "none" }], { duration: 420, easing: EASE_OUT });
  stage.querySelectorAll<HTMLElement>("[data-wz-seq]").forEach((el) =>
    el.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], {
      duration: 560,
      delay: SEQ_START_MS + Number(el.dataset.wzSeq) * SEQ_GAP_MS,
      easing: EASE_OUT,
      fill: "backwards",
    })
  );
  return landChoices(stage, 90);
}

/** The card eases from its old size to the new step's, instead of jumping. */
export function resizeCard(card: HTMLElement, from: { width: number; height: number }) {
  if (reducedMotion()) return;
  const width = card.offsetWidth;
  const height = card.offsetHeight;
  if (Math.abs(width - from.width) < 2 && Math.abs(height - from.height) < 2) return;
  card.style.overflow = "clip";
  const done = () => {
    card.style.removeProperty("overflow");
    // Overlays laid over the card (the cursor spotlight) measure it again.
    window.dispatchEvent(new Event("scroll"));
  };
  card
    .animate([{ width: `${from.width}px`, height: `${from.height}px` }, { width: `${width}px`, height: `${height}px` }], { duration: 440, easing: EASE_OUT })
    .finished.then(done, done);
}

/**
 * After a step change the card's top stays in view, with the steps above it (`anchor`): when they
 * are hidden under the floating header, above the screen or low on it, they are brought up to
 * sit just under the header.
 */
export function keepInView(anchor: HTMLElement) {
  const header = Math.max(0, document.querySelector("header")?.getBoundingClientRect().bottom ?? 0);
  const top = anchor.getBoundingClientRect().top;
  if (top >= header + 8 && top < window.innerHeight * 0.55) return;
  window.scrollTo({ top: Math.max(0, window.scrollY + top - header - 12), behavior: reducedMotion() ? "auto" : "smooth" });
}

/**
 * The slider's thumb slips sideways and back once, with a soft ring, to show it can be dragged.
 * A press on the slider stops it at once.
 */
export function nudgeSlider(input: HTMLInputElement, delay = 0) {
  if (reducedMotion()) return;
  const value = Number(input.value);
  const atEnd = value <= Number(input.min) || value >= Number(input.max);
  const sign = value >= Number(input.max) ? -1 : 1;
  const steps = atEnd ? [0, 24, 4, 12, 0] : [0, 22, -16, 6, 0];
  const nudge = input.animate(
    steps.map((x, i) => ({ "--wz-nudge": `${x * sign}px`, "--wz-ring": i === 0 || i === steps.length - 1 ? "0px" : "9px" })),
    { duration: 1600, delay, easing: "ease-in-out" }
  );
  const stop = () => nudge.cancel();
  input.addEventListener("pointerdown", stop, { once: true });
  input.addEventListener("keydown", stop, { once: true });
}

/**
 * Cues the choices under `root` once `wait` ms after `active` turns on and the choices are in view,
 * then again, more softly, after every six seconds with nothing tapped (`repeats` times at most).
 * Turning `active` off, or changing `key`, stops it.
 */
export function useTapInvite(root: RefObject<HTMLElement | null>, active: boolean, key: unknown, wait = 800, repeats = 2) {
  useEffect(() => {
    const el = root.current;
    if (!active || !el || reducedMotion()) return;
    let timer = 0;
    let round = 0;
    let seen = false;
    let due = false;
    const run = () => {
      if (!seen || document.hidden) {
        due = true;
        return;
      }
      due = false;
      cueChoices(el, round > 0);
      round += 1;
      if (round <= repeats) timer = window.setTimeout(run, IDLE_MS);
    };
    const watch = new IntersectionObserver(
      ([entry]) => {
        seen = entry.isIntersecting;
        if (seen && due) timer = window.setTimeout(run, 250);
      },
      // In view means past the lower third of the screen, however tall the step is.
      { rootMargin: "0px 0px -30% 0px" }
    );
    watch.observe(el);
    timer = window.setTimeout(run, wait);
    return () => {
      clearTimeout(timer);
      watch.disconnect();
    };
  }, [root, active, key, wait, repeats]);
}
