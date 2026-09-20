import Image from "next/image";

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
    <section className="bg-mist pt-16 lg:pt-[84px]">
      <h2 className="px-6 text-center font-display text-[36px] font-extrabold leading-tight text-navy lg:text-[64px] lg:leading-[64px]">
        Milestones That <span className="text-brand">Define Us</span>
      </h2>
      {/* Desktop shows the Figma road illustration, milestone cards included; the list below carries the text. */}
      <div className="relative mt-[7px] hidden aspect-[1440/1212] w-full lg:block">
        <Image src="/figma/milestones-road.webp" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <ol className="mx-auto mt-10 max-w-md space-y-4 px-6 pb-16 lg:sr-only">
        {milestones.map((m) => (
          <li key={m.year} className="flex gap-4">
            <span className="h-fit rounded-md bg-[#ce3922] px-3 py-1 font-display text-xl font-extrabold text-white">{m.year}</span>
            <div className="flex-1 rounded-md border border-[#e9ebc6] bg-[#fdffe4] p-3">
              <p className="text-sm font-bold text-navy">{m.title}</p>
              <p className="mt-1 text-[13px] leading-[18px] text-ink-soft">{m.body}</p>
              {m.badge && (
                <p className="mt-2 w-fit rounded bg-[#e3f0ff] px-2 py-0.5 text-[11px] font-semibold text-brand">{m.badge}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
