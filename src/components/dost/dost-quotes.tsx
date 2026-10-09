"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, User } from "lucide-react";

/**
 * Quotes from real Dost partners, in their own words and with their consent. The section stays hidden
 * until there is one; the arrows and dots appear once there are two.
 */
const QUOTES: { quote: string; name: string; role: string }[] = [];

const arrow =
  "absolute top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/5 text-white transition hover:bg-white/15 lg:grid";

export function DostQuotes() {
  const [index, setIndex] = useState(0);
  if (!QUOTES.length) return null;
  const many = QUOTES.length > 1;
  const current = QUOTES[index];
  const go = (step: number) => setIndex((i) => (i + step + QUOTES.length) % QUOTES.length);

  return (
    <section className="bg-navy px-4 pb-12 pt-[47px] lg:pb-24 lg:pt-24">
      <div className="text-center">
        <p className="text-[13px] font-semibold uppercase leading-4 tracking-[1.6px] text-sun">Partners</p>
        <h2 className="mt-[7px] text-2xl font-bold leading-[30px] text-white lg:mt-[13px] lg:text-[40px] lg:leading-[48px]">
          What Our Dosts Say
        </h2>
      </div>

      <div className="relative mx-auto mt-6 max-w-[1184px] lg:mt-12">
        {many ? (
          <button type="button" aria-label="Previous quote" onClick={() => go(-1)} className={`${arrow} left-0`}>
            <ArrowLeft size={22} strokeWidth={1.75} />
          </button>
        ) : null}
        <figure
          aria-live="polite"
          className="mx-auto max-w-[760px] rounded-2xl bg-white px-6 pb-[18px] pt-[23px] lg:rounded-3xl lg:px-12 lg:pb-12 lg:pt-[47px]"
        >
          <blockquote className="text-[15px] leading-[22px] text-navy lg:text-xl lg:leading-7">
            <span className="lg:hidden">&ldquo;</span>
            {current.quote}
            <span className="lg:hidden">&rdquo;</span>
          </blockquote>
          <figcaption className="mt-[21px] flex flex-wrap items-center gap-x-4 gap-y-5 lg:mt-[29px]">
            <span className="flex items-center gap-3 lg:gap-4">
              <span className="grid size-10 place-items-center rounded-full bg-[#eaf3fb] text-brand lg:size-12">
                <User className="size-[18px] lg:size-5" strokeWidth={1.75} />
              </span>
              <span>
                <span className="block text-[15px] font-bold leading-5 text-navy lg:text-lg lg:leading-6">{current.name}</span>
                <span className="block text-xs leading-4 text-ink-soft lg:mt-0.5 lg:text-sm lg:leading-5">{current.role}</span>
              </span>
            </span>
          </figcaption>
        </figure>
        {many ? (
          <button type="button" aria-label="Next quote" onClick={() => go(1)} className={`${arrow} right-0`}>
            <ArrowRight size={22} strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      {many ? (
        <div className="mt-12 flex justify-center gap-2">
          {QUOTES.map((q, i) => (
            <button
              key={q.quote}
              type="button"
              aria-label={`Quote ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`size-2.5 rounded-full ${i === index ? "bg-sun" : "bg-white/25"}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
