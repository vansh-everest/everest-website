import Image from "next/image";
import type { ReactNode } from "react";
import { HeroActions, HeroLabel, HeroTitle, type Action } from "./ui";

/**
 * The hero shared by the business pages.
 *
 * - `photo`: a full-bleed photograph on a desktop; a phone shows the same subject boxed under the title.
 * - `car`: the branded sedan on the navy studio gradient; a phone boxes it under the title.
 * - `brand-car`: the same sedan with the "your brand here" marker; a phone opens on the car band.
 */
export type HeroMedia =
  | { kind: "photo"; desktop: string; phone: string; alt: string }
  | { kind: "car" | "brand-car"; alt: string };

/* The studio backdrop behind the sedan, matched to the export's left half and its right edge. */
const STUDIO =
  "bg-[#062f50] lg:bg-[linear-gradient(90deg,#052b4a_0%,#062c4d_40%,#062d50_50%,#08355e_70%,#0a3c69_90%,#0b4070_100%)]";

export function B2BHero({
  label,
  title,
  primary,
  secondary,
  size = "lg",
  media,
  brandLabel = "Your brand here",
  compactTitle = false,
}: {
  label: string;
  title: ReactNode;
  primary: Action;
  secondary: Action & { phoneIcon?: boolean };
  size?: "lg" | "md";
  media: HeroMedia;
  brandLabel?: string;
  compactTitle?: boolean;
}) {
  const studio = media.kind !== "photo";
  return (
    <section className={`relative isolate overflow-hidden ${studio ? STUDIO : "bg-navy"} lg:h-[600px]`}>
      {media.kind === "photo" ? (
        <Image
          src={media.desktop}
          alt={media.alt}
          fill
          preload
          loading="eager"
          sizes="100vw"
          className="-z-10 hidden object-cover object-right lg:block"
        />
      ) : null}
      {/* Below 1440 the photo crops into the title, so a navy wash keeps the text readable. */}
      {media.kind === "photo" ? (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(6,47,80,0.85)_0%,rgba(6,47,80,0.55)_45%,rgba(6,47,80,0)_75%)] lg:block xl:hidden"
        />
      ) : (
        <div className="absolute right-0 top-1/2 -z-10 hidden aspect-[720/600] w-[44%] max-w-[720px] xl:w-1/2 -translate-y-1/2 [mask-image:linear-gradient(90deg,transparent_0%,#000_14%)] lg:block">
          <Image src="/figma/b2b/hero-car.webp" alt={media.alt} fill preload loading="eager" sizes="50vw" className="object-cover" />
          {media.kind === "brand-car" ? <BrandMarker label={brandLabel} at={DESKTOP_MARKER} /> : null}
        </div>
      )}

      {media.kind === "brand-car" ? (
        <div className="relative aspect-[412/251] bg-[#0a4070] lg:hidden">
          <Image src="/figma/b2b/ad-hero-phone.webp" alt={media.alt} fill preload loading="eager" sizes="100vw" className="object-cover" />
          <BrandMarker label={brandLabel} at={PHONE_MARKER} />
        </div>
      ) : null}

      <div
        className={`px-4 pb-[39px] lg:px-[42px] lg:pb-0 lg:pt-[238px] ${
          media.kind === "brand-car" ? "bg-[linear-gradient(180deg,#052543_0%,#021831_100%)] pt-2 lg:bg-none" : "pt-7"
        }`}
      >
        <div className={media.kind === "brand-car" ? "mb-3 lg:mb-0" : ""}>
          <HeroLabel>{label}</HeroLabel>
        </div>
        <HeroTitle compact={compactTitle}>{title}</HeroTitle>
        {media.kind === "photo" || media.kind === "car" ? (
          <div
            className={`relative mt-3 aspect-[380/220] overflow-hidden rounded-2xl sm:mx-auto sm:max-w-[560px] lg:hidden ${
              media.kind === "car" ? "bg-[#043b66]" : ""
            }`}
          >
            <Image
              src={media.kind === "photo" ? media.phone : "/figma/b2b/car-phone.webp"}
              alt={media.alt}
              fill
              preload
              loading="eager"
              sizes="(min-width: 640px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <HeroActions
          primary={primary}
          secondary={secondary}
          size={size}
          arrow={media.kind === "brand-car"}
          className={`${media.kind === "brand-car" ? "mt-6" : "mt-3"} lg:mt-[14px]`}
        />
      </div>
    </section>
  );
}

type MarkerAt = { x: string; pillTop: string; lineTop: string; lineHeight: string; pinTop: string; size: "lg" | "sm" };

/* Positions as fractions of each image, so the marker stays on the door as the image scales. */
const DESKTOP_MARKER: MarkerAt = { x: "68.4%", pillTop: "33%", lineTop: "38.5%", lineHeight: "21.5%", pinTop: "62%", size: "lg" };
const PHONE_MARKER: MarkerAt = { x: "65.9%", pillTop: "19.9%", lineTop: "30.7%", lineHeight: "29.9%", pinTop: "64.9%", size: "sm" };

function BrandMarker({ label, at }: { label: string; at: MarkerAt }) {
  const lg = at.size === "lg";
  return (
    <>
      <span
        className={`absolute -translate-x-1/2 whitespace-nowrap rounded-full bg-sun font-bold text-navy ${
          lg ? "px-4 text-[15px] leading-[33px]" : "px-3 text-[13px] leading-[27px]"
        }`}
        style={{ left: at.x, top: at.pillTop }}
      >
        {label}
      </span>
      <span aria-hidden className="absolute w-px -translate-x-1/2 bg-white" style={{ left: at.x, top: at.lineTop, height: at.lineHeight }} />
      <span
        aria-hidden
        className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/45 ${lg ? "size-7" : "size-[22px]"}`}
        style={{ left: at.x, top: at.pinTop }}
      >
        <span className={`rounded-full border-2 border-white bg-sun ${lg ? "size-3" : "size-2.5"}`} />
      </span>
    </>
  );
}
