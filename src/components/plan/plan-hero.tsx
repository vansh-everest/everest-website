import Link from "next/link";
import { Phone } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";
import { SiteImage } from "@/components/site/site-image";
import type { PlanPageView } from "@/lib/plan-view";

/*
 * Desktop, `wide`: the photo runs edge to edge and carries the design's navy fade on its left.
 * Under 1440 the photo is cropped from the left, so a shade keeps the heading readable there.
 * Desktop, otherwise: hero photos are cropped clear of the heading, so the sharp photo only fills the
 * right-hand side. Under the heading a blurred copy of the same file (one download) runs full
 * width behind the navy shade, and the sharp photo fades into it. The shade holds far enough out
 * for the heading to stay readable on a narrow desktop.
 * Phone: one navy column, the phone crop as a card between the tags and the figures.
 */
const SHADE =
  "linear-gradient(90deg,rgba(9,50,84,.93) 0,rgba(9,50,84,.88) max(560px,calc(100% - 800px)),rgba(9,50,84,.55) max(700px,calc(100% - 660px)),rgba(9,50,84,0) max(860px,calc(100% - 500px)))";
const SIZES = "48vw";
const NARROW_SHADE =
  "linear-gradient(90deg,rgba(9,50,84,.75) 0,rgba(9,50,84,.55) 45%,rgba(9,50,84,0) 72%)";

export function PlanHero({ view, startHref, wide }: { view: PlanPageView; startHref: string; wide: boolean }) {
  const lastTag = view.tags.length - 1;
  return (
    <section className="relative overflow-hidden bg-navy lg:h-[600px]">
      {wide ? (
        <>
          <div className="absolute inset-0 hidden lg:block">
            <SiteImage slot={view.heroImage} priority sizes="100vw" className="object-[70%_center]" />
          </div>
          <div aria-hidden className="absolute inset-0 hidden lg:block min-[1440px]:hidden" style={{ background: NARROW_SHADE }} />
        </>
      ) : (
        <>
          <div aria-hidden className="absolute inset-0 hidden overflow-hidden lg:block">
            {view.heroImage.url ? <SiteImage slot={{ ...view.heroImage, alt: "" }} sizes={SIZES} className="scale-110 blur-xl" /> : null}
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-[max(684px,47.5%)] [mask-image:linear-gradient(90deg,transparent,#000_160px)] lg:block">
            <SiteImage slot={view.heroImage} priority sizes={SIZES} className="object-[right_center]" />
          </div>
          <div aria-hidden className="absolute inset-0 hidden lg:block" style={{ background: SHADE }} />
        </>
      )}

      <div className="relative mx-auto flex max-w-[600px] flex-col px-4 pb-10 pt-8 sm:px-6 lg:h-full lg:max-w-[1440px] lg:justify-center lg:px-[89px] lg:py-0">
        <p className="w-fit rounded-full border border-navy bg-white px-3 py-0.5 text-xs font-medium uppercase leading-[17px] tracking-[0.5px] text-navy lg:px-[18px] lg:py-1 lg:text-[15px] lg:font-semibold lg:leading-[21px] lg:tracking-[1.5px]">
          {view.name}
        </p>
        <h1 className="mt-[11px] text-[36px] font-bold leading-[42px] tracking-[-0.6px] text-white lg:mt-4 lg:text-[58px] lg:leading-[64px] lg:tracking-[-0.5px]">
          {view.headline}
          {view.highlight ? (
            <>
              <br />
              <span className="text-sun">{view.highlight}</span>
            </>
          ) : null}
        </h1>

        {view.tags.length ? (
          <ul className="mt-[11px] flex flex-wrap gap-[11px] lg:order-5 lg:mt-[13px] lg:gap-2">
            {view.tags.map((tag, i) => (
              <li
                key={i}
                className={`rounded-full bg-brand px-3 py-[5px] text-center text-[13px] font-bold uppercase leading-[17px] tracking-[0.9px] text-white lg:py-1.5 lg:leading-4 lg:tracking-[1px] ${
                  i > 0 && i < lastTag ? "hidden lg:block" : ""
                } ${i > 0 && i === lastTag ? "min-w-[148px] lg:min-w-0" : ""}`}
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="relative mt-[13px] aspect-[380/220] overflow-hidden rounded-2xl bg-white/10 lg:hidden">
          <SiteImage slot={view.heroImagePhone} priority sizes="(min-width: 640px) 600px, 100vw" />
        </div>

        {view.figures.length ? (
          <dl className="mt-[25px] flex divide-x divide-white/20 rounded-xl border border-white/20 bg-white/5 py-5 text-center lg:order-4 lg:mt-3.5 lg:gap-3 lg:divide-x-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
            {view.figures.map((f, i) => (
              <div
                key={i}
                className="min-w-0 flex-auto px-1.5 lg:h-[71px] lg:flex-none lg:w-[199px] lg:rounded-[10px] lg:border lg:border-white/30 lg:bg-white/10 lg:px-3 lg:py-2.5 lg:backdrop-blur-[2px]"
              >
                <dt className="text-[11px] font-semibold uppercase leading-4 tracking-[0.5px] text-white/85 lg:text-[13px] lg:font-medium lg:tracking-[1px]">
                  {f.label}
                </dt>
                <dd className="mt-[3px] text-white lg:mt-0 lg:flex lg:items-baseline lg:gap-x-1">
                  <span className="text-[15px] font-bold leading-5 lg:text-2xl lg:leading-8">{f.value}</span>
                  {f.suffix ? <span className="ml-1 text-[11px] leading-4 lg:ml-0 lg:text-xs">{f.suffix}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="order-6 mt-[25px] flex flex-col gap-[13px] lg:mt-3 lg:flex-row lg:gap-3">
          <Link
            href={startHref}
            className="flex h-14 items-center justify-center rounded-full bg-sun text-[17px] font-bold text-navy transition hover:brightness-95 lg:w-[272px] lg:text-xl lg:font-medium"
          >
            <span className="lg:hidden">Get Started</span>
            <span className="hidden lg:inline">Get Started</span>
          </Link>
          <a
            href={PHONE_HREF}
            className="flex h-14 items-center justify-center gap-2.5 rounded-full border-2 border-white text-[17px] font-medium text-white transition hover:bg-white/10 lg:w-[164px] lg:text-lg"
          >
            <Phone size={20} strokeWidth={1.75} className="hidden lg:block" />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
