import Image from "next/image";
import type { ReactNode } from "react";
import type { CarCardView } from "@/lib/plan-view";

function Tile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-h-16 rounded-lg bg-mist p-[14px]">
      <p className="text-[10px] font-semibold uppercase leading-[13px] tracking-[0.5px] text-ink-soft">{label}</p>
      <div className="mt-1 text-base font-bold leading-[19px] text-navy">{children}</div>
    </div>
  );
}

const photoPill =
  "absolute top-4 flex h-[22px] items-center gap-[5px] rounded-full bg-white px-[11px] text-[10px] font-semibold text-navy";

/**
 * One car on a plan page, priced for the chosen city. All four boxes always show, as in the
 * design, with a dash for a figure not set.
 */
export function CarCard({ car, city }: { car: CarCardView; city: string; variant: "plan" }) {
  const tiles: { label: string; value: ReactNode }[] = [
    { label: car.rentLabel, value: car.rent },
    { label: "Deposit", value: car.deposit },
    { label: "Tenure", value: car.tenure },
    { label: "Models available", value: car.modelYears },
  ].map((t) => (t.value ? t : { ...t, value: "—" }));

  return (
    <article className="flex min-w-0 flex-col items-center">
      {car.highlight ? (
        <p
          className={`flex h-[38px] w-[423px] max-w-full items-center justify-center rounded-t-xl text-sm font-semibold text-white ${
            car.highlightTone === "leaf" ? "bg-leaf" : "bg-brand"
          }`}
        >
          {car.highlight}
        </p>
      ) : (
        // Keeps a card without a tab level with its neighbours in the carousel.
        <span aria-hidden className="h-[38px]" />
      )}
      <div className="w-full overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(6,47,80,0.08)]">
        <div className="relative h-[262px] bg-mist">
          {car.image.url ? (
            <Image
              src={car.image.url}
              alt={car.image.alt}
              fill
              sizes="(min-width: 1024px) 580px, 100vw"
              className="object-cover object-left"
            />
          ) : null}
          <p className={`${photoPill} left-4`}>
            <span aria-hidden className="size-[7px] rounded-full bg-leaf" />
            Available in {city}
          </p>
          {car.condition ? <p className={`${photoPill} right-[22px]`}>{car.condition}</p> : null}
        </div>
        <div className="p-[26px] pt-6 lg:min-h-[313px]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[22px] font-bold leading-[27px] text-navy">{car.name}</h3>
              {car.subtitle ? <p className="text-sm leading-[17px] text-ink-soft/60">{car.subtitle}</p> : null}
            </div>
            {car.fuel ? (
              <span
                className={`flex h-[25px] items-center gap-1 rounded-full px-[13px] text-[11px] font-bold text-white ${
                  car.fuel.toUpperCase() === "EV" ? "bg-leaf" : "bg-brand"
                }`}
              >
                ⚡ {car.fuel}
              </span>
            ) : null}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {tiles.map((tile) => (
              <Tile key={tile.label} label={tile.label}>
                {tile.value}
              </Tile>
            ))}
          </div>
          <a
            href="#apply"
            className="mt-6 flex h-[50px] items-center justify-center rounded-full border-[1.5px] border-brand text-2xl font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            View plan
          </a>
        </div>
      </div>
    </article>
  );
}
