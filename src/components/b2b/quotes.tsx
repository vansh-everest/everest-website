"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Eyebrow, SectionTitle } from "./ui";

export type Quote = { text: string; name: string; meta: string; avatar?: string };

/**
 * One quote at a time on navy. With a single quote the arrows and dots stay out of the way, so
 * the control count always matches what can be shown.
 */
export function Quotes({ eyebrow, title, quotes }: { eyebrow: string; title: string; quotes: Quote[] }) {
  const [index, setIndex] = useState(0);
  const many = quotes.length > 1;
  const quote = quotes[index];
  const go = (step: number) => setIndex((i) => (i + step + quotes.length) % quotes.length);

  return (
    <section className={`bg-navy px-4 pt-12 lg:px-6 lg:pt-[95px] ${many ? "pb-[26px] lg:pb-[100px]" : "pb-[75px] lg:pb-[154px]"}`}>
      <div className="text-center">
        <Eyebrow tone="sun" className="justify-center">
          {eyebrow}
        </Eyebrow>
        <SectionTitle tone="white" size="md" className="mx-auto mt-2 max-w-[380px] lg:mt-3 lg:max-w-none">
          {title}
        </SectionTitle>
      </div>
      <div className="relative mx-auto mt-[25px] max-w-[1184px] lg:mt-[47px]">
        {many ? (
          <>
            <ArrowButton label="Previous" onClick={() => go(-1)} className="left-0">
              <ArrowLeft size={20} />
            </ArrowButton>
            <ArrowButton label="Next" onClick={() => go(1)} className="right-0">
              <ArrowRight size={20} />
            </ArrowButton>
          </>
        ) : null}
        <figure aria-live="polite" className="mx-auto max-w-[760px] rounded-2xl bg-white px-6 pb-[23px] pt-[23px] lg:rounded-3xl lg:px-12 lg:pb-12 lg:pt-12">
          <blockquote className="text-base leading-[22px] text-navy lg:text-xl lg:leading-7">
            <span className="lg:hidden">&ldquo;</span>
            {quote.text}
            <span className="lg:hidden">&rdquo;</span>
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3 lg:mt-7 lg:gap-4">
            {quote.avatar ? (
              <Image src={quote.avatar} alt="" width={48} height={48} className="size-10 rounded-full lg:size-12" />
            ) : (
              <span aria-hidden className="grid size-10 place-items-center rounded-full bg-[#e8f2fa] text-[15px] font-bold text-brand lg:size-12 lg:text-base">
                {quote.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            )}
            <span>
              <span className="block text-[15px] font-bold leading-5 text-navy lg:text-lg lg:leading-6">{quote.name}</span>
              <span className="block text-xs leading-4 text-ink-soft lg:mt-px lg:text-sm lg:leading-5">{quote.meta}</span>
            </span>
          </figcaption>
        </figure>
        {many ? (
          <div className="mt-[22px] flex justify-center gap-2 lg:mt-12">
            {quotes.map((q, i) => (
              <button
                key={q.name}
                type="button"
                aria-label={`Quote ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`size-2 rounded-full ${i === index ? "bg-sun" : "bg-white/25"}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ArrowButton({ label, onClick, className, children }: { label: string; onClick: () => void; className: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20 lg:grid lg:mx-[80px] ${className}`}
    >
      {children}
    </button>
  );
}
