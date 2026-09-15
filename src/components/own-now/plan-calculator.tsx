import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { CarCard, type CarCardData } from "@/components/home/car-showcase";
import { PHONE_HREF } from "@/components/home/ui";

const filters = ["All", "Pre-owned", "Brand New"];
const perks = ["Taxes and insurance included", "Maintenance for contract duration", "You own it at month 48"];

const tiles = [
  { label: "Rent starting from", value: "₹650/day" },
  { label: "Deposit starting from", value: "₹40,000" },
  { label: "Tenure", value: "24 months" },
  { label: "Models available", value: "2025, 2024, 2023" },
];

const cars: CarCardData[] = [
  {
    tab: "India’s Most Driven & Trusted Choice",
    tabTone: "bg-brand",
    name: "Wagonr",
    subtitle: "Sedan · Most popular",
    fuel: "CNG",
    fuelTone: "bg-brand",
    img: "/figma/own-card-wagonr.jpg",
    alt: "White Everest Fleet Wagonr",
    condition: "Pre-owned",
    tiles,
    cta: "View plan",
    ctaClassName: "text-2xl",
  },
  {
    tab: "Our Most Popular Eco-Friendly Favorite",
    tabTone: "bg-leaf",
    name: "Tigor EV",
    subtitle: "Sedan · Comfort drive",
    fuel: "EV",
    fuelTone: "bg-leaf",
    img: "/figma/own-card-tigor.jpg",
    alt: "White Everest Fleet Tigor EV",
    condition: "Brand new",
    tiles,
    cta: "View plan",
    ctaClassName: "text-2xl",
  },
];

function CarMedia() {
  return (
    <div className="border-line p-6 lg:border-r lg:p-8">
      <div className="relative aspect-[456/280] overflow-hidden rounded-lg">
        <Image
          src="/figma/own-wagonr-studio.jpg"
          alt="Maruti Suzuki WagonR in a studio"
          fill
          sizes="(min-width: 1024px) 456px, 100vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 flex h-[21px] w-[51px] items-center justify-center rounded-full bg-sun text-[11px] font-bold uppercase text-navy">
          New
        </span>
      </div>
      <p className="mt-6 text-xl leading-7 text-ink-soft/70">Maruti Suzuki · 2025</p>
      <h3 className="mt-1 text-[40px] font-bold leading-[48px] text-navy">WagonR</h3>
      <p className="mt-3 flex items-center gap-1.5 text-xl leading-7 text-navy">
        <MapPin size={18} className="text-brand" />
        Bengaluru
      </p>
      <ul className="mt-3 space-y-2.5">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-3 text-[15px] leading-5 text-navy">
            <span className="grid size-5 place-items-center rounded-full bg-leaf text-white">
              <Check size={12} strokeWidth={3} />
            </span>
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Static until the pricing rules behind deposit, tenure and daily rate are supplied.
function PlanSummary() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex h-[41px] w-[240px] rounded-full bg-mist p-1">
        <button type="button" aria-pressed="true" className="w-[116px] rounded-full bg-brand text-[13px] font-medium text-white">
          Daily
        </button>
        <button type="button" aria-pressed="false" className="w-[116px] rounded-full text-[13px] font-medium text-ink-soft">
          Weekly
        </button>
      </div>
      <p className="mt-6 text-[13px] font-medium leading-4 text-navy">Model Year</p>
      <div className="mt-1.5 flex h-12 items-center justify-between rounded-md border border-line px-4 text-base text-navy">
        2025
        <ChevronDown size={22} />
      </div>
      <div className="mt-6 flex min-h-[37px] items-center justify-between gap-4">
        <p className="text-lg text-navy">
          Joining deposit <span className="text-ink-soft/60">(refundable)</span>
        </p>
        <p className="text-2xl font-bold text-navy">₹65,000</p>
      </div>
      <div aria-hidden className="mt-6">
        <div className="flex h-6 items-center">
          <div className="relative h-2 w-full rounded-full bg-line">
            <div className="h-full w-[46.7%] rounded-full bg-navy" />
            <span className="absolute left-[45%] top-1/2 size-6 -translate-y-1/2 rounded-full border-2 border-navy bg-white" />
          </div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-ink-soft/80">
          <span>₹5,000</span>
          <span>Higher deposit → lower daily</span>
          <span>₹1,50,000</span>
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-[287px_1fr] sm:gap-8">
        <div>
          <p className="text-sm leading-[21px] text-ink-soft">You pay each day</p>
          <p className="mt-1 flex items-baseline gap-3">
            <span className="text-5xl font-extrabold leading-[64px] text-navy lg:text-[56px]">₹750</span>
            <span className="text-xl text-ink-soft">for 48 months</span>
          </p>
        </div>
        <div>
          <p className="text-sm leading-[21px] text-ink-soft">Joining deposit</p>
          <p className="mt-1 text-5xl font-extrabold leading-[64px] text-navy lg:text-[56px]">₹65,000</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-mist p-4">
          <p className="text-[13px] leading-[17px] text-ink-soft/70">Total over 48 months</p>
          <p className="mt-2 text-[26px] font-bold leading-9 text-navy lg:text-[30px]">₹11,45,000</p>
        </div>
        <div className="rounded-xl bg-mist p-4">
          <p className="text-[13px] leading-[17px] text-ink-soft/70">Driver&apos;s share</p>
          <p className="mt-2 text-[26px] font-bold leading-9 text-leaf lg:text-[30px]">₹0 / day</p>
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <a
          href={PHONE_HREF}
          className="flex h-14 w-24 items-center justify-center rounded-full border-[1.5px] border-navy text-base font-bold text-navy"
        >
          Call
        </a>
        <Link href="#apply" className="flex h-14 flex-1 items-center justify-center rounded-full bg-brand text-base font-bold text-white">
          Apply for this car
        </Link>
      </div>
      <p className="mt-4 text-center text-xs leading-[17px] text-ink-soft">
        Plans, fees and deductions subject to{" "}
        <a href="#" className="text-brand underline">
          terms
        </a>
        .
      </p>
    </div>
  );
}

