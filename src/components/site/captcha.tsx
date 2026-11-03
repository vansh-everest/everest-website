"use client";

import { useEffect, useRef } from "react";

/**
 * Google reCAPTCHA inside a lead form, above its buttons, in one of two modes.
 *
 * - Checkbox (v2, the default): the "I'm not a robot" box. The site key is public by design; the
 *   one below is registered for everestfleet.com (and its subdomains) and the Amplify address.
 *   NEXT_PUBLIC_RECAPTCHA_SITE_KEY overrides it, e.g. with Google's test key on localhost.
 * - Invisible (v3): set NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY at build time (and RECAPTCHA_V3_SECRET_KEY
 *   on the server). No box: a score token is fetched when the visitor first touches the form,
 *   renewed every 90 seconds (a token lives two minutes) and again after each submit.
 *
 * Either way Google's script loads three seconds after the page opens, or as soon as someone
 * touches a form, so the ~400 KB of reCAPTCHA stays out of the page's first seconds. A hidden required field holds the token, so
 * a form that wakes its button on checkValidity() waits for it. api/lead checks each token once its
 * secret is set. A token works once, so it is cleared or renewed after every submit.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LcuWOstAAAAAOJla0SkIxCV-K2rLmUzNlYah7X1";
const V3_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY || "";
/** The field api/lead reads; the checkbox widget adds its own, the invisible mode fills ours. */
const TOKEN_FIELD = "g-recaptcha-response";
const RENEW_MS = 90_000;
/** Google's script starts loading this long after the page opens, or sooner on a touch of the form. */
const START_MS = 3_000;
/** How long a submit waits for its first invisible-mode token before going ahead without one. */
const WAIT_MS = 4_000;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (fn: () => void) => void;
      render: (el: HTMLElement, opts: Record<string, unknown>) => number;
      reset: (id?: number) => void;
      execute: (key: string, opts: { action: string }) => Promise<string>;
    };
    onRecaptchaLoad?: () => void;
  }
}

let loading: Promise<void> | null = null;

function loadScript(lang: string): Promise<void> {
  loading ??= new Promise((resolve) => {
    const s = document.createElement("script");
    if (V3_KEY) {
      s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(V3_KEY)}&hl=${encodeURIComponent(lang)}`;
      s.onload = () => window.grecaptcha?.ready(() => resolve());
    } else {
      window.onRecaptchaLoad = () => resolve();
      s.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit&hl=${encodeURIComponent(lang)}`;
    }
    // Blocked (an ad blocker, a bad network): settle anyway, so nothing waits on it forever.
    s.onerror = () => resolve();
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

/**
 * Runs `start` once: the first time someone focuses, taps or clicks inside the form, or `delay` ms
 * after the page opens, whichever comes first. The delay keeps Google's script out of the page's
 * first seconds while still having the check ready before most people reach the buttons.
 */
function onFirstTouch(form: HTMLFormElement | null, start: () => void, delay: number): () => void {
  const events = ["focusin", "pointerdown"] as const;
  let done = false;
  const cleanup = () => {
    window.clearTimeout(timer);
    for (const e of events) form?.removeEventListener(e, once);
  };
  const once = () => {
    if (done) return;
    done = true;
    cleanup();
    start();
  };
  const timer = window.setTimeout(once, delay);
  for (const e of events) form?.addEventListener(e, once);
  return cleanup;
}

export function Captcha({ lang = "en", className = "" }: { lang?: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // The invisible mode renders only its field; the checkbox mode renders the widget's box.
    const el = V3_KEY ? field.current : box.current;
    if ((!SITE_KEY && !V3_KEY) || !el) return;
    const form = el.closest("form");
    let alive = true;
    let id: number | undefined;
    let timer: number | undefined;

    const renew = () =>
      window.grecaptcha
        ?.execute(V3_KEY, { action: "lead" })
        .then((token) => alive && setField(field.current, token))
        .catch(() => alive && setField(field.current, ""));

    const stop = onFirstTouch(form, () =>
      loadScript(lang).then(() => {
        if (!alive || !window.grecaptcha) return;
        if (V3_KEY) {
          renew();
          timer = window.setInterval(renew, RENEW_MS);
          return;
        }
        if (!box.current) return;
        id = window.grecaptcha.render(box.current, {
          sitekey: SITE_KEY,
          callback: (token: string) => setField(field.current, token),
          "expired-callback": () => setField(field.current, ""),
          "error-callback": () => setField(field.current, ""),
        });
      }),
      START_MS
    );

    // Invisible mode: a submit that beats its first token (a quick fill, a slow network) is held
    // until the token lands or WAIT_MS passes, then sent again; without a token the server decides.
    // It runs on the form itself, before React's handler at the root, and stops that event there.
    let letThrough = false;
    const gate = (event: SubmitEvent) => {
      if (!V3_KEY || letThrough || field.current?.value) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const submitter = event.submitter;
      const token = loadScript(lang).then(() => renew());
      void Promise.race([token, new Promise((r) => window.setTimeout(r, WAIT_MS))]).then(() => {
        if (!alive || !form) return;
        letThrough = true;
        form.requestSubmit(submitter instanceof HTMLElement ? submitter : undefined);
        letThrough = false;
      });
    };

    // The form builds its data in the same submit event; replace the used token just after.
    const onSubmit = () =>
      window.setTimeout(() => {
        if (V3_KEY) {
          setField(field.current, "");
          renew();
          return;
        }
        if (id === undefined) return;
        window.grecaptcha?.reset(id);
        setField(field.current, "");
      }, 0);
    form?.addEventListener("submit", gate);
    form?.addEventListener("submit", onSubmit);
    return () => {
      alive = false;
      stop();
      if (timer) window.clearInterval(timer);
      form?.removeEventListener("submit", gate);
      form?.removeEventListener("submit", onSubmit);
    };
  }, [lang]);

  if (V3_KEY) {
    return <input ref={field} type="hidden" name={TOKEN_FIELD} defaultValue="" />;
  }
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
