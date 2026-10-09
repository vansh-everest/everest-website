"use client";

import { useState } from "react";
import Link from "next/link";
import { Gauge, Plus } from "lucide-react";
import { placeholder, rupees, type Calculator, type CalculatorCar, type DepositOption, type SiteContent } from "@/lib/content";
import { Badge, Cell, Collapsible, ImageField, LinesArea, ListControls, NumbersInput, Panel, Row, RowHeads, Section, Text, button, move } from "./fields";
import { PLAN_PAGES } from "@/lib/plan-pages";
import { FromJarvis, JarvisYears } from "./jarvis-fields";
import type { JarvisView, Setter } from "./shared";

/**
 * One calculator per plan page. The tabs pick the plan; a plan without one shows none. On Jarvis
 * the picker's figures are Jarvis's, shown read only; the words, tenures and photos stay editable.
 */
export function CalculatorTab({
  content,
  setContent,
  locked,
  jarvis = null,
}: {
  content: SiteContent;
  setContent: Setter;
  locked: boolean;
  jarvis?: JarvisView | null;
}) {
  // Only a plan with its own page can show a calculator.
  const plans = content.plans.filter((p) => PLAN_PAGES.some((page) => page.planId === p.id));
  const [picked, setPicked] = useState(() => content.calculators[0]?.planId ?? "");
  const planId = plans.some((p) => p.id === picked) ? picked : (plans[0]?.id ?? "");
  const plan = plans.find((p) => p.id === planId);
  const calc = content.calculators.find((c) => c.planId === planId);

  const update = (fn: (calc: Calculator) => Calculator) =>
    setContent((c) => ({ ...c, calculators: c.calculators.map((x) => (x.planId === planId ? fn(x) : x)) }));
  const patch = (p: Partial<Calculator>) => update((x) => ({ ...x, ...p }));
  const patchCar = (i: number, p: Partial<CalculatorCar>) =>
    update((x) => ({ ...x, cars: x.cars.map((car, j) => (j === i ? { ...car, ...p } : car)) }));
  const create = () =>
    setContent((c) => ({
      ...c,
      calculators: [...c.calculators, { planId, depositLabel: "Deposit", cars: [], tenures: [], perks: ["Taxes and insurance included"] }],
    }));
  const discard = () => setContent((c) => ({ ...c, calculators: c.calculators.filter((x) => x.planId !== planId) }));

  const carName = (id: string) => {
    const car = content.cars.find((c) => c.id === id);
    return car ? [car.make, car.name].filter(Boolean).join(" ") || car.id : id;
  };
  const studioPhoto = (id: string) =>
    content.calculators.flatMap((c) => c.cars).find((car) => car.carId === id && car.image.url)?.image ??
    placeholder(`${carName(id)}, studio photo`);
  const addable = calc ? (plan?.carIds ?? []).filter((id) => !calc.cars.some((c) => c.carId === id)) : [];
  const moneyLabel = calc?.depositLabel || (planId === "own-now" ? "Upfront payment" : "Deposit");

  const figures = jarvis ? (
    <Panel
      title="Prices"
      aside={
        <>
          <FromJarvis />
          <Link href="/admin/live-data" className={button.small}>
            <Gauge size={14} />
            Live data
          </Link>
        </>
      }
    >
      <JarvisYears key={planId} cities={jarvis.calculators[planId] ?? []} moneyLabel={moneyLabel} />
    </Panel>
  ) : null;

  return (
    <div className="grid gap-3">
      <div role="tablist" aria-label="Plan" className="flex flex-wrap gap-1.5">
        {plans.map((p) => {
          const has = content.calculators.some((c) => c.planId === p.id);
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === planId}
              onClick={() => setPicked(p.id)}
              className={`flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium ${
                p.id === planId ? "bg-navy text-white" : "border border-line bg-white text-navy"
              }`}
            >
              {p.name.en || p.id}
              {has ? null : <span className={p.id === planId ? "text-white/60" : "text-ink-soft"}>· none</span>}
            </button>
          );
        })}
      </div>

      {!calc ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-navy/20 bg-white/60 p-4">
          <p className="text-[13px] text-ink-soft">No calculator on the {plan?.name.en || planId} page</p>
          <button type="button" disabled={locked || !plan} onClick={create} className={button.small}>
            <Plus size={14} />
            Add a calculator
          </button>
        </div>
      ) : null}
      {!calc ? (
        figures
      ) : (
        <>
          <Panel
            title={`${plan?.name.en || planId} calculator`}
            aside={
              <button type="button" disabled={locked} onClick={discard} className={`${button.small} text-[#b3261e]`}>
                Remove calculator
              </button>
            }
          >
            <Row cols={2}>
              <Text
                label="Deposit label"
                placeholder="Upfront payment"
                value={calc.depositLabel}
                disabled={locked}
                onChange={(depositLabel) => patch({ depositLabel })}
              />
              <NumbersInput
                label="Tenures (months)"
                hint="blank hides the picker"
                placeholder="48, 36"
                value={calc.tenures}
                disabled={locked}
                onChange={(tenures) => patch({ tenures })}
              />
            </Row>
            <LinesArea
              label="Ticks beside the car"
              hint="one per line, {months} prints the tenure"
              rows={3}
              max={8}
              value={calc.perks}
              disabled={locked}
              onChange={(perks) => patch({ perks })}
            />
          </Panel>
          {figures}

          <p className="mt-3 text-[13px] text-ink-soft">{jarvis ? "Studio photos for the picker" : "Cars appear in the picker in this order"}</p>
          {calc.cars.map((car, i) => {
            const start = car.options[car.defaultOption];
            return (
              <Collapsible
                key={car.carId}
                defaultOpen
                title={carName(car.carId)}
                meta={
                  jarvis ? null : (
                    <>
                      {start?.deposit && start.daily ? (
                        <Badge tone="blue">
                          {rupees(start.deposit)} · {rupees(start.daily)}/day
                        </Badge>
                      ) : null}
                      <Badge>{car.options.length === 1 ? "1 stop" : `${car.options.length} stops`}</Badge>
                    </>
                  )
                }
                actions={
                  <ListControls
                    index={i}
                    count={calc.cars.length}
                    disabled={locked}
                    onMove={(to) => patch({ cars: move(calc.cars, i, to) })}
                    onRemove={() => patch({ cars: calc.cars.filter((_, j) => j !== i) })}
                    removeLabel={`Remove ${carName(car.carId)}`}
                    hideMove={Boolean(jarvis)}
                  />
                }
              >
                <Section title="Photo">
                  <ImageField slot={car.image} disabled={locked} onChange={(image) => patchCar(i, { image })} />
                </Section>
                {jarvis ? null : (
                  <Section title="Slider stops" hint="The slider shows once there are two or more">
                    <DepositOptions
                      car={car}
                      name={`default-${planId}-${car.carId}`}
                      depositLabel={calc.depositLabel || "Deposit"}
                      locked={locked}
                      onChange={(p) => patchCar(i, p)}
                    />
                  </Section>
                )}
              </Collapsible>
            );
          })}

          {addable.length ? (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-navy/20 bg-white/60 p-4">
              <span className="mr-1 text-[13px] font-medium text-navy">Add a car</span>
              {addable.map((id) => (
                <button
                  key={id}
                  type="button"
                  disabled={locked}
                  onClick={() =>
                    patch({
                      cars: [
                        ...calc.cars,
                        { carId: id, image: studioPhoto(id), options: jarvis ? [] : [{ deposit: "", daily: "" }], defaultOption: 0 },
                      ],
                    })
                  }
                  className={button.small}
                >
                  <Plus size={14} />
                  {carName(id)}
                </button>
              ))}
            </div>
          ) : calc.cars.length ? null : (
            <p className="text-[13px] text-ink-soft">Tick cars for this plan in the Plans tab first</p>
          )}
        </>
      )}
    </div>
  );
}

