import { SiteImage } from "@/components/site/site-image";
import type { ImageSlot } from "@/lib/content";

/** Full-bleed fleet photo with the heading on a navy fade at the bottom. */
export function PlansHero({ slot }: { slot: ImageSlot }) {
  return (
    <section className="relative isolate flex h-[240px] items-end overflow-hidden bg-navy sm:h-[400px] lg:h-[600px]">
      <SiteImage slot={slot} priority sizes="100vw" className="-z-10 object-[center_30%]" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,47,80,0)_35%,rgba(6,34,58,0.72)_70%,#081d33_100%)]"
      />
      <h1 className="px-[13px] pb-2.5 text-[26px] font-bold leading-[31px] tracking-[-0.3px] text-white sm:px-6 sm:pb-10 sm:text-[44px] sm:leading-[50px] sm:tracking-[-0.5px] lg:px-[53px] lg:pb-[62px] lg:text-[54px] lg:leading-[62px] lg:tracking-normal">
        Ownership To Renting
        <br /> <span className="lg:hidden">We Have Plans For Everyone</span>
        <span className="hidden lg:inline">We have plans for everyone</span>
      </h1>
    </section>
  );
}
