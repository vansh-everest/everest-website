import Image from "next/image";
import { Car, Eye, IndianRupee, MapPin, Route, Users, type LucideIcon } from "lucide-react";
import { Eyebrow } from "@/components/b2b/ui";
import { COMPANY } from "@/lib/company";

const AUDIENCES = ["Millennials & Gen Z", "Corporate employees", "Homemakers"];

/** Starred figures are worked out from the fleet size and the footnote's assumptions. */
const STATS: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Car, value: COMPANY.vehicles, label: "Cars in motion" },
  { icon: Route, value: "35,25,000 km*", label: "Driven every day" },
  { icon: Eye, value: "3,52,50,000*", label: "Street impressions a day" },
  { icon: Users, value: "4,70,000*", label: "In-cab impressions" },
  { icon: MapPin, value: String(COMPANY.cities), label: "Cities covered" },
  { icon: IndianRupee, value: "10–20 paise", label: "Cost per impression" },
];

export function Reach() {
  return (
    <section className="bg-[#eaf4fc] px-4 pb-12 pt-12 lg:px-10 lg:pb-[53px] lg:pt-[54px]">
      <div className="text-center">
        <Eyebrow className="justify-center">The reach</Eyebrow>
        <h2 className="mt-[9px] text-[clamp(24px,7vw,28px)] font-bold leading-[34px] tracking-[-0.2px] text-navy lg:mt-3.5 lg:text-5xl lg:leading-14 lg:tracking-[-0.5px]">
          In Motion, In Sight, In Mind
        </h2>
        <ul className="mt-[11px] flex flex-wrap justify-center gap-x-2.5 gap-y-[9px] lg:mt-4">
          {AUDIENCES.map((audience) => (
            <li
              key={audience}
              className="flex h-8 items-center rounded-full border border-[#dbe7f1] bg-white px-3.5 text-sm font-medium text-navy lg:h-[35px] lg:px-4 lg:text-[15px]"
            >
              {audience}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-[21px] grid max-w-[560px] gap-[21px] lg:mt-[60px] lg:max-w-[1104px] lg:grid-cols-[580px_1fr] lg:items-center lg:gap-[41px]">
        <div className="relative aspect-[580/325] overflow-hidden rounded-2xl shadow-[0_12px_32px_rgba(6,47,80,0.1)] lg:rounded-3xl">
          <Image
            src="/figma/advertise/video-thumb.webp"
            alt="Illustration of a street full of yellow cabs with ad panels on their doors"
            fill
            sizes="(min-width: 1024px) 580px, (min-width: 640px) 560px, 100vw"
            className="object-cover"
          />
        </div>
        <ul className="grid grid-cols-2 gap-[11px] lg:gap-x-[13px] lg:gap-y-3.5">
          {STATS.map(({ icon: Icon, value, label }) => (
            <li key={label} className="rounded-xl border border-[#dbe7f1] bg-white px-3.5 pb-3 pt-3 lg:rounded-2xl lg:px-[18px] lg:pb-3.5 lg:pt-[17px]">
              <Icon aria-hidden strokeWidth={2} className="size-[18px] text-brand lg:size-5" />
              <p className="mt-1 text-[clamp(16px,4.6vw,19px)] font-bold leading-[26px] text-navy lg:mt-0 lg:text-[26px] lg:leading-[34px]">{value}</p>
              <p className="text-[clamp(12px,3.15vw,13px)] leading-5 text-ink-soft lg:text-[13px]">{label}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mx-auto mt-[17px] max-w-[560px] text-center text-xs leading-5 text-ink-soft lg:mt-[58px] lg:max-w-none lg:text-[13px] lg:leading-[18px]">
        *For external: considering ~10 impressions per km. For internal: considering ~2 per ride. 150 km/day. 10 trips/day. T&amp;C apply.
      </p>
    </section>
  );
}
