import type { ReactNode } from "react";
import { Mail, Phone, type LucideIcon } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/home/ui";
import { COMPANY } from "@/lib/company";
import { QuoteForm } from "./quote-form";

function Contact({ icon: Icon, label, href, children, className = "" }: { icon: LucideIcon; label: string; href: string; children: ReactNode; className?: string }) {
  return (
    <li className={`flex items-center gap-3.5 ${className}`}>
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/10 text-sun">
        <Icon aria-hidden size={22} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] leading-[18px] text-white/70">{label}</p>
        <a href={href} className="block break-words text-lg font-semibold leading-6 text-white hover:text-sun focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun">
          {children}
        </a>
      </div>
    </li>
  );
}

/** The form section: the hero's button lands here. */
export function Quote() {
  return (
    <section id="enquire" className="scroll-mt-[60px] bg-[linear-gradient(160deg,#062f50_0%,#0a4378_100%)] px-4 pb-12 pt-12 lg:scroll-mt-20 lg:px-6 lg:py-24">
      <div className="mx-auto grid max-w-[1104px] grid-cols-1 gap-y-[29px] lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center lg:gap-x-16">
        <div>
          <h2 className="text-[30px] font-medium leading-[35px] tracking-[-0.5px] text-white lg:text-[48px] lg:leading-[54px] lg:tracking-[-0.6px]">
            Plan your team’s <br />
            <span className="text-sun">commute</span>
          </h2>
          <p className="mt-4 text-[17px] leading-6 text-white/70 lg:mt-5 lg:text-lg lg:leading-7">Tell us about your office and shifts.</p>
          <ul className="mt-[27px] grid gap-4 lg:mt-[37px] lg:gap-5">
            <Contact icon={Phone} label="Call us" href={PHONE_HREF} className="lg:hidden">
              {PHONE_DISPLAY}
            </Contact>
            <Contact icon={Mail} label="Email" href={`mailto:${COMPANY.email}`}>
              {COMPANY.email}
            </Contact>
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-5 pb-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] lg:px-8 lg:pb-8 lg:pt-[30px]">
          <h3 className="text-2xl font-bold leading-8 text-navy">Get a quote</h3>
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
