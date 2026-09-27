"use client";

import { Plus } from "lucide-react";
import {
  FEATURE_ICONS,
  emptyPage,
  emptyPrice,
  headline,
  type Feature,
  type FeatureIcon,
  type Plan,
  type PlanPage,
  type Row as CardRow,
  type SiteContent,
} from "@/lib/content";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";
import { PLAN_PAGES } from "@/lib/plan-pages";
import {
  AddByName,
  Area,
  Badge,
  Cell,
  Checks,
  Collapsible,
  ImageField,
  ListControls,
  Row,
  RowHeads,
  Section,
  Select,
  Text,
  Toggle,
  button,
  control,
  move,
} from "./fields";
import { CityPriceTable, PriceGrid } from "./price-fields";
import { newId, type Setter } from "./shared";

const PLAN_FIELDS = ["amount", "unit", "deposit", "upfront", "tenureMonths"] as const;

const ICON_NAMES: Record<FeatureIcon, string> = {
  card: "Card",
  coins: "Coins",
  calendar: "Calendar",
  key: "Key",
  shield: "Shield",
  wrench: "Spanner",
};

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
    <div className="grid gap-3">
      <p className="text-[13px] text-ink-soft">Plans appear on the home page in this order</p>
      {content.plans.map((plan, i) => {
        const page = PLAN_PAGES.find((p) => p.planId === plan.id);
        const price = headline(plan.price);
        return (
          <Collapsible
            key={plan.id}
            title={plan.name.en || plan.id}
            meta={
              <>
                {price ? <Badge tone="blue">{price}</Badge> : null}
                <Badge tone={plan.visible ? "green" : "grey"}>{plan.visible ? "Offered" : "Not offered"}</Badge>
                {plan.showCard ? <Badge>Home page card</Badge> : null}
              </>
            }
            actions={
              <ListControls
                index={i}
                count={content.plans.length}
                disabled={locked}
                onMove={(to) => setContent((c) => ({ ...c, plans: move(c.plans, i, to) }))}
                onRemove={plan.id === content.calculator.planId ? undefined : () => remove(i)}
                removeLabel={`Remove ${plan.name.en || "plan"}`}
              />
            }
          >
            <Section title="Status">
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <Toggle label="Offered" checked={plan.visible} disabled={locked} onChange={(visible) => patch(i, { visible })} />
                <Toggle label="Card on the home page" checked={plan.showCard} disabled={locked} onChange={(showCard) => patch(i, { showCard })} />
              </div>
            </Section>

            <Section title="Name">
              <Row cols={3}>
                {LOCALES.map((l) => (
                  <Text
                    key={l}
                    label={`Name, ${LOCALE_META[l].label}`}
                    value={plan.name[l]}
                    disabled={locked}
                    onChange={(v) => patch(i, { name: { ...plan.name, [l]: v } as Record<Locale, string> })}
                  />
                ))}
              </Row>
            </Section>

            <Section title="Price" hint="National figures, with city rows below">
              <PriceGrid value={plan.price} fields={[...PLAN_FIELDS]} disabled={locked} onChange={(price) => patch(i, { price })} />
              <Row cols={2}>
                <Text
                  label="Word after the figures"
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
              </Row>
              <CityPriceTable
                cities={cities}
                base={plan.price}
                fields={[...PLAN_FIELDS]}
                value={plan.cityPrices}
                disabled={locked}
                onChange={(cityPrices) => patch(i, { cityPrices })}
              />
            </Section>

            <Section title="Cars">
              <Checks label="Cars offered" items={cars} selected={plan.carIds} disabled={locked} onChange={(carIds) => patch(i, { carIds })} />
            </Section>

            <Section title="Home page card">
              <Row cols={3}>
                <Text label="Tab above the card" value={plan.tag} disabled={locked} onChange={(tag) => patch(i, { tag })} />
                <Text label="Rent label on car cards" value={plan.priceLabel} disabled={locked} onChange={(priceLabel) => patch(i, { priceLabel })} />
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
              </Row>
              <RowsEditor rows={plan.rows} disabled={locked} onChange={(rows) => patch(i, { rows })} />
              <Area
                label="Key benefits"
                hint="one per line"
                rows={4}
                value={plan.benefits.join("\n")}
                disabled={locked}
                onChange={(v) => patch(i, { benefits: v.split("\n").map((s) => s.trim()).filter(Boolean) })}
              />
            </Section>

            <Section title="Driver pages" hint="The plan's line on each city's driver page.">
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
            </Section>

            <Section title="Plan page" hint={page ? `${page.path}/` : "No page for this plan"}>
              <PageEditor page={plan.page} disabled={locked} onChange={(next) => patch(i, { page: next })} />
            </Section>
          </Collapsible>
        );
      })}
      <AddByName label="New plan name" disabled={locked} onAdd={add} />
    </div>
  );
}

const ROWS_GRID = "sm:grid-cols-[180px_minmax(0,1fr)_104px]";

