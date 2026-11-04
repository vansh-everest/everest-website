"use client";

import { useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { PHONE_DISPLAY } from "@/components/home/ui";
import { sendLead } from "@/components/b2b/lead";
import { Captcha } from "@/components/site/captcha";
import { Consent } from "@/components/site/consent";
import { useCityField } from "@/lib/use-city-field";

const labelCls = "block text-sm font-medium leading-5 text-navy";
const inputCls =
  "mt-1 h-[52px] w-full rounded-[3px] border border-[#dfe3e8] bg-white px-4 text-base text-navy placeholder:text-[#8d99a5] focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/25 lg:h-12";
const star = (
  <span aria-hidden className="ml-1 text-[#e5484d]">
    *
  </span>
);

type FieldProps = { name: string; label: string; required?: boolean; className?: string };

export function TextField({
  name,
  label,
  required,
  className = "",
  ...input
}: FieldProps & { placeholder: string } & Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "autoComplete" | "inputMode" | "pattern" | "maxLength" | "title"
  >) {
  return (
    <label className={`${labelCls} ${className}`}>
      {label}
      {required ? star : null}
      <input name={name} required={required} className={inputCls} {...input} />
    </label>
  );
}

export function MobileField() {
  return (
    <TextField
      name="mobile"
      label="Mobile"
      required
      type="tel"
      inputMode="numeric"
      pattern="[6-9][0-9]{9}"
      maxLength={10}
      autoComplete="tel-national"
      placeholder="10-digit mobile number"
      title="10-digit mobile number"
    />
  );
}

export function SelectField({
  name,
  label,
  required,
  className = "",
  placeholder,
  options,
}: FieldProps & { placeholder: string; options: string[] }) {
  const cityField = useCityField();
  return (
    <label className={`${labelCls} ${className}`}>
      {label}
      {required ? star : null}
      <span className="relative block">
        <select
          ref={name === "city" ? cityField : undefined}
          name={name}
          required={required}
          defaultValue=""
          className={`${inputCls} appearance-none pr-11 [&:has(option[value='']:checked)]:text-[#8d99a5] [&>option]:text-navy`}
        >
          <option value="" disabled={required}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden size={16} className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-navy" />
      </span>
    </label>
  );
}

export type ChipOption = string | { value: string; label: string; lang: string };

/** A single-choice group: real radios, so arrow keys work and the choice posts with the form. */
export function Chips({
  name,
  label,
  options,
  required,
  error,
}: {
  name: string;
  label: string;
  options: ChipOption[];
  required?: boolean;
  error?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className={labelCls}>
        {label}
        {required ? star : null}
      </legend>
      <div className="mt-1 flex flex-wrap gap-2 lg:gap-1.5">
        {options.map((option) => {
          const { value, text, lang } = typeof option === "string" ? { value: option, text: option, lang: undefined } : { value: option.value, text: option.label, lang: option.lang };
          return (
            <label
              key={value}
              lang={lang}
              className={`relative flex h-12 cursor-pointer items-center rounded-full border bg-white px-[16px] text-[15px] font-medium text-navy transition hover:border-navy/40 has-checked:border-navy has-checked:bg-navy has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-brand has-focus-visible:ring-offset-1 lg:px-3 ${
                error ? "border-[#e5484d]" : "border-[#dfe3e8]"
              }`}
            >
              <input type="radio" name={name} value={value} className="sr-only" />
              {text}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-[13px] font-medium leading-[18px] text-[#b3261e]">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function ConsentBox() {
  return (
    <label className="mt-5 flex items-start gap-2.5 text-sm leading-[18px] text-ink-soft lg:mt-[27px] lg:items-center">
      <span className="relative size-5 shrink-0">
        <input
          type="checkbox"
          name="contact_consent"
          value="Yes"
          required
          className="peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-md border border-[#c9d2db] bg-white checked:border-brand checked:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        />
        <Check aria-hidden size={14} strokeWidth={3} className="pointer-events-none absolute left-[3px] top-[3px] hidden text-white peer-checked:block" />
      </span>
      I agree to be contacted by Everest Fleet on call or SMS.
    </label>
  );
}

/** The confirmation that replaces a form once its lead is in. */
function Thanks({ title, line }: { title: string; line: string }) {
  return (
    <div role="status" className="px-1 pb-4 pt-8 text-center lg:pb-[60px] lg:pt-[68px]">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-lime text-navy lg:size-16">
        <Check aria-hidden size={28} strokeWidth={2} />
      </span>
      <p className="mt-4 text-[22px] font-bold leading-7 text-navy lg:mt-5 lg:text-[28px] lg:leading-9">{title}</p>
      <p className="mt-2 text-[17px] font-medium leading-[22px] text-navy lg:text-lg">{line}</p>
    </div>
  );
}

const BUTTON = {
  brand: "bg-brand text-white disabled:bg-brand/45",
  sun: "bg-sun text-navy disabled:bg-sun/50",
};

/**
 * One enquiry form: the page's fields, the consent box, the captcha line, the button, and the
 * confirmation in its place once sent. `requiredChips` maps each required chip group to the error
 * it shows. The button's click checks those groups first, so a visitor sees every missing choice
 * at once and an unanswered group never spends a captcha token.
 */
export function LeadForm({
  source,
  label,
  submit,
  tone,
  requiredChips,
  thanks,
  children,
}: {
  source: string;
  label: string;
  submit: string;
  tone: keyof typeof BUTTON;
  requiredChips: Record<string, string>;
  thanks: { title: string; line: string };
  children: (errors: Record<string, string>) => ReactNode;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function missingChoices(form: HTMLFormElement) {
    const data = new FormData(form);
    return Object.fromEntries(Object.entries(requiredChips).filter(([name]) => !data.get(name)));
  }

  function onSubmitClick(event: MouseEvent<HTMLButtonElement>) {
    const form = ref.current;
    if (!form) return;
    const missing = missingChoices(form);
    setErrors(missing);
    const first = Object.keys(missing)[0];
    if (!first) return;
    event.preventDefault();
    if (form.reportValidity()) form.querySelector<HTMLInputElement>(`input[name="${first}"]`)?.focus();
  }

  function clearError(event: FormEvent<HTMLFormElement>) {
    const { name } = event.target as unknown as HTMLInputElement;
    setErrors((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== name)));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setState((await sendLead(new FormData(event.currentTarget), source)) ? "done" : "failed");
  }

  if (state === "done") return <Thanks {...thanks} />;

  return (
    <form ref={ref} aria-label={label} onSubmit={onSubmit} onChange={clearError}>
      <div className="grid gap-y-[17px] lg:grid-cols-3 lg:gap-x-4 lg:gap-y-[18px]">{children(errors)}</div>
      <ConsentBox />
      <Captcha className="mt-4 lg:justify-start lg:text-left" />
      <button
        type="submit"
        onClick={onSubmitClick}
        disabled={state === "sending"}
        className={`mt-4 h-14 w-full rounded-full px-8 text-[17px] font-medium tracking-[0.2px] transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:w-auto ${BUTTON[tone]}`}
      >
        {state === "sending" ? "Sending" : submit}
      </button>
      {state === "failed" ? (
        <p role="alert" className="mt-3 text-sm text-[#b3261e]">
          Not sent: try again, or call {PHONE_DISPLAY}
        </p>
      ) : null}
      <Consent className="mt-3 lg:text-left" />
    </form>
  );
}