export function PlanCalculator() {
  return (
    <section id="calculator" className="scroll-mt-20 bg-[#f0f4f8] px-6 pb-[100px] pt-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase leading-4 tracking-[1.5px] text-brand">Plan calculator</p>
        <h2 className="mt-2 text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[64px]">
          Pick Your Car
        </h2>
        <p className="mt-2 text-lg leading-[22px] text-ink-soft">Drive India&apos;s most trusted and well-maintained fleet</p>
        <button
          type="button"
          className="mx-auto mt-8 flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-[15px] font-semibold text-navy"
        >
          <MapPin size={22} strokeWidth={1.75} />
          Mumbai
          <ChevronDown size={20} className="text-ink-soft" />
        </button>
        <p className="mt-3 text-[13px] leading-4 text-ink-soft/60">Vehicle availability varies by city</p>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {filters.map((filter, i) => (
            <button
              key={filter}
              type="button"
              aria-pressed={i === 0}
              className={`h-9 w-[140px] rounded-full text-sm ${i === 0 ? "bg-brand text-white" : "border-[1.5px] border-brand text-brand"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-[1184px] overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(6,47,80,0.08)] lg:grid-cols-[520px_1fr]">
        <CarMedia />
        <PlanSummary />
      </div>
      <div className="mx-auto mt-12 grid max-w-[1184px] gap-10 lg:grid-cols-2 lg:gap-6">
        {cars.map((car) => (
          <CarCard key={car.name} car={car} />
        ))}
      </div>
      <div aria-hidden className="mt-16 flex justify-center gap-2">
        <span className="h-2 w-6 rounded-full bg-navy" />
        <span className="size-2 rounded-full bg-navy/15" />
        <span className="size-2 rounded-full bg-navy/15" />
      </div>
      <p className="mt-8 text-center text-[15px] text-ink-soft">
        Showing 8 vehicles available in Mumbai.{" "}
        <a href="#" className="font-semibold text-brand">
          View full fleet →
        </a>
      </p>
    </section>
  );
}
