"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import { trackLead } from "@/lib/analytics";

const OCCUPATIONS = ["Driver sourcing agent", "Agent", "Logistics business", "Someone who knows drivers"];

const input =
  "mt-1 h-[52px] w-full rounded-[3px] border border-[#dfe3e8] bg-white px-4 text-base text-navy placeholder:text-[#8d99a5] focus:border-brand focus:outline-none lg:mt-1 lg:h-12 lg:text-[15.5px]";
const label = "block text-[12.5px] font-medium leading-5 text-navy lg:text-[13px]";
const star = <span className="ml-1 text-[#e5484d]">*</span>;

/**
 * The Dost application. It posts to the same lead endpoint as the driver forms, with its own
 * source so a Dost lead never reads as a driver lead. "Joining as" and the occupation are sent
 * too, but the lead record has no fields for them yet, so the endpoint drops them.
 */
export function DostForm({ cities }: { cities: { slug: string; name: string }[] }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [ready, setReady] = useState(false);
  const [joining, setJoining] = useState<"individual" | "company">("individual");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const data = new FormData(event.currentTarget);
    data.set("joining", joining);
    data.set("locale", "en");
    data.set("source", "everest-dost");
    data.set("page", window.location.pathname);
    data.set("referrer", document.referrer);
    data.set("campaign", new URLSearchParams(window.location.search).toString());
    try {
      const res = await fetch("/api/lead/", { method: "POST", body: data });
      if (res.ok) trackLead("everest-dost");
      setState(res.ok ? "done" : "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="rounded-2xl bg-leaf/10 px-5 py-8 text-center text-lg font-semibold text-navy">
        Application received.
      </p>
    );
  }

  return (
    <form onSubmit={submit} onChange={(e) => setReady(e.currentTarget.checkValidity())} className="grid">
      <fieldset>
        <legend className={`${label} text-[13.5px]`}>You&rsquo;re joining as</legend>
        <div className="mt-1 grid grid-cols-2 gap-2 lg:mt-[7px]">
          {(["individual", "company"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={joining === value}
              onClick={() => setJoining(value)}
              className={`h-10 rounded-full border text-[15px] font-semibold lg:h-11 transition lg:text-[15px] ${
                joining === value ? "border-navy bg-navy text-white" : "border-[#dfe3e8] bg-white text-navy hover:border-navy/40"
              }`}
            >
              {value === "individual" ? "An individual" : "A company"}
            </button>
          ))}
        </div>
      </fieldset>

      <label className={`${label} mt-2.5 lg:mt-[18px]`}>
        Name{star}
        <input
          name="name"
          required
          autoComplete={joining === "company" ? "organization" : "name"}
          placeholder="Your full name"
          className={input}
        />
      </label>
      <label className={`${label} mt-2.5 lg:mt-[18px]`}>
        Mobile number{star}
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
      <label className={`${label} mt-2.5 lg:mt-[18px]`}>
        City{star}
        <span className="relative block">
          <select name="city" required defaultValue="" className={`${input} appearance-none pr-12 invalid:text-[#8d99a5]`}>
            <option value="" disabled>
              Select your city
            </option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 mt-[3px] -translate-y-1/2 text-navy" />
        </span>
      </label>
      <label className={`${label} mt-2.5 lg:mt-[18px]`}>
        Occupation{star}
        <span className="relative block">
          <select name="occupation" required defaultValue="" className={`${input} appearance-none pr-12 invalid:text-[#8d99a5]`}>
            <option value="" disabled>
              Driver sourcing, agent, logistics...
            </option>
            {OCCUPATIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 mt-[3px] -translate-y-1/2 text-navy" />
        </span>
      </label>

      <button
        type="submit"
        disabled={!ready || state === "sending"}
        className="mt-3 h-11 w-full rounded-full bg-brand text-[17px] font-medium text-white transition hover:brightness-110 disabled:bg-brand/45 disabled:hover:brightness-100 sm:h-14 lg:mt-6"
      >
        {state === "sending" ? "Sending" : "Apply to become a Dost"}
      </button>
      {state === "failed" ? (
        <p role="alert" className="mt-3 text-center text-sm text-[#b3261e]">
          Not sent. Try again, or call {PHONE_DISPLAY}.
        </p>
      ) : null}
      <p className="mt-[15px] hidden text-center text-base leading-6 text-navy lg:block">
        Or reach us directly ·{" "}
        <a href={PHONE_HREF} className="hover:text-brand">
          <span aria-hidden>📞</span> {PHONE_DISPLAY}
        </a>{" "}
        ·{" "}
        <a href={WHATSAPP_HREF} className="hover:text-brand">
          <span aria-hidden>💬</span> WhatsApp
        </a>
      </p>
    </form>
  );
}
