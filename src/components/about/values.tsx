import Image from "next/image";

type Size = "lg" | "md" | "sm";

type Value = { name: string; line: string; img: string; alt: string; size: Size; layout: string; sizes: string };

// Phones stack every card at one size. Three rows on desktop: wide + narrow, three equal, two equal.
// Flex basis rather than a grid because the first row's 728:440 split does not fall on any shared column count.
const ROW1 = "h-[280px] md:h-[400px] lg:h-[480px]";
const ROW2 = "h-[280px] md:h-[340px] lg:h-[380px]";
const ROW3 = "h-[280px] md:h-[300px] lg:h-[340px]";
const THIRD = "md:basis-[calc((100%_-_4rem_-_1px)_/_3)]";
const HALF = "md:basis-[calc((100%_-_2rem_-_1px)_/_2)]";

const values: Value[] = [
  {
    name: "Entrepreneurial",
    line: "Boldly pushing limits, creating real impact",
    img: "entrepreneurial",
    alt: "Passenger looking out of the window from the back seat of a car",
    size: "lg",
    layout: `${ROW1} md:basis-[calc((100%_-_2rem_-_1px)_*_0.6233)]`,
    sizes: "(min-width: 1280px) 728px, (min-width: 768px) 62vw, 100vw",
  },
  {
    name: "Vigilant",
    line: "Safety-first for every journey",
    img: "vigilant",
    alt: "Driver with both hands on the wheel on a city street at night",
    size: "md",
    layout: `${ROW1} md:basis-[calc((100%_-_2rem_-_1px)_*_0.3767)]`,
    sizes: "(min-width: 1280px) 440px, (min-width: 768px) 38vw, 100vw",
  },
  {
    name: "Empowering",
    line: "Enabling drivers, teams & clients to thrive",
    img: "empowering",
    alt: "Car keys being handed over outside a showroom",
    size: "sm",
    layout: `${ROW2} ${THIRD}`,
    sizes: "(min-width: 1280px) 380px, (min-width: 768px) 33vw, 100vw",
  },
  {
    name: "Rigorous",
    line: "Relentless pursuit of excellence",
    img: "rigorous",
    alt: "Vehicle telemetry on a dashboard screen",
    size: "sm",
    layout: `${ROW2} ${THIRD}`,
    sizes: "(min-width: 1280px) 380px, (min-width: 768px) 33vw, 100vw",
  },
  {
    name: "Empathetic",
    line: "Solving for what truly matters",
    img: "empathetic",
    alt: "Driver helping an elderly passenger into a car",
    size: "sm",
    layout: `${ROW2} ${THIRD}`,
    sizes: "(min-width: 1280px) 380px, (min-width: 768px) 33vw, 100vw",
  },
  {
    name: "Sharing",
    line: "Collaborating for the greater good",
    img: "sharing",
    alt: "Team working together around a meeting table",
    size: "md",
    layout: `${ROW3} ${HALF}`,
    sizes: "(min-width: 1280px) 584px, (min-width: 768px) 50vw, 100vw",
  },
  {
    name: "Trust",
    line: "Ethical, honest, and dependable",
    img: "trust",
    alt: "Two men shaking hands in front of a lot of parked cars",
    size: "md",
    layout: `${ROW3} ${HALF}`,
    sizes: "(min-width: 1280px) 584px, (min-width: 768px) 50vw, 100vw",
  },
];

// The unprefixed classes are the phone card, the same for every size; md: and up restore the desktop scale.
const type: Record<Size, { pad: string; num: string; title: string; line: string }> = {
  lg: {
    pad: "p-6 md:p-10 lg:p-12",
    num: "text-[#ff5d2b]",
    title: "text-[22px] leading-7 md:text-[30px] md:leading-[36px] lg:text-[40px] lg:leading-[48px]",
    line: "mt-1 text-sm leading-5 md:mt-2 md:text-base md:leading-6 lg:mt-3",
  },
  md: {
    pad: "p-6 lg:p-10",
    num: "text-[#ff5d2b] md:text-white/60",
    title: "text-[22px] leading-7 md:text-[26px] md:leading-[32px] lg:text-[28px] lg:leading-[34px]",
    line: "mt-1 text-sm leading-5 md:mt-2",
  },
  sm: {
    pad: "p-6 lg:p-8",
    num: "text-[#ff5d2b] md:text-white/60",
    title: "text-[22px] leading-7 md:text-2xl md:leading-[30px]",
    line: "mt-1 text-sm leading-5 md:mt-2 md:text-[13px] md:leading-[18px]",
  },
};

export function Values() {
  return (
    <section className="bg-navy px-4 pb-14 pt-[53px] sm:px-6 sm:py-20 lg:px-10 lg:py-[120px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase leading-5 tracking-[0.5px] text-sun sm:text-sm">
            <span aria-hidden className="h-0.5 w-6 bg-sun" />
            What we stand for
          </p>
          <h2 className="mt-2 text-wrap font-sans text-[26px] font-bold leading-[32px] text-white sm:mt-4 sm:text-balance sm:font-display sm:text-[40px] sm:leading-[48px] lg:mt-[14px] lg:text-[54px] lg:leading-[62px]">
            The standards we live by on every single mile
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-sm leading-[17px] text-[#9aa8bd] sm:mt-4 sm:text-[15px] sm:leading-[26px] sm:text-[#94a3b8] lg:mt-6">
            Seven principles guiding our journey to move India&rsquo;s mobility forward.
          </p>
        </div>
        <ol className="mt-9 grid gap-5 md:mt-12 md:flex md:flex-row md:flex-wrap md:gap-8 lg:mt-[68px]">
          {values.map((value, i) => {
            const t = type[value.size];
            return (
              <li
                key={value.name}
                className={`relative isolate overflow-hidden rounded-2xl border border-white/15 md:grow md:rounded-3xl md:border-0 ${value.layout}`}
              >
                <Image
                  src={`/figma/about/value-${value.img}.webp`}
                  alt={value.alt}
                  fill
                  sizes={value.sizes}
                  className="-z-10 object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-[rgba(8,23,38,0.68)] md:bg-transparent md:bg-[linear-gradient(180deg,rgba(6,47,80,0)_50%,rgba(6,47,80,0.35)_100%)]"
                />
                <div className={`flex h-full flex-col justify-between ${t.pad}`}>
                  <span className={`text-sm font-medium leading-5 ${t.num}`}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className={`font-display font-bold text-white ${t.title}`}>{value.name}</h3>
                    <p className={`text-slate-200 ${t.line}`}>{value.line}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
