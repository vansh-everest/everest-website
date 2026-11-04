"use client";

import { useState } from "react";
import { PHONE_DISPLAY } from "@/components/home/ui";
import { sendLead } from "@/components/b2b/lead";
import { Captcha } from "@/components/site/captcha";
import { Consent } from "@/components/site/consent";

const FIELDS = [
  { name: "name", label: "Name", type: "text", placeholder: "Your full name", autoComplete: "name" },
  { name: "company", label: "Company Name", type: "text", placeholder: "Your company name", autoComplete: "organization" },
  { name: "role", label: "Designation", type: "text", placeholder: "Your designation", autoComplete: "organization-title" },
  { name: "email", label: "Email", type: "email", placeholder: "name@company.com", autoComplete: "email" },
];
const CLIENT_TYPES = ["Brand", "Agency"];

const input =
  "mt-1 h-[52px] w-full rounded-[3px] border border-[#dfe3e8] bg-white px-4 text-base text-navy placeholder:text-[#8d99a5] focus:border-brand focus:outline-none lg:h-12";
const labelCls = "block text-sm font-medium leading-5 text-navy";
const star = <span className="ml-1 text-[#e5484d]">*</span>;

/** The brand enquiry. The button wakes up once every field is filled. */
export function AdEnquiryForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [picked, setPicked] = useState(CLIENT_TYPES[0]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const data = new FormData(event.currentTarget);
    data.set("client_type", picked);
    setState((await sendLead(data, "advertise-with-us")) ? "done" : "failed");
  }

  if (state === "done") {
    return (
      <p role="status" className="rounded-2xl bg-leaf/10 px-5 py-8 text-center text-lg font-semibold text-navy">
        Enquiry received.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-2.5 lg:gap-[18px]">
      <fieldset>
        <legend className={labelCls}>Are you a brand or an agency?</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {CLIENT_TYPES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={picked === option}
              onClick={() => setPicked(option)}
              className={`h-10 rounded-full border text-[15px] font-semibold transition lg:h-11 ${
                picked === option ? "border-navy bg-navy text-white" : "border-[#dfe3e8] bg-white text-navy hover:border-navy/40"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      {FIELDS.map((field) => (
        <label key={field.name} className={labelCls}>
          {field.label}
          {star}
          <input name={field.name} type={field.type} required autoComplete={field.autoComplete} placeholder={field.placeholder} className={input} />
        </label>
      ))}

      <label className={labelCls}>
        Mobile Number{star}
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

      <Captcha className="mt-[9px] lg:mt-[15px]" />
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-[5px] h-[42px] w-full rounded-full bg-brand text-[17px] font-medium text-white transition hover:brightness-110 disabled:bg-brand/45 disabled:hover:brightness-100 lg:mt-[29px] lg:h-14"
      >
        {state === "sending" ? "Sending" : "Request a Callback"}
      </button>
      {state === "failed" ? (
        <p role="alert" className="text-center text-sm text-[#b3261e]">
          Not sent: try again, or call {PHONE_DISPLAY}
        </p>
      ) : null}
      <Consent />
      <p className="text-center text-sm leading-5 text-ink-soft lg:-mt-[3px] lg:text-base lg:leading-6 lg:text-navy">
        Or reach us directly ·{" "}
        <a href="tel:+919970732823" className="hover:text-brand">
          <span aria-hidden>📞</span> 99707 32823
        </a>
        <br />
        <a href="mailto:car.branding@everestfleet.com" className="break-words hover:text-brand">
          car.branding@everestfleet.com
        </a>{" "}
        ·{" "}
        <a href="mailto:rahul.lall@everestfleet.com" className="break-words hover:text-brand">
          rahul.lall@everestfleet.com
        </a>
      </p>
    </form>
  );
}
