import { getImageProps } from "next/image";
import { ESG_REPORT_URL, HERO_STATS } from "./data";

/**
 * Phones: the photo, then the copy on navy. From lg: the copy sits over a wider crop of the
 * same photo, tinted navy from the left so the white text reads.
 */
export function InvestorHero() {
  const stats = HERO_STATS.filter((s) => s.value);
  const common = { alt: "Rows of white Everest cars parked in front of a city skyline", sizes: "100vw" };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: "/figma/investors/hero-wide.webp", width: 2880, height: 1200 });
  const {
    props: { srcSet: tight, ...img },
  } = getImageProps({ ...common, src: "/figma/investors/hero.webp", width: 1648, height: 884, loading: "eager", fetchPriority: "high" });
  return (
    <section className="relative bg-navy lg:h-[600px] lg:bg-transparent">
      <picture className="relative block aspect-[412/222] sm:aspect-[16/7] lg:absolute lg:inset-0 lg:aspect-auto">
        <source media="(min-width: 1024px)" srcSet={wide} />
        <source srcSet={tight} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...img} className="absolute inset-0 size-full object-cover" />
        <span
          aria-hidden
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(6,47,80,0.93)_0px,rgba(6,47,80,0.88)_480px,rgba(6,47,80,0.76)_650px,rgba(6,47,80,0.5)_765px,rgba(6,47,80,0.28)_890px,rgba(6,47,80,0.12)_1065px,rgba(6,47,80,0)_1270px)] lg:block"
        />
      </picture>

      <div className="relative px-4 pb-10 pt-3 sm:px-6 lg:flex lg:h-full lg:items-center lg:px-[42px] lg:py-0">
        <div className="mx-auto max-w-[1356px] lg:mx-0 lg:w-full">
          <p className="flex items-center gap-3 text-[13px] font-bold uppercase leading-4 tracking-[1.5px] text-sun lg:inline-flex lg:h-[33px] lg:rounded-full lg:bg-white lg:px-5 lg:text-navy">
            <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun lg:hidden" />
            For investors
          </p>
          <h1 className="mt-[22px] max-w-[760px] text-[30px] font-bold leading-[38px] tracking-[-0.3px] text-white lg:mt-[17px] lg:text-[64px] lg:leading-[74px] lg:tracking-[-0.5px]">
            India&rsquo;s Largest Fleet Management Company
          </h1>
          <p className="mt-3 text-[15px] leading-[22px] text-white/85 lg:mt-[17px] lg:text-xl lg:leading-7 lg:text-white/90">
            We give drivers a car, steady work on Uber and a path to own it.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-0.5 border-t border-white/15 pt-1 lg:mt-[14px] lg:flex lg:gap-0 lg:border-0 lg:pt-0">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col-reverse lg:border-l lg:border-white/25 lg:px-7 lg:first:border-l-0 lg:first:pl-0"
              >
                <dt className="text-xs leading-4 text-white/75 lg:mt-0.5 lg:text-[15px] lg:leading-[18px]">{s.label}</dt>
                <dd className="text-[22px] font-bold leading-[27px] text-white lg:text-[32px] lg:leading-[34px] lg:tracking-[-0.3px]">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid gap-3 lg:mt-[13px] lg:flex lg:gap-3">
            <a
              href="#contact"
              className="flex h-14 items-center justify-center rounded-full bg-sun px-8 text-[17px] font-medium tracking-[0.2px] text-navy transition hover:brightness-95 lg:w-[391px] lg:text-xl"
            >
              Contact investor relations
            </a>
            {ESG_REPORT_URL ? (
              <a
                href={ESG_REPORT_URL}
                className="flex h-14 items-center justify-center rounded-full border-2 border-white px-8 text-[17px] font-medium tracking-[0.2px] text-white transition hover:bg-white/10 lg:text-lg"
              >
                Download ESG report
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
