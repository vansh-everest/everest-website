import Image from "next/image";
import { LIFE } from "./data";

/** A grid of real photos from team days and celebrations: two across on phones, four from lg up. */
export function LifeAtEverest() {
  return (
    <section className="bg-white px-4 pb-4 pt-[26px] lg:pb-0 lg:pt-[94px]">
      <div className="mx-auto max-w-[1104px]">
        <h2 className="text-center text-[28px] font-bold leading-[34px] text-navy lg:text-left lg:text-[44px] lg:leading-[53px]">
          Life At Everest
        </h2>
        <ul className="mt-[15px] grid grid-cols-2 gap-2.5 lg:mt-[33px] lg:grid-cols-4 lg:gap-4">
          {LIFE.map((alt, i) => (
            <li key={alt} className="relative aspect-[3/2] overflow-hidden rounded-2xl">
              <Image
                src={`/figma/careers/life-${i + 1}.webp`}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 264px, 50vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
