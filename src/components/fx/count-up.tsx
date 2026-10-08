"use client";

import { useLayoutEffect, useRef } from "react";

/** True when the visitor asked for less motion. Read at call time, so effects can ask it directly. */
export function reducedMotion(): boolean {
  return typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** "₹1,50,000" splits into "₹", 150000 and ""; "36 months" into "", 36 and " months". */
function parse(text: string) {
  const match = /^(\D*?)(\d[\d,]*)(\D*)$/.exec(text);
  if (!match) return null;
  return { head: match[1], value: Number(match[2].replace(/,/g, "")), tail: match[3], grouped: match[2].includes(",") || match[1].includes("₹") };
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * A figure that counts to its value instead of jumping: from zero when it first appears (with
 * `fromZero`), and from the old figure whenever it changes. The text is written straight into the
 * span, so counting costs no renders, and the last frame is always the exact text given. Anything
 * that is not one plain number, and reduced motion, simply shows the text.
 */
export function CountUp({
  value,
  fromZero = false,
  delay = 0,
  duration = 600,
  className,
}: {
  value: string;
  fromZero?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // What the span showed last; null until the first count from zero.
  const shown = useRef<string | null>(fromZero ? null : value);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = (text: string) => {
      if (el.textContent !== text) el.textContent = text;
    };
    const to = parse(value);
    const from = shown.current === null ? (to ? { ...to, value: 0 } : null) : parse(shown.current);
    if (reducedMotion() || !to || !from || from.head !== to.head || from.tail !== to.tail || from.value === to.value) {
      shown.current = value;
      write(value);
      return;
    }
    const text = (n: number) => `${to.head}${to.grouped ? n.toLocaleString("en-IN") : n}${to.tail}`;
    let now = text(from.value);
    write(now);
    let start = 0;
    let frame = requestAnimationFrame(function tick(time) {
      if (!start) start = time + delay;
      const progress = Math.min(1, Math.max(0, (time - start) / duration));
      now = progress >= 1 ? value : text(Math.round(from.value + (to.value - from.value) * easeOut(progress)));
      write(now);
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(frame);
      // A new figure mid-count carries on from wherever this one had got to.
      shown.current = now;
    };
  }, [value, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
