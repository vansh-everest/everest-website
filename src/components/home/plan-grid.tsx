"use client";

import Link from "next/link";
import { useState } from "react";
import type { CityOption, PlanCardView } from "@/lib/plan-view";
import { CitySelect } from "./city-select";

/** Chip colours for the row labels: navy cards use yellow, white cards alternate. */
const LIGHT_CHIPS = ["border-[#8fc27a] bg-[#eef7e9] text-[#3f7a2a]", "border-brand/50 bg-[#e8f3fb] text-brand"];

function PlanCard({ plan, index }: { plan: PlanCardView; index: number }) {
  const dark = plan.theme === "dark";
  const divider = dark ? "border-white/25" : "border-line";
  const chip = dark ? "border-sun/60 bg-sun/10 text-sun" : LIGHT_CHIPS[index % LIGHT_CHIPS.length];
  return (
    <article className="flex flex-col items-center">
      {plan.tag ? (
        <p className="flex h-9 w-[186px] items-center justify-center rounded-t-lg bg-sun text-xs font-semibold text-navy">{plan.tag}</p>
      ) : null}
      <div className="w-full overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(6,47,80,0.12)]">
        <h3 className={`flex h-12 items-center justify-center text-xl font-semibold text-white ${dark ? "bg-navy" : "bg-brand"}`}>
          {plan.href ? (
            <Link href={plan.href} className="underline-offset-4 hover:underline">
              {plan.name}
            </Link>
          ) : (
            plan.name
          )}
        </h3>
        <div
          className={`px-[26px] pb-7 pt-3 lg:min-h-[444px] ${dark ? "bg-[linear-gradient(180deg,#0d3458_0%,#44627f_100%)] text-white" : "text-navy"}`}
        >
          {plan.amount ? (
            <>
              <p className={`text-sm ${dark ? "text-sun" : "text-brand"}`}>{plan.priceLabel}</p>
              <div className={`flex items-center gap-2 border-b border-dashed pb-5 ${divider}`}>
                <p className="flex items-baseline gap-0.5">
                  <span className="text-base">₹</span>
                  <span className="text-[40px] font-bold leading-10">{Number(plan.amount).toLocaleString("en-IN")}</span>
                  <span className={`text-[13px] ${dark ? "text-white/70" : "text-ink-soft"}`}>{plan.unit}</span>
                </p>
                <a
                  href="#apply"
                  className="ml-2 flex h-9 w-[104px] items-center justify-center rounded-full bg-sun text-[13px] font-semibold text-navy"
                >
                  Join Now
                </a>
              </div>
            </>
          ) : null}
          <dl>
            {plan.rows.map((row, i) => (
              <div
                key={`${row.label}-${i}`}
                className={`grid grid-cols-[86px_1fr] items-center gap-[11px] border-b border-dashed py-4 ${divider}`}
              >
                <dt className={`w-fit rounded border px-2.5 py-1 text-[10px] font-bold uppercase leading-[12px] tracking-[0.5px] ${chip}`}>
                  {row.label}
                </dt>
                <dd className={`leading-5 ${i === 0 ? "text-base font-medium" : "text-[13px]"} ${dark ? "text-white/90" : "text-navy/80"}`}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          {plan.benefits.length ? (
            <>
              <p className={`mt-3 text-[11px] font-semibold uppercase tracking-[1px] ${dark ? "text-white/60" : "text-ink-soft"}`}>
                Key Benefits
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {plan.benefits.map((b) => (
                  <li
                    key={b}
                    className={`rounded-md px-2.5 py-[5px] text-[11px] leading-4 ${
                      dark ? "bg-brand text-white" : "border border-line bg-mist text-ink-soft"
                    }`}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PlanGrid({ cities, cards }: { cities: CityOption[]; cards: Record<string, PlanCardView[]> }) {
  const [city, setCity] = useState(cities[0]?.slug ?? "");
  const plans = cards[city] ?? [];
  return (
    <>
      <div className="mt-[21px] px-6">
        <CitySelect cities={cities} value={city} onChange={setCity} />
      </div>
      <div className="relative z-10 mx-auto mt-[50px] grid max-w-[1192px] gap-10 px-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-[38px] lg:px-0">
        {plans.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} index={plans.slice(0, i).filter((p) => p.theme !== "dark").length} />
        ))}
      </div>
    </>
  );
}
