import { homeCopy } from "@/content/home-copy";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

export function Hero({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = homeCopy(locale).hero;
  return (
    <section className="relative aspect-[412/300] overflow-clip bg-navy sm:aspect-[1440/654]">
      {/* One photo serves both frames. Phones crop it to the car; from sm up it runs the full
          width and sits 16% above the frame, where the Figma frame places it. */}
      <div className="fx-scroll-exit absolute inset-0 sm:inset-auto sm:left-0 sm:top-[-16.13%] sm:h-[116.13%] sm:w-full">
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
            className="absolute inset-0 size-full object-cover object-[42%_100%] sm:object-center"
          />
        </picture>
      </div>
      <p className="fx-blur-in absolute left-[13px] top-[14px] rounded-full bg-sun py-[4.5px] pl-1.5 pr-2 text-[11px] font-bold uppercase leading-4 tracking-[1.26px] text-navy sm:left-[35px] sm:top-[68px] sm:py-[11px] sm:pl-[13px] sm:pr-4">
        <span aria-hidden>⭐</span> {copy.badge}
      </p>
    </section>
  );
}
