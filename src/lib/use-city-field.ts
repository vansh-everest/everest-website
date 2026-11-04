"use client";

import { useEffect, useRef } from "react";
import { CITY_COOKIE, CITY_EVENT } from "./city-phones";

const savedCity = () => document.cookie.match(new RegExp(`(?:^|; )${CITY_COOKIE}=([^;]*)`))?.[1] ?? "";

/**
 * A ref for a form's city select. An empty select starts at the visitor's city: the choice the top
 * bar saved, or the one it finds from the request (/api/geo) on a first visit. The fallback city the
 * bar shows when it finds none is never saved, so it is never filled in. A city already in the
 * field, from the page or the visitor, stays. Options hold a slug or a city's name.
 */
export function useCityField() {
  const field = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    function fill() {
      const select = field.current;
      const city = savedCity();
      if (!select || select.value || !city) return;
      const option = [...select.options].find((o) => o.value === city || o.text.toLowerCase().startsWith(city));
      if (!option) return;
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    fill();
    window.addEventListener(CITY_EVENT, fill);
    return () => window.removeEventListener(CITY_EVENT, fill);
  }, []);
  return field;
}
