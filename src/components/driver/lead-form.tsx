"use client";

import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";
import { PHONE_HREF } from "@/components/home/ui";
import { trackLead } from "@/lib/analytics";

const input =
  "mt-1.5 block h-12 w-full rounded border border-line bg-white px-4 text-base text-navy outline-none focus:border-brand";
const label = "block text-[13px] font-medium leading-4 text-navy";

function Required() {
  return (
    <span aria-hidden className="ml-1 text-[#ef4444]">
      *
    </span>
  );
}

/**
 * Three fields: name, mobile, city. The previous form asked for nine including an email
 * address, which most drivers do not have to hand. Drawn like the other pages' form (ApplyForm),
 * in the page's language.
 *
 * Every submission carries the page and the campaign source, so a lead can be attributed.
 * That is what makes it countable against the owned demand target.
 */
export function LeadForm({
  copy,
  locale,
  cities,
  defaultCity,
  source,
}: {
  copy: { form: Dictionary["form"]; cta: Dictionary["cta"] };
  locale: Locale;
  cities: { slug: string; label: string }[];
  defaultCity?: string;
  source: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const { form, cta } = copy;

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
      if (res.ok) trackLead(String(data.get("source") ?? ""));
      setState(res.ok ? "done" : "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="rounded-lg border-l-4 border-leaf bg-[#f0fdf4] px-5 py-6 text-center text-base font-semibold text-navy">
        {form.done}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:gap-5">
      <label className={label}>
        {form.name}
        <Required />
        <input name="name" required autoComplete="name" className={input} />
      </label>
      <label className={label}>
        {form.mobile}
        <Required />
        <input
          name="mobile"
          required
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          autoComplete="tel-national"
          className={input}
        />
      </label>
      <label className={label}>
        {form.city}
        <Required />
        <span className="relative block">
          <select name="city" required defaultValue={defaultCity ?? ""} className={`${input} appearance-none pr-12 invalid:text-[#9ca3af]`}>
            <option value="" disabled>
              {form.selectCity}
            </option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
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
      <div className="mt-1 grid grid-cols-2 gap-3 sm:mt-2 sm:gap-[22px]">
        <button
          type="submit"
          disabled={state === "sending"}
          className="h-12 rounded-full bg-brand px-3 text-[15px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60 sm:h-14 sm:text-[17px]"
        >
          {state === "sending" ? form.sending : form.submit}
        </button>
        <a
          href={PHONE_HREF}
          className="flex h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-brand px-3 text-[15px] font-semibold text-brand transition hover:bg-brand/5 sm:h-14 sm:border-2 sm:text-[17px]"
        >
          <Phone aria-hidden size={18} strokeWidth={1.75} className="shrink-0 sm:size-5" />
          {cta.call}
        </a>
      </div>
      {state === "failed" ? (
        <p role="alert" className="text-center text-sm text-[#b3261e]">
          {form.failed}
        </p>
      ) : null}
      <p className="text-center text-xs text-ink-soft sm:text-[13px]">{cta.formNote}</p>
    </form>
  );
}
