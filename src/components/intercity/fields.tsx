"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";
import { ArrowRight, Calendar, Check, ChevronDown, Clock, Phone, type LucideIcon } from "lucide-react";
import { VEHICLES, rupees, type Route, type VehicleId } from "./routes";

/**
 * The fields the hero's booking card and the route sheet share. `hero` is set white on the blue
 * panel on a phone and joins the sheet's look from `lg` up; `sheet` is the same at every width.
 */
export type Look = "hero" | "sheet";

const FOCUS = "focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30";
const PEER_FOCUS = "peer-focus-visible:border-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/30";
const SOFT_BOX = "rounded-xl border border-[#dee4ec] bg-white text-base";

const LOOKS = {
  hero: {
    label: "block text-[13px] font-medium leading-4 text-white lg:font-semibold lg:text-[#1a2133]",
    box: "h-[52px] rounded-[4px] border border-transparent bg-white text-base lg:h-12 lg:rounded-xl lg:border-[#dee4ec]",
    pad: "pl-4 pr-10 lg:pl-[43px]",
    icon: "left-[15px] hidden lg:block",
    star: "ml-1 text-[#e5484d] lg:hidden",
    chevron: "right-3 size-3.5 text-navy lg:size-[18px] lg:text-brand",
  },
  sheet: {
    label: "block text-[13px] font-semibold leading-4 text-[#1a2133]",
    box: `h-12 ${SOFT_BOX}`,
    pad: "pl-9 pr-7 max-[359px]:pl-3 lg:pl-[43px] lg:pr-9",
    icon: "left-2.5 max-[359px]:hidden lg:left-[15px]",
    star: "hidden",
    chevron: "right-2 size-[18px] text-brand lg:right-3",
  },
} as const;

/** Label, then its control with the leading icon and the trailing chevron laid over it. */
export function Field({
  look,
  label,
  icon: Icon,
  chevron = false,
  children,
}: {
  look: Look;
  label: string;
  icon?: LucideIcon;
  chevron?: boolean;
  children: ReactNode;
}) {
  const style = LOOKS[look];
  return (
    <label className={style.label}>
      {label}
      <span aria-hidden className={style.star}>
        *
      </span>
      <span className="relative mt-[5px] block font-normal">
        {children}
        {Icon ? (
          <Icon aria-hidden size={20} strokeWidth={1.75} className={`pointer-events-none absolute top-1/2 z-20 -translate-y-1/2 text-brand ${style.icon}`} />
        ) : null}
        {chevron ? (
          <ChevronDown aria-hidden size={18} strokeWidth={2} className={`pointer-events-none absolute top-1/2 z-20 -translate-y-1/2 ${style.chevron}`} />
        ) : null}
      </span>
    </label>
  );
}

export function selectClass(look: Look) {
  const style = LOOKS[look];
  return `w-full appearance-none text-navy ${style.box} ${style.pad} ${FOCUS} invalid:text-[#94a3b8]`;
}

function today() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

const SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  return { minutes: i * 30, label: `${hour % 12 || 12}:${i % 2 ? "30" : "00"} ${hour < 12 ? "AM" : "PM"}` };
});

const showDate = (iso: string) =>
  new Date(`${iso}T00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

/**
 * Date and time, posted as `date` and `time`. The date is a native picker laid invisibly over a
 * box that shows the design's placeholder, since a browser's own date input shows dd/mm/yyyy. Today
 * is read when the visitor reaches the field, so the server and the browser render the same page.
 * On today's date the half hours already gone are disabled.
 */
export function WhenFields({ look, dateLabel, timeLabel }: { look: Look; dateLabel: string; timeLabel: string }) {
  const style = LOOKS[look];
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [min, setMin] = useState<string>();
  const [gone, setGone] = useState(-1);

  function pickDate(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    const now = new Date();
    const cutoff = next === today() ? now.getHours() * 60 + now.getMinutes() : -1;
    setDate(next);
    setGone(cutoff);
    if ((SLOTS.find((slot) => slot.label === time)?.minutes ?? Infinity) <= cutoff) setTime("");
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Field look={look} label={dateLabel} icon={Calendar} chevron>
        <input
          type="date"
          name="date"
          required
          min={min}
          value={date}
          onChange={pickDate}
          onFocus={() => setMin(today())}
          onPointerDown={() => setMin(today())}
          className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
        <span aria-hidden className={`flex w-full items-center truncate ${style.box} ${style.pad} ${PEER_FOCUS} ${date ? "text-navy" : "text-[#94a3b8]"}`}>
          {date ? showDate(date) : "Choose date"}
        </span>
      </Field>
      <Field look={look} label={timeLabel} icon={Clock} chevron>
        <select name="time" required value={time} onChange={(e) => setTime(e.target.value)} className={selectClass(look)}>
          <option value="" disabled>
            Choose time
          </option>
          {SLOTS.map((slot) => (
            <option key={slot.label} value={slot.label} disabled={slot.minutes <= gone}>
              {slot.label}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

export function MobileField({ look }: { look: Look }) {
  const style = LOOKS[look];
  return (
    <Field look={look} label="Mobile number" icon={Phone}>
      <input
        name="mobile"
        required
        type="tel"
        inputMode="numeric"
        pattern="[6-9][0-9]{9}"
        maxLength={10}
        autoComplete="tel-national"
        title="10-digit mobile number"
        placeholder="10-digit mobile number"
        className={`w-full text-navy ${style.box} ${style.pad} ${FOCUS} placeholder:text-[#94a3b8]`}
      />
    </Field>
  );
}

