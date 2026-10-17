import type { PlanCardView } from "@/lib/plan-view";

/**
 * Phones meet the plans one card at a time in the carousel; this table sets the same figures side
 * by side under it. Nothing in it that the cards do not already say.
 */
export function PlanCompare({ cards, title, planLabel }: { cards: PlanCardView[]; title: string; planLabel: string }) {
  if (cards.length < 2) return null;
  // One row per figure position: whatever each plan asks first (upfront or deposit).
  const rows = Array.from({ length: Math.max(...cards.map((c) => c.figures.length)) }, (_, i) => {
    const labels = [...new Set(cards.map((c) => c.figures[i]?.label).filter(Boolean))];
    return { label: labels.join(" / "), mixed: labels.length > 1, i };
  });
  return (
    <div className="mx-4 mt-5 overflow-hidden rounded-[14px] bg-white shadow-[0_8px_24px_rgba(6,47,80,0.08)] sm:hidden">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="bg-navy px-3 py-2 text-left text-sm font-semibold leading-5 text-white">{title}</caption>
        <thead>
          <tr>
            <td className="w-[27%]" />
            {cards.map((c) => (
              <th key={c.id} scope="col" className="px-1.5 pb-1.5 pt-2.5 text-center text-[13px] font-bold leading-4 text-navy">
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cards.some((c) => c.tag) ? (
            <tr className="border-t border-line">
              <th scope="row" className={rowHead}>
                {planLabel}
              </th>
              {cards.map((c) => (
                <td key={c.id} className="px-1.5 py-2 text-center text-xs leading-4 text-navy">
                  {c.tag}
                </td>
              ))}
            </tr>
          ) : null}
          {rows.map((row) => (
            <tr key={row.i} className="border-t border-line">
              <th scope="row" className={rowHead}>
                {row.label}
              </th>
              {cards.map((c) => {
                const f = c.figures[row.i];
                return (
                  <td key={c.id} className="px-1.5 py-2 text-center">
                    <span className="block text-[15px] font-bold leading-5 text-navy tabular-nums">{f?.value ?? "–"}</span>
                    {f ? (
                      <span className="block text-[11px] leading-[14px] text-ink-soft">
                        {row.mixed ? `${f.label} · ${c.suffix}` : c.suffix}
                      </span>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const rowHead = "py-2 pl-3 pr-1 text-[11px] font-medium uppercase leading-[13px] tracking-[0.4px] text-ink-soft";
