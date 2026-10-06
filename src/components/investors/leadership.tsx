import type { CSSProperties } from "react";
import Image from "next/image";
import { BACKERS, FOUNDERS } from "./data";
import { Heading, Kicker, Label } from "./ui";

export function Leadership() {
  return (
    <section id="leadership" className="scroll-mt-28 bg-white px-4 pb-6 pt-[30px] sm:px-6 lg:pb-[100px] lg:pt-[97px]">
      <div className="mx-auto w-full max-w-[1104px]">
        <Kicker>Leadership</Kicker>
        <Heading className="mt-2 lg:mt-2.5">The People Behind Everest</Heading>

        <Label className="mt-[30px] lg:mt-11">Founding team</Label>
        <ul className="mt-6 grid grid-cols-2 gap-3 lg:mt-4 lg:grid-cols-4 lg:gap-6">
          {FOUNDERS.map((f) => (
            <li key={f.name} className="rounded-2xl bg-[#f2f5fd] px-4 pb-3.5 pt-[18px] lg:rounded-[20px] lg:px-6 lg:pb-[26px] lg:pt-6">
              <span className="grid size-11 place-items-center rounded-full bg-white text-lg font-bold text-brand lg:size-16 lg:text-[22px]">
                {f.initials}
              </span>
              <p className="mt-2.5 text-[15px] font-bold leading-5 text-navy lg:mt-[11px] lg:text-lg lg:leading-6">{f.name}</p>
              <p className="mt-2 text-[13px] leading-[18px] text-ink-soft lg:mt-[3px] lg:text-[15px] lg:leading-5">{f.role}</p>
            </li>
          ))}
        </ul>

        <Label className="mt-8 lg:mt-[41px]">Backed by</Label>
        <ul className="mt-[26px] grid grid-cols-2 gap-3 lg:mt-4 lg:flex lg:gap-4">
          {BACKERS.map((b) => (
            <li
              key={b.id}
              className="grid h-16 place-items-center rounded-xl border border-line bg-white lg:h-[88px] lg:w-[144px]"
            >
              <Image
                src={`/figma/investors/backer-${b.id}.webp`}
                alt={b.name}
                width={b.w}
                height={b.h}
                style={{ "--w": `${b.w}px`, "--h": `${b.h}px` } as CSSProperties}
                className="h-[calc(var(--h)*0.86)] w-[calc(var(--w)*0.86)] lg:h-(--h) lg:w-(--w)"
              />
            </li>
          ))}
        </ul>
        <p className="mt-[60px] text-[13px] leading-5 text-ink-soft lg:mt-[17px] lg:text-[15px]">
          Debt partners include Axis Bank and GuarantCo.
        </p>
      </div>
    </section>
  );
}
