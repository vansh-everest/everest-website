"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import { sendLead } from "./lead";

export type EnquiryField =
  | { name: string; label: string; type: "text" | "email"; placeholder: string; autoComplete?: string }
  | { name: string; label: string; type: "select"; placeholder: string; options: string[] };

export type EnquiryChoice = { legend: string; name: string; options: string[] };

const input =
  "mt-[7px] h-12 w-full rounded-[3px] border border-[#dfe3e8] bg-white px-4 text-base text-navy placeholder:text-[#8d99a5] focus:border-brand focus:outline-none lg:h-12";
const labelCls = "block text-[13px] font-medium leading-5 text-navy";
const star = <span className="ml-1 text-[#e5484d]">*</span>;

/**
 * A business enquiry: the fields a page asks for, then the mobile number every lead needs.
 * The button wakes up once every field is filled.
 */
export function EnquiryForm({
  source,
  fields,
  after,
  choice,
  submit,
}: {
  source: string;
  fields: EnquiryField[];
  /** Fields that follow the mobile number. */
  after?: EnquiryField[];
  choice?: EnquiryChoice;
  submit: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [ready, setReady] = useState(false);
  const [picked, setPicked] = useState(choice?.options[0] ?? "");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const data = new FormData(event.currentTarget);
    if (choice) data.set(choice.name, picked);
    setState((await sendLead(data, source)) ? "done" : "failed");
  }

  if (state === "done") {
    return (
      <p role="status" className="rounded-2xl bg-leaf/10 px-5 py-8 text-center text-lg font-semibold text-navy">
        Enquiry received.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} onChange={(e) => setReady(e.currentTarget.checkValidity())} className="grid gap-[7px] lg:gap-[15px]">
      {choice ? (
        <fieldset>
          <legend className={labelCls}>{choice.legend}</legend>
          <div className="mt-[9px] grid grid-cols-2 gap-2">
            {choice.options.map((option) => (
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
      ) : null}

      {fields.map(renderField)}

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

      {after?.map(renderField)}

      <button
        type="submit"
        disabled={!ready || state === "sending"}
        className="mt-[9px] h-11 w-full rounded-full bg-brand text-[17px] font-medium text-white transition hover:brightness-110 disabled:bg-brand/45 disabled:hover:brightness-100 lg:mt-[29px] lg:h-14"
      >
        {state === "sending" ? "Sending" : submit}
      </button>
      {state === "failed" ? (
        <p role="alert" className="text-center text-sm text-[#b3261e]">
          Not sent: try again, or call {PHONE_DISPLAY}
        </p>
      ) : null}
      <p className="hidden text-center text-base leading-6 text-navy lg:-mt-[3px] lg:block">
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

function renderField(field: EnquiryField) {
  return (
    <label key={field.name} className={labelCls}>
      {field.label}
      {star}
      {field.type === "select" ? (
        <span className="relative block">
          <select name={field.name} required defaultValue="" className={`${input} appearance-none pr-11 invalid:text-[#8d99a5]`}>
            <option value="" disabled>
              {field.placeholder}
            </option>
            {field.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden size={16} className="pointer-events-none absolute right-4 top-1/2 mt-[3px] -translate-y-1/2 text-navy" />
        </span>
      ) : (
        <input
          name={field.name}
          type={field.type}
          required
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          className={input}
        />
      )}
    </label>
  );
}
