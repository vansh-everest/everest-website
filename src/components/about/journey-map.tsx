"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { JourneyCard, JourneyPin, type JourneyStop } from "./journey-card";

/** The drawing's own units; the box keeps this ratio, so a stop's position is a share of it. */
const W = 1440;
const H = 1130;

/**
 * The road's centre line: in from the left along the bottom, a hairpin up on the right, back along
 * the middle, a hairpin up on the left, then across and up into the arrow at the top right.
 */
const ROAD =
  "M -40 1045 C 260 1060, 520 1025, 800 1040 C 960 1048, 1080 1042, 1170 1040 C 1350 1040, 1350 770, 1170 770 C 950 770, 820 755, 640 768 C 470 780, 360 770, 270 770 C 90 770, 90 500, 270 500 C 450 500, 620 515, 780 502 C 880 494, 940 492, 980 480 C 1090 450, 1150 410, 1150 335";
const ARROW = "1012,342 1150,212 1288,342";

/** Where each year's pin stands on the road, in drawing units, oldest first; the last sits on the arrow. */
const SPOTS: { x: number; y: number; width: number }[] = [
  { x: 190, y: 1048, width: 236 },
  { x: 560, y: 1037, width: 236 },
  { x: 930, y: 1044, width: 236 },
  { x: 1010, y: 768, width: 236 },
  { x: 720, y: 764, width: 250 },
  { x: 420, y: 773, width: 300 },
  { x: 450, y: 504, width: 280 },
  { x: 760, y: 503, width: 236 },
  { x: 1150, y: 300, width: 236 },
];

type Phase = "still" | "waiting" | "drawing";

/**
 * "Our Journey So Far" from xl up: a winding road map with a pin and a card for every year.
 * The first time it scrolls into view the road draws itself and the pins drop in along it, once.
 * Reduced motion, or no script, shows it finished.
 */
export function JourneyMap({ stops }: { stops: JourneyStop[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("still");
  const mask = `journey-road-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Hidden only once the script runs, and only while the map is still below the fold.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.75) return;
    setPhase("waiting");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        setPhase("drawing");
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = phase === "waiting";
  const animate = phase === "drawing";
  const road: CSSProperties = {
    strokeDasharray: "1 1",
    strokeDashoffset: hidden ? 1 : 0,
    transition: animate ? "stroke-dashoffset 2.6s cubic-bezier(0.45, 0, 0.25, 1)" : undefined,
  };

  return (
    <div ref={box} className="relative mx-auto mt-10 hidden max-w-[1440px] xl:block" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible">
        <defs>
          <mask id={mask} maskUnits="userSpaceOnUse" x="-100" y="0" width={W + 200} height={H}>
            <path d={ROAD} pathLength={1} fill="none" stroke="white" strokeWidth={130} strokeLinecap="round" style={road} />
          </mask>
        </defs>
        <g mask={`url(#${mask})`}>
          <path d={ROAD} transform="translate(0 9)" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={100} />
          <path d={ROAD} fill="none" stroke="#f1f1f1" strokeWidth={92} />
          <path d={ROAD} fill="none" stroke="#373739" strokeWidth={74} />
          <path d={ROAD} fill="none" stroke="#ffffff" strokeWidth={3} strokeDasharray="18 16" />
        </g>
        <polygon
          points={ARROW}
          fill="#373739"
          stroke="#f1f1f1"
          strokeWidth={9}
          strokeLinejoin="round"
          style={{
            opacity: hidden ? 0 : 1,
            transition: animate ? "opacity 0.5s ease 2.4s" : undefined,
          }}
        />
      </svg>

      <ol>
        {stops.map((stop, i) => {
          const spot = SPOTS[Math.min(i, SPOTS.length - 1)];
          const delay = 0.35 + (i / Math.max(1, stops.length - 1)) * 2.3;
          return (
            <li
              key={stop.year}
              className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
              style={{ left: `${(spot.x / W) * 100}%`, top: `${(spot.y / H) * 100}%`, width: spot.width }}
            >
              <JourneyCard
                stop={stop}
                className="w-full"
                style={{
                  opacity: hidden ? 0 : 1,
                  transform: hidden ? "translateY(10px)" : "none",
                  transition: animate ? `opacity 0.5s ease ${delay + 0.15}s, transform 0.5s ease ${delay + 0.15}s` : undefined,
                }}
              />
              <span
                aria-hidden
                className="h-4 w-0.5 bg-white/80"
                style={{ opacity: hidden ? 0 : 1, transition: animate ? `opacity 0.3s ease ${delay + 0.1}s` : undefined }}
              />
              <span
                className="block origin-bottom"
                style={{
                  transform: hidden ? "scale(0)" : "scale(1)",
                  transition: animate ? `transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s` : undefined,
                }}
              >
                <JourneyPin />
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
