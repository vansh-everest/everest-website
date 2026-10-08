"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "./ui";
import type { FormCopy } from "@/content/home-copy";
import { trackLead } from "@/lib/analytics";
import { fill, type Locale } from "@/lib/i18n";

const input =
  "mt-1.5 h-12 w-full rounded border border-line bg-white px-4 text-base text-navy placeholder:text-[#9ca3af] focus:border-brand focus:outline-none";
const label = "block text-[13px] font-medium leading-4 text-navy";

function Required() {
  return (
    <span aria-hidden className="ml-1 text-[#ef4444]">
      *
    </span>
  );
}

/* The desktop exports ask for a full name where the phone ones show an example. */
const WIDE = "(min-width: 640px)";
function subscribe(onChange: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function useWide() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

/**
 * Name, mobile and city, sent to the same lead endpoint as the driver pages with the page it
 * came from. The button wakes up once all three are filled. A sent form keeps its values and
 * shows a toast over the top of the card, which StartDriving positions.
 */
export function ApplyForm({
  cities,
  source,
  locale,
  copy,
}: {
  cities: { slug: string; name: string }[];
  source: string;
  locale: Locale;
  copy: FormCopy;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [ready, setReady] = useState(false);
  const wide = useWide();
  const form = useRef<HTMLFormElement>(null);

  // The sent form keeps its values under the toast, then clears so it cannot go twice.
  useEffect(() => {
    if (state !== "done") return;
    const timer = setTimeout(() => {
      form.current?.reset();
      setReady(false);
      setState("idle");
    }, 6000);
    return () => clearTimeout(timer);
  }, [state]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "done") return;
    setState("sending");
    const data = new FormData(event.currentTarget);
    data.set("locale", locale);
    data.set("source", source);
    data.set("page", window.location.pathname);
    data.set("referrer", document.referrer);
    data.set("campaign", new URLSearchParams(window.location.search).toString());
    try {
      const res = await fetch("/api/lead/", { method: "POST", body: data });
      if (res.ok) trackLead(String(data.get("source") ?? ""));
      setState(res.ok ? "done" : "failed");
    } catch {
      setState("failed");
    }
  }

  return (
    <form ref={form} onSubmit={submit} onChange={(e) => setReady(e.currentTarget.checkValidity())} className="grid gap-3 sm:gap-5">
      {state === "done" ? (
        <div
          role="status"
          className="absolute inset-x-[18px] -top-[58px] z-10 sm:-top-8 rounded-lg border-l-4 border-leaf bg-[#f0fdf4] px-3 py-2.5 shadow-[0_8px_24px_rgba(6,47,80,0.18)] sm:inset-x-14"
        >
          <p className="text-base font-medium leading-6 text-navy">{copy.done}</p>
          <p className="text-sm leading-5 text-ink-soft">{copy.doneNote}</p>
        </div>
      ) : null}
      <label className={label}>
        {copy.name}
        <Required />
        <input
          name="name"
          required
          autoComplete="name"
          placeholder={wide ? copy.nameFull : copy.nameExample}
          className={input}
        />
      </label>
      <label className={label}>
        {copy.mobile}
        <Required />
        <input
          name="mobile"
          required
          type="tel"
          inputMode="numeric"
          pattern="[6-9][0-9]{9}"
          maxLength={10}
          autoComplete="tel-national"
          placeholder={copy.mobilePlaceholder}
          className={input}
        />
      </label>
      <label className={label}>
        {copy.city}
        <Required />
        <span className="relative block">
          <select name="city" required defaultValue="" className={`${input} appearance-none pr-12 invalid:text-[#9ca3af]`}>
            <option value="" disabled>
              {copy.selectCity}
            </option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute right-4 top-1/2 mt-[3px] -translate-y-1/2 text-navy"
          />
        </span>
      </label>
      <div className="mt-1 grid grid-cols-2 gap-6 sm:mt-3 sm:gap-[22px]">
        <button
          type="submit"
          disabled={!ready || state === "sending"}
          className="h-11 rounded-full bg-brand text-sm font-medium tracking-[0.2px] text-white transition hover:brightness-110 disabled:bg-brand/45 disabled:hover:brightness-100 sm:h-14 sm:text-[17px]"
        >
          {state === "sending" ? copy.sending : copy.submit}
        </button>
        <a
          href={PHONE_HREF}
          className="flex h-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-brand text-sm font-medium tracking-[0.2px] text-brand transition hover:bg-brand/5 sm:h-14 sm:border-2 sm:text-[17px]"
        >
          <Phone aria-hidden size={18} strokeWidth={1.75} className="sm:size-5" />
          {copy.call}
        </a>
      </div>
      {state === "failed" ? (
        <p role="alert" className="text-center text-sm text-[#b3261e]">
          {fill(copy.failed, { phone: PHONE_DISPLAY })}
        </p>
      ) : null}
    </form>
  );
}
