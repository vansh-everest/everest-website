import {
  BadgeCheck,
  Calendar,
  ClipboardList,
  Coins,
  CreditCard,
  Headphones,
  IdCard,
  Key,
  Landmark,
  RotateCcw,
  Shield,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { FeatureIcon } from "@/lib/content";
import type { PlanPageView } from "@/lib/plan-view";

const ICONS: Record<FeatureIcon, LucideIcon> = {
  card: CreditCard,
  coins: Coins,
  calendar: Calendar,
  key: Key,
  shield: Shield,
  wrench: Wrench,
  refund: RotateCcw,
  badge: BadgeCheck,
  headset: Headphones,
  id: IdCard,
  bank: Landmark,
  clipboard: ClipboardList,
};

/** The plan's benefit cards, two across. Only the phone designs carry them. */
export function PlanBenefits({ view }: { view: PlanPageView }) {
  if (!view.features.length) return null;
  return (
    <section aria-label={view.whyTag || "Benefits"} className="bg-[#f5f8fc] px-6 pb-[25px] pt-[27px] sm:px-6 lg:hidden">
      {view.whyTag ? (
        <p className="text-center text-[13px] font-bold uppercase leading-4 tracking-[1.5px] text-brand">{view.whyTag}</p>
      ) : null}
      <ul className="mx-auto mt-[30px] grid max-w-[720px] grid-cols-2 gap-[13px] sm:grid-cols-3">
        {view.features.map((feature, i) => {
          const Icon = ICONS[feature.icon];
          return (
            <li key={`${i}-${feature.title}`} className="min-h-[185px] rounded-2xl border border-[#dfecf6] bg-white px-4 pb-5 pt-4">
              <span aria-hidden className="grid size-[42px] place-items-center rounded-xl bg-[#eaf3fb] text-brand">
                <Icon size={21} strokeWidth={1.9} />
              </span>
              {feature.title ? <h3 className="mt-4 text-base font-bold leading-[21px] text-navy">{feature.title}</h3> : null}
              {feature.body ? <p className="mt-2 text-sm leading-5 text-ink-soft">{feature.body}</p> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
