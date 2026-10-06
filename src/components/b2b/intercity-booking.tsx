"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/home/ui";
import { sendLead } from "./lead";

const TRIPS = ["One way", "Round trip", "Multi way"] as const;
const TRAVELLERS = [1, 2, 3, 4, 5, 6, 7];

const field =
  "mt-[7px] h-[52px] w-full appearance-none rounded-[3px] border border-[#dfe3e8] bg-white px-4 text-base text-navy placeholder:text-[#8d99a5] focus:border-brand focus:outline-none lg:mt-1.5 lg:h-12";
const label = "block text-[13px] font-medium leading-4 text-white lg:text-navy";
const star = <span className="ml-1 text-[#e5484d]">*</span>;

function Caret() {
  return <ChevronDown aria-hidden size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy" />;
}

/**
 * The intercity booking strip. The lead record has no trip fields and requires a name this form
 * does not ask for, so the trip is summarised into the record's name and the pick-up city into its
 * city; the individual fields are sent alongside.
 */
export function IntercityBooking({ cities }: { cities: { slug: string; name: string }[] }) {
  const [trip, setTrip] = useState<(typeof TRIPS)[number]>("One way");
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [dateType, setDateType] = useState<"text" | "datetime-local">("text");
  const [minDate, setMinDate] = useState<string>();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const data = new FormData(event.currentTarget);
    const nameOf = (slug: FormDataEntryValue | null) => cities.find((c) => c.slug === slug)?.name ?? String(slug ?? "");
    const pickup = nameOf(data.get("pickup"));
    const drop = nameOf(data.get("drop"));
    data.set("trip", trip);
    data.set("city", String(data.get("pickup") ?? ""));
    data.set("name", `Intercity: ${pickup} to ${drop}, ${trip}, ${data.get("when")}, ${data.get("travellers")} travelling`);
    setState((await sendLead(data, "intercity")) ? "done" : "failed");
  }

  function openDate(event: React.FocusEvent<HTMLInputElement>) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDate(now.toISOString().slice(0, 16));
    setDateType("datetime-local");
    const input = event.currentTarget;
    requestAnimationFrame(() => input.showPicker?.());
  }

  if (state === "done") {
    return (
      <p role="status" className="rounded-2xl bg-white px-5 py-8 text-center text-lg font-semibold text-navy">
        Booking request received.
      </p>
    );
  }

  return (
    <div id="book" className="scroll-mt-28">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-white/30 bg-white/10 px-4 pb-4 pt-4 lg:rounded-3xl lg:border-white/45 lg:bg-white/15 lg:px-6 lg:py-6 lg:shadow-[0_10px_40px_rgba(0,0,0,0.15)] lg:backdrop-blur-[30px]"
      >
        <div role="radiogroup" aria-label="Trip type" className="grid grid-cols-3 gap-2 lg:flex lg:justify-center">
          {TRIPS.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={trip === t}
              onClick={() => setTrip(t)}
              className={`h-10 rounded-full border text-[15px] font-semibold transition lg:w-[140px] lg:text-base ${
                trip === t ? "border-navy bg-navy text-white" : "border-white bg-white text-navy hover:bg-white/90"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-[11px] grid gap-[11px] lg:mt-5 lg:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))_172px] lg:items-end lg:gap-3">
          <label className={label}>
            Pick-up city{star}
            <span className="relative block">
              <select name="pickup" required defaultValue="" className={`${field} pr-11 invalid:text-[#8d99a5]`}>
                <option value="" disabled>
                  Select city
                </option>
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Caret />
            </span>
          </label>
          <label className={label}>
            Drop city{star}
            <span className="relative block">
              <select name="drop" required defaultValue="" className={`${field} pr-11 invalid:text-[#8d99a5]`}>
                <option value="" disabled>
                  Select city
                </option>
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Caret />
            </span>
          </label>
          <label className={label}>
            Date &amp; time{star}
            <span className="relative block">
              <input
                name="when"
                required
                type={dateType}
                min={minDate}
                onFocus={openDate}
                onBlur={(e) => {
                  if (!e.currentTarget.value) setDateType("text");
                }}
                placeholder="Choose date"
                className={`${field} pr-11`}
              />
              {dateType === "text" ? <Caret /> : null}
            </span>
          </label>
          <label className={label}>
            Travellers{star}
            <span className="relative block">
              <select name="travellers" required defaultValue="" className={`${field} pr-11 invalid:text-[#8d99a5]`}>
                <option value="" disabled>
                  Select
                </option>
                {TRAVELLERS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <Caret />
            </span>
          </label>
          <label className={label}>
            Mobile number{star}
            <input
              name="mobile"
              required
              type="tel"
              inputMode="numeric"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              autoComplete="tel-national"
              placeholder="10-digit number"
              className={field}
            />
          </label>
          <button
            type="submit"
            disabled={state === "sending"}
            className="mt-[2px] inline-flex h-14 items-center justify-center gap-2 rounded-full bg-sun text-[17px] font-medium text-navy transition hover:brightness-95 disabled:opacity-60 lg:mt-0 lg:h-12 lg:text-xl"
          >
            {state === "sending" ? "Sending" : "Book now"}
            <ArrowRight aria-hidden size={18} className="lg:hidden" />
          </button>
        </div>
        {state === "failed" ? (
          <p role="alert" className="mt-3 text-center text-sm text-white lg:text-navy">
            Not sent: try again, or call {PHONE_DISPLAY}
          </p>
        ) : null}
      </form>
      <p className="mt-[11px] text-center text-[15px] leading-5 text-white lg:hidden">
        Prefer to talk? <a href={PHONE_HREF}>Call {PHONE_DISPLAY}</a>
      </p>
    </div>
  );
}
