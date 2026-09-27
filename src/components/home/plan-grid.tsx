"use client";

import Link from "next/link";
import { useState } from "react";
import type { CityOption, PlanCardView } from "@/lib/plan-view";
import { CitySelect } from "./city-select";

function PlanCard({ plan }: { plan: PlanCardView }) {
  const dark = plan.theme === "dark";
  return (
    <article className="flex h-full flex-col items-center">
      {plan.tag ? (
        <p className="flex h-11 items-center rounded-t-lg bg-sun px-8 text-base font-medium text-navy">{plan.tag}</p>
      ) : (
        <span aria-hidden className="h-11" />
      )}
      <div className="flex w-full flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(6,47,80,0.12)]">
        <h3 className={`flex h-14 items-center justify-center text-[26px] font-medium text-white lg:text-[28px] ${dark ? "bg-navy" : "bg-brand"}`}>
          {plan.href ? (
            <Link href={plan.href} className="underline-offset-4 hover:underline">
              {plan.name}
            </Link>
          ) : (
            plan.name
          )}
        </h3>
        <div
          className={`flex flex-1 flex-col px-5 pb-5 pt-5 ${
            dark ? "bg-[radial-gradient(95%_75%_at_78%_32%,#76899b_0%,#4f667d_45%,#1c3e5d_100%)] text-white" : "text-navy"
          }`}
        >
          {plan.figures.length ? (
            <dl className="grid grid-cols-2 gap-2.5">
              {plan.figures.map((f) => (
                <div
                  key={f.label}
                  className={`rounded-lg border px-3.5 py-2.5 ${dark ? "border-sun/30 bg-sun/10" : "border-[#f3e7a0] bg-[#fdfae2]"}`}
                >
                  <dt className={`text-[13px] font-medium ${dark ? "text-sun" : "text-brand"}`}>{f.label}</dt>
                  <dd className="mt-1 whitespace-nowrap">
                    <span className="text-xl font-bold">{f.value}</span>
                    <span className={`text-xs ${dark ? "text-white/80" : "text-navy/80"}`}>{plan.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          <ul className="mt-4 space-y-2">
            {plan.points.map((point, i) => (
              <li key={`${i}-${point}`} className={`flex items-baseline gap-2.5 leading-5 ${i === 0 && dark ? "text-[17px] leading-6" : "text-[15px]"} ${dark ? "text-white" : "text-navy/90"}`}>
                <span aria-hidden className="size-1.5 shrink-0 -translate-y-0.5 rounded-full bg-sun" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-5">
            <a
              href="#apply"
              className="flex h-12 w-full items-center justify-center rounded-full bg-sun text-xl font-medium text-navy transition hover:brightness-95"
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
      <div className="mt-5 px-6">
        <CitySelect cities={cities} value={city} onChange={setCity} filled />
      </div>
      <div className="mx-auto mt-10 flex max-w-[1248px] snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:none] lg:mt-12 lg:grid lg:max-w-[1440px] lg:grid-cols-3 lg:gap-[66px] lg:overflow-visible lg:px-24 [&::-webkit-scrollbar]:hidden">
        {plans.map((plan) => (
          <div key={plan.id} className="w-[86%] shrink-0 snap-start sm:w-[60%] lg:w-auto">
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>
    </>
  );
}
