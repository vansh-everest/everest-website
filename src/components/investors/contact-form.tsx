"use client";

import { useState } from "react";

const INBOX = "hello@everestfleet.com";

/**
 * Name, email and details. The lead record (src/lib/leads.ts) holds a mobile number and a city,
 * and the lead route rejects a submission without a mobile, so this form cannot post there.
 * It opens the visitor's mail app with the request addressed to the company inbox instead.
 */
export function InvestorForm() {
  const [values, setValues] = useState({ name: "", email: "", details: "" });
  // A browser with no mail app does nothing on a mailto link, so the address is shown once tried.
  const [tried, setTried] = useState(false);
  const ready = Boolean(values.name.trim() && values.email.trim() && values.details.trim());

  function update(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const body = `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.details.trim()}`;
    setTried(true);
    window.location.href = `mailto:${INBOX}?subject=${encodeURIComponent("Investor deck request")}&body=${encodeURIComponent(body)}`;
  }

  const label = "block text-sm font-semibold leading-5 text-navy";
  const field =
    "mt-1.5 block h-12 w-full rounded-[3px] border border-line bg-white px-4 text-base text-navy outline-none placeholder:text-[#9aa3ae] focus:border-brand lg:h-[48px] lg:text-[17px]";

  return (
    <form onSubmit={submit} className="grid gap-[18px] lg:gap-4">
      <label className={label}>
        Name <span className="text-[#e5484d]">*</span>
        <input name="name" required autoComplete="name" placeholder="Your full name" value={values.name} onChange={update} className={field} />
      </label>
      <label className={label}>
        Email <span className="text-[#e5484d]">*</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@company.com"
          value={values.email}
          onChange={update}
          className={field}
        />
      </label>
      <label className={label}>
        Details <span className="text-[#e5484d]">*</span>
        <textarea
          name="details"
          required
          rows={1}
          placeholder="Details..."
          value={values.details}
          onChange={update}
          className={`${field} min-h-12 resize-none py-[11px] leading-6 [field-sizing:content]`}
        />
      </label>
      <button
        type="submit"
        disabled={!ready}
        className="mt-2 h-10 rounded-full bg-brand text-[17px] font-medium tracking-[0.3px] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-[#8dbddf] lg:mt-[30px] lg:h-14"
      >
        Request The Investor Deck
      </button>
      {tried ? (
        <p role="status" className="text-center text-sm leading-5 text-ink-soft">
          Or write to{" "}
          <a href={`mailto:${INBOX}`} className="font-semibold text-brand underline-offset-2 hover:underline">
            {INBOX}
          </a>
        </p>
      ) : null}
    </form>
  );
}
