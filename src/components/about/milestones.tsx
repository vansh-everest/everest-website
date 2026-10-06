import Image from "next/image";
import { MapPin } from "lucide-react";

const milestones = [
  { year: "2016", title: "Founded in Mumbai", body: "10 cars and a vision to professionalize ride-hailing.", badge: "10 Cars" },
  { year: "2018", title: "1,000 Vehicles & Delhi", body: "Crossed 1,000 vehicles and expanded operations to Delhi NCR.", badge: "1,000+ Vehicles" },
  { year: "2020", title: "Pandemic Pivot", body: "Launched India's first structured driver welfare program." },
  { year: "2022", title: "10,000 Vehicles & Series B", body: "10,000 vehicles on platform and Series B funding secured.", badge: "Series B" },
  { year: "2024", title: "#1 EV Fleet, Uber India", body: "Became Uber India's largest electric vehicle fleet partner.", badge: "#1 EV" },
  { year: "2025", title: "6 Cities, 25,000+ Drivers", body: "Expanded to 6 major cities with 25,000+ driver-partners and counting.", badge: "25,000+" },
];

export function Milestones() {
  return (
    <section className="relative bg-blue-gradient pb-[52px] pt-[15px] lg:aspect-[1440/1367] lg:pb-0 lg:pt-20">
      {/* Desktop shows the road illustration, milestone cards included; the list below carries the text. */}
      <Image
        src="/figma/about/journey-road.webp"
        alt=""
        fill
        sizes="100vw"
        className="hidden object-cover lg:block"
      />
      <p className="relative flex items-center justify-center gap-2.5 text-[13px] font-semibold uppercase leading-4 tracking-[1px] text-sun lg:hidden">
        <span aria-hidden className="h-0.5 w-[18px] bg-sun" />
        Our milestones
        <span aria-hidden className="h-0.5 w-[18px] bg-sun" />
      </p>
      <h2 className="relative mt-[14px] px-6 text-center text-[34px] font-extrabold leading-[40px] text-white lg:mt-0 lg:text-[64px] lg:leading-[70px] lg:tracking-[-0.5px]">
        Our Journey So Far
      </h2>
      {/* Narrow screens: a pin, a year pill and a card per milestone, joined by a small road down the left. */}
      <ol className="relative mx-auto mt-[45px] max-w-md space-y-[33px] pl-6 pr-4 lg:sr-only">
        {milestones.map((m, i) => (
          <li key={m.year} className="relative pl-16">
            <span
              aria-hidden
              className="absolute left-0 top-[-3px] z-10 grid size-10 place-items-center rounded-full bg-[#d33f27] text-white shadow-[0_0_0_3px_rgba(240,128,105,0.8),0_4px_12px_rgba(0,0,0,0.25)]"
            >
              <MapPin className="size-[18px]" strokeWidth={2} />
            </span>
            {i < milestones.length - 1 && (
              <span
                aria-hidden
                className="absolute -bottom-[30px] left-4 top-[37px] w-2 border-x-2 border-dashed border-sun bg-[#1f2b39]"
              />
            )}
            <p className="w-fit rounded-full bg-[#d33f27] px-4 text-lg font-extrabold leading-[34px] text-white">{m.year}</p>
            <div className="mt-3 rounded-[14px] bg-white px-4 pb-4 pt-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <p className="text-base font-bold leading-5 text-[#0f172a]">{m.title}</p>
              <p className="mt-[7px] text-[13px] leading-[18px] text-ink-soft">{m.body}</p>
              {m.badge && (
                <p className="mt-3 w-fit rounded-md bg-[#e3f0ff] px-2.5 py-0.5 text-[11px] font-semibold leading-4 text-[#195af5]">
                  {m.badge}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
