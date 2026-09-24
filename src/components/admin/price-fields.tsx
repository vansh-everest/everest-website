"use client";

import { DIGIT_FIELDS, type CityPrices, type Price } from "@/lib/content";
import { Text } from "./fields";

type Field = keyof Price;

export const PRICE_LABELS: Record<Field, string> = {
  amount: "Headline amount (₹)",
  unit: "Unit",
  deposit: "Deposit (₹)",
  upfront: "Upfront (₹)",
  tenureMonths: "Tenure (months)",
};

const isDigits = (f: Field) => (DIGIT_FIELDS as readonly Field[]).includes(f);

/** The national figures for a plan or car. */
export function PriceGrid({
  value,
  fields,
  onChange,
  disabled,
}: {
  value: Price;
  fields: Field[];
  onChange: (next: Price) => void;
  disabled: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {fields.map((f) => (
        <Text
          key={f}
          label={PRICE_LABELS[f]}
          value={value[f]}
          numeric={isDigits(f)}
          placeholder={f === "unit" ? "/day" : "Blank hides it"}
          disabled={disabled}
          onChange={(v) => onChange({ ...value, [f]: v })}
        />
      ))}
    </div>
  );
}

/**
 * One row per city. An empty box uses the national figure, shown faintly as the placeholder,
 * so an editor only fills in the cities that actually differ.
 */
export function CityPriceTable({
  cities,
  base,
  fields,
  value,
  onChange,
  disabled,
}: {
  cities: { slug: string; name: string }[];
  base: Price;
  fields: Field[];
  value: CityPrices;
  onChange: (next: CityPrices) => void;
  disabled: boolean;
}) {
  const overridden = cities.filter((c) => Object.keys(value[c.slug] ?? {}).length).length;

  function set(city: string, field: Field, raw: string) {
    const v = isDigits(field) ? raw.replace(/\D/g, "") : raw;
    const own = { ...(value[city] ?? {}) };
    if (v) own[field] = v;
    else delete own[field];
    const next = { ...value };
    if (Object.keys(own).length) next[city] = own;
    else delete next[city];
    onChange(next);
  }

  return (
    <details className="rounded-xl border border-line bg-paper" open={overridden > 0}>
      <summary className="cursor-pointer px-4 py-3 text-[13px] font-bold text-navy">
        City prices · {overridden ? `${overridden} ${overridden === 1 ? "city differs" : "cities differ"}` : "all national"}
      </summary>
      <div className="overflow-x-auto px-4 pb-4">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-1.5 text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-soft">
              <th className="pr-3 font-semibold">City</th>
              {fields.map((f) => (
                <th key={f} className="pr-3 font-semibold">
                  {PRICE_LABELS[f]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cities.map((c) => (
              <tr key={c.slug}>
                <td className="pr-3 font-semibold text-navy">{c.name}</td>
                {fields.map((f) => (
                  <td key={f} className="pr-3">
                    <input
                      aria-label={`${c.name} ${PRICE_LABELS[f]}`}
                      value={value[c.slug]?.[f] ?? ""}
                      placeholder={base[f] || "—"}
                      inputMode={isDigits(f) ? "numeric" : undefined}
                      disabled={disabled}
                      onChange={(e) => set(c.slug, f, e.target.value)}
                      className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm text-navy outline-none placeholder:text-ink-soft/40 focus:border-brand disabled:bg-mist"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
