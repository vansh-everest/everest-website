import Image from "next/image";

type Size = "lg" | "md" | "sm";

type Value = { name: string; line: string; img: string; alt: string; size: Size; layout: string; sizes: string };

// Three rows on desktop: wide + narrow, three equal, two equal. Flex basis rather than a grid
// because the first row's 728:440 split does not fall on any shared column count.
const ROW1 = "h-[340px] md:h-[400px] lg:h-[480px]";
const ROW2 = "h-[300px] md:h-[340px] lg:h-[380px]";
const ROW3 = "h-[300px] lg:h-[340px]";
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

const type: Record<Size, { pad: string; num: string; title: string; line: string }> = {
  lg: {
    pad: "p-6 md:p-10 lg:p-12",
    num: "text-[#ff5d2b]",
    title: "text-[30px] leading-[36px] lg:text-[40px] lg:leading-[48px]",
    line: "mt-2 text-base leading-6 lg:mt-3",
  },
  md: {
    pad: "p-6 lg:p-10",
    num: "text-white/60",
    title: "text-[26px] leading-[32px] lg:text-[28px] lg:leading-[34px]",
    line: "mt-2 text-sm leading-5",
  },
  sm: {
    pad: "p-6 lg:p-8",
    num: "text-white/60",
    title: "text-2xl leading-[30px]",
    line: "mt-2 text-[13px] leading-[18px]",
  },
};

export function Values() {
  return (
    <section className="bg-navy px-6 py-20 lg:px-10 lg:py-[120px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="lg:shrink-0">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase leading-5 tracking-[0.5px] text-sun">
              <span aria-hidden className="h-0.5 w-6 bg-sun" />
              What we stand for
            </p>
            <h2 className="mt-4 font-display text-[36px] font-bold leading-[42px] text-white lg:mt-[14px] lg:text-[56px] lg:leading-[62px]">
              The standards we live by
              <br className="hidden sm:block" /> on every single mile
            </h2>
          </div>
          <p className="max-w-[400px] text-[15px] leading-[26px] text-[#94a3b8] lg:-mb-1 lg:w-[400px]">
            Seven simple principles guiding our journey to move India&rsquo;s mobility forward. Honest, rigorous, and human.
          </p>
        </div>
        <ol className="mt-12 flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-8 lg:mt-[68px]">
          {values.map((value, i) => {
            const t = type[value.size];
            return (
              <li key={value.name} className={`relative isolate overflow-hidden rounded-3xl md:grow ${value.layout}`}>
                <Image
                  src={`/figma/about/value-${value.img}.webp`}
                  alt={value.alt}
                  fill
                  sizes={value.sizes}
                  className="-z-10 object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,47,80,0)_40%,rgba(6,47,80,0.6)_100%)] md:bg-[linear-gradient(180deg,rgba(6,47,80,0)_50%,rgba(6,47,80,0.35)_100%)]"
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
