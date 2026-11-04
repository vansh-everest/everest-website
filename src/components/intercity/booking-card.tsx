"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/home/ui";
import { sendLead } from "@/components/b2b/lead";
import { Captcha } from "@/components/site/captcha";
import { Consent } from "@/components/site/consent";
import { Field, MobileField, Received, VehicleOptions, WhenFields, selectClass } from "./fields";
import { vehicleLabel, type VehicleId } from "./routes";

const TRIPS = ["One Way", "Round Trip", "Multi way"] as const;

type City = { slug: string; name: string };

function CitySelect({ name, label, cities }: { name: string; label: string; cities: City[] }) {
  return (
    <Field look="hero" label={label} icon={MapPin} chevron>
      <select name={name} required defaultValue="" className={selectClass("hero")}>
        <option value="" disabled>
          Select city
        </option>
        {cities.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </Field>
  );
}

/**
 * The hero's booking card, for any city pair. The lead record has no trip fields and requires a
 * name this form does not ask for, so the trip is summarised into the record's name and the pick-up
 * city into its city; the individual fields are sent alongside.
 */
export function BookingCard({ cities }: { cities: City[] }) {
  const [vehicle, setVehicle] = useState<VehicleId>("sedan");
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [trip, setTrip] = useState<{ from: string; to: string; detail: string }>();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const drop = form.elements.namedItem("drop") as HTMLSelectElement;
    if (drop.value === (form.elements.namedItem("pickup") as HTMLSelectElement).value) {
      drop.setCustomValidity("Pick a different drop city");
      drop.reportValidity();
      return;
    }
    setState("sending");
    const data = new FormData(form);
    const nameOf = (slug: FormDataEntryValue | null) => cities.find((c) => c.slug === slug)?.name ?? String(slug ?? "");
    const from = nameOf(data.get("pickup"));
    const to = nameOf(data.get("drop"));
    const kind = String(data.get("trip"));
    const when = `${data.get("date")} ${data.get("time")}`;
    data.set("city", String(data.get("pickup") ?? ""));
    data.set("when", when);
    data.set("name", `Intercity: ${from} to ${to}, ${kind}, ${when}, ${vehicleLabel(vehicle)}`);
    setTrip({ from, to, detail: `${vehicleLabel(vehicle)} · ${kind.toLowerCase()}` });
    setState((await sendLead(data, "intercity")) ? "done" : "failed");
  }

  if (state === "done" && trip) {
    return (
      <div id="book" className="flex scroll-mt-32 flex-col justify-center rounded-[20px] bg-white px-5 py-8 lg:min-h-[523px] lg:rounded-3xl lg:px-[25px]">
        <Received from={trip.from} to={trip.to} detail={trip.detail} />
      </div>
    );
  }

  return (
    <form
      id="book"
      onSubmit={onSubmit}
      onChange={(e) => (e.currentTarget.elements.namedItem("drop") as HTMLSelectElement).setCustomValidity("")}
      className="scroll-mt-32 space-y-[17px] rounded-[20px] border border-white/20 bg-white/10 p-4 lg:space-y-2.5 lg:rounded-3xl lg:border-[#dee4ec] lg:bg-white lg:px-[25px] lg:pb-5 lg:pt-[25px]"
    >
      <div role="radiogroup" aria-label="Trip type" className="grid grid-cols-3 gap-1.5 lg:flex lg:justify-center lg:gap-2">
        {TRIPS.map((t, i) => (
          <label key={t} className="block cursor-pointer lg:w-[140px]">
            <input type="radio" name="trip" value={t} defaultChecked={i === 0} className="peer sr-only" />
            <span className="flex h-10 items-center justify-center rounded-full border border-white bg-white text-[13px] font-semibold text-navy transition peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-sun lg:border-[#dee4ec] lg:text-base lg:peer-focus-visible:ring-brand/40">
              {t}
            </span>
          </label>
        ))}
      </div>
      <div className="grid gap-[17px] lg:grid-cols-2 lg:gap-2.5">
        <CitySelect name="pickup" label="Pick-up city" cities={cities} />
        <CitySelect name="drop" label="Drop city" cities={cities} />
      </div>
      <WhenFields look="hero" dateLabel="Start Date" timeLabel="Start Time" />
      <VehicleOptions look="hero" value={vehicle} onChange={setVehicle} />
      <MobileField look="hero" />
      <Captcha tone="dark" className="lg:text-ink-soft" />
      <button
        type="submit"
        disabled={state === "sending"}
        className="block h-[52px] w-full rounded-full bg-sun text-[20px] font-medium tracking-[0.2px] text-navy transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60 lg:h-12 lg:focus-visible:outline-brand"
      >
        {state === "sending" ? "Sending" : "Book Now"}
      </button>
      {state === "failed" ? (
        <p role="alert" className="text-center text-sm text-white lg:text-navy">
          Not sent: try again, or call <a href={PHONE_HREF} className="underline underline-offset-2">{PHONE_DISPLAY}</a>
        </p>
      ) : null}
      <Consent tone="dark" className="lg:text-ink-soft" />
    </form>
  );
}
