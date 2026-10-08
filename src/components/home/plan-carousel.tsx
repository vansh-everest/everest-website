"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** How long each card stays before the next one slides in. */
const ADVANCE_MS = 4500;
/** How long the row stays still after the visitor last touched it. */
const IDLE_AFTER_TOUCH_MS = 10_000;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Where the row must scroll to centre its `index`th card. */
function centreOf(row: HTMLDivElement, index: number): number | null {
  const card = row.children[index] as HTMLElement | undefined;
  if (!card) return null;
  const left = card.offsetLeft + card.offsetWidth / 2 - row.clientWidth / 2;
  return Math.max(0, Math.min(left, row.scrollWidth - row.clientWidth));
}

/** The card whose middle is nearest the row's middle. */
function centredIndex(row: HTMLDivElement): number {
  const middle = row.scrollLeft + row.clientWidth / 2;
  let best = 0;
  let bestGap = Infinity;
  Array.from(row.children).forEach((child, i) => {
    const card = child as HTMLElement;
    const gap = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle);
    if (gap < bestGap) {
      bestGap = gap;
      best = i;
    }
  });
  return best;
}

/**
 * The plan cards' row. On a wide screen the cards sit side by side and nothing moves. Where the
 * row scrolls (phones and small tablets), a swipe moves exactly one card, dots under it show and
 * pick the card in view, and the next card slides in every few seconds while the row is on
 * screen: never while the visitor is touching it, nor for a while after, nor under reduced motion.
 */
