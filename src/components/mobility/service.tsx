import Image from "next/image";
import { MapPin } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { Heading } from "./ui";

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Pune", "Kolkata", "Chennai"];

/** "10 years of trusted service": the parked fleet beside the cities it runs in. */
export function Service() {
  return (
    <section className="bg-white px-4 pb-12 pt-[19px] lg:px-6 lg:pb-[97px] lg:pt-[27px]">
      <div className="mx-auto grid max-w-[1104px] gap-y-[22px] lg:grid-cols-[minmax(0,560fr)_minmax(0,480fr)] lg:items-center lg:gap-x-16">
        <div className="relative aspect-[343/219] overflow-hidden rounded-[20px] lg:aspect-[560/360] lg:rounded-3xl">
          <Image src="/figma/mobility/fleet.webp" alt="Row of parked white cars on open ground at sunset" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
        </div>
        <div>
          <Heading>
            <span className="text-brand">10 years</span> of trusted service
          </Heading>
          <p className="mt-3 text-[17px] leading-6 text-ink-soft lg:mt-[18px] lg:text-lg lg:leading-7">
            On the road since {COMPANY.founded}
            <span className="lg:hidden">, now in {COMPANY.cities} metro cities.</span>
          </p>
          <ul className="mt-3.5 flex flex-wrap gap-x-2.5 gap-y-2 lg:mt-[18px] lg:gap-y-2.5">
            {CITIES.map((city) => (
              <li key={city} className="flex h-10 items-center gap-2 rounded-full border border-line bg-white pl-3.5 pr-4 text-[15px] font-semibold text-navy lg:h-[41px] lg:text-base">
                <MapPin aria-hidden size={18} strokeWidth={1.9} className="text-brand" />
                {city}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
