import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";
import { SiteImage } from "@/components/site/site-image";
import type { PlanPageView } from "@/lib/plan-view";

/**
 * The photo sits on the right and fades into white under the heading. Hero photos are cropped
 * clear of the heading, so each one only has to fill the right-hand side.
 */
export function PlanHero({ view, calculateHref }: { view: PlanPageView; calculateHref: string }) {
  return (
    <section className="relative bg-white lg:h-[600px] lg:overflow-hidden">
      <div className="relative h-[260px] sm:h-[360px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[60%]">
        <SiteImage slot={view.heroImage} priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-[right_center]" />
        <div aria-hidden className="absolute inset-y-0 left-0 hidden w-1/5 bg-gradient-to-r from-white to-transparent lg:block" />
      </div>
      <div className="relative px-6 pb-12 pt-8 lg:absolute lg:left-0 lg:top-20 lg:px-0 lg:pb-0 lg:pl-[89px] lg:pt-0">
        <p className="inline-flex h-[31px] w-fit items-center rounded-full bg-navy px-3.5 text-[13px] font-bold uppercase tracking-[1px] text-white lg:text-[15px]">
          {view.name} plan
        </p>
        <h1 className="mt-5 text-[40px] font-bold leading-[1.1] tracking-[-0.5px] text-navy lg:mt-[22px] lg:text-[64px] lg:leading-[69px]">
          {view.headline}
          {view.highlight ? (
            <>
              <br />
              <span className="text-brand">{view.highlight}</span>
            </>
          ) : null}
        </h1>
        {view.amount ? (
          <div className="mt-[22px]">
            <p className="text-xs font-semibold uppercase leading-[15px] tracking-[0.5px] text-ink-soft">Starting at</p>
            <p className="flex items-baseline gap-1">
              <span className="text-[44px] font-extrabold leading-[48px] text-navy">{view.amount}</span>
              <span className="text-base text-ink-soft">{view.unit}</span>
            </p>
          </div>
        ) : null}
        <div className="mt-[22px] flex flex-wrap gap-3.5">
          <Link
            href={calculateHref}
            className="flex h-[49px] items-center gap-2 rounded-full bg-sun px-7 text-base font-semibold text-navy transition hover:brightness-95"
          >
            Calculate Plan
            <ArrowRight size={18} />
          </Link>
          <a
            href={PHONE_HREF}
            className="flex h-[49px] items-center gap-2 rounded-full border-[1.5px] border-navy bg-white/60 px-[26px] text-base font-semibold text-navy"
          >
            <Phone size={18} />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
