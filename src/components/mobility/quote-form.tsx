"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { sendLead } from "@/components/b2b/lead";
import { PHONE_DISPLAY } from "@/components/home/ui";
import { Captcha } from "@/components/site/captcha";
import { Consent } from "@/components/site/consent";
import { useCityField } from "@/lib/use-city-field";

const CITIES = ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Pune", "Kolkata", "Chennai"];

const label = "block text-[13px] font-medium leading-5 text-navy";
const control =
  "mt-1 h-[52px] w-full rounded-[4px] border border-[#dfe3e8] bg-white px-4 text-base text-navy placeholder:text-[#8d99a5] focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 lg:h-12";

function Star() {
  return <span className="ml-1 text-[#e5484d]">*</span>;
}

function Field({ title, ...input }: { title: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={label}>
      {title}
      {input.required ? <Star /> : null}
      <input {...input} className={control} />
    </label>
  );
}

/** The quote form. Company, job title, email and message reach Jarvis as the lead's details. */
export function QuoteForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const cityField = useCityField();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setState((await sendLead(new FormData(event.currentTarget), "employee-mobility")) ? "done" : "failed");
  }

  if (state === "done") {
    return (
      <p role="status" className="mt-4 rounded-2xl bg-leaf/10 px-5 py-8 text-center text-lg font-semibold text-navy">
        Enquiry received.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 lg:mt-3.5 lg:grid-cols-2 lg:gap-y-[13px]">
      <Field title="Name" name="name" type="text" required autoComplete="name" placeholder="Your full name" />
      <Field title="Company" name="company" type="text" required autoComplete="organization" placeholder="Company name" />
      <Field title="Job title" name="role" type="text" required autoComplete="organization-title" placeholder="Your role" />
      <Field title="Work email" name="email" type="email" required autoComplete="email" placeholder="name@company.com" />
      <Field
        title="Mobile"
        name="mobile"
        type="tel"
        required
        inputMode="numeric"
        pattern="[6-9][0-9]{9}"
        maxLength={10}
        autoComplete="tel-national"
        placeholder="10-digit mobile number"
      />
      <label className={label}>
        City
        <Star />
        <span className="relative block">
          <select ref={cityField} name="city" required defaultValue="" className={`${control} appearance-none pr-11 invalid:text-[#8d99a5]`}>
            <option value="" disabled>
              Select your city
            </option>
            {CITIES.map((city) => (
              <option key={city} value={city} className="text-navy">
                {city}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden size={16} className="pointer-events-none absolute right-4 top-1/2 mt-0.5 -translate-y-1/2 text-ink-soft" />
        </span>
      </label>
      <div className="lg:col-span-2">
        <Field title="Message" name="message" type="text" placeholder="Anything else we should know?" />
      </div>
      <label className="mt-1.5 flex items-start gap-2.5 text-sm leading-5 text-ink-soft lg:col-span-2 lg:items-center lg:leading-[18px]">
        <span className="relative size-5 shrink-0">
          <input
            name="consent"
            type="checkbox"
            value="yes"
            required
            className="peer block size-5 appearance-none rounded-[5px] border border-[#cdd5de] bg-white checked:border-brand checked:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
          <Check aria-hidden size={14} strokeWidth={3} className="pointer-events-none absolute left-[3px] top-[3px] text-white opacity-0 peer-checked:opacity-100" />
        </span>
        I agree to be contacted by Everest Fleet on call or SMS.
      </label>
      <Captcha className="lg:col-span-2" />
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-1 h-14 w-full rounded-full bg-brand text-[17px] font-medium tracking-[0.3px] text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:bg-brand/45 lg:col-span-2"
      >
        {state === "sending" ? "Sending" : "Get a quote"}
      </button>
      {state === "failed" ? (
        <p role="alert" className="text-center text-sm text-[#b3261e] lg:col-span-2">
          Not sent: try again, or call {PHONE_DISPLAY}
        </p>
      ) : null}
      <Consent className="lg:col-span-2" />
    </form>
  );
}
