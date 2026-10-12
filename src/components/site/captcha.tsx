"use client";

import { useEffect, useRef } from "react";

/**
 * Google's "I'm not a robot" check (reCAPTCHA v2), inside a lead form, above its buttons.
 *
 * Off until NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set (and RECAPTCHA_SECRET_KEY on the server, which
 * api/lead uses to verify): without it the form works as before. With it, a hidden required field
 * holds the token, so a form that wakes its button on checkValidity() waits for the tick, and the
 * widget's own g-recaptcha-response field travels with the form data. A token works once, so the
 * widget clears itself after every submit.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (fn: () => void) => void;
      render: (el: HTMLElement, opts: Record<string, unknown>) => number;
      reset: (id?: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

let loading: Promise<void> | null = null;

function loadScript(lang: string): Promise<void> {
  if (window.grecaptcha?.render) return Promise.resolve();
  loading ??= new Promise((resolve) => {
    window.onRecaptchaLoad = () => resolve();
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit&hl=${encodeURIComponent(lang)}`;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  });
  return loading;
}

/** Sets the hidden field the way typing would, so React's onChange (and the form's) fires. */
function setField(input: HTMLInputElement | null, value: string) {
  if (!input) return;
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

export function Captcha({ lang = "en", className = "" }: { lang?: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!SITE_KEY || !el) return;
    let alive = true;
    let id: number | undefined;
    loadScript(lang).then(() => {
      if (!alive || !window.grecaptcha) return;
      id = window.grecaptcha.render(el, {
        sitekey: SITE_KEY,
        callback: (token: string) => setField(field.current, token),
        "expired-callback": () => setField(field.current, ""),
        "error-callback": () => setField(field.current, ""),
      });
    });
    // The form builds its data in the same submit event; clear the used token just after.
    const form = el.closest("form");
    const onSubmit = () =>
      window.setTimeout(() => {
        if (id === undefined) return;
        window.grecaptcha?.reset(id);
        setField(field.current, "");
      }, 0);
    form?.addEventListener("submit", onSubmit);
    return () => {
      alive = false;
      form?.removeEventListener("submit", onSubmit);
    };
  }, [lang]);

  if (!SITE_KEY) return null;
  return (
    <div className={`flex justify-center ${className}`}>
      {/* The hidden field sits over the widget, so a form submitted without the tick points the browser's
          "fill out this field" bubble at the box itself. */}
      <div className="relative">
        <div ref={box} className="min-h-[78px] min-w-[304px]" />
        <input
          ref={field}
          required
          tabIndex={-1}
          aria-hidden
          defaultValue=""
          className="pointer-events-none absolute inset-0 size-full opacity-0"
        />
      </div>
    </div>
  );
}
