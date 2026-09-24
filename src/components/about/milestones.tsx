import Image from "next/image";
import { MapPin } from "@phosphor-icons/react/ssr";

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
    <section className="relative bg-blue-gradient pb-16 pt-16 lg:aspect-[1440/1367] lg:pb-0 lg:pt-20">
      {/* Desktop shows the road illustration, milestone cards included; the list below carries the text. */}
      <Image
        src="/figma/about/journey-road.webp"
        alt=""
        fill
        sizes="100vw"
        className="hidden object-cover lg:block"
      />
      <h2 className="relative px-6 text-center text-[36px] font-extrabold leading-tight tracking-[-0.5px] text-white lg:text-[64px] lg:leading-[70px]">
        Our Journey So Far
      </h2>
      <div className="relative mx-auto mt-10 max-w-md px-6 lg:sr-only">
        {/* A vertical road for narrow screens: asphalt strip with a dashed centre line. */}
        <span aria-hidden className="absolute bottom-0 left-6 top-0 w-5 rounded-full bg-[#333]">
          <span className="absolute inset-y-3 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-white/80" />
        </span>
        <ol className="relative space-y-8">
          {milestones.map((m) => (
            <li key={m.year} className="relative pl-12">
              <MapPin aria-hidden size={28} weight="fill" className="absolute -left-1 top-6 text-[#e5392a] drop-shadow" />
              <p className="w-fit rounded-t-xl bg-[#ce3922] px-4 pt-1 font-display text-xl font-extrabold leading-7 text-white">
                {m.year}
              </p>
              <div className="rounded-xl rounded-tl-none bg-[#fdffe4] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                <p className="text-sm font-bold text-navy">{m.title}</p>
                <p className="mt-1 text-[13px] leading-[18px] text-ink-soft">{m.body}</p>
                {m.badge && (
                  <p className="mt-2 w-fit rounded bg-[#e3f0ff] px-2 py-0.5 text-[11px] font-semibold text-brand">{m.badge}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
