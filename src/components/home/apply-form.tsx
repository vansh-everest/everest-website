"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react/ssr";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "./ui";

const input =
  "mt-2 h-[54px] w-full rounded-xl border border-line bg-white px-4 text-base text-navy placeholder:text-ink-soft/60 focus:border-brand focus:outline-none";
const label = "block text-[13px] font-semibold leading-4 text-navy";

/**
 * Name, mobile and city, sent to the same lead endpoint as the driver pages with the page it
 * came from. The button wakes up once all three are filled.
 */
export function ApplyForm({ cities, source }: { cities: { slug: string; name: string }[]; source: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [ready, setReady] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const data = new FormData(event.currentTarget);
    data.set("locale", "en");
    data.set("source", source);
    data.set("page", window.location.pathname);
    data.set("referrer", document.referrer);
    data.set("campaign", new URLSearchParams(window.location.search).toString());
    try {
      const res = await fetch("/api/lead/", { method: "POST", body: data });
      setState(res.ok ? "done" : "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="rounded-2xl bg-leaf/10 px-5 py-8 text-center text-lg font-semibold text-navy">
        Thanks. The team will call you shortly.
      </p>
    );
  }

  return (
    <form onSubmit={submit} onChange={(e) => setReady(e.currentTarget.checkValidity())} className="grid gap-[18px]">
      <label className={label}>
        Name *
        <input name="name" required autoComplete="name" placeholder="e.g. Ravi Kumar" className={input} />
      </label>
      <label className={label}>
        Mobile number *
        <input
          name="mobile"
          required
          type="tel"
          inputMode="numeric"
          pattern="[6-9][0-9]{9}"
          maxLength={10}
          autoComplete="tel-national"
          placeholder="10-digit mobile number"
          className={input}
        />
      </label>
      <label className={label}>
        City *
        <span className="relative block">
          <select name="city" required defaultValue="" className={`${input} appearance-none pr-12 invalid:text-ink-soft/60`}>
            <option value="" disabled>
              Select your city
            </option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <CaretDown size={20} className="pointer-events-none absolute right-5 top-1/2 mt-1 -translate-y-1/2 text-navy" />
        </span>
      </label>
      <button
        type="submit"
        disabled={!ready || state === "sending"}
        className="mt-2 h-14 w-full rounded-full bg-brand text-lg font-medium text-white transition hover:brightness-110 disabled:bg-brand/45 disabled:hover:brightness-100"
      >
        {state === "sending" ? "Sending" : "Submit & apply"}
      </button>
      {state === "failed" ? (
        <p role="alert" className="text-center text-sm text-[#b3261e]">
          Not sent. Try again, or call {PHONE_DISPLAY}.
        </p>
      ) : null}
      <p className="text-center text-sm leading-5 text-navy">
        Or reach us directly ·{" "}
        <a href={PHONE_HREF} className="font-medium hover:text-brand">
          📞 {PHONE_DISPLAY}
        </a>{" "}
        ·{" "}
        <a href={WHATSAPP_HREF} className="font-medium hover:text-brand">
          💬 WhatsApp
        </a>
      </p>
    </form>
  );
}
