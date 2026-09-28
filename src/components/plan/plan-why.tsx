import { Calendar, Coins, CreditCard, Key, ShieldCheck, Wrench } from "lucide-react";
import { SiteImage } from "@/components/site/site-image";
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

/** The navy title band, then the benefits photo beside the cards. With no photo the cards sit centred on their own. */
export function PlanWhy({ view }: { view: PlanPageView }) {
  if (!view.features.length && !view.whyTitle) return null;
  const photo = !!view.benefitsImage.url;
  return (
    <>
      <section className="bg-navy px-4 pb-[31px] pt-8 text-center sm:px-6 lg:pb-[57px] lg:pt-[35px]">
        {view.whyTag ? (
          <p className="text-xs font-semibold uppercase leading-4 tracking-[1.5px] text-sun lg:text-lg lg:leading-6 lg:tracking-[3px]">{view.whyTag}</p>
        ) : null}
        <h2 className="mx-auto mt-1.5 max-w-[1100px] text-balance text-[30px] font-bold leading-9 tracking-[-0.5px] text-white lg:mt-0 lg:text-[52px] lg:leading-[64px]">
          {view.whyTitle}
        </h2>
        {view.whySubtitle ? <p className="mt-3 text-lg text-white/85 lg:text-2xl">{view.whySubtitle}</p> : null}
      </section>

      {view.features.length ? (
        <section className="bg-paper px-5 pb-10 pt-6 sm:px-6 lg:pb-[119px] lg:pt-[66px]">
          <div className={`mx-auto grid items-start gap-6 ${photo ? "max-w-[1280px] lg:grid-cols-[558px_1fr] lg:gap-[66px]" : "max-w-[654px]"}`}>
            {photo ? (
              <div className="relative aspect-[558/313] overflow-hidden rounded-xl border border-line shadow-[0_12px_32px_rgba(6,47,80,0.12)]">
                <SiteImage slot={view.benefitsImage} sizes="(min-width: 1024px) 558px, 100vw" />
              </div>
            ) : null}
            <ul className="grid gap-3 sm:grid-cols-2 lg:gap-x-[22px] lg:gap-y-[21px]">
              {view.features.map((feature, i) => {
                const { icon: Icon, tone } = MARKS[feature.icon];
                return (
                  <li
                    key={`${i}-${feature.title}`}
                    className="flex items-center gap-4 rounded-2xl border border-line bg-white px-4 py-[15px] shadow-[0_4px_12px_rgba(6,47,80,0.05)] lg:min-h-[87px] lg:px-[19px] lg:py-4 lg:shadow-none"
                  >
                    <span className={`grid size-11 shrink-0 place-items-center rounded-[10px] text-white lg:size-12 ${tone}`}>
                      <Icon size={22} strokeWidth={2} />
                    </span>
                    <div>
                      {feature.title ? <h3 className="text-[17px] font-bold leading-6 text-navy lg:text-lg">{feature.title}</h3> : null}
                      {feature.body ? <p className="text-sm leading-5 text-ink-soft lg:mt-1">{feature.body}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
