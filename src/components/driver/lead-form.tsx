"use client";

import { useState } from "react";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";

/**
 * Three fields: name, mobile, city. The previous form asked for nine including an email
 * address, which most drivers do not have to hand.
 *
 * Every submission carries the page and the campaign source, so a lead can be attributed.
 * That is what makes it countable against the owned demand target.
 */
export function LeadForm({
  dict,
  locale,
  cities,
  defaultCity,
  source,
}: {
  dict: Dictionary;
  locale: Locale;
  cities: { slug: string; label: string }[];
  defaultCity?: string;
  source: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const data = new FormData(event.currentTarget);
    data.set("locale", locale);
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
      <p className="rounded-2xl bg-leaf/10 px-5 py-6 text-center text-base font-semibold text-navy">
        {dict.form.done}
      </p>
    );
  }

  const field =
    "mt-1.5 block h-12 w-full rounded-xl border border-line bg-white px-4 text-base text-navy outline-none focus:border-brand";

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="block text-[13px] font-semibold text-navy">
        {dict.form.name}
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="block text-[13px] font-semibold text-navy">
        {dict.form.mobile}
        <input
          name="mobile"
          required
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          autoComplete="tel-national"
          className={field}
        />
      </label>
      <label className="block text-[13px] font-semibold text-navy">
        {dict.form.city}
        <select name="city" required defaultValue={defaultCity ?? ""} className={field}>
          <option value="" disabled>
            {dict.form.selectCity}
          </option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={state === "sending"}
        className="h-12 rounded-full bg-sun text-base font-bold text-navy transition hover:brightness-95 disabled:opacity-60"
      >
        {state === "sending" ? dict.form.sending : dict.form.submit}
      </button>
      {state === "failed" ? <p className="text-sm text-[#b3261e]">{dict.form.failed}</p> : null}
      <p className="text-xs text-ink-soft">{dict.cta.formNote}</p>
    </form>
  );
}