/** Extra label and value rows on the plan card, under deposit and vehicles. */
function RowsEditor({ rows, onChange, disabled }: { rows: CardRow[]; onChange: (rows: CardRow[]) => void; disabled: boolean }) {
  const set = (i: number, p: Partial<CardRow>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));
  return (
    <div className="grid gap-2">
      <p className="text-[13px] font-medium text-navy">Card rows</p>
      {rows.length ? <RowHeads grid={ROWS_GRID} heads={["Label", "Text", ""]} /> : null}
      {rows.map((row, i) => (
        <div key={i} className={`grid items-end gap-3 rounded-lg border border-line p-3 sm:items-center sm:rounded-none sm:border-0 sm:p-0 ${ROWS_GRID}`}>
          <Cell label="Label" value={row.label} disabled={disabled} onChange={(label) => set(i, { label })} />
          <Cell label="Text" value={row.value} disabled={disabled} onChange={(value) => set(i, { value })} />
          <div className="flex items-center justify-end">
            <ListControls
              index={i}
              count={rows.length}
              disabled={disabled}
              onMove={(to) => onChange(move(rows, i, to))}
              onRemove={() => onChange(rows.filter((_, j) => j !== i))}
              removeLabel="Remove row"
            />
          </div>
        </div>
      ))}
      <button type="button" disabled={disabled || rows.length >= 8} onClick={() => onChange([...rows, { label: "", value: "" }])} className={button.add}>
        <Plus size={14} />
        Add row
      </button>
    </div>
  );
}

const CARDS_GRID = "sm:grid-cols-[120px_minmax(0,1fr)_minmax(0,1.4fr)_104px]";

/** The plan's own page: hero, the blue band of cards, and the video heading. */
function PageEditor({ page, onChange, disabled }: { page: PlanPage; onChange: (page: PlanPage) => void; disabled: boolean }) {
  const set = (p: Partial<PlanPage>) => onChange({ ...page, ...p });
  const setFeature = (i: number, p: Partial<Feature>) => set({ features: page.features.map((f, j) => (j === i ? { ...f, ...p } : f)) });

  return (
    <>
      <p className="text-xs text-ink-soft">{"{price}, {deposit} and {months} print this plan's national figures"}</p>
      <Row cols={2}>
        <Text label="Heading, first line" value={page.headline} disabled={disabled} onChange={(headline) => set({ headline })} />
        <Text label="Heading, blue line" value={page.highlight} disabled={disabled} onChange={(highlight) => set({ highlight })} />
      </Row>
      <ImageField slot={page.heroImage} disabled={disabled} onChange={(heroImage) => set({ heroImage })} />
      <Row cols={3}>
        <Text label="Pill above the cards" value={page.whyTag} disabled={disabled} onChange={(whyTag) => set({ whyTag })} />
        <Text label="Cards heading" value={page.whyTitle} disabled={disabled} onChange={(whyTitle) => set({ whyTitle })} />
        <Text label="Cards subheading" value={page.whySubtitle} disabled={disabled} onChange={(whySubtitle) => set({ whySubtitle })} />
      </Row>

      <div className="grid gap-2">
        <p className="text-[13px] font-medium text-navy">Cards</p>
        {page.features.length ? <RowHeads grid={CARDS_GRID} heads={["Icon", "Title", "Line", ""]} /> : null}
        {page.features.map((feature, i) => (
          <div key={i} className={`grid gap-3 rounded-lg border border-line p-3 sm:items-center sm:rounded-none sm:border-0 sm:p-0 ${CARDS_GRID}`}>
            <label className="grid min-w-0 gap-1">
              <span className="text-xs font-medium text-ink-soft sm:sr-only">Icon</span>
              <select
                value={feature.icon}
                disabled={disabled}
                onChange={(e) => setFeature(i, { icon: e.target.value as FeatureIcon })}
                className={`${control} cursor-pointer`}
              >
                {FEATURE_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {ICON_NAMES[icon]}
                  </option>
                ))}
              </select>
            </label>
            <Cell label={`Card ${i + 1} title`} value={feature.title} disabled={disabled} onChange={(title) => setFeature(i, { title })} />
            <Cell label="Line" value={feature.body} disabled={disabled} onChange={(body) => setFeature(i, { body })} />
            <div className="flex items-center justify-end gap-1">
              <ListControls
                index={i}
                count={page.features.length}
                disabled={disabled}
                onMove={(to) => set({ features: move(page.features, i, to) })}
                onRemove={() => set({ features: page.features.filter((_, j) => j !== i) })}
                removeLabel="Remove card"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          disabled={disabled || page.features.length >= 9}
          onClick={() => set({ features: [...page.features, { icon: FEATURE_ICONS[page.features.length % FEATURE_ICONS.length], title: "", body: "" }] })}
          className={button.add}
        >
          <Plus size={14} />
          Add card
        </button>
      </div>

      <Text label="Video heading" value={page.storiesTitle} disabled={disabled} onChange={(storiesTitle) => set({ storiesTitle })} />
    </>
  );
}
