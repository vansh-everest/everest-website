import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Carousel } from "@/components/site/carousel";
import type { CarCardView } from "@/lib/plan-view";

function FuelBadge({ fuel }: { fuel: string }) {
  return (
    <span
      className={`flex h-6 items-center gap-1 rounded-full px-3 text-[11px] font-bold text-white ${
        fuel.toUpperCase() === "EV" ? "bg-leaf" : "bg-brand"
      }`}
    >
      ⚡ {fuel}
    </span>
  );
}

/** A car on the home page: its photo, name and fuel, and a way in. Prices live on the plan pages. */
function HomeCarCard({ car }: { car: CarCardView }) {
  return (
    <article className="flex min-w-0 flex-col items-center">
      {car.highlight ? (
        <p
          className={`flex h-[38px] w-[423px] max-w-[88%] items-center justify-center rounded-t-xl px-3 text-center text-sm font-semibold text-white lg:text-base ${
            car.highlightTone === "leaf" ? "bg-leaf" : "bg-brand"
          }`}
        >
          {car.highlight}
        </p>
      ) : (
        <span aria-hidden className="h-[38px]" />
      )}
      <div className="w-full overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_20px_rgba(6,47,80,0.08)]">
        <div className="relative h-[210px] bg-mist sm:h-[288px]">
          {car.image.url ? (
            <Image src={car.image.url} alt={car.image.alt} fill sizes="(min-width: 1024px) 580px, 90vw" className="object-cover" />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-10 sm:hidden">
            <h3 className="text-xl font-bold text-white">{car.name}</h3>
            {car.fuel ? <FuelBadge fuel={car.fuel} /> : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
          <div className="hidden items-center gap-3 sm:flex">
            <p className="text-[22px] font-bold text-navy">{car.name}</p>
            {car.fuel ? <FuelBadge fuel={car.fuel} /> : null}
          </div>
          <a
            href="#apply"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-base font-medium text-white transition hover:brightness-110 sm:w-auto sm:text-lg"
          >
            Drive this car
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

export function CarGrid({ cars }: { cars: CarCardView[] }) {
  return (
    <div className="mx-auto mt-10 max-w-[1184px] lg:mt-[60px]">
      <Carousel label="Our cars" item="w-[86%] md:w-[calc((100%-24px)/2)]" arrowTop="182px">
        {cars.map((car) => (
          <HomeCarCard key={car.id} car={car} />
        ))}
      </Carousel>
    </div>
  );
}
