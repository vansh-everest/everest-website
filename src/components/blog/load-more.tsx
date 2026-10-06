"use client";

import { Children, useState, type ReactNode } from "react";

/** Shows the first `step` items and a button that reveals the next `step` each time. */
export function LoadMore({
  children,
  step,
  label,
  className,
}: {
  children: ReactNode;
  step: number;
  label: string;
  className: string;
}) {
  const items = Children.toArray(children);
  const [shown, setShown] = useState(step);
  return (
    <>
      <ul className={className}>{items.slice(0, shown)}</ul>
      {shown < items.length ? (
        <button
          type="button"
          onClick={() => setShown((n) => n + step)}
          className="mx-auto mt-6 flex h-[52px] w-full items-center justify-center rounded-full border-2 border-navy text-[17px] font-semibold text-navy transition hover:bg-navy hover:text-white lg:mt-12 lg:h-[50px] lg:w-[188px] lg:text-[17px]"
        >
          {label}
        </button>
      ) : null}
    </>
  );
}
