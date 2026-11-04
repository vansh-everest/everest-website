"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import { ROUTES, lowestFare, rupees, type Route } from "./routes";
import { RouteSheet } from "./route-sheet";

const DRAG_START_PX = 4;
const SNAP_BACK_MS = 400;

function RouteCard({ route, onBook }: { route: Route; onBook: (route: Route, opener: HTMLElement) => void }) {
  const label = "text-[9px] font-semibold uppercase leading-3 text-ink-soft lg:text-[10px] lg:leading-[14px]";
  return (
    <article className="grid h-full grid-cols-[1fr_auto] items-center rounded-lg border border-[#cfdeea] bg-white px-[19px] pb-[11px] pt-[17px] lg:px-6 lg:pb-[23px] lg:pt-6">
      <div className="col-span-2 flex items-start lg:justify-between">
        <p className="w-[105px] lg:w-auto">
          <span className={`block ${label}`}>From</span>
          <span className="block text-sm font-semibold leading-[18px] text-navy lg:text-xl lg:leading-[26px]">{route.from}</span>
        </p>
        <ArrowRight aria-hidden size={16} strokeWidth={1.9} className="mt-[7px] text-ink-soft lg:mt-[7px] lg:size-[18px] lg:text-brand" />
        <p className="ml-2 lg:ml-0">
          <span className={`block ${label}`}>To</span>
          <span className="block text-sm font-semibold leading-[18px] text-navy lg:text-xl lg:leading-[26px]">{route.to}</span>
        </p>
      </div>
      <div className="order-2 col-span-2 mt-2.5 lg:order-4 lg:col-span-1 lg:mt-0">
        <p className={label}>Starting from</p>
        <p className="text-2xl font-bold leading-[30px] text-navy lg:mt-0.5 lg:text-[38px] lg:leading-[42px]">{rupees(lowestFare(route))}</p>
      </div>
      <span aria-hidden className="order-3 col-span-2 my-[7px] block border-t border-[#cfdeea] lg:mb-[20px] lg:mt-[21px] lg:border-dashed lg:border-[#dfe5ec]" />
      <p className="order-4 text-xs leading-[18px] text-ink-soft lg:order-2 lg:col-span-2 lg:mt-[13px]">One way · all inclusive</p>
      <button
        type="button"
        aria-label={`Book ${route.from} to ${route.to}`}
        onClick={(event) => onBook(route, event.currentTarget)}
        className="order-5 inline-flex items-center gap-1 self-end rounded-lg text-[13px] font-semibold text-brand transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:h-10 lg:w-[82px] lg:justify-center lg:bg-brand lg:text-sm lg:font-medium lg:text-white lg:hover:brightness-110"
      >
        Book
        <ArrowRight aria-hidden size={15} />
      </button>
    </article>
  );
}

/**
 * The route carousel. The row bleeds off the right edge on a desktop and stops at the page margin on
 * a phone. A mouse has no other way along a row with no arrows, so it can drag; touch and trackpads
 * scroll natively. The bar's fill is the share of the row in view, moved along by the scroll.
 */
export function TopRoutes() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [bar, setBar] = useState({ width: 50, left: 0 });
  const [booking, setBooking] = useState<{ route: Route; opener: HTMLElement } | null>(null);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const width = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
    const room = el.scrollWidth - el.clientWidth;
    setBar({ width, left: room > 0 ? (el.scrollLeft / room) * (100 - width) : 0 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start) return;
    const distance = event.clientX - start.x;
    if (!start.moved && Math.abs(distance) < DRAG_START_PX) return;
    if (!start.moved) {
      start.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.style.scrollSnapType = "none";
    }
    event.currentTarget.scrollLeft = start.left - distance;
  }

  function onPointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    const el = event.currentTarget;
    drag.current = null;
    if (!start?.moved) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap) : el.clientWidth;
    el.scrollTo({ left: Math.round(el.scrollLeft / step) * step, behavior: "smooth" });
    window.setTimeout(() => el.style.removeProperty("scroll-snap-type"), SNAP_BACK_MS);
  }

  const close = useCallback(() => setBooking(null), []);

  return (
    <section className="bg-[linear-gradient(to_bottom_right,#062f51,#0a3d6b)] pb-[38px] pt-[39px] lg:pb-[56px] lg:pt-14">
      <h2 className="px-5 text-center text-[28px] font-bold leading-9 text-white lg:text-[40px] lg:leading-[48px]">Top Routes, Fixed Prices</h2>
      <p className="mx-auto mt-3 max-w-[340px] px-2 text-center text-[15px] leading-[23px] text-white/70 lg:mt-2 lg:max-w-none lg:text-base">
        Fixed, upfront pricing on our most-travelled corridors
      </p>
      <div className="mx-5 mt-[23px] overflow-hidden lg:mx-0 lg:mt-[27px]">
        <div
          ref={track}
          role="region"
          aria-label="Top routes"
          onScroll={measure}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] lg:cursor-grab lg:gap-5 lg:scroll-pl-[max(24px,calc((100vw-1200px)/2))] lg:px-[max(24px,calc((100vw-1200px)/2))] lg:active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        >
          {ROUTES.map((route) => (
            <div key={`${route.from}-${route.to}`} className="w-[264px] shrink-0 snap-start lg:w-[285px]">
              <RouteCard route={route} onBook={(picked, opener) => setBooking({ route: picked, opener })} />
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-[23px] flex max-w-[1248px] items-center justify-center px-5 lg:mt-[30px] lg:justify-between lg:px-6">
        <span aria-hidden className="relative hidden h-1 w-40 overflow-hidden rounded-full bg-white/20 lg:block">
          <span className="absolute inset-y-0 rounded-full bg-sun" style={{ width: `${bar.width}%`, left: `${bar.left}%` }} />
        </span>
        <a
          href="#book"
          className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Going somewhere else? Book any route
          <ArrowUp aria-hidden size={15} />
        </a>
      </div>
      {booking ? <RouteSheet key={`${booking.route.from}-${booking.route.to}`} route={booking.route} opener={booking.opener} onClose={close} /> : null}
    </section>
  );
}
