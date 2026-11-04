import type { ReactNode } from "react";

/** Keyboard focus on the page's own links and buttons. */
export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/** The page's section title: medium weight, one phrase picked out in colour by the caller. */
export function Heading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-[30px] font-medium leading-[35px] tracking-[-0.3px] text-navy lg:text-[48px] lg:leading-[54px] lg:tracking-[-0.6px] ${className}`}>
      {children}
    </h2>
  );
}

/** The small ring-bulleted line above a section title. */
export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-[19px] gap-y-1 text-[15px] leading-6 text-navy lg:gap-x-[22px] lg:text-base">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full border-2 border-brand" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** A tower with two side wings: the office, in the page's button and on its map. */
export function OfficeIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M10 7h4M10 11h4M10 15h4" />
      <path d="M7 10.5H4.5a2 2 0 0 0-2 2V20a2 2 0 0 0 2 2H7M17 10.5h2.5a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2H17" />
    </svg>
  );
}
