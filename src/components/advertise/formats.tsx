import { Car, Eye, Users, type LucideIcon } from "lucide-react";
import { Eyebrow } from "@/components/b2b/ui";
import { PhotoRail, type Photo } from "./photo-rail";

const FORMATS: { title: string; body: string; facts: { icon: LucideIcon; label: string }[]; photos: Photo[] }[] = [
  {
    title: "Exterior Branding",
    body: "Turn every street into your brand’s stage.",
    facts: [
      { icon: Car, label: "36 sq. ft of branding space" },
      { icon: Eye, label: "10+ impressions per km" },
    ],
    photos: [
      { src: "/figma/advertise/exterior-1.webp", alt: "White cab with a Wonderla ad across both doors" },
      { src: "/figma/advertise/exterior-2.webp", alt: "White cab with a red Charcoal Eats and Swiggy ad across both doors" },
      { src: "/figma/advertise/exterior-3.webp", alt: "White cab with a blue Shapoorji Pallonji Real Estate ad across both doors" },
      { src: "/figma/advertise/exterior-4.webp", alt: "Cab door branded for The Cosmos Co-op Bank" },
    ],
  },
  {
    title: "Car Interior Branding",
    body: "Undivided attention, every moment of the ride.",
    facts: [{ icon: Users, label: "11+ lakh customers a month" }],
    photos: [
      { src: "/figma/advertise/interior-1.webp", alt: "Cab interior with ad spaces on the headrests and hanging from the front seats" },
      { src: "/figma/advertise/interior-2.webp", alt: "Swiggy ads on the backs of both front seats" },
      { src: "/figma/advertise/interior-3.webp", alt: "Aakash ads on the backs of both front seats" },
      { src: "/figma/advertise/interior-4.webp", alt: "Printed ads hanging from the front seats, seen from the rear door" },
    ],
  },
];

export function Formats() {
  return (
    <section className="bg-[linear-gradient(160deg,#062f50_0%,#0a4378_100%)] pb-12 pt-12 lg:pb-[90px] lg:pt-[54px]">
      <div className="px-4 text-center lg:px-10">
        <Eyebrow tone="sun" className="justify-center lg:text-xs! lg:tracking-[1.65px]!">
          Ad formats
        </Eyebrow>
        <h2 className="mt-[9px] text-[clamp(24px,7vw,28px)] font-bold leading-[34px] text-white lg:mt-[15px] lg:text-5xl lg:leading-14 lg:tracking-[-0.5px]">
          Two Ways To Get Seen
        </h2>
        <p className="mt-2.5 text-base leading-6 text-[#adc6da] lg:mt-3.5 lg:text-lg lg:leading-[26px]">
          Every format rides on cabs already on the road, every day.
        </p>
      </div>

      {FORMATS.map((format, i) => (
        <div key={format.title} className={i === 0 ? "mt-9 lg:mt-[61px]" : "mt-[43px] lg:mt-[72px]"}>
          <div className="mx-auto max-w-[1104px] px-4 lg:box-content lg:px-10">
            <div className="flex items-center gap-2.5 lg:gap-3.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sun text-sm font-bold text-navy lg:size-10 lg:text-[15px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[22px] font-bold leading-7 text-white lg:text-[32px] lg:leading-10">{format.title}</h3>
            </div>
            <p className="mt-2.5 text-[15px] leading-[22px] text-[#adc6da] lg:text-lg lg:leading-[26px]">{format.body}</p>
            <ul className="mt-[11px] flex flex-wrap gap-x-2.5 gap-y-2 lg:mt-[9px]">
              {format.facts.map(({ icon: Icon, label }) => (
                <li key={label} className="flex h-7 items-center gap-2 rounded-full bg-white/10 px-3 text-[13px] font-semibold text-white lg:h-8 lg:text-sm">
                  <Icon aria-hidden strokeWidth={2} className="size-[15px] text-sun lg:size-4" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-[17px] lg:mt-[27px]">
            <PhotoRail label={`${format.title} photos`} photos={format.photos} />
          </div>
        </div>
      ))}
    </section>
  );
}
