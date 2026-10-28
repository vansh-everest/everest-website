"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";

/**
 * Call, fixed to the bottom of a phone screen so a person is never scrolled away.
 * It slides away once the apply form (#apply) comes into view, where the form's own Apply and
 * Call take over, and stays away over the footer below it, which lists both again.
 */
export function StickyBar({ call, callHref }: { call: string; callHref?: string }) {
  const [away, setAway] = useState(false);

  useEffect(() => {
    // Any other lead form on the page (a search page's hero and middle ones) also sends the bar away while it is on screen.
    const apply = document.getElementById("apply");
    const forms = [...document.querySelectorAll<HTMLElement>("[data-lead-form]")].filter((el) => !apply?.contains(el));
    if (!apply && !forms.length) return;
    const shown = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) shown.set(e.target, e.isIntersecting || (e.target === apply && e.boundingClientRect.top < 0));
      setAway([...shown.values()].some(Boolean));
    });
    if (apply) observer.observe(apply);
    for (const form of forms) observer.observe(form);
    return () => observer.disconnect();
  }, []);

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
      <a href={callHref ?? PHONE_HREF} className={`${button} bg-navy text-white`}>
        <Phone aria-hidden size={18} strokeWidth={1.75} />
        {call}
      </a>
    </div>
  );
}
