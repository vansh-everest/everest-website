"use client";

import Link from "next/link";
import { useState } from "react";
import type { CityOption, PlanCardView } from "@/lib/plan-view";
import { CitySelect } from "./city-select";

/* The dark card leads with a larger first point; its other points are a size smaller than a light card's. */
function pointSize(i: number, dark: boolean) {
  if (dark && i === 0) return "text-[15px] lg:text-base";
  return dark ? "text-[13px] lg:text-sm" : "text-[13px] lg:text-[15px]";
}

function PlanCard({ plan }: { plan: PlanCardView }) {
  const dark = plan.theme === "dark";
  return (
    <article className="flex h-full flex-col items-center">
      {plan.tag ? (
        <p className="flex h-9 items-center rounded-t-md bg-sun px-[27px] text-sm font-semibold tracking-[0.3px] text-navy lg:h-[43px] lg:rounded-t-lg lg:px-8 lg:text-base lg:font-medium lg:tracking-normal">
          {plan.tag}
        </p>
      ) : (
        <span aria-hidden className="h-9 lg:h-[43px]" />
      )}
      <div className="flex w-full flex-1 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_8px_24px_rgba(6,47,80,0.12)] lg:rounded-2xl">
        <h3 className={`flex h-12 items-center justify-center text-[26px] font-medium text-white lg:h-14 lg:text-[28px] ${dark ? "bg-navy" : "bg-brand"}`}>
          {plan.href ? (
            <Link href={plan.href} className="underline-offset-4 hover:underline">
              {plan.name}
            </Link>
          ) : (
            plan.name
          )}
        </h3>
        <div
          className={`flex flex-1 flex-col p-4 lg:px-5 lg:pb-[22px] lg:pt-5 ${
            dark ? "bg-[radial-gradient(95%_75%_at_78%_32%,#76899b_0%,#4f667d_45%,#1c3e5d_100%)] text-white" : "text-navy"
          }`}
        >
          {plan.figures.length ? (
            <dl className="grid grid-cols-2 gap-2 lg:gap-[9px]">
              {plan.figures.map((f) => (
                <div
                  key={f.label}
                  className={`flex min-h-[66px] flex-col justify-center rounded-lg border px-2.5 lg:min-h-[73px] lg:px-3.5 ${dark ? "border-sun/30 bg-sun/10" : "border-[#f3e7a0] bg-[#fdfae2]"}`}
                >
                  <dt className={`text-xs font-semibold lg:text-[13px] ${dark ? "text-sun" : "text-brand"}`}>{f.label}</dt>
                  <dd className="mt-1.5 flex flex-wrap items-baseline gap-x-[3px] lg:gap-x-1">
                    <span className="whitespace-nowrap text-[15px] font-bold lg:text-lg">{f.value}</span>
                    <span className={`text-[11px] lg:text-[13px] ${dark ? "text-white/80" : "text-navy/80"}`}>{plan.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          <ul className="mt-2 lg:mt-2.5">
            {plan.points.map((point, i) => (
              <li key={`${i}-${point}`} className={`flex items-baseline gap-1.5 leading-[26px] lg:gap-2.5 lg:leading-[30px] ${pointSize(i, dark)} ${dark ? "text-white" : "text-navy/90"}`}>
                <span aria-hidden className="size-[5px] shrink-0 -translate-y-0.5 rounded-full bg-sun lg:size-1.5" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-2 lg:pt-[9px]">
            <a
              href="#apply"
              className="flex h-12 w-full items-center justify-center rounded-full bg-sun text-[21px] font-medium text-navy transition hover:brightness-95 lg:text-[22px]"
            >
              Join Now
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Three across on a wide screen; on a phone the cards swipe, with the next one peeking in. */
export function PlanGrid({ cities, cards }: { cities: CityOption[]; cards: Record<string, PlanCardView[]> }) {
  const [city, setCity] = useState(cities[0]?.slug ?? "");
  const plans = cards[city] ?? [];
  return (
    <>
      {/* The phone design drops the city pill; phones see the first city's prices. */}
      <div className="mt-5 hidden px-6 sm:block lg:mt-[11px]">
        <CitySelect cities={cities} value={city} onChange={setCity} filled />
      </div>
      <div className="mx-auto mt-[30px] flex max-w-[1248px] snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-[26px] px-[26px] pb-4 [scrollbar-width:none] sm:mt-10 sm:gap-5 sm:scroll-px-6 sm:px-6 lg:mt-[50px] lg:grid lg:max-w-[1440px] lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-10 xl:gap-[66px] xl:px-24 [&::-webkit-scrollbar]:hidden">
        {plans.map((plan) => (
          <div key={plan.id} className="w-[300px] max-w-[86%] shrink-0 snap-start sm:w-[60%] sm:max-w-none lg:w-auto">
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>
    </>
  );
}
