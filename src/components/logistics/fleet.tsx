import { Truck } from "lucide-react";
import { FLEET, GREEN_FLEET } from "./data";
import { Heading, Wrap } from "./ui";

const TONES = {
  navy: { card: "bg-navy text-white", tile: "lg:bg-white/15", range: "text-white/85", pill: "bg-white/15", track: "bg-white/15", fill: "bg-white" },
  brand: { card: "bg-brand text-white", tile: "lg:bg-white/20", range: "text-white/85", pill: "bg-white/20", track: "bg-white/25", fill: "bg-white" },
  sun: { card: "bg-sun text-navy", tile: "lg:bg-navy/10", range: "text-navy/80", pill: "bg-navy/10", track: "bg-navy/10", fill: "bg-navy" },
};

/** The thermometer on each card: a track, a fill to the band's level, and the bulb. */
function Gauge({ level, track, fill }: { level: number; track: string; fill: string }) {
  return (
    <div aria-hidden className="absolute bottom-5 right-5 top-5 w-[20px] lg:bottom-7 lg:right-7 lg:top-7 lg:w-6">
      <div className={`absolute inset-y-0 left-1/2 w-2.5 -translate-x-1/2 rounded-full lg:w-3 ${track}`}>
        <div className={`absolute inset-x-0 bottom-0 rounded-full ${fill}`} style={{ height: `${level}%` }} />
      </div>
      <div className={`absolute inset-x-0 bottom-0 aspect-square rounded-full ${fill}`} />
    </div>
  );
}

export function FleetBands() {
  return (
    <section className="bg-[#f6f9fc] pb-12 pt-[47px] lg:pb-[96px] lg:pt-[97px]">
      <Wrap>
        <Heading title="Fleet & Temperature" sub="Freezer, chiller and ambient, in LCV and HCV." />
        <div className="mt-[31px] grid gap-3 lg:mt-[50px] lg:grid-cols-3 lg:gap-6">
          {FLEET.map(({ icon: Icon, name, range, size, tone, level }) => {
            const t = TONES[tone];
            return (
              <article key={name} className={`relative h-[160px] rounded-[20px] p-5 lg:h-[292px] lg:rounded-3xl lg:p-7 ${t.card}`}>
                <div className="flex items-center gap-2 lg:block">
                  <span className={`grid place-items-center lg:size-[52px] lg:rounded-2xl ${t.tile}`}>
                    <Icon aria-hidden strokeWidth={1.75} className="size-[22px] lg:size-6" />
                  </span>
                  <h3 className="text-2xl font-bold leading-8 lg:mt-[37px] lg:text-[32px] lg:leading-10">{name}</h3>
                </div>
                <p className={`mt-1 text-[15px] font-medium leading-6 lg:mt-1 lg:text-lg lg:font-semibold ${t.range}`}>{range}</p>
                <p className={`mt-3.5 inline-flex h-[29px] items-center gap-1.5 rounded-full px-[11px] text-[15px] font-semibold lg:mt-[29px] lg:h-[34px] lg:gap-2 lg:px-3.5 lg:text-base ${t.pill}`}>
                  <Truck aria-hidden size={17} strokeWidth={2} />
                  {size}
                </p>
                <Gauge level={level} track={t.track} fill={t.fill} />
              </article>
            );
          })}
        </div>
        <ul className="mt-5 grid justify-items-start gap-2 lg:hidden">
          {GREEN_FLEET.map(({ icon: Icon, label }) => (
            <li key={label} className="flex h-11 items-center gap-2.5 rounded-full border border-[#e4e9ef] bg-white pl-1.5 pr-4 text-[15px] font-semibold text-navy">
              <span className="grid size-[30px] place-items-center rounded-full bg-lime">
                <Icon aria-hidden size={16} strokeWidth={2} />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
