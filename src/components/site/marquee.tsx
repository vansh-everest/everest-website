import type { CSSProperties, ReactNode } from "react";

/**
 * A row that drifts left without end.
 *
 * The items are laid out `copies` times in each half and the track holds two halves, so moving
 * it by half its width lands on an identical frame. Each item carries its own trailing gap, which
 * keeps the spacing even across the seam. Only the first copy is real: the rest are hidden from
 * screen readers and the keyboard. The row stops under a pointer, a finger or keyboard focus, and
 * for anyone who has asked for reduced motion it is a plain swipe row of one copy.
 */
export function Marquee({
  items,
  label,
  seconds,
  copies = 2,
  itemClassName = "",
  className = "",
}: {
  items: { key: string; node: ReactNode }[];
  label: string;
  /** Time for one copy of the items to pass; longer is slower. */
  seconds: number;
  copies?: number;
  /** Width and trailing gap of each item, e.g. "w-[300px] pr-7". */
  itemClassName?: string;
  className?: string;
}) {
  const halves = [0, 1];
  return (
    <div
      role="region"
      aria-label={label}
      className={`group overflow-hidden motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:none] ${className}`}
    >
      <div
        style={{ "--marquee-speed": `${seconds * copies}s` } as CSSProperties}
        className="flex w-max animate-marquee group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused] motion-reduce:animate-none"
      >
        {halves.flatMap((half) =>
          Array.from({ length: copies }, (_, copy) => {
            const real = half === 0 && copy === 0;
            return (
              <div
                key={`${half}-${copy}`}
                aria-hidden={real ? undefined : true}
                inert={!real}
                className={`flex ${real ? "" : "motion-reduce:hidden"}`}
              >
                {items.map((item) => (
                  <div key={item.key} className={`flex shrink-0 ${itemClassName}`}>
                    {item.node}
                  </div>
                ))}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
