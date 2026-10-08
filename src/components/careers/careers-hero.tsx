import Image from "next/image";

const ALT = "Four Everest Fleet colleagues standing together in the office";

/** Phones: heading on white above a framed photo. From lg up the photo runs edge to edge and fades into the navy band below. */
export function CareersHero() {
  return (
    <section className="relative bg-white px-4 pb-8 pt-9 lg:h-[582px] lg:overflow-hidden lg:p-0">
      <Image
        src="/figma/careers/hero.webp"
        alt={ALT}
        fill
        preload
        sizes="(min-width: 1024px) 100vw, 0px"
        className="hidden object-cover lg:block"
      />
      <h1 className="relative text-[34px] font-bold leading-10 tracking-[-0.2px] text-navy lg:absolute lg:inset-x-0 lg:top-[496px] lg:text-center lg:text-[62px] lg:capitalize lg:leading-[72px] lg:tracking-[-0.02em] lg:text-white">
        Build Your Career With Everest
      </h1>
      <div className="relative mt-3.5 aspect-[380/220] overflow-hidden rounded-2xl lg:hidden">
        <Image src="/figma/careers/hero-mobile.webp" alt={ALT} fill preload sizes="(min-width: 1024px) 0px, 100vw" className="object-cover" />
      </div>
    </section>
  );
}
