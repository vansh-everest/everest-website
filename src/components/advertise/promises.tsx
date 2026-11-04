import { Eye, IndianRupee, MapPin, type LucideIcon } from "lucide-react";
import { Eyebrow, IconTile } from "@/components/b2b/ui";

const PROMISES: { icon: LucideIcon; title: string; points: string[] }[] = [
  { icon: Eye, title: "It gets seen", points: ["Guaranteed impressions", "Enhanced visibility, at eye level"] },
  { icon: MapPin, title: "It meets your buyers", points: ["Close to your customers, every day", "Wider reach, city after city"] },
  { icon: IndianRupee, title: "More reach per rupee", points: ["Cost-effective outdoor media", "Premium, innovative, always moving"] },
];

export function Promises() {
  return (
    <section className="bg-[#f0f4f8] px-4 pb-[47px] pt-12 lg:px-10 lg:pb-[53px] lg:pt-[54px]">
      <div className="text-center">
        <Eyebrow className="justify-center">Our commitment</Eyebrow>
        <h2 className="mx-auto mt-[7px] max-w-[380px] text-[clamp(21px,5.85vw,24px)] font-bold leading-[30px] text-navy lg:mt-[11px] lg:max-w-none lg:text-[52px] lg:leading-[60px]">
          Three Things You Can Hold Us To
        </h2>
        <p className="mt-2.5 hidden text-lg leading-[26px] text-ink-soft lg:block">Everything else is detail. These are the promises worth arguing about.</p>
      </div>
      {/* Each desktop card spans two shared rows, so all three lists start level. */}
      <ul className="mx-auto mt-[23px] grid max-w-[560px] gap-[17px] lg:mt-[49px] lg:max-w-[1104px] lg:grid-cols-3 lg:gap-x-6 lg:gap-y-0">
        {PROMISES.map(({ icon: Icon, title, points }) => (
          <li
            key={title}
            className="rounded-2xl border border-line bg-white px-5 pb-[19px] pt-5 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-y-0 lg:rounded-[20px] lg:px-[30px] lg:pb-[34px] lg:pt-[32px]"
          >
            <div className="flex items-center gap-2 lg:block">
              <IconTile className="size-6 rounded-md lg:size-[50px] lg:rounded-xl">
                <Icon aria-hidden strokeWidth={1.75} className="size-4 lg:size-[22px]" />
              </IconTile>
              <h3 className="text-base font-bold leading-6 text-navy lg:mt-5 lg:text-2xl lg:leading-[30px]">{title}</h3>
            </div>
            <ul className="mt-[11px] grid content-start text-[13px] leading-[19px] text-ink-soft lg:mt-[26px] lg:gap-[18px] lg:text-base">
              {points.map((point) => (
                <li key={point} className="flex gap-2.5 lg:gap-3">
                  <span aria-hidden className="lg:hidden">·</span>
                  <span aria-hidden className="mt-1.5 hidden size-1.5 shrink-0 rounded-full bg-sun lg:block" />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
