"use client";

import { useEffect } from "react";
import { SITE_URL } from "@/lib/company";
import { CITY_COOKIE } from "@/lib/city-phones";

const LIVE = new URL(SITE_URL).hostname;

const id = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * Each tap on a call link (any a[href^="tel:"]) goes to /api/call/ for the admin's calls page:
 * the number, the page, the city the visitor chose and how the visit arrived. Like the analytics
 * tags, it runs on the live domain only and never from automated browsers.
 */
export function CallBeacon({ locale }: { locale: string }) {
  useEffect(() => {
    if (![LIVE, `www.${LIVE}`].includes(location.hostname) || navigator.webdriver || !navigator.sendBeacon) return;
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="tel:"]') : null;
      if (!link) return;
      const params = new URLSearchParams(location.search);
      let landing: string | null = null;
      try {
        landing = sessionStorage.getItem("ef_landing");
      } catch {}
      const city = document.cookie.match(new RegExp(`(?:^|; )${CITY_COOKIE}=([^;]*)`))?.[1];
      navigator.sendBeacon(
        "/api/call/",
        JSON.stringify({
          call_id: id(),
          phone: link.getAttribute("href")?.slice(4) ?? "",
          city: city ? decodeURIComponent(city) : null,
          page: location.pathname,
          landing,
          utm_source: params.get("utm_source"),
          utm_campaign: params.get("utm_campaign"),
          locale,
          clicked_at: new Date().toISOString(),
        }),
      );
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [locale]);
  return null;
}
