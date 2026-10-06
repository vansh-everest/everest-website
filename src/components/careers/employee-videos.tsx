"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { VIDEOS } from "./data";

const GAP = 24;
const arrow =
  "absolute top-1/2 z-10 hidden size-[46px] -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-[0_4px_14px_rgba(6,47,80,0.16)] transition-opacity disabled:cursor-default lg:grid";

/**
 * The employee interviews. A card plays its YouTube video in place when pressed, so nothing
 * loads from YouTube until someone asks for it. Phones swipe; wide screens step with the arrows.
 */
export function EmployeeVideos() {
  const track = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [state, setState] = useState({ start: true, end: false, index: 0 });

  function measure() {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const next = {
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      index: Math.round(el.scrollLeft / (card.offsetWidth + 12)),
    };
    // Scroll fires many times a frame; only a change in what the controls show is worth a render.
    setState((prev) =>
      prev.start === next.start && prev.end === next.end && prev.index === next.index ? prev : next,
    );
  }

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function step(direction: 1 | -1) {
    const card = track.current?.firstElementChild as HTMLElement | null;
    if (card) track.current?.scrollBy({ left: direction * (card.offsetWidth + GAP), behavior: "smooth" });
  }

  return (
    <section className="overflow-x-clip bg-[#f5f8fb] pb-10 pt-[38px] lg:pb-[120px] lg:pt-[86px]">
      <h2 className="px-4 text-center text-[26px] font-bold leading-8 text-navy lg:text-[44px] lg:leading-[53px]">
        Our Employee Testimonial
      </h2>
      <div className="relative mx-auto mt-[17px] max-w-[1104px] lg:mt-[33.5px] lg:w-[calc(100%-48px)]">
        <button type="button" aria-label="Previous video" disabled={state.start} onClick={() => step(-1)} className={`${arrow} -left-[23px]`}>
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <div
          ref={track}
          onScroll={measure}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] lg:gap-6 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {VIDEOS.map((video) => (
            <div key={video.id} className="relative aspect-[352/200] w-[300px] shrink-0 snap-start overflow-hidden rounded-[20px] bg-navy lg:w-[352px]">
              {playing === video.id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                  title={video.name}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 size-full"
                />
              ) : (
                <button type="button" onClick={() => setPlaying(video.id)} className="group absolute inset-0" aria-label={`Play: ${video.name}`}>
                  <Image src={video.image} alt="" fill sizes="(min-width: 1024px) 352px, 300px" className="object-cover" />
                  <span className="absolute left-1/2 top-1/2 grid size-[42px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[2.5px] border-white text-white transition group-hover:scale-110 lg:size-[50px] lg:border-[3px]">
                    <Play className="ml-0.5 size-4 fill-white lg:size-5" strokeWidth={0} />
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" aria-label="Next video" disabled={state.end} onClick={() => step(1)} className={`${arrow} -right-[23px]`}>
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>
      </div>
      <div aria-hidden className="mt-4 flex justify-center gap-1.5 lg:hidden">
        {VIDEOS.map((video, i) => (
          <span key={video.id} className={`h-2 rounded-full transition-all ${i === state.index ? "w-[22px] bg-navy" : "w-2 bg-navy/15"}`} />
        ))}
      </div>
    </section>
  );
}
