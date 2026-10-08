"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import { PICK_SERVICE_EVENT, SERVICES } from "./services";
import { trackLead } from "@/lib/analytics";

const input =
  "mt-1.5 h-[52px] w-full rounded border border-line bg-white px-4 text-base text-navy placeholder:text-[#9ca3af] focus:border-brand focus:outline-none sm:h-12";
const label = "block text-[13px] font-medium leading-4 text-navy";

function Required() {
  return (
    <span aria-hidden className="ml-1 text-[#ef4444]">
      *
    </span>
  );
}

/**
 * A business enquiry sent to the driver lead endpoint. That record holds name, mobile and source,
 * so the chosen service rides in `source`; company and email are posted too but the endpoint does
 * not keep them yet. A service's Get Started button preselects it here.
 */
export function EnquiryForm({ source }: { source: string }) {
  const form = useRef<HTMLFormElement>(null);
  const [service, setService] = useState("");
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");

  useEffect(() => {
    const pick = (event: Event) => {
      const slug = String((event as CustomEvent<string>).detail ?? "");
      setService(slug);
      // Setting the value raises no change event, so readiness is checked here as well.
      const select = form.current?.elements.namedItem("service");
      if (select instanceof HTMLSelectElement) select.value = slug;
      setReady(form.current?.checkValidity() ?? false);
    };
    window.addEventListener(PICK_SERVICE_EVENT, pick);
    return () => window.removeEventListener(PICK_SERVICE_EVENT, pick);
  }, []);

  useEffect(() => {
    if (state !== "done") return;
    // The sent form keeps its values under the message, then clears so it cannot go twice.
    const timer = setTimeout(() => {
      form.current?.reset();
      setService("");
      setReady(false);
      setState("idle");
    }, 6000);
    return () => clearTimeout(timer);
  }, [state]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending" || state === "done") return;
    setState("sending");
    const data = new FormData(event.currentTarget);
    data.set("locale", "en");
    data.set("source", service ? `${source}/${service}` : source);
    data.set("page", window.location.pathname);
    data.set("referrer", document.referrer);
    data.set("campaign", new URLSearchParams(window.location.search).toString());
    try {
      const res = await fetch("/api/lead/", { method: "POST", body: data });
      if (res.ok) trackLead(String(data.get("source") ?? ""));
      setState(res.ok ? "done" : "failed");
    } catch {
      setState("failed");
    }
  }

  return (
    <form
      ref={form}
      onSubmit={submit}
      onChange={(e) => setReady(e.currentTarget.checkValidity())}
      className="grid gap-3.5 sm:gap-5"
    >
      {state === "done" ? (
        <div
          role="status"
          className="absolute inset-x-[18px] -top-[58px] z-10 rounded-lg border-l-4 border-leaf bg-[#f0fdf4] px-3 py-2.5 shadow-[0_8px_24px_rgba(6,47,80,0.18)] sm:inset-x-14"
        >
          <p className="text-base font-medium leading-6 text-navy">Enquiry sent</p>
          <p className="text-sm leading-5 text-ink-soft">The team will call you shortly.</p>
        </div>
      ) : null}
      <label className={label}>
        Name
        <Required />
        <input name="name" required autoComplete="name" placeholder="Your full name" className={input} />
      </label>
      <label className={label}>
        Company
        <Required />
        <input name="company" required autoComplete="organization" placeholder="Your company name" className={input} />
      </label>
      <label className={label}>
        Email
        <Required />
        <input name="email" required type="email" autoComplete="email" placeholder="name@company.com" className={input} />
      </label>
      <label className={label}>
        Mobile Number
        <Required />
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
      <label className={label}>
        Service You Need
        <Required />
        <span className="relative block">
          <select
            name="service"
            required
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={`${input} appearance-none pr-12 invalid:text-[#9ca3af]`}
          >
            <option value="" disabled>
              Select a service
            </option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute right-4 top-1/2 mt-[3px] -translate-y-1/2 text-navy"
          />
        </span>
      </label>
      <button
        type="submit"
        disabled={!ready || state === "sending" || state === "done"}
        className="mt-1 h-[41px] rounded-full bg-brand text-[17px] font-medium tracking-[0.2px] text-white transition hover:brightness-110 disabled:bg-brand/45 disabled:hover:brightness-100 sm:mt-3 sm:h-14"
      >
        {state === "sending" ? "Sending" : "Send Enquiry"}
      </button>
      {state === "failed" ? (
        <p role="alert" className="text-center text-sm text-[#b3261e]">
          Not sent. Try again, or call {PHONE_DISPLAY}.
        </p>
      ) : null}
      <p className="hidden text-center text-base leading-6 text-navy sm:block">
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
