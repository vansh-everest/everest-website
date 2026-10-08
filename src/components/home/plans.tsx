import { homeCopy, seedText } from "@/content/home-copy";
import type { SiteContent } from "@/lib/content";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { planCard, type PlanCardView } from "@/lib/plan-view";
import { PlanGrid } from "./plan-grid";

/** A card's admin text in `locale`, where it still reads as seeded. Names and figures stay as they are. */
function inLocale(card: PlanCardView, locale: Locale): PlanCardView {
  const t = (text: string) => seedText(text, locale);
  return {
    ...card,
    tag: t(card.tag),
    figures: card.figures.map((f) => ({ ...f, label: t(f.label) })),
    suffix: t(card.suffix),
    points: card.points.map(t),
  };
}

export function Plans({ content, locale = DEFAULT_LOCALE }: { content: SiteContent; locale?: Locale }) {
  const copy = homeCopy(locale).plans;
  // No city is chosen here, so each card shows the plan's own "onwards" figures.
  const cards = content.plans.filter((p) => p.visible && p.showCard).map((p) => inLocale(planCard(content, p), locale));
  return (
    <section id="plans" className="relative bg-[#f7f9fc] pb-5 pt-[22px] sm:pb-16 sm:pt-12 lg:bg-fog lg:pb-20 lg:pt-[52px]">
      <div className="px-6 text-center">
        <h2 className="text-[25px] font-bold leading-tight tracking-[-0.5px] text-navy sm:text-[34px] lg:text-[64px] lg:leading-[72px]">
          <span className="sm:hidden">{copy.title}</span>
          <span className="hidden sm:inline">{copy.title}</span>
        </h2>
      </div>
      <PlanGrid cards={cards} label={copy.region} join={copy.join} />
    </section>
  );
}