/** Vehicle tiles, posted as `vehicle`. With `fares`, each tile carries its price for the route. */
export function VehicleOptions({
  look,
  value,
  onChange,
  fares,
}: {
  look: Look;
  value: VehicleId;
  onChange: (id: VehicleId) => void;
  fares?: Route["fares"];
}) {
  return (
    <fieldset>
      <legend className={LOOKS[look].label}>Vehicle type</legend>
      <div className="mt-[5px] grid grid-cols-3 gap-2">
        {VEHICLES.map((vehicle) => (
          <label key={vehicle.id} className="relative block cursor-pointer">
            <input
              type="radio"
              name="vehicle"
              value={vehicle.label}
              checked={value === vehicle.id}
              onChange={() => onChange(vehicle.id)}
              className="peer sr-only"
            />
            <span
              className={`flex flex-col items-center justify-center rounded-xl border border-[#dee4ec] bg-white px-1 text-center transition peer-checked:border-brand peer-checked:bg-[#e7f1fa] peer-checked:shadow-[inset_0_0_0_1px_var(--color-brand)] ${PEER_FOCUS} ${
                fares ? "h-[74px]" : "h-[53px]"
              }`}
            >
              <span className="text-sm font-semibold leading-[18px] text-navy">{vehicle.label}</span>
              <span className="text-xs leading-4 text-ink-soft">{vehicle.seats}</span>
              {fares ? <span className="text-base font-bold leading-[21px] text-navy">{rupees(fares[vehicle.id])}</span> : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** "Mumbai → Pune", read out as "Mumbai to Pune". */
export function RouteName({ from, to, arrow = 18 }: { from: string; to: string; arrow?: number }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-[11px]">
      {from}
      <ArrowRight aria-hidden size={arrow} strokeWidth={2.25} className="text-brand" />
      <span className="sr-only">to</span>
      {to}
    </span>
  );
}

/** The confirmation both forms end on. */
export function Received({
  from,
  to,
  detail,
  fare,
  titleId,
  children,
}: {
  from: string;
  to: string;
  detail: string;
  fare?: number;
  titleId?: string;
  children?: ReactNode;
}) {
  return (
    <div role="status" className="flex flex-col items-center text-center">
      <span className="grid size-14 place-items-center rounded-full bg-lime text-navy">
        <Check aria-hidden size={24} strokeWidth={2.25} />
      </span>
      <h2 id={titleId} className="mt-3 text-2xl font-bold leading-[30px] text-navy">
        Booking request received
      </h2>
      <p className="mt-2 max-w-[310px] text-[15px] leading-[21px] text-ink-soft">Our team will call you on your mobile number to confirm your ride.</p>
      <div className="mt-[17px] w-full rounded-xl border border-[#dee4ec] bg-[#f6f9fc] px-[17px] py-[13px] text-left">
        <p className="text-base font-bold leading-[22px] text-navy">
          <RouteName from={from} to={to} arrow={15} />
        </p>
        <p className="mt-1.5 text-[13px] leading-[18px] text-ink-soft">{detail}</p>
        {fare ? (
          <p className="mt-1.5 flex items-center justify-between text-[13px] font-semibold leading-6 text-navy">
            Fare
            <span className="text-xl font-bold">{rupees(fare)}</span>
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