export function PlanCarousel({ label, names, className, children }: { label: string; names: string[]; className: string; children: ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  // While a finger is down, and when it last let go (or a dot was picked).
  const touchingRef = useRef(false);
  const lastTouchRef = useRef(-Infinity);
  const count = Children.count(children);

  const goTo = useCallback((index: number) => {
    const row = rowRef.current;
    if (!row) return;
    const left = centreOf(row, index);
    if (left === null) return;
    row.scrollTo({ left, behavior: reducedMotion() ? "auto" : "smooth" });
  }, []);

  // The dot follows whichever card is centred, however it got there.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = centredIndex(row);
        if (index !== activeRef.current) {
          activeRef.current = index;
          setActive(index);
        }
      });
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      row.removeEventListener("scroll", onScroll);
    };
  }, []);

  // One card per swipe. Native momentum can carry a hard flick past the next card whatever
  // scroll-snap-stop says, so on a touch screen the row moves with the finger itself (the page
  // still scrolls up and down natively, touch-action: pan-y) and glides to the neighbour on release.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let axis: "x" | "y" | null = "y";
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startIndex = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let snapBack = 0;

    // Snapping would pull every step of the drag to a card, so it is off from the first move
    // until the glide has landed.
    const snapOff = () => {
      window.clearTimeout(snapBack);
      row.style.scrollSnapType = "none";
    };
    const snapOnSoon = () => {
      window.clearTimeout(snapBack);
      snapBack = window.setTimeout(() => row.style.removeProperty("scroll-snap-type"), 700);
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || row.scrollWidth <= row.clientWidth + 1) {
        axis = "y";
        return;
      }
      const t = e.touches[0];
      startX = lastX = t.clientX;
      startY = t.clientY;
      lastT = e.timeStamp;
      velocity = 0;
      startLeft = row.scrollLeft;
      startIndex = centredIndex(row);
      axis = null;
    };
    const onMove = (e: TouchEvent) => {
      if (axis === "y" || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      if (axis === null) {
        const dy = t.clientY - startY;
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axis === "y") return;
        snapOff();
      }
      const dt = e.timeStamp - lastT;
      if (dt > 0) velocity = 0.7 * ((t.clientX - lastX) / dt) + 0.3 * velocity;
      lastX = t.clientX;
      lastT = e.timeStamp;
      const last = row.children.length - 1;
      const low = centreOf(row, Math.max(0, startIndex - 1)) ?? 0;
      const high = centreOf(row, Math.min(last, startIndex + 1)) ?? 0;
      row.scrollLeft = Math.min(high, Math.max(low, startLeft - dx));
    };
    const onEnd = () => {
      if (axis !== "x") {
        axis = "y";
        return;
      }
      axis = "y";
      const moved = row.scrollLeft - startLeft;
      // A quick flick counts whatever its length; a slow drag must cover a fifth of the row.
      const flick = Math.abs(velocity) > 0.3 ? -Math.sign(velocity) : 0;
      const step = flick || (Math.abs(moved) > row.clientWidth * 0.2 ? Math.sign(moved) : 0);
      const target = Math.min(row.children.length - 1, Math.max(0, startIndex + step));
      row.scrollTo({ left: centreOf(row, target) ?? startLeft, behavior: reducedMotion() ? "auto" : "smooth" });
      snapOnSoon();
    };

    row.addEventListener("touchstart", onStart, { passive: true });
    row.addEventListener("touchmove", onMove, { passive: true });
    row.addEventListener("touchend", onEnd, { passive: true });
    row.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.clearTimeout(snapBack);
      row.style.removeProperty("scroll-snap-type");
      row.removeEventListener("touchstart", onStart);
      row.removeEventListener("touchmove", onMove);
      row.removeEventListener("touchend", onEnd);
      row.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  // The next card every few seconds, looping back to the first after the last.
  useEffect(() => {
    const row = rowRef.current;
    if (!row || count < 2 || reducedMotion()) return;

    let onScreen = false;
    const hold = () => {
      lastTouchRef.current = performance.now();
    };
    // A finger counts from touchstart to touchend: the browser cancels its pointer as soon as the
    // swipe starts scrolling, while the finger is still down.
    const isFingerPointer = (e: Event) => e instanceof PointerEvent && e.pointerType === "touch";
    const press = (e: Event) => {
      if (isFingerPointer(e)) return;
      touchingRef.current = true;
      hold();
    };
    const release = (e: Event) => {
      if (isFingerPointer(e)) return;
      touchingRef.current = false;
      hold();
    };

    const seen = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        // The cards still off to the side settle now, together with the ones in view, rather
        // than rising into place as they slide in (RevealOnScroll marks them "out").
        if (onScreen && row.scrollWidth > row.clientWidth + 1) {
          row.querySelectorAll<HTMLElement>('[data-fx="out"]').forEach((el) => {
            el.dataset.fx = "in";
          });
        }
      },
      { threshold: 0.5 }
    );
    seen.observe(row);

    const pressEvents = ["touchstart", "pointerdown"] as const;
    const releaseEvents = ["touchend", "touchcancel", "pointerup"] as const;
    const holdEvents = ["wheel", "keydown", "focusin"] as const;
    pressEvents.forEach((e) => row.addEventListener(e, press, { passive: true }));
    releaseEvents.forEach((e) => row.addEventListener(e, release, { passive: true }));
    holdEvents.forEach((e) => row.addEventListener(e, hold, { passive: true }));

    const timer = window.setInterval(() => {
      const scrolls = row.scrollWidth > row.clientWidth + 1;
      const idle = !touchingRef.current && performance.now() - lastTouchRef.current >= IDLE_AFTER_TOUCH_MS;
      if (!scrolls || !onScreen || !idle || document.hidden) return;
      goTo((activeRef.current + 1) % count);
    }, ADVANCE_MS);

    return () => {
      window.clearInterval(timer);
      seen.disconnect();
      pressEvents.forEach((e) => row.removeEventListener(e, press));
      releaseEvents.forEach((e) => row.removeEventListener(e, release));
      holdEvents.forEach((e) => row.removeEventListener(e, hold));
    };
  }, [count, goTo]);

  return (
    <div data-plan-carousel>
      <div ref={rowRef} role="region" aria-label={label} className={`${className} touch-pan-y touch-pinch-zoom lg:touch-auto`}>
        {children}
      </div>
      {count > 1 ? (
        <div className="plan-dots flex justify-center gap-1 lg:hidden">
          {names.map((name, i) => (
            <button
              key={`${i}-${name}`}
              type="button"
              aria-label={name}
              aria-current={i === active ? "true" : undefined}
              onClick={() => {
                // A tap on a dot is a choice: that card stays like it does after a touch on the row.
                lastTouchRef.current = performance.now();
                goTo(i);
              }}
              className="plan-dot group grid h-6 min-w-6 place-items-center px-1"
            >
              <span aria-hidden className="plan-dot-mark block h-2 w-2 rounded-full bg-navy/25 group-aria-[current=true]:w-6 group-aria-[current=true]:bg-navy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
