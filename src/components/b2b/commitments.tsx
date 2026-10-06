import type { LucideIcon } from "lucide-react";
import { Eyebrow, IconTile, SectionTitle } from "./ui";

export type Commitment = { icon: LucideIcon; title: string; points: string[] };

/** "Three things you can hold us to": three cards with an icon, a promise and its proof points. */
export function Commitments({ items, tone = "slate" }: { items: Commitment[]; tone?: "slate" | "mist" }) {
  return (
    <section className={`px-4 pb-12 pt-[52px] lg:px-10 lg:pb-24 lg:pt-[98px] ${tone === "mist" ? "bg-paper lg:bg-mist" : "bg-paper lg:bg-[#f0f4f8]"}`}>
      <div className="text-center">
        <Eyebrow className="justify-center">Our commitment</Eyebrow>
        <SectionTitle className="mt-2 lg:mt-3">Three Things You Can Hold Us To</SectionTitle>
        <p className="mt-[9px] hidden text-lg leading-[26px] text-ink-soft lg:block">
          Everything else is detail. These are the promises worth arguing about.
        </p>
      </div>
      <ul className="mx-auto mt-[25px] grid max-w-[560px] gap-4 lg:mt-[48px] lg:max-w-[1104px] lg:grid-cols-3 lg:gap-[25px]">
        {items.map(({ icon: Icon, title, points }) => (
          <li key={title} className="rounded-2xl border border-line bg-white px-5 pb-[19px] pt-5 lg:rounded-[20px] lg:px-[30px] lg:pb-[30px] lg:pt-[33px]">
            <div className="flex items-center gap-2.5 lg:block">
              <IconTile className="size-6 rounded-md lg:size-12 lg:rounded-xl">
                <Icon aria-hidden strokeWidth={1.75} className="size-3.5 lg:size-[22px]" />
              </IconTile>
              <h3 className="text-[17px] font-bold leading-6 text-navy lg:mt-[22px] lg:text-2xl lg:leading-[30px]">{title}</h3>
            </div>
            <ul className="mt-[11px] grid gap-0 text-sm leading-[19px] text-ink-soft lg:mt-6 lg:gap-[13px] lg:text-[15px] lg:leading-[23px] lg:tracking-[-0.25px]">
              {points.map((p) => (
                <li key={p} className="flex gap-2.5 lg:gap-3">
                  <span aria-hidden className="lg:hidden">·</span>
                  <span aria-hidden className="mt-[7px] hidden size-1.5 shrink-0 rounded-full bg-sun lg:block" />
                  {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
