"use client";

import Image from "next/image";
import { useState } from "react";

export type Photo = { src: string; alt: string };

/**
 * A swiped row of photos that starts on the page's 1104px column and runs off the right edge, so
 * the next card shows. Phones get a dot per photo.
 */
export function PhotoRail({ label, photos }: { label: string; photos: Photo[] }) {
  const [active, setActive] = useState(0);

  function onScroll(event: React.UIEvent<HTMLDivElement>) {
    const rail = event.currentTarget;
    const [first, second] = rail.querySelectorAll("li");
    if (!first || !second) return;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
    setActive(atEnd ? photos.length - 1 : Math.round(rail.scrollLeft / (second.offsetLeft - first.offsetLeft)));
  }

  return (
    <>
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={onScroll}
        className="snap-x snap-mandatory scroll-pl-4 overflow-x-auto overscroll-x-contain outline-offset-2 outline-sun [scrollbar-width:none] focus-visible:outline-2 lg:scroll-pl-[max(40px,calc((100vw-1104px)/2))] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max gap-3 px-4 lg:gap-5 lg:px-[max(40px,calc((100vw-1104px)/2))]">
          {photos.map((photo) => (
            <li key={photo.src} className="relative aspect-[340/240] w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl lg:w-[340px] lg:rounded-[20px]">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 340px, 280px" className="object-cover" />
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden className="mt-[15px] flex justify-center gap-1.5 lg:hidden">
        {photos.map((photo, i) => (
          <span key={photo.src} className={`h-1.5 rounded-full transition-all ${i === active ? "w-[18px] bg-sun" : "w-1.5 bg-white/30"}`} />
        ))}
      </div>
    </>
  );
}
