"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Clock, Package, Truck } from "lucide-react";
import { CARGO, CITIES } from "./data";
import { Chips, LeadForm, MobileField, SelectField, TextField } from "./form-kit";
import { TAB_EVENT, type EnquiryTab } from "./tab-link";

const TABS = [
  { id: "quote", label: "Get a quote", icon: Package, note: "We reply the same business day." },
  { id: "attach", label: "Attach your vehicle", icon: Truck, note: "We call you back within one business day." },
] as const;

const CARGO_TYPES = [...CARGO.map((c) => c.label), "Other"];
const TONNAGE = ["Under 1 T", "1 T to 5 T", "5 T to 10 T", "10 T to 20 T", "20 T to 30 T"];
const TIMELINE = ["Immediate", "1–3 months", "Exploring"];
const THIS_YEAR = new Date().getFullYear();
const YEARS = [...Array.from({ length: 12 }, (_, i) => String(THIS_YEAR - i)), "Older"];
const LANGUAGES = [
  "English",
  { value: "Hindi", label: "हिंदी", lang: "hi" },
  { value: "Kannada", label: "ಕನ್ನಡ", lang: "kn" },
  { value: "Marathi", label: "मराठी", lang: "mr" },
];

function QuoteForm({ source }: { source: string }) {
  return (
    <LeadForm
      source={source}
      label="Get a quote"
      submit="Get My Quote"
      tone="brand"
      requiredChips={{ temperature: "Select a temperature band", movement: "Select a movement type" }}
      thanks={{ title: "Thanks, we have your enquiry.", line: "We will reply the same business day." }}
    >
      {(errors) => (
        <>
          <TextField name="name" label="Name" required placeholder="Your full name" autoComplete="name" />
          <TextField name="company" label="Company" required placeholder="Company name" autoComplete="organization" />
          <TextField name="email" label="Work email" required type="email" placeholder="name@company.com" autoComplete="email" />
          <MobileField />
          <SelectField name="city" label="City / zone" required placeholder="Select your city" options={CITIES} />
          <SelectField name="cargo" label="What you move" required placeholder="Select a cargo type" options={CARGO_TYPES} />
          <Chips name="temperature" label="Temperature band" required options={["Frozen", "Chilled", "Ambient", "Mixed"]} error={errors.temperature} />
          <Chips name="movement" label="Movement type" required options={["Intracity", "Intercity", "Both"]} error={errors.movement} />
          {/* Phones list Scale first; the order classes keep tab order right on a desktop. */}
          <SelectField name="timeline" label="Start timeline" placeholder="Select a timeline" options={TIMELINE} className="order-1 lg:order-none" />
          <TextField name="scale" label="Scale" placeholder="Vehicles needed or trips a month" />
          <TextField name="notes" label="Notes" placeholder="Anything else we should know?" className="order-2 lg:order-none lg:col-span-2" />
        </>
      )}
    </LeadForm>
  );
}

function AttachForm({ source }: { source: string }) {
  return (
    <LeadForm
      source={source}
      label="Attach your vehicle"
      submit="Register My Vehicle"
      tone="sun"
      requiredChips={{
        vehicle_type: "Select a vehicle type",
        driver_included: "Select Yes or No for driver included",
        rc_permit_ready: "Select Yes or No for RC and permit",
      }}
      thanks={{ title: "Thanks, we have your registration.", line: "We will call you back within one business day." }}
    >
      {(errors) => (
        <>
          <TextField name="name" label="Name" required placeholder="Your full name" autoComplete="name" />
          <MobileField />
          <SelectField name="city" label="City" required placeholder="Select your city" options={CITIES} />
          <Chips name="vehicle_type" label="Vehicle type" required options={["Ambient", "Reefer", "EV 3W"]} error={errors.vehicle_type} />
          <SelectField name="tonnage" label="Tonnage" required placeholder="Select tonnage" options={TONNAGE} />
          <TextField name="vehicles" label="Number of vehicles" required inputMode="numeric" pattern="[1-9][0-9]{0,3}" maxLength={4} placeholder="How many vehicles?" title="Number of vehicles" />
          <SelectField name="year" label="Year of manufacture" placeholder="Select year" options={YEARS} />
          <Chips name="driver_included" label="Driver included" required options={["Yes", "No"]} error={errors.driver_included} />
          <Chips name="rc_permit_ready" label="RC and permit ready" required options={["Yes", "No"]} error={errors.rc_permit_ready} />
          <Chips name="language" label="Preferred language" options={LANGUAGES} />
        </>
      )}
    </LeadForm>
  );
}

/**
 * The two-tab enquiry card. Both forms stay mounted so a half-filled one survives a look at the
 * other tab, and each keeps its own confirmation. Links elsewhere on the page open a tab through
 * TabLink's event.
 */
export function EnquiryCard({ source }: { source: string }) {
  const [tab, setTab] = useState<EnquiryTab>("quote");
  const buttons = useRef<Partial<Record<EnquiryTab, HTMLButtonElement | null>>>({});

  useEffect(() => {
    const open = (event: Event) => setTab((event as CustomEvent<EnquiryTab>).detail);
    window.addEventListener(TAB_EVENT, open);
    return () => window.removeEventListener(TAB_EVENT, open);
  }, []);

  function onKeyDown(event: KeyboardEvent) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "quote" : event.key === "End" ? "attach" : tab === "quote" ? "attach" : "quote";
    setTab(next);
    buttons.current[next]?.focus();
  }

  const note = TABS.find((t) => t.id === tab)?.note;

  return (
    <div id="enquire" className="mt-3 scroll-mt-24 rounded-3xl border border-[#e4e9ef] bg-white p-5 shadow-[0_16px_50px_rgba(6,47,80,0.07)] lg:mt-10 lg:scroll-mt-40 lg:rounded-[28px] lg:p-11">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Enquiry type" onKeyDown={onKeyDown} className="grid grid-cols-2 gap-1 rounded-2xl border border-[#e4e9ef] bg-[#f6f9fc] p-1 lg:inline-flex lg:rounded-full">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                ref={(el) => {
                  buttons.current[id] = el;
                }}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(id)}
                className={`flex h-[58px] flex-col items-center justify-center gap-1 rounded-xl text-[14px] font-semibold leading-[18px] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:h-11 lg:flex-row lg:gap-2 lg:rounded-full lg:px-5 lg:text-base ${
                  active ? "bg-white text-navy shadow-[0_2px_8px_rgba(6,47,80,0.1)]" : "text-ink-soft"
                }`}
              >
                <Icon aria-hidden size={20} strokeWidth={1.75} className={active ? "text-brand" : ""} />
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm leading-5 text-ink-soft lg:mt-0 lg:text-[15px]">
          <Clock aria-hidden size={17} strokeWidth={1.75} />
          {note}
        </p>
      </div>
      <div id="panel-quote" role="tabpanel" aria-labelledby="tab-quote" hidden={tab !== "quote"} className="mt-[17px] lg:mt-6">
        <QuoteForm source={source} />
      </div>
      <div id="panel-attach" role="tabpanel" aria-labelledby="tab-attach" hidden={tab !== "attach"} className="mt-[17px] lg:mt-6">
        <AttachForm source={`${source}/attach`} />
      </div>
    </div>
  );
}
