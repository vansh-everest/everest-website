import { homeCopy } from "@/content/home-copy";
import type { SiteContent } from "@/lib/content";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { carCard } from "@/lib/plan-view";
import { CarGrid } from "./car-grid";

export function CarShowcase({ content, locale = DEFAULT_LOCALE }: { content: SiteContent; locale?: Locale }) {
  const copy = homeCopy(locale).cars;
  const cars = content.cars.filter((c) => c.visible).map((car) => carCard(content, car));
  return (
    <section id="fleet" className="relative scroll-mt-20 bg-white px-6 pb-5 pt-[35px] sm:bg-mist sm:pb-16 sm:pt-16 lg:pb-[58px] lg:pt-[89px]">
      <div className="text-center">
        <h2 className="text-[29px] font-bold leading-tight tracking-[-0.5px] text-navy sm:text-[34px] lg:text-[64px] lg:leading-[72px]">
          {copy.title}
        </h2>
        <p className="mt-2 text-xs text-ink-soft sm:text-base sm:text-ink-soft/70 lg:mt-0">{copy.subtitle}</p>
      </div>
      <CarGrid cars={cars} locale={locale} />
    </section>
  );
}
