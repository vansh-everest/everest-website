"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";

/** The page's next lead form below the screen's top edge, or its last one once all are above. */
function nextForm(): HTMLElement | null {
  const forms = [...document.querySelectorAll<HTMLElement>("[data-lead-form]")];
  return forms.find((f) => f.getBoundingClientRect().top > 0) ?? forms[forms.length - 1] ?? null;
}

/**
 * Apply and Call, fixed to the bottom of a phone screen so a person is never scrolled away from
 * either. Apply scrolls to the page's next lead form and puts the cursor in its first field. The
 * bar slides away while any lead form is on screen, where the form's own buttons take over, and
 * stays away over the footer below the apply band, which lists both again.
 */
export function StickyBar({ call, callHref, apply }: { call: string; callHref?: string; apply?: string }) {
  const [away, setAway] = useState(false);

  useEffect(() => {
    // Any other lead form on the page (a search page's hero and middle ones) also sends the bar away while it is on screen.
    const band = document.getElementById("apply");
    const forms = [...document.querySelectorAll<HTMLElement>("[data-lead-form]")].filter((el) => !band?.contains(el));
    if (!band && !forms.length) return;
    const shown = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) shown.set(e.target, e.isIntersecting || (e.target === band && e.boundingClientRect.top < 0));
      setAway([...shown.values()].some(Boolean));
    });
    if (band) observer.observe(band);
    for (const form of forms) observer.observe(form);
    return () => observer.disconnect();
  }, []);

  function toForm() {
    const form = nextForm();
    if (!form) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    form.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
    window.setTimeout(() => form.querySelector<HTMLInputElement>("input:not([type=hidden]):not([tabindex='-1'])")?.focus({ preventScroll: true }), still ? 0 : 450);
  }

  const button = "flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-semibold";
  return (
    <div
      data-no-reveal
      data-contact-bar
      inert={away}
      className={`fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white/95 p-3 shadow-[0_-8px_24px_rgba(6,47,80,0.1)] backdrop-blur transition-transform duration-300 motion-reduce:transition-none md:hidden ${
        away ? "translate-y-[calc(100%+32px)]" : ""
      }`}
    >
      {apply ? (
        <button type="button" onClick={toForm} className={`${button} bg-brand text-white`}>
          {apply}
        </button>
      ) : null}
      <a href={callHref ?? PHONE_HREF} className={`${button} ${apply ? "border-2 border-navy text-navy" : "bg-navy text-white"}`}>
        <Phone aria-hidden size={18} strokeWidth={1.75} />
        {call}
      </a>
    </div>
  );
}
