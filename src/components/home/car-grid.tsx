import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Carousel } from "@/components/site/carousel";
import type { CarCardView } from "@/lib/plan-view";

function FuelBadge({ fuel }: { fuel: string }) {
  return (
    <span
      className={`flex h-[18px] shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 text-[9px] font-bold text-white sm:h-6 sm:px-3 sm:text-[11px] ${
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
          className={`flex h-7 w-[220px] max-w-[88%] items-center justify-center rounded-t-xl px-2 text-center text-[10px] font-semibold text-white sm:h-[38px] sm:w-[423px] sm:px-3 sm:text-sm lg:text-base ${
            car.highlightTone === "leaf" ? "bg-leaf" : "bg-brand"
          }`}
        >
          {car.highlight}
        </p>
      ) : (
        <span aria-hidden className="h-7 sm:h-[38px]" />
      )}
      <div className="w-full overflow-hidden rounded-xl border border-line bg-white shadow-[0_4px_20px_rgba(6,47,80,0.08)] sm:rounded-2xl">
        <div className="relative h-[180px] bg-mist sm:h-[288px]">
          {car.image.url ? (
            <Image src={car.image.url} alt={car.image.alt} fill sizes="(min-width: 1024px) 580px, 90vw" className="object-cover" />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/55 to-transparent px-[13px] pb-2.5 pt-10 sm:hidden">
            <h3 className="text-base font-bold text-white">{car.name}</h3>
            {car.fuel ? <FuelBadge fuel={car.fuel} /> : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-[13px] py-3.5 sm:px-6 sm:py-[18px] lg:flex-nowrap">
          <div className="hidden items-center gap-3 sm:flex">
            <p className="whitespace-nowrap text-[22px] font-bold text-navy">{car.name}</p>
            {car.fuel ? <FuelBadge fuel={car.fuel} /> : null}
          </div>
          <a
            href="#apply"
            className="flex h-[26px] w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-xs font-semibold tracking-[0.5px] text-white transition hover:brightness-110 sm:h-9 sm:whitespace-nowrap sm:text-[15px] sm:tracking-[0.5px] lg:w-[222px] lg:shrink-0"
          >
            Drive this car
            <ArrowRight aria-hidden className="size-3.5 sm:size-[18px]" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function CarGrid({ cars }: { cars: CarCardView[] }) {
  return (
    // On a phone the design packs the cards tighter and drops the dots: the track's gap and padding
    // and the dot row are overridden here rather than in the shared carousel.
    <div className="mx-auto mt-[17px] max-w-[1184px] max-sm:[&_.snap-x]:scroll-px-[17px] max-sm:[&_.snap-x]:gap-3.5 max-sm:[&_.snap-x]:px-[17px] max-sm:[&_[role=region]>[aria-hidden]]:hidden sm:mt-10 lg:mt-[91px]">
      <Carousel label="Our cars" item="w-[286px] max-w-[80%] sm:w-[86%] sm:max-w-none md:w-[calc((100%-24px)/2)]" arrowTop="182px">
        {cars.map((car) => (
          <HomeCarCard key={car.id} car={car} />
        ))}
      </Carousel>
    </div>
  );
}
