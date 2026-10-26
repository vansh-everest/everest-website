"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { CITY_COOKIE, CITY_EVENT, CITY_PHONES, cityPhone } from "@/lib/city-phones";
import { PHONE_DISPLAY, PHONE_HREF } from "./ui";

type CityOption = { slug: string; name: string };

const YEAR_SECONDS = 60 * 60 * 24 * 365;

function savedCity(): string {
  return document.cookie.match(new RegExp(`(?:^|; )${CITY_COOKIE}=([^;]*)`))?.[1] ?? "";
}

function watchCity(change: () => void) {
  window.addEventListener(CITY_EVENT, change);
  return () => window.removeEventListener(CITY_EVENT, change);
}

const noCity = () => "";

function saveCity(slug: string) {
  document.cookie = `${CITY_COOKIE}=${slug}; path=/; max-age=${YEAR_SECONDS}; samesite=lax`;
  window.dispatchEvent(new CustomEvent(CITY_EVENT, { detail: slug }));
}

/**
 * Pages for businesses, investors and job seekers. The city numbers run the driver recruitment call
 * flow, so on these pages call links keep the main number.
 */
const NOT_FOR_DRIVERS = ["/fleet-logistics", "/employee-mobility", "/intercity", "/advertise-with-us", "/our-services", "/investors", "/careers", "/newsroom"];

const forDrivers = () => !NOT_FOR_DRIVERS.some((path) => location.pathname.startsWith(path));

/** Each text node's own words, so switching city twice never compounds a change. */
const firstText = new WeakMap<Text, string>();

/** On a driver page, points every link to the main number at the city's number instead; elsewhere, or with no city number, back to the main one. */
function applyPhone(slug: string) {
  const phone = forDrivers() ? cityPhone(slug) : null;
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]')) {
    if (link.dataset.mainTel !== PHONE_HREF && link.getAttribute("href") !== PHONE_HREF) continue;
    link.dataset.mainTel = PHONE_HREF;
    link.setAttribute("href", phone?.href ?? PHONE_HREF);
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
      const original = firstText.get(node) ?? node.nodeValue ?? "";
      if (!original.includes(PHONE_DISPLAY)) continue;
      firstText.set(node, original);
      node.nodeValue = phone ? original.replace(PHONE_DISPLAY, phone.display) : original;
    }
  }
}

/**
 * The visitor's city in the top bar. A choice is kept in a cookie; on a first visit the city the
 * request came from (/api/geo) fills it in, and the visitor can change it. Where the city has its
 * own number (lib/city-phones.ts), every call link on a driver page uses it.
 */
export function CityPicker({ cities }: { cities: CityOption[] }) {
  const id = useId();
  const select = useRef<HTMLSelectElement>(null);
  const saved = useSyncExternalStore(watchCity, savedCity, noCity);
  const city = cities.some((c) => c.slug === saved) ? saved : "";

  // The picker renders blank until it knows the city (saved, or looked up on a first visit), so
  // the placeholder never flashes ahead of the answer.
  useEffect(() => {
    const shown = () => select.current?.removeAttribute("data-detecting");
    if (cities.some((c) => c.slug === savedCity())) {
      shown();
      return;
    }
    let live = true;
    fetch("/api/geo/", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((answer: { city?: string | null } | null) => {
        const slug = answer?.city ?? "";
        if (live && cities.some((c) => c.slug === slug)) saveCity(slug);
      })
      .catch(() => {})
      .finally(() => {
        if (live) shown();
      });
    return () => {
      live = false;
    };
  }, [cities]);

  // Only a city with its own number changes anything on the page; then pages and parts of pages
  // that render later (a client navigation, a menu opening) get the same number.
  useEffect(() => {
    if (!Object.keys(CITY_PHONES).length) return;
    applyPhone(city);
    let frame = 0;
    const watch = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => applyPhone(city));
    });
    watch.observe(document.body, { childList: true, subtree: true });
    return () => {
      watch.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [city]);

  return (
    <div className="relative flex items-center">
      <label htmlFor={id} className="sr-only">
        City
      </label>
      <MapPin aria-hidden size={15} className="pointer-events-none absolute left-0 text-white/80" />
      <select
        id={id}
        ref={select}
        data-detecting=""
        value={city}
        onChange={(e) => saveCity(e.target.value)}
        className="h-8 max-w-[130px] cursor-pointer appearance-none truncate bg-transparent pl-5 pr-5 text-sm font-semibold text-white outline-none transition hover:text-sun focus-visible:text-sun data-[detecting]:text-transparent"
      >
        <option value="" disabled className="text-navy">
          Select city
        </option>
        {cities.map((c) => (
          <option key={c.slug} value={c.slug} className="text-navy">
            {c.name}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden size={14} className="pointer-events-none absolute right-0 text-white/80" />
    </div>
  );
}
