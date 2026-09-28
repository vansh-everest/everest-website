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
    <section className="relative bg-blue-gradient pb-[58px] pt-14 lg:aspect-[1440/1367] lg:pb-0 lg:pt-20">
      {/* Desktop shows the road illustration, milestone cards included; the list below carries the text. */}
      <Image
        src="/figma/about/journey-road.webp"
        alt=""
        fill
        sizes="100vw"
        className="hidden object-cover lg:block"
      />
      <h2 className="relative px-6 text-center text-[28px] font-extrabold leading-[34px] text-white lg:text-[64px] lg:tracking-[-0.5px] lg:leading-[70px]">
        Our Journey So Far
      </h2>
      {/* Narrow screens: a year tab and card per milestone, with a marker on a dashed line down the left. */}
      <ol className="relative mx-auto mt-8 max-w-md space-y-6 pl-[21px] pr-[17px] lg:sr-only">
        {milestones.map((m, i) => (
          <li key={m.year} className="relative pl-[23px]">
            <span aria-hidden className="absolute left-0 top-3 size-3.5 rounded-full bg-[#ce3922]" />
            {i < milestones.length - 1 && (
              <span aria-hidden className="absolute -bottom-[43px] left-1.5 top-[19px] border-l-2 border-dashed border-white/25" />
            )}
            <p className="w-fit rounded-t-[10px] bg-[#ce3922] px-3.5 pt-px text-[15px] font-extrabold leading-[27px] text-white">{m.year}</p>
            <div className="mt-2 rounded-xl rounded-tl-none border border-[#d2dbe3] bg-[#fdffe4] pb-3.5 pl-[15px] pr-3 pt-3.5">
              <p className="text-sm font-bold leading-5 text-[#000014]">{m.title}</p>
              <p className="mt-[7px] text-xs leading-[17px] text-[#727e95]">{m.body}</p>
              {m.badge && (
                <p className="mt-[9px] w-fit rounded-md bg-[#e3f0ff] px-2.5 py-0.5 text-xs font-medium leading-[17px] text-[#195af5]">
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
