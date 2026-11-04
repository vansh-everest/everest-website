import Image, { getImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { OfficeIcon, focusRing } from "./ui";

const ALT = "White Everest cabs lined up outside an office tower at sunset, with staff walking to work";

const STATS = [
  { value: COMPANY.vehicles, label: "Vehicles" },
  { value: "100%", label: "Compliant" },
  { value: String(COMPANY.founded), label: "In business since" },
];

const LOGOS = [
  { src: "/figma/b2b/logos/tcs.webp", name: "Tata Consultancy Services", w: 120, h: 35, phone: 97 },
  { src: "/figma/mobility/logos/bny.webp", name: "BNY", w: 82, h: 22, phone: 82 },
  { src: "/figma/b2b/logos/sutherland.webp", name: "Sutherland", w: 141, h: 53, phone: 113 },
  { src: "/figma/b2b/logos/bank-of-america.webp", name: "Bank of America", w: 108, h: 60, phone: 86 },
];

/** The office photo over the navy band: title, wave and the button down to the form. */
export function MobilityHero() {
  const common = { alt: ALT, sizes: "100vw" };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: "/figma/mobility/hero.webp", width: 2880, height: 1000 });
  const {
    props: { srcSet: tight, ...img },
  } = getImageProps({ ...common, src: "/figma/mobility/hero-phone.webp", width: 750, height: 480, loading: "eager", fetchPriority: "high" });
  return (
    <section>
      <picture className="relative block aspect-[375/240] overflow-hidden bg-navy sm:aspect-[1440/500] sm:max-h-[640px] sm:w-full">
        <source media="(min-width: 640px)" srcSet={wide} />
        <source srcSet={tight} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...img} className="absolute inset-0 size-full object-cover" />
      </picture>
      <div className="relative isolate overflow-hidden bg-navy px-4 pb-10 pt-9 lg:h-[380px] lg:px-6 lg:pb-0 lg:pt-[35px]">
        {/* The same wave as the home band; a phone sees only its middle, at the export's scale. */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-10 ml-[-604px] h-[400px] w-[1256px] lg:inset-x-0 lg:top-[-40px] lg:ml-0 lg:h-[460px] lg:w-full">
          <Image src="/figma/wave.svg" alt="" fill loading="eager" className="object-fill" />
        </div>
        <h1 className="text-center text-[clamp(30px,9.6vw,36px)] font-bold leading-10 tracking-[-0.3px] text-white sm:text-[52px] lg:text-[76px] lg:leading-[104px] lg:tracking-[-1.5px] xl:text-[96px]">
          Everest <br className="sm:hidden" />
          Employee Mobility
        </h1>
        <a
          href="#enquire"
          className={`mx-auto mt-[35px] flex h-[72px] max-w-[375px] items-center gap-3.5 rounded-[20px] bg-white pl-3 pr-4 transition hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] lg:mt-[64px] lg:h-20 lg:w-[340px] lg:gap-4 ${focusRing} focus-visible:outline-sun`}
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#eaf4fc] text-brand lg:size-14">
            <OfficeIcon className="size-6 lg:size-7" />
          </span>
          <span className="min-w-0">
            <span className="block text-[17px] font-semibold leading-6 text-navy lg:text-lg">Plan your team’s commute</span>
            <span className="mt-0.5 flex items-center gap-2 text-[15px] font-semibold leading-5 text-brand lg:mt-0">
              Get a quote
              <ArrowRight aria-hidden size={16} strokeWidth={2.25} />
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}

/** The figures card, half on the navy band. */
export function Stats() {
  return (
    <section aria-label="Everest in figures" className="relative bg-white px-4 lg:px-6">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[42px] bg-navy lg:h-[60px]" />
      <div className="relative mx-auto max-w-[1104px] rounded-[20px] bg-white px-5 pb-[18px] pt-3.5 shadow-[0_8px_24px_rgba(6,47,80,0.1)] lg:flex lg:h-[120px] lg:items-center lg:rounded-3xl lg:bg-[#f6f9fc] lg:px-10 lg:py-0 lg:shadow-[0_16px_40px_rgba(6,47,80,0.1)]">
        <div className="flex items-center justify-between border-b border-line pb-2 lg:block lg:h-[60px] lg:w-[191px] lg:shrink-0 lg:border-b-0 lg:border-r lg:pb-0">
          <p className="text-[15px] font-medium leading-5 text-ink-soft lg:text-sm lg:leading-5">Backed by</p>
          <Image src="/figma/logo.png" alt="Everest" width={84} height={48} className="-mr-1 h-11 w-auto lg:-ml-2.5 lg:-mt-0.5 lg:h-[50px]" />
        </div>
        <ul className="mt-3.5 grid grid-cols-3 gap-3 lg:mt-0 lg:flex lg:flex-1 lg:justify-between lg:pl-[72px]">
          {STATS.map((stat) => (
            <li key={stat.label} className="lg:pt-[5px]">
              <p className="text-[15px] font-bold leading-6 text-navy lg:text-[36px] lg:leading-10 lg:tracking-[-0.3px]">{stat.value}</p>
              <p className="text-xs leading-[15px] text-ink-soft lg:mt-[5px] lg:text-[15px] lg:leading-5">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "Trusted by teams at": bare logos in a row on a desktop, carded two by two on a phone. */
export function Trusted() {
  return (
    <section className="bg-white px-4 pb-8 pt-8 lg:border-b lg:border-line lg:px-6 lg:pb-[33px] lg:pt-[74px]">
      <div className="mx-auto max-w-[1104px] lg:flex lg:items-center lg:gap-[111px]">
        <p className="shrink-0 text-center text-base font-semibold leading-6 text-ink-soft lg:text-left">Trusted by teams at</p>
        <ul className="mt-3 grid grid-cols-2 gap-2.5 lg:mt-0 lg:flex lg:flex-1 lg:items-center lg:justify-between lg:gap-0 lg:pr-[18px]">
          {LOGOS.map((logo) => (
            <li key={logo.name} className="grid h-[72px] place-items-center rounded-2xl border border-line bg-white lg:h-auto lg:rounded-none lg:border-0 lg:bg-transparent">
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.w}
                height={logo.h}
                className="h-auto w-[var(--phone)] lg:w-[var(--desk)]"
                style={{ "--phone": `${logo.phone}px`, "--desk": `${logo.w}px` } as React.CSSProperties}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