const STOPS_GRID = "sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_112px_40px]";

/** Slider stops for one car: pay this deposit, then this much a day. */
function DepositOptions({
  car,
  name,
  depositLabel,
  locked,
  onChange,
}: {
  car: CalculatorCar;
  name: string;
  depositLabel: string;
  locked: boolean;
  onChange: (p: Partial<CalculatorCar>) => void;
}) {
  const setOption = (i: number, p: Partial<DepositOption>) => onChange({ options: car.options.map((o, j) => (j === i ? { ...o, ...p } : o)) });

  return (
    <div className="grid gap-2">
      <RowHeads grid={STOPS_GRID} heads={[`${depositLabel} (₹)`, "Per day (₹)", "", ""]} />
      {car.options.map((option, i) => (
        <div key={i} className={`grid items-end gap-3 rounded-lg border border-line p-3 sm:items-center sm:rounded-none sm:border-0 sm:p-0 ${STOPS_GRID}`}>
          <Cell label={`${depositLabel} (₹)`} numeric value={option.deposit} disabled={locked} onChange={(deposit) => setOption(i, { deposit })} />
          <Cell label="Per day (₹)" numeric value={option.daily} disabled={locked} onChange={(daily) => setOption(i, { daily })} />
          <label className="flex h-10 cursor-pointer items-center gap-2 text-[13px] font-medium text-navy">
            <input
              type="radio"
              name={name}
              checked={car.defaultOption === i}
              disabled={locked}
              onChange={() => onChange({ defaultOption: i })}
              className="size-4 accent-brand"
            />
            Starts here
          </label>
          <div className="flex justify-end">
            <ListControls
              index={i}
              count={1}
              disabled={locked || car.options.length <= 1}
              onMove={() => {}}
              onRemove={() =>
                onChange({
                  options: car.options.filter((_, j) => j !== i),
                  defaultOption: Math.max(0, car.defaultOption - (i <= car.defaultOption ? 1 : 0)),
                })
              }
              removeLabel="Remove stop"
              hideMove
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        disabled={locked || car.options.length >= 20}
        onClick={() => onChange({ options: [...car.options, { deposit: "", daily: "" }] })}
        className={button.add}
      >
        <Plus size={14} />
        Add slider stop
      </button>
    </div>
  );
}
