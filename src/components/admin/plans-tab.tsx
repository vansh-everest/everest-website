"use client";

import { FEATURE_ICONS, emptyPage, emptyPrice, type Feature, type FeatureIcon, type Plan, type PlanPage, type Row, type SiteContent } from "@/lib/content";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";
import { AddByName, Area, Checks, ImageField, ListControls, Panel, Select, Text, Toggle, move } from "./fields";
import { CityPriceTable, PriceGrid } from "./price-fields";
import { newId, type Setter } from "./shared";

const PLAN_FIELDS = ["amount", "unit", "deposit", "upfront", "tenureMonths"] as const;

export function PlansTab({ content, setContent, locked }: { content: SiteContent; setContent: Setter; locked: boolean }) {
  const cities = content.cities.map((c) => ({ slug: c.slug, name: c.name.en }));
  const cars = content.cars.map((c) => ({ id: c.id, label: c.visible ? c.name || c.id : `${c.name || c.id} (hidden)` }));

  const patch = (i: number, p: Partial<Plan>) =>
    setContent((c) => ({ ...c, plans: c.plans.map((x, j) => (j === i ? { ...x, ...p } : x)) }));

  function add(name: string) {
    setContent((c) => {
      const id = newId(name, c.plans.map((p) => p.id));
      const plan: Plan = {
        id,
        visible: false,
        showCard: false,
        name: { en: name, hi: name, te: name },
        shortName: "",
        summary: { en: "", hi: "", te: "" },
        tag: "",
        priceLabel: "Rent starting from",
        theme: "light",
        price: emptyPrice(),
        depositNote: "",
        tenureNote: "",
        cityPrices: {},
        rows: [],
        benefits: [],
        carIds: [],
        page: emptyPage(name),
      };
      return { ...c, plans: [...c.plans, plan] };
    });
  }

  function remove(i: number) {
    const plan = content.plans[i];
    setContent((c) => ({
      ...c,
      plans: c.plans.filter((_, j) => j !== i),
      cities: c.cities.map((city) => ({ ...city, plans: city.plans.filter((id) => id !== plan.id) })),
    }));
  }

  return (
    <div className="grid gap-5">
      <p className="text-[13px] text-ink-soft">Home page order, top to bottom</p>
      {content.plans.map((plan, i) => (
        <Panel
          key={plan.id}
          title={plan.name.en || plan.id}
          aside={
            <ListControls
              index={i}
              count={content.plans.length}
              disabled={locked}
              onMove={(to) => setContent((c) => ({ ...c, plans: move(c.plans, i, to) }))}
              onRemove={plan.id === content.calculator.planId ? undefined : () => remove(i)}
            />
          }
        >
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Toggle label="Offered" checked={plan.visible} disabled={locked} onChange={(visible) => patch(i, { visible })} />
            <Toggle
              label="Card on the home page"
              checked={plan.showCard}
              disabled={locked}
              onChange={(showCard) => patch(i, { showCard })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {LOCALES.map((l) => (
              <Text
                key={l}
                label={`Name, ${LOCALE_META[l].label}`}
                value={plan.name[l]}
                disabled={locked}
                onChange={(v) => patch(i, { name: { ...plan.name, [l]: v } as Record<Locale, string> })}
              />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <Text label="Badge on car cards" value={plan.shortName} disabled={locked} onChange={(shortName) => patch(i, { shortName })} />
            <Text label="Tab above the card" value={plan.tag} disabled={locked} onChange={(tag) => patch(i, { tag })} />
            <Text label="Line above the price" value={plan.priceLabel} disabled={locked} onChange={(priceLabel) => patch(i, { priceLabel })} />
            <Select
              label="Card colour"
              value={plan.theme}
              disabled={locked}
              options={[
                { value: "dark", label: "Navy" },
                { value: "light", label: "White" },
              ]}
              onChange={(theme) => patch(i, { theme })}
            />
          </div>

          <PriceGrid value={plan.price} fields={[...PLAN_FIELDS]} disabled={locked} onChange={(price) => patch(i, { price })} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Text
              label="After the deposit"
              placeholder="Onwards"
              value={plan.depositNote}
              disabled={locked}
              onChange={(depositNote) => patch(i, { depositNote })}
            />
            <Text
              label="Tenure when no months"
              placeholder="Flexible"
              value={plan.tenureNote}
              disabled={locked}
              onChange={(tenureNote) => patch(i, { tenureNote })}
            />
          </div>
          <CityPriceTable
            cities={cities}
            base={plan.price}
            fields={[...PLAN_FIELDS]}
            value={plan.cityPrices}
            disabled={locked}
            onChange={(cityPrices) => patch(i, { cityPrices })}
          />

          <Checks
            label="Cars offered"
            items={cars}
            selected={plan.carIds}
            disabled={locked}
            onChange={(carIds) => patch(i, { carIds })}
          />

          <RowsEditor rows={plan.rows} disabled={locked} onChange={(rows) => patch(i, { rows })} />

          <Area
            label="Key benefits"
            hint="one per line"
            rows={4}
            value={plan.benefits.join("\n")}
            disabled={locked}
            onChange={(v) => patch(i, { benefits: v.split("\n").map((s) => s.trim()).filter(Boolean) })}
          />

          {LOCALES.map((l) => (
            <Area
              key={l}
              rows={2}
              label={`Driver page summary, ${LOCALE_META[l].label}`}
              value={plan.summary[l]}
              disabled={locked}
              onChange={(v) => patch(i, { summary: { ...plan.summary, [l]: v } as Record<Locale, string> })}
            />
          ))}

          <PageEditor page={plan.page} disabled={locked} onChange={(page) => patch(i, { page })} />
        </Panel>
      ))}
      <AddByName label="New plan name" disabled={locked} onAdd={add} />
    </div>
  );
}

/** Extra label and value rows on the plan card, under deposit and vehicles. */
function RowsEditor({ rows, onChange, disabled }: { rows: Row[]; onChange: (rows: Row[]) => void; disabled: boolean }) {
  const set = (i: number, p: Partial<Row>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));
  return (
    <div className="grid gap-3">
      <p className="text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-soft">
        Card rows <span className="normal-case tracking-normal text-ink-soft/70">after deposit and vehicles</span>
      </p>
      {rows.map((row, i) => (
        <div key={i} className="grid items-end gap-3 sm:grid-cols-[180px_1fr_auto]">
          <Text label="Label" value={row.label} disabled={disabled} onChange={(label) => set(i, { label })} />
          <Text label="Text" value={row.value} disabled={disabled} onChange={(value) => set(i, { value })} />
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            className="h-10 rounded-full border border-line px-4 text-[13px] font-bold text-[#b3261e] disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={disabled || rows.length >= 8}
        onClick={() => onChange([...rows, { label: "", value: "" }])}
        className="h-9 justify-self-start rounded-full border border-dashed border-line bg-white px-4 text-[13px] font-bold text-navy disabled:opacity-50"
      >
        Add row
      </button>
    </div>
  );
}

const ICON_NAMES: Record<FeatureIcon, string> = {
  card: "Card",
  coins: "Coins",
  calendar: "Calendar",
  key: "Key",
  shield: "Shield",
  wrench: "Spanner",
};

/** The plan's own page: hero, the blue band of cards, and the video heading. */
function PageEditor({ page, onChange, disabled }: { page: PlanPage; onChange: (page: PlanPage) => void; disabled: boolean }) {
  const set = (p: Partial<PlanPage>) => onChange({ ...page, ...p });
  const setFeature = (i: number, p: Partial<Feature>) =>
    set({ features: page.features.map((f, j) => (j === i ? { ...f, ...p } : f)) });

  return (
    <details className="rounded-xl border border-line bg-paper p-4">
      <summary className="cursor-pointer text-sm font-bold text-navy">Plan page</summary>
      <div className="mt-4 grid gap-4">
        <p className="text-[13px] text-ink-soft">{"{price}, {deposit} and {months} print this plan's national figures"}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Heading, first line" value={page.headline} disabled={disabled} onChange={(headline) => set({ headline })} />
          <Text label="Heading, blue line" value={page.highlight} disabled={disabled} onChange={(highlight) => set({ highlight })} />
        </div>
        <ImageField slot={page.heroImage} disabled={disabled} onChange={(heroImage) => set({ heroImage })} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Text label="Pill above the cards" value={page.whyTag} disabled={disabled} onChange={(whyTag) => set({ whyTag })} />
          <Text label="Cards heading" value={page.whyTitle} disabled={disabled} onChange={(whyTitle) => set({ whyTitle })} />
          <Text label="Cards subheading" value={page.whySubtitle} disabled={disabled} onChange={(whySubtitle) => set({ whySubtitle })} />
        </div>
        {page.features.map((feature, i) => (
          <div key={i} className="grid items-end gap-3 sm:grid-cols-[120px_1fr_1.4fr_auto]">
            <Select<FeatureIcon>
              label="Icon"
              value={feature.icon}
              disabled={disabled}
              options={FEATURE_ICONS.map((icon) => ({ value: icon, label: ICON_NAMES[icon] }))}
              onChange={(icon) => setFeature(i, { icon })}
            />
            <Text label={`Card ${i + 1} title`} value={feature.title} disabled={disabled} onChange={(title) => setFeature(i, { title })} />
            <Text label="Line" value={feature.body} disabled={disabled} onChange={(body) => setFeature(i, { body })} />
            <div className="flex h-10 items-center gap-2">
              <ListControls
                index={i}
                count={page.features.length}
                disabled={disabled}
                onMove={(to) => set({ features: move(page.features, i, to) })}
                onRemove={() => set({ features: page.features.filter((_, j) => j !== i) })}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          disabled={disabled || page.features.length >= 9}
          onClick={() => set({ features: [...page.features, { icon: FEATURE_ICONS[page.features.length % FEATURE_ICONS.length], title: "", body: "" }] })}
          className="h-9 justify-self-start rounded-full border border-dashed border-line bg-white px-4 text-[13px] font-bold text-navy disabled:opacity-50"
        >
          Add card
        </button>
        <Text label="Video heading" value={page.storiesTitle} disabled={disabled} onChange={(storiesTitle) => set({ storiesTitle })} />
      </div>
    </details>
  );
}
