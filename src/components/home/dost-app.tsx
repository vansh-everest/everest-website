import Image from "next/image";
import Link from "next/link";
import { ArriveOnScroll } from "@/components/fx/arrive-on-scroll";
import { homeCopy } from "@/content/home-copy";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

/*
 * The photo band is drawn on the export frame (412 wide on phones, 1440 on desktop); --u is one
 * frame pixel, so the card and the phone render keep the frame's geometry at every width. The
 * band photos are the background alone; the card and phone are drawn here on top of them.
 *
 * The photo fades into the white page at its foot and, past 1440, at its sides (.dost-photo).
 * As the band scrolls in, the phone travels into place and the card follows once it lands.
 */
export function DostApp({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = homeCopy(locale).dost;
  return (
    <section id="dost" className="@container overflow-hidden">
      <div className="[--u:calc(100cqw/412)] lg:[--u:calc(min(100cqw,1440px)/1440)]">
        <div className="h-[calc(var(--u)*42)] bg-[linear-gradient(90deg,#062f50_0%,#054e84_100%)] pt-[calc(var(--u)*5.7)] lg:h-[calc(var(--u)*173)] lg:pt-[calc(var(--u)*45.7)]">
          <h2 className="text-center text-[length:calc(var(--u)*24)] font-bold leading-[calc(var(--u)*29)] tracking-[calc(var(--u)*0.35)] text-white lg:tracking-[calc(var(--u)*0.5)] lg:text-[length:calc(var(--u)*64)] lg:leading-[calc(var(--u)*77)]">
            {copy.before}
            <span className="text-sun">{copy.brand}</span>
            <span className="hidden lg:inline">{copy.after}</span>
          </h2>
        </div>

        <div className="dost-fill relative overflow-hidden">
          <ArriveOnScroll className="relative mx-auto aspect-[412/310] w-[calc(var(--u)*412)] lg:aspect-[1440/752] lg:w-[calc(var(--u)*1440)]">
            <div className="dost-photo absolute inset-0">
              <Image
                src="/figma/home/dost-band-mobile.webp"
                alt={copy.bandAlt}
                fill
                sizes="(min-width: 1024px) 0px, 100vw"
                className="object-cover lg:hidden"
              />
              <Image
                src="/figma/home/dost-band.webp"
                alt={copy.bandAlt}
                fill
                sizes="(min-width: 1024px) min(1440px, 100vw), 0px"
                className="hidden object-cover lg:block"
              />
            </div>

            <div className="dost-card absolute left-[calc(var(--u)*112)] top-[calc(var(--u)*79)] h-[calc(var(--u)*151)] w-[calc(var(--u)*184)] rounded-[calc(var(--u)*8)] bg-white pl-[calc(var(--u)*18.75)] pt-[calc(var(--u)*18.5)] text-navy lg:left-[calc(var(--u)*340)] lg:top-[calc(var(--u)*228)] lg:h-[calc(var(--u)*266)] lg:w-[calc(var(--u)*560)] lg:rounded-[calc(var(--u)*20)] lg:pl-[calc(var(--u)*35)] lg:pt-[calc(var(--u)*28)]">
              <h3 className="text-[length:calc(var(--u)*14.5)] font-bold leading-[calc(var(--u)*17)] lg:hidden">
                {copy.phoneTitle[0]}
                <br />
                {copy.phoneTitle[1]}
              </h3>
              <p className="text-[length:calc(var(--u)*13)] leading-[calc(var(--u)*15.25)] lg:hidden">
                {copy.phoneLines[0]}
                <br />
                {copy.phoneLines[1]}
                <br />
                {copy.phoneLines[2]}
              </p>
              <h3 className="hidden text-[length:calc(var(--u)*43)] font-bold leading-[calc(var(--u)*48)] lg:block">
                {copy.desktopTitle[0]}
                <br />
                {copy.desktopTitle[1]}
                <br />
                {copy.desktopTitle[2]}
              </h3>
              <Link
                href="/everest-dost/"
                className="mt-[calc(var(--u)*11.4)] flex h-[calc(var(--u)*30)] w-[calc(var(--u)*159)] items-center justify-center rounded-full border-[length:calc(var(--u)*2)] border-brand text-[length:calc(var(--u)*14)] tracking-[0.04em] text-brand transition hover:bg-brand/5 lg:-ml-[calc(var(--u)*1)] lg:mt-[calc(var(--u)*16.2)] lg:h-[calc(var(--u)*48)] lg:w-[calc(var(--u)*498)] lg:border-navy lg:text-[length:calc(var(--u)*16)] lg:font-medium lg:text-navy lg:hover:bg-navy/5"
              >
                {copy.cta}
              </Link>
            </div>

            <div className="dost-phone absolute left-[calc(var(--u)*9.5)] top-[calc(var(--u)*37)] h-[calc(var(--u)*229.5)] w-[calc(var(--u)*110.75)] drop-shadow-[0_calc(var(--u)*8)_calc(var(--u)*12)_rgba(6,47,80,0.4)] lg:left-[calc(var(--u)*72.75)] lg:top-[calc(var(--u)*39.5)] lg:h-[calc(var(--u)*598)] lg:w-[calc(var(--u)*289.5)] lg:drop-shadow-[0_calc(var(--u)*20)_calc(var(--u)*32)_rgba(6,47,80,0.4)]">
              <Image
                src="/figma/home/dost-phone.webp"
                alt={copy.phoneAlt}
                fill
                sizes="(min-width: 1024px) min(290px, 21vw), 27vw"
              />
            </div>
          </ArriveOnScroll>
        </div>
      </div>
    </section>
  );
}
