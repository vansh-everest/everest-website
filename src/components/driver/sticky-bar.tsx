"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";

/**
 * Call and WhatsApp, fixed to the bottom of a phone screen so a person is never scrolled away.
 * It slides away once the apply form (#apply) comes into view, where the form's own Apply and
 * Call take over, and stays away over the footer below it, which lists both again.
 */
export function StickyBar({ call, whatsapp }: { call: string; whatsapp: string }) {
  const [away, setAway] = useState(false);

  useEffect(() => {
    const form = document.getElementById("apply");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => {
      setAway(entry.isIntersecting || entry.boundingClientRect.top < 0);
    });
    observer.observe(form);
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
      <a href={PHONE_HREF} className={`${button} bg-navy text-white`}>
        <Phone aria-hidden size={18} strokeWidth={1.75} />
        {call}
      </a>
      <a href={WHATSAPP_HREF} className={`${button} bg-whatsapp text-white`}>
        <WhatsappLogo aria-hidden size={20} weight="fill" />
        {whatsapp}
      </a>
    </div>
  );
}
