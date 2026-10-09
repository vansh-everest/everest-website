import type { CSSProperties } from "react";
import Image from "next/image";
import { FounderStory } from "@/components/about/founder";
import { BACKERS } from "./data";
import { Heading, Kicker, Label } from "./ui";

export function Leadership() {
  return (
    <section id="leadership" className="scroll-mt-28 bg-white px-4 pb-6 pt-[30px] sm:px-6 lg:pb-[100px] lg:pt-[97px]">
      <div className="mx-auto w-full max-w-[1104px]">
        <Kicker>Leadership</Kicker>
        <Heading className="mt-2 lg:mt-2.5">The People Behind Everest</Heading>

        <Label className="mt-[30px] lg:mt-11">Founder</Label>
        <FounderStory className="mt-6 lg:mt-8" />

        <Label className="mt-12 lg:mt-16">Backed by</Label>
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
