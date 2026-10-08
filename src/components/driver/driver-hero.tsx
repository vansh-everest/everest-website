import type { ReactNode } from "react";
import { SiteImage } from "@/components/site/site-image";
import type { ImageSlot } from "@/lib/content";

/*
 * The plan pages' hero (PlanHero), for the driver pages.
 * Desktop: the sharp photo fills the right-hand side and fades into a blurred copy of itself (one
 * download) that runs behind the navy shade, so the heading always sits on navy.
 * Phone: one navy column, with the photo as a card under the copy.
 */
const SHADE =
  "linear-gradient(90deg,rgba(9,50,84,.95) 0,rgba(9,50,84,.9) max(560px,calc(100% - 800px)),rgba(9,50,84,.55) max(700px,calc(100% - 660px)),rgba(9,50,84,0) max(860px,calc(100% - 500px)))";

/** Shown until a photo is uploaded for the page's slot in the admin. */
const FALLBACK: ImageSlot = {
  label: "Drive with us, hero image",
  url: "/figma/hero-revenue-share.webp",
  alt: "An Everest driver leaning on his car with the city skyline behind him",
};

export function DriverHero({
  photo,
  top,
  chip,
  title,
  intro,
  figure,
  actions,
}: {
  photo?: ImageSlot;
  /** The language switch, above everything else. */
  top: ReactNode;
  chip: ReactNode;
  title: ReactNode;
  intro: string;
  figure?: { label: string; value: string };
  actions: ReactNode;
}) {
  const slot = photo?.url ? photo : { ...FALLBACK, label: photo?.label ?? FALLBACK.label };
  return (
    <section className="relative isolate overflow-clip bg-navy">
      <div aria-hidden className="absolute inset-0 -z-10 hidden overflow-hidden lg:block">
        <SiteImage slot={{ ...slot, alt: "" }} sizes="48vw" className="scale-110 blur-xl" />
      </div>
      <div className="fx-scroll-exit absolute inset-y-0 right-0 -z-10 hidden w-[max(684px,47.5%)] [mask-image:linear-gradient(90deg,transparent,#000_160px)] lg:block">
        <SiteImage slot={slot} priority sizes="48vw" className="object-[70%_center]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 hidden lg:block" style={{ background: SHADE }} />

      <div className="mx-auto flex max-w-[600px] flex-col px-4 pb-10 pt-6 sm:px-6 lg:min-h-[600px] lg:max-w-[1440px] lg:justify-center lg:px-[89px] lg:py-16">
        {top}
        <div className="mt-6 lg:mt-8">{chip}</div>
        <h1 className="mt-3 max-w-[640px] text-[34px] font-bold leading-[42px] tracking-[-0.6px] text-white lg:mt-4 lg:text-[54px] lg:leading-[62px] lg:tracking-[-0.5px]">
          {title}
        </h1>
        <p className="mt-3 max-w-[560px] text-[15px] leading-6 text-white/85 lg:mt-4 lg:text-lg lg:leading-7">{intro}</p>

        <div className="relative mt-6 aspect-[380/220] overflow-hidden rounded-2xl bg-white/10 lg:hidden">
          <SiteImage slot={slot} priority sizes="(min-width: 640px) 600px, 100vw" className="object-[65%_center]" />
        </div>

        {figure ? (
          <dl className="mt-5 w-fit rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 backdrop-blur-[2px] lg:mt-6">
            <dt className="text-[11px] font-semibold uppercase leading-4 tracking-[0.8px] text-white/85 lg:text-[13px]">{figure.label}</dt>
            <dd className="text-2xl font-bold leading-8 text-white">{figure.value}</dd>
          </dl>
        ) : null}

        <div className="mt-6 lg:mt-8">{actions}</div>
      </div>
    </section>
  );
}
