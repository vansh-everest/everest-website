import { homeCopy } from "@/content/home-copy";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

export function Hero({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = homeCopy(locale).hero;
  return (
    // On desktop the photo takes what is left of the first screen once the header and the headline
    // band are counted, so the headline and Join As Driver sit above the fold on any laptop; never
    // taller than its designed 1440:654, never shorter than 320px.
    <section
      className={`relative aspect-[412/300] overflow-clip bg-navy sm:aspect-[1440/654] lg:aspect-auto ${
        // Tamil's headline takes two lines, 40px more than one.
        locale === "ta" ? "lg:h-[clamp(320px,calc(100svh_-_430px),45.42vw)]" : "lg:h-[clamp(320px,calc(100svh_-_390px),45.42vw)]"
      }`}
    >
      {/* One photo serves both frames. Phones crop it to the car; from sm up it runs the full
          width and sits 16% above the frame, where the Figma frame places it. */}
      <div className="fx-scroll-exit absolute inset-0 sm:inset-auto sm:left-0 sm:top-[-16.13%] sm:h-[116.13%] sm:w-full lg:top-0 lg:h-full">
        {/* Static files, not the image optimiser: a cold optimiser left the frame blank for seconds
            while it upscaled this 2880px photo to 3840. Phones get a 1280px copy. */}
        <picture>
          <source media="(min-width: 640px)" srcSet="/figma/home/hero.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/hero-1280.webp"
            alt={copy.alt}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[42%_100%] sm:object-center lg:object-[50%_45%]"
          />
        </picture>
      </div>
      <p className="fx-blur-in absolute left-[13px] top-[14px] rounded-full bg-sun py-[4.5px] pl-1.5 pr-2 text-[11px] font-bold uppercase leading-4 tracking-[1.26px] text-navy sm:left-[35px] sm:top-[68px] sm:py-[11px] sm:pl-[13px] sm:pr-4">
        <span aria-hidden>⭐</span> {copy.badge}
      </p>
    </section>
  );
}
