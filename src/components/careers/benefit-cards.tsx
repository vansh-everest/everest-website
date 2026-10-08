"use client";

import Image from "next/image";
import { useState } from "react";
import { BENEFITS } from "./data";

/**
 * Each card shows the partner's mark and the benefit's name; hovering it on a desktop, or
 * tapping it on a phone, turns it over to the full description.
 */
export function BenefitCards() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white px-4 pb-6 pt-[26px] lg:pb-20 lg:pt-[94px]">
      <div className="mx-auto max-w-[1104px]">
        <h2 className="text-center text-[28px] font-bold leading-[34px] text-navy lg:text-left lg:text-[44px] lg:leading-[53px]">
          Employee Benefits
        </h2>
        <ul className="mt-[15px] grid gap-3 lg:mt-[33px] lg:grid-cols-3 lg:gap-6">
          {BENEFITS.map((benefit, i) => {
            const shown = open === i;
            return (
              <li key={benefit.title} className="mx-auto w-full max-w-[480px] lg:max-w-none">
                <button
                  type="button"
                  aria-expanded={shown}
                  onClick={() => setOpen(shown ? null : i)}
                  className={`group relative block h-[300px] w-full overflow-hidden rounded-[28px] text-white ${benefit.tone}`}
                >
                  <Image
                    src={benefit.imagePhone}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 0px, 480px"
                    className={`object-cover transition-opacity duration-300 lg:hidden ${shown ? "opacity-15" : ""}`}
                  />
                  <Image
                    src={benefit.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 352px, 0px"
                    className={`hidden object-cover transition-opacity duration-300 lg:block lg:group-hover:opacity-15 ${shown ? "opacity-15" : ""}`}
                  />
                  <span
                    className={`absolute inset-x-0 bottom-[22px] text-[32px] leading-10 transition-opacity duration-300 lg:bottom-[27px] lg:text-[28px] lg:group-hover:opacity-0 ${
                      shown ? "opacity-0" : ""
                    }`}
                  >
                    {benefit.title}
                  </span>
                  <span
                    className={`absolute inset-0 grid place-items-center px-6 text-base leading-[23px] transition-opacity duration-300 lg:px-7 lg:text-[15px] lg:leading-[23px] lg:group-hover:opacity-100 ${
                      shown ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {benefit.body}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
