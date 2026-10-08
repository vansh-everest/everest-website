"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";

/**
 * The four triangles of the Everest mark, traced from /figma/logo.png in that file's own
 * 1675 x 961 pixel grid, with the colours sampled from it. Listed clockwise from the top left,
 * the order they burst in. dx/dy point each one away from the centre of the mark (the bottom-left
 * one down, clear of the "t"); spin is the way it turns.
 */
const MARK = [
  { fill: "#f0d512", points: "1289,196.5 1422,196.5 1422,329.5", dx: -1, dy: -1, spin: -1 },
  { fill: "#b3cf32", points: "1432.75,196.5 1565.75,196.5 1565.75,329.5", dx: 1, dy: -1, spin: 1 },
  { fill: "#9a3e91", points: "1432.75,341.75 1565.75,341.75 1565.75,474.75", dx: 1, dy: 1, spin: 1 },
  { fill: "#006db2", points: "1289,341.75 1422,341.75 1422,474.75", dx: 0.25, dy: 1, spin: -1 },
] as const;

/** How far a triangle flies out, in the artwork's pixels (about 8 screen pixels at header size). */
const BURST = 140;

/**
 * The Everest logo as a link home. The wordmark is the original artwork with the mark cut out;
 * the mark is drawn over it as four triangles, so at rest it looks exactly like the PNG.
 *
 * A click sends the triangles spinning out one after another and snaps them back into the mark.
 * The link navigates as usual while they move. Mouse screens get a small hover hint (globals.css,
 * "Chrome (batch 9)"); reduced motion gets neither.
 */
export function BrandLogo({
  href = "/",
  tone = "dark",
  className = "",
  preload = false,
}: {
  /** The home page it links to: the one in the page's language. */
  href?: string;
  /** "dark" for the navy wordmark on light backgrounds, "light" for the white one. */
  tone?: "dark" | "light";
  className?: string;
  preload?: boolean;
}) {
  const mark = useRef<SVGSVGElement>(null);

  const burst = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const triangles = mark.current?.querySelectorAll("polygon");
    triangles?.forEach((triangle, i) => {
      const { dx, dy, spin } = MARK[i];
      triangle.getAnimations().forEach((a) => a.cancel());
      triangle.animate(
        [
          { transform: "translate(0, 0) rotate(0deg) scale(1)", easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" },
          {
            transform: `translate(${dx * BURST}px, ${dy * BURST}px) rotate(${spin * 180}deg) scale(0.78)`,
            offset: 0.42,
            easing: "cubic-bezier(0.55, 0, 0.6, 1)",
          },
          {
            transform: `translate(${-dx * 14}px, ${-dy * 14}px) rotate(${spin * 360}deg) scale(1.08)`,
            offset: 0.8,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          },
          { transform: `translate(0, 0) rotate(${spin * 360}deg) scale(1)` },
        ],
        { duration: 620, delay: i * 55 }
      );
    });
  };

  return (
    <Link href={href} onClick={burst} className={`brand-logo block ${className}`}>
      <span className="relative block h-14 w-[98px]">
        <Image
          src={tone === "light" ? "/figma/logo-word-white.png" : "/figma/logo-word.png"}
          alt="Everest Fleet"
          width={98}
          height={56}
          preload={preload}
          className="h-14 w-[98px]"
        />
        <svg
          ref={mark}
          aria-hidden
          viewBox="0 0 1675 961"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          {MARK.map((t) => (
            <polygon
              key={t.fill}
              className="brand-tri"
              points={t.points}
              fill={t.fill}
              style={{ "--dx": t.dx, "--dy": t.dy } as CSSProperties}
            />
          ))}
        </svg>
      </span>
    </Link>
  );
}
