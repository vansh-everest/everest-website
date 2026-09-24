import { Calendar, Coins, CreditCard, Key, ShieldCheck, Wrench } from "lucide-react";
import type { FeatureIcon } from "@/lib/content";
import type { PlanPageView } from "@/lib/plan-view";

// Each mark keeps the colour the design gives it, whichever card it lands on.
const MARKS: Record<FeatureIcon, { icon: typeof CreditCard; tone: string }> = {
  card: { icon: CreditCard, tone: "bg-brand" },
  coins: { icon: Coins, tone: "bg-sun" },
  calendar: { icon: Calendar, tone: "bg-lime" },
  key: { icon: Key, tone: "bg-plum" },
  shield: { icon: ShieldCheck, tone: "bg-navy" },
  wrench: { icon: Wrench, tone: "bg-[#005a99]" },
};

export function PlanWhy({ view }: { view: PlanPageView }) {
  if (!view.features.length && !view.whyTitle) return null;
  return (
    <section className="bg-blue-gradient px-6 pb-20 pt-16 lg:pb-[122px] lg:pt-20">
      <div className="text-center">
        {view.whyTag ? (
          <p className="inline-flex h-[33px] items-center rounded-full bg-brand px-4 text-sm font-bold uppercase text-white">{view.whyTag}</p>
        ) : null}
        <h2 className="mt-6 text-[34px] font-bold leading-tight tracking-[-0.5px] text-white lg:text-[64px] lg:leading-[64px]">{view.whyTitle}</h2>
        {view.whySubtitle ? <p className="mt-6 text-xl text-white/90 lg:text-2xl lg:leading-[29px]">{view.whySubtitle}</p> : null}
      </div>
      <ul className="mx-auto mt-10 flex max-w-[1200px] flex-wrap justify-center gap-3 sm:gap-6 lg:mt-[94px]">
        {view.features.map((feature, i) => {
          const { icon: Icon, tone } = MARKS[feature.icon];
          return (
            <li
              key={`${i}-${feature.title}`}
              className="w-[calc((100%-12px)/2)] rounded-2xl bg-white p-4 sm:w-[calc((100%-24px)/2)] sm:rounded-3xl sm:p-8 lg:min-h-[220px] lg:w-[calc((100%-48px)/3)]"
            >
              <span className={`grid size-10 place-items-center rounded-[10px] text-white sm:size-12 ${tone}`}>
                <Icon size={22} strokeWidth={2} />
              </span>
              {feature.title ? (
                <h3 className="mt-3 text-lg font-bold leading-6 text-navy sm:mt-4 sm:text-[26px] sm:leading-[34px] lg:text-[32px] lg:leading-[39px]">{feature.title}</h3>
              ) : null}
              {feature.body ? <p className="mt-1.5 text-[13px] leading-[18px] text-ink-soft/80 sm:mt-3 sm:text-base sm:leading-6 lg:text-lg">{feature.body}</p> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
