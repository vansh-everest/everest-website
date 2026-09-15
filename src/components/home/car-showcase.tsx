import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import { CityPill } from "./ui";

const cars = [
  {
    tab: "India’s Most Driven & Trusted Choice",
    tabTone: "bg-brand",
    name: "Wagonr",
    fuel: "CNG",
    fuelTone: "bg-brand",
    img: "/figma/car-wagonr.jpg",
    alt: "White Everest Fleet Wagonr",
    plans: ["DTE", "DTO", "Own Now", "RS"],
  },
  {
    tab: "Our Most Popular Eco-Friendly Favorite",
    tabTone: "bg-leaf",
    name: "Tigor EV",
    fuel: "EV",
    fuelTone: "bg-leaf",
    img: "/figma/car-tigor-ev.jpg",
    alt: "White Everest Fleet Tigor EV",
    plans: ["DTE", "RS"],
  },
];

function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-h-16 rounded-lg bg-mist p-[14px]">
      <p className="text-[10px] font-semibold uppercase leading-[13px] tracking-[0.5px] text-ink-soft">{label}</p>
      <div className="mt-1 text-base font-bold leading-[19px] text-navy">{children}</div>
    </div>
  );
}

function CarCard({ car }: { car: (typeof cars)[number] }) {
  return (
    <article className="flex min-w-0 flex-col items-center">
      <p className={`flex h-[38px] w-[423px] max-w-full items-center justify-center rounded-t-xl text-sm font-semibold text-white ${car.tabTone}`}>
        {car.tab}
      </p>
      <div className="w-full overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(6,47,80,0.08)]">
        <div className="relative h-[262px]">
          <Image src={car.img} alt={car.alt} fill sizes="(min-width: 1024px) 580px, 100vw" className="object-cover object-left" />
          <p className="absolute left-4 top-4 flex h-[22px] items-center gap-[5px] rounded-full bg-white px-[11px] text-[10px] font-semibold text-navy">
            <span aria-hidden className="size-[7px] rounded-full bg-leaf" />
            Available in Mumbai
          </p>
        </div>
        <div className="p-[26px] pt-6 lg:min-h-[313px]">
          <div className="flex items-center justify-between">
            <h3 className="text-[22px] font-bold leading-[27px] text-navy">{car.name}</h3>
            <span className={`flex h-[25px] items-center gap-1 rounded-full px-[13px] text-[11px] font-bold text-white ${car.fuelTone}`}>
              ⚡ {car.fuel}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Tile label="Rent starting from">₹650/day</Tile>
            <Tile label="Deposit starting from">₹40,000</Tile>
            <Tile label="Plans available">
              <ul className="flex flex-wrap gap-[3px]">
                {car.plans.map((p) => (
                  <li key={p} className="flex h-[21px] items-center rounded-full border border-brand px-2 text-[10px] font-semibold text-brand">
                    {p}
                  </li>
                ))}
              </ul>
            </Tile>
            <Tile label="Models available">2025, 2024, 2023</Tile>
          </div>
          <a
            href="#apply"
            className="mt-6 flex h-[50px] items-center justify-center rounded-full border-[1.5px] border-brand text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            Drive this car →
          </a>
        </div>
      </div>
    </article>
  );
}

const arrow = "absolute top-[578px] hidden size-12 place-items-center rounded-full bg-white text-navy shadow-[0_4px_12px_rgba(6,47,80,0.15)] lg:grid";

export function CarShowcase() {
  return (
    <section className="relative bg-mist px-6 pb-[31px] pt-24">
      <div className="text-center">
        <h2 className="text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[60px]">
          Car that earns for you
        </h2>
        <p className="mt-2 text-sm text-ink-soft/70">Drive India&apos;s most trusted and well-maintained fleet</p>
        <div className="mt-[26px]">
          <CityPill />
        </div>
        <p className="mt-3 text-[11px] text-ink-soft/60">Vehicle availability varies by city</p>
      </div>
      <div className="mx-auto mt-[10px] grid max-w-[1184px] gap-10 lg:grid-cols-2 lg:gap-6">
        {cars.map((car) => (
          <CarCard key={car.name} car={car} />
        ))}
      </div>
      <button type="button" aria-label="Previous vehicle" className={`${arrow} left-24`}>
        <CaretLeft size={20} weight="bold" />
      </button>
      <button type="button" aria-label="Next vehicle" className={`${arrow} right-[46px]`}>
        <CaretRight size={20} weight="bold" />
      </button>
      <div aria-hidden className="mt-[75px] flex justify-center gap-1.5">
        <span className="h-[7px] w-6 rounded-full bg-navy" />
        <span className="size-[7px] rounded-full bg-navy/20" />
        <span className="size-[7px] rounded-full bg-navy/20" />
      </div>
      <p className="mt-4 text-center text-xs text-ink-soft">
        Showing 5 vehicles available in Mumbai{" "}
        <a href="#" className="ml-1 font-semibold text-brand">
          View full fleet →
        </a>
      </p>
    </section>
  );
}
