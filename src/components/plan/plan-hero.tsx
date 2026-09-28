import Link from "next/link";
import { Phone } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";
import { SiteImage } from "@/components/site/site-image";
import type { PlanPageView } from "@/lib/plan-view";

/*
 * Hero photos are cropped clear of the heading, so the sharp photo only fills the right-hand side.
 * Under the heading a blurred copy of the same file (one download) runs full width behind the navy
 * shade, and the sharp photo fades into it. The shade holds far enough out for the heading to stay
 * readable on a narrow desktop. Phones use the same layers at a smaller scale, under a lighter shade.
 */
const SHADE =
  "linear-gradient(90deg,rgba(9,50,84,.93) 0,rgba(9,50,84,.88) max(560px,calc(100% - 800px)),rgba(9,50,84,.55) max(700px,calc(100% - 660px)),rgba(9,50,84,0) max(860px,calc(100% - 500px)))";
const PHONE_SHADE = "linear-gradient(90deg,rgba(9,50,84,.85) 0,rgba(9,50,84,.6) 45%,rgba(9,50,84,0) 75%)";
const SIZES = "(min-width: 1024px) 48vw, 100vw";

export function PlanHero({ view, startHref }: { view: PlanPageView; startHref: string }) {
  return (
    <section className="relative overflow-hidden bg-navy lg:h-[600px]">
      {view.heroImage.url ? (
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <SiteImage slot={{ ...view.heroImage, alt: "" }} sizes={SIZES} className="scale-110 blur-xl" />
        </div>
      ) : null}
      <div className="absolute inset-y-0 -right-[10%] w-[70%] [mask-image:linear-gradient(90deg,transparent,#000_80px)] sm:right-0 sm:w-[55%] lg:w-[max(684px,47.5%)] lg:[mask-image:linear-gradient(90deg,transparent,#000_160px)]">
        <SiteImage slot={view.heroImage} priority sizes={SIZES} className="object-[right_top] lg:object-[right_center]" />
      </div>
      <div aria-hidden className="absolute inset-0 lg:hidden" style={{ background: PHONE_SHADE }} />
      <div aria-hidden className="absolute inset-0 hidden lg:block" style={{ background: SHADE }} />

      <div className="relative mx-auto flex h-full min-h-[240px] max-w-[1440px] sm:min-h-[360px] flex-col justify-center px-4 pb-[22px] pt-[39px] sm:px-6 lg:px-[89px] lg:py-0">
        <p className="mb-4 w-fit rounded-full border border-navy bg-white px-3 py-px text-xs font-medium uppercase leading-[17px] tracking-[0.5px] text-navy lg:mb-0 lg:px-[18px] lg:py-1 lg:text-[15px] lg:font-semibold lg:leading-[21px] lg:tracking-[1.5px]">
          {view.name} plan
        </p>
        <h1 className="mt-auto text-[27px] font-bold leading-[29px] tracking-[-0.5px] text-white lg:mt-4 lg:text-[58px] lg:leading-[64px]">
          {view.headline}
          {view.highlight ? (
            <>
              <br />
              <span className="text-sun">{view.highlight}</span>
            </>
          ) : null}
        </h1>

        {view.figures.length ? (
          <dl className="mt-3.5 hidden gap-3 lg:flex">
            {view.figures.map((f, i) => (
              <div
                key={i}
                className="h-[71px] w-[199px] rounded-[10px] border border-white/30 bg-white/10 px-3 py-2.5 backdrop-blur-[2px]"
              >
                <dt className="text-[13px] font-medium uppercase leading-4 tracking-[1px] text-white/85">{f.label}</dt>
                <dd className="flex items-baseline gap-x-1 text-white">
                  <span className="text-2xl font-bold leading-8">{f.value}</span>
                  {f.suffix ? <span className="text-xs leading-4">{f.suffix}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {view.tags.length ? (
          <ul className="mt-[13px] hidden flex-wrap gap-2 lg:flex">
            {view.tags.map((tag, i) => (
              <li
                key={i}
                className="rounded-full bg-brand px-3 py-1.5 text-[13px] font-bold uppercase leading-4 tracking-[1px] text-white"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-2.5 flex gap-2 lg:mt-3 lg:gap-3">
          <Link
            href={startHref}
            className="flex h-11 w-[125px] items-center justify-center rounded-full bg-sun text-[15px] font-semibold text-navy transition hover:brightness-95 lg:h-14 lg:w-[272px] lg:text-xl lg:font-medium"
          >
            Get started
          </Link>
          <a
            href={PHONE_HREF}
            className="flex h-11 w-[124px] items-center justify-center gap-2 rounded-full border-2 border-white text-[15px] text-white transition hover:bg-white/10 lg:h-14 lg:w-[164px] lg:gap-2.5 lg:text-lg lg:font-medium"
          >
            <Phone size={20} strokeWidth={1.75} />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
