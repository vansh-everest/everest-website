import { getImageProps } from "next/image";

const ALT = "Rows of Everest Fleet cars parked under an evening sky";

export function ServicesHero() {
  // Phones get their own, closer framing of the same photo.
  const common = { alt: ALT, sizes: "100vw", loading: "eager" as const, fetchPriority: "high" as const };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: "/figma/services/hero.webp", width: 2880, height: 1200 });
  const {
    props: { srcSet: narrow, src, ...img },
  } = getImageProps({ ...common, src: "/figma/services/hero-phone.webp", width: 824, height: 476 });

  return (
    <section className="relative isolate h-[238px] overflow-hidden bg-navy sm:h-[420px] lg:h-[600px]">
      <picture>
        <source media="(min-width: 640px)" srcSet={wide} />
        <img {...img} src={src} srcSet={narrow} alt={ALT} className="absolute inset-0 -z-10 size-full object-cover" />
      </picture>
      <h1 className="absolute inset-x-4 bottom-[18px] text-[26px] font-bold leading-8 tracking-[-0.3px] text-white sm:inset-x-6 sm:bottom-8 sm:text-[44px] sm:leading-[52px] lg:bottom-[43px] lg:left-[60px] lg:right-10 lg:text-[64px] lg:leading-[72px] lg:tracking-[-0.25px]">
        We Move More Than People
      </h1>
    </section>
  );
}
