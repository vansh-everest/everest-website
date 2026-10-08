import Link from "next/link";
import type { PlanCardView } from "@/lib/plan-view";

/* The dark card leads with a larger first point; its other points are a size smaller than a light card's. */
function pointSize(i: number, dark: boolean) {
  if (dark && i === 0) return "text-[15px] lg:text-base";
  return dark ? "text-[13px] lg:text-sm" : "text-[13px] lg:text-[15px]";
}

function PlanCard({ plan, join }: { plan: PlanCardView; join: string }) {
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
                  className={`flex flex-col rounded-lg border px-2.5 py-2.5 lg:px-3.5 lg:py-3 ${dark ? "border-sun/30 bg-sun/10" : "border-[#f3e7a0] bg-[#fdfae2]"}`}
                >
                  {/* Label, figure and "Onwards" each on their own line, so every tile lines up whatever the figure's length. */}
                  <dt className={`text-xs font-semibold lg:text-[13px] ${dark ? "text-sun" : "text-brand"}`}>{f.label}</dt>
                  <dd className="mt-1 flex flex-col">
                    <span className="whitespace-nowrap text-[15px] font-bold leading-5 lg:text-lg lg:leading-6">{f.value}</span>
                    <span className={`text-[11px] leading-4 lg:text-[13px] lg:leading-5 ${dark ? "text-white/80" : "text-navy/80"}`}>{plan.suffix}</span>
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
              {join}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * The plan cards: side by side on a wide screen, and a row a phone swipes one card at a time.
 * Nothing moves on its own.
 */
export function PlanGrid({ cards, label, join }: { cards: PlanCardView[]; label: string; join: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      className="mt-[30px] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[7%] py-4 [scrollbar-width:none] sm:mt-10 sm:gap-6 sm:px-6 lg:mx-auto lg:mt-[46px] lg:max-w-[1260px] lg:snap-none lg:justify-center lg:overflow-visible lg:px-6 xl:gap-[66px] [&::-webkit-scrollbar]:hidden"
    >
      {cards.map((plan) => (
        <div key={plan.id} className="w-[86%] max-w-[340px] shrink-0 snap-center snap-always sm:w-[372px] sm:max-w-none lg:w-auto lg:max-w-[372px] lg:flex-1">
          <PlanCard plan={plan} join={join} />
        </div>
      ))}
    </div>
  );
}
