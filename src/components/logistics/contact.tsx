import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/home/ui";
import { OFFICE_LINE } from "@/lib/company";
import { EFL_EMAIL } from "./data";
import { EnquiryCard } from "./enquiry-card";
import { Heading, Wrap } from "./ui";

function Tile({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-[#f6f9fc] px-3.5 py-3 lg:gap-3.5 lg:px-5 lg:py-[17px]">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand lg:size-11">{icon}</span>
      <div className="min-w-0">
        <p className="text-[13px] leading-[17px] text-ink-soft lg:text-sm lg:leading-5">{label}</p>
        {children}
      </div>
    </li>
  );
}

const value = "block text-[16px] font-bold leading-[21px] text-navy transition hover:text-brand lg:leading-6 xl:text-lg";

export function Contact({ source }: { source: string }) {
  return (
    <section className="bg-white pb-[56px] pt-[47px] lg:pb-[112px] lg:pt-[97px]">
      <Wrap>
        <Heading title="Get In Touch" sub="Phone, email, offices and both forms in one place." />
        <ul className="mt-[26px] grid gap-2 lg:mt-[42px] lg:grid-cols-3 lg:gap-4 xl:grid-cols-[1fr_1.15fr_1.55fr]">
          <Tile label="Call us" icon={<Phone aria-hidden size={22} strokeWidth={1.75} />}>
            <a href={PHONE_HREF} className={value}>
              {PHONE_DISPLAY}
            </a>
          </Tile>
          <Tile label="Email" icon={<Mail aria-hidden size={22} strokeWidth={1.75} />}>
            <a href={`mailto:${EFL_EMAIL}`} className={`${value} break-words`}>
              {EFL_EMAIL}
            </a>
          </Tile>
          <Tile label="Offices" icon={<MapPin aria-hidden size={22} strokeWidth={1.75} />}>
            <p className="text-[14px] font-semibold leading-[19px] text-navy">{OFFICE_LINE}</p>
          </Tile>
        </ul>
        <EnquiryCard source={source} />
      </Wrap>
    </section>
  );
}
