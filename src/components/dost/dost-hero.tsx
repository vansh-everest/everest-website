import Image from "next/image";
import { Phone } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";

const ALT = "An Everest Dost shaking hands with an Everest Fleet team member in front of the fleet";

/*
 * Phones get the stacked layout from the 412 export. From lg up the band is drawn on the 1440
 * frame: --u is one frame pixel, so at 1024 the heading and the photo shrink together and the
 * heading never runs into the two faces.
 */
export function DostHero() {
  return (
    <section className="@container overflow-hidden bg-[#052b4a]">
      <div className="relative [--u:calc(min(100cqw,1440px)/1440)] lg:h-[calc(var(--u)*600)]">
        <div className="absolute inset-y-0 right-0 hidden w-[calc(var(--u)*1040)] lg:block">
          <Image src="/figma/dost/hero.webp" alt={ALT} fill preload sizes="(min-width: 1024px) min(1040px, 72vw), 0px" className="object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-4 pb-[37px] pt-8 lg:px-0 lg:pb-0 lg:pl-[calc(var(--u)*42)] lg:pt-[calc(var(--u)*238)]">
          <p className="inline-flex h-[21px] items-center rounded-full bg-white px-3 text-xs font-medium uppercase tracking-[0.5px] text-navy lg:h-[calc(var(--u)*33)] lg:px-[calc(var(--u)*20)] lg:text-[length:calc(var(--u)*12.5)] lg:font-semibold lg:tracking-[calc(var(--u)*1.2)]">
            Everest Dost
          </p>
          <h1 className="mt-[11px] text-[31px] font-bold capitalize leading-[38px] tracking-[-0.02em] text-white lg:mt-[calc(var(--u)*13.5)] lg:text-[length:calc(var(--u)*64)] lg:normal-case lg:leading-[calc(var(--u)*72)] lg:tracking-[-0.004em]">
            Refer A Driver.
            <br />
            Earn At Every Milestone.
          </h1>
          <div className="relative mt-[13px] aspect-[380/220] overflow-hidden rounded-2xl lg:hidden">
            <Image src="/figma/dost/hero-mobile.webp" alt={ALT} fill preload sizes="(min-width: 1024px) 0px, 100vw" className="object-cover" />
          </div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:mt-[calc(var(--u)*14.5)] lg:flex lg:gap-[calc(var(--u)*13)]">
            <a
              href="#apply"
              className="flex h-14 items-center justify-center gap-2 rounded-full bg-sun text-[17px] text-navy transition-[filter] hover:brightness-95 lg:h-[calc(var(--u)*56)] lg:px-[calc(var(--u)*16.5)] lg:text-[length:calc(var(--u)*21)]"
            >
              Apply To Become A Dost
              <span aria-hidden className="text-xl lg:hidden">
                &rarr;
              </span>
            </a>
            <a
              href={PHONE_HREF}
              className="flex h-14 items-center justify-center gap-[calc(var(--u)*9)] rounded-full border-2 border-white/90 text-[17px] text-white transition-colors hover:bg-white/10 lg:h-[calc(var(--u)*56)] lg:border-white lg:px-[calc(var(--u)*30)] lg:text-[length:calc(var(--u)*17)]"
            >
              <Phone className="hidden size-[calc(var(--u)*19)] lg:block" strokeWidth={1.6} />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
