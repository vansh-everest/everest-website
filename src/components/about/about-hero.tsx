import Image from "next/image";

export function AboutHero() {
  return (
    <section className="relative h-[360px] overflow-hidden sm:h-[480px] lg:h-[605px]">
      <Image
        src="/figma/about-hero.webp"
        alt="Everest Fleet cars lined up in a sunlit showroom"
        fill
        preload
        loading="eager"
        sizes="100vw"
        className="object-cover"
      />
      <h1 className="absolute inset-x-0 top-10 px-4 text-center text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy [text-shadow:0_0_24px_rgba(255,255,255,0.9)] sm:text-5xl lg:top-[78px] lg:text-[64px] lg:leading-[70px]">
        Driving India Forward,
        <br />
        <span className="text-brand">One Driver at a Time</span>
      </h1>
    </section>
  );
}
