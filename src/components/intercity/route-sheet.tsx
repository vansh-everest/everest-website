"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { holdScroll } from "@/components/fx/smooth-scroll";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/home/ui";
import { sendLead } from "@/components/b2b/lead";
import { Captcha } from "@/components/site/captcha";
import { Consent } from "@/components/site/consent";
import { MobileField, Received, RouteName, VehicleOptions, WhenFields } from "./fields";
import { rupees, vehicleLabel, type Route, type VehicleId } from "./routes";

const TABBABLE = 'a[href], button:not([disabled]), iframe, select:not([disabled]), input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])';

const SUN_BUTTON =
  "block h-12 w-full rounded-full bg-sun text-[20px] font-medium tracking-[0.2px] text-navy transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60";

/**
 * The booking sheet behind a route card's Book button: a centred modal on a desktop, a bottom sheet
 * on a phone. It is a plain dialog over the page, not a native <dialog>: Google's checkbox opens its
 * image challenge on <body>, which a native modal would leave unreachable behind it. While open it
 * holds the page still, makes the page inert and keeps Tab inside; closing returns to `opener`.
 */
export function RouteSheet({ route, opener, onClose }: { route: Route; opener: HTMLElement | null; onClose: () => void }) {
  const [vehicle, setVehicle] = useState<VehicleId>("hatchback");
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [booked, setBooked] = useState<VehicleId>("hatchback");
  const panel = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLButtonElement>(null);
  const title = useId();

  useEffect(() => {
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    const release = holdScroll();
    const behind = [...document.body.children].filter((el) => !el.contains(panel.current));
    for (const el of behind) el.setAttribute("inert", "");
    panel.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(TABBABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel.current)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      release();
      for (const el of behind) el.removeAttribute("inert");
      opener?.focus({ preventScroll: true });
    };
  }, [onClose, opener]);

  useEffect(() => {
    if (state === "done") done.current?.focus();
  }, [state]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const data = new FormData(event.currentTarget);
    const name = `${route.from} to ${route.to}`;
    const fare = rupees(route.fares[vehicle]);
    const when = `${data.get("date")} ${data.get("time")}`;
    data.set("route", name);
    data.set("pickup", route.from);
    data.set("drop", route.to);
    data.set("trip", "One Way");
    data.set("fare", fare);
    data.set("when", when);
    data.set("city", route.city);
    data.set("name", `Intercity: ${name}, One Way, ${when}, ${vehicleLabel(vehicle)}, ${fare}`);
    setBooked(vehicle);
    setState((await sendLead(data, "intercity")) ? "done" : "failed");
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center lg:items-center">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 starting:opacity-0 motion-reduce:transition-none"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title}
        tabIndex={-1}
        data-lenis-prevent
        className="relative max-h-[calc(100dvh-24px)] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-white px-5 pb-[calc(16px+env(safe-area-inset-bottom,0px))] pt-[26px] shadow-[0_20px_60px_rgba(6,47,80,0.3)] outline-none transition duration-300 ease-out starting:translate-y-full motion-reduce:transition-none lg:max-h-[calc(100dvh-48px)] lg:w-[480px] lg:rounded-3xl lg:px-7 lg:pb-5 lg:pt-7 lg:starting:translate-y-3 lg:starting:opacity-0"
      >
        <span aria-hidden className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-[#d9dee6] lg:hidden" />
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-[26px] z-10 grid size-9 place-items-center rounded-full bg-[#eef2f6] text-navy transition hover:bg-[#dee4ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:right-7 lg:top-7"
        >
          <X aria-hidden size={18} strokeWidth={2.25} />
        </button>

        {state === "done" ? (
          <div className="pb-1 pt-[122px] lg:pb-2 lg:pt-[110px]">
            <Received titleId={title} from={route.from} to={route.to} detail={`${vehicleLabel(booked)} · one way · all inclusive`} fare={route.fares[booked]}>
              <button ref={done} type="button" onClick={onClose} className={`${SUN_BUTTON} mt-[76px]`}>
                Done
              </button>
            </Received>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <h2 id={title} className="pr-11 text-2xl font-bold leading-[30px] text-navy">
              <RouteName from={route.from} to={route.to} />
            </h2>
            <p className="text-[13px] leading-[18px] text-ink-soft">One way · all inclusive</p>
            <div className="mt-[17px] space-y-[17px]">
              <WhenFields look="sheet" dateLabel="Date" timeLabel="Time" />
              <VehicleOptions look="sheet" value={vehicle} onChange={setVehicle} fares={route.fares} />
              <MobileField look="sheet" />
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#dee4ec] pt-[17px]">
              <p>
                <span className="block text-[15px] font-semibold leading-5 text-navy">Fare</span>
                <span className="block text-[13px] leading-[18px] text-ink-soft">{vehicleLabel(vehicle)} · one way · all inclusive</span>
              </p>
              <p className="text-[26px] font-bold leading-8 text-navy">{rupees(route.fares[vehicle])}</p>
            </div>
            <Captcha className="mt-3" />
            <button type="submit" disabled={state === "sending"} className={`${SUN_BUTTON} mt-3`}>
              {state === "sending" ? "Sending" : "Book Now"}
            </button>
            {state === "failed" ? (
              <p role="alert" className="mt-3 text-center text-sm text-navy">
                Not sent: try again, or call <a href={PHONE_HREF} className="underline underline-offset-2">{PHONE_DISPLAY}</a>
              </p>
            ) : null}
            <Consent className="mt-2.5" />
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
