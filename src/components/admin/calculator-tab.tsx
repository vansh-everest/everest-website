"use client";

import { Plus } from "lucide-react";
import { placeholder, rupees, type Calculator, type CalculatorCar, type DepositOption, type SiteContent } from "@/lib/content";
import { Area, Badge, Cell, Collapsible, ImageField, ListControls, Panel, Row, RowHeads, Section, Select, Text, button, move } from "./fields";
import type { Setter } from "./shared";

export function CalculatorTab({ content, setContent, locked }: { content: SiteContent; setContent: Setter; locked: boolean }) {
  const calc = content.calculator;
  const patch = (p: Partial<Calculator>) => setContent((c) => ({ ...c, calculator: { ...c.calculator, ...p } }));
  const patchCar = (i: number, p: Partial<CalculatorCar>) =>
    setContent((c) => ({
      ...c,
      calculator: { ...c.calculator, cars: c.calculator.cars.map((x, j) => (j === i ? { ...x, ...p } : x)) },
    }));

  const carName = (id: string) => {
    const car = content.cars.find((c) => c.id === id);
    return car ? [car.make, car.name].filter(Boolean).join(" ") || car.id : id;
  };
  const plan = content.plans.find((p) => p.id === calc.planId);
  const addable = (plan?.carIds ?? []).filter((id) => !calc.cars.some((c) => c.carId === id));

  return (
    <div className="grid gap-3">
      <Panel title="Own Now calculator">
        <Row cols={2}>
          <Select
            label="Plan it prices"
            value={calc.planId}
            disabled={locked}
            options={content.plans.map((p) => ({ value: p.id, label: p.name.en || p.id }))}
            onChange={(planId) => patch({ planId })}
          />
          <Text
            label="Tenures (months)"
            placeholder="48, 36"
            value={calc.tenures.join(", ")}
            disabled={locked}
            onChange={(v) => patch({ tenures: v.split(/[^\d]+/).filter(Boolean) })}
          />
        </Row>
        <Area
          label="Ticks beside the car"
          hint="one per line, {months} prints the tenure"
          rows={3}
          value={calc.perks.join("\n")}
          disabled={locked}
          onChange={(v) => patch({ perks: v.split("\n").map((s) => s.trim()).filter(Boolean) })}
        />
      </Panel>

      <p className="mt-3 text-[13px] text-ink-soft">Cars appear in the picker in this order</p>
      {calc.cars.map((car, i) => {
        const start = car.options[car.defaultOption];
        return (
          <Collapsible
            key={car.carId}
            defaultOpen
            title={carName(car.carId)}
            meta={
              <>
                {start?.deposit && start.daily ? (
                  <Badge tone="blue">
                    {rupees(start.deposit)} · {rupees(start.daily)}/day
                  </Badge>
                ) : null}
                <Badge>{car.options.length === 1 ? "1 stop" : `${car.options.length} stops`}</Badge>
              </>
            }
            actions={
              <ListControls
                index={i}
                count={calc.cars.length}
                disabled={locked}
                onMove={(to) => patch({ cars: move(calc.cars, i, to) })}
                onRemove={() => patch({ cars: calc.cars.filter((_, j) => j !== i) })}
                removeLabel={`Remove ${carName(car.carId)}`}
              />
            }
          >
            <Section title="Photo">
              <ImageField slot={car.image} disabled={locked} onChange={(image) => patchCar(i, { image })} />
            </Section>
            <Section title="Slider stops" hint="The slider shows once there are two or more">
              <DepositOptions car={car} name={`default-${car.carId}`} locked={locked} onChange={(p) => patchCar(i, p)} />
            </Section>
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
                    { carId: id, image: placeholder(`${carName(id)}, studio photo`), options: [{ deposit: "", daily: "" }], defaultOption: 0 },
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
      ) : null}
    </div>
  );
}

const STOPS_GRID = "sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_112px_40px]";

/** Slider stops for one car: pay this much upfront, then this much a day. */
function DepositOptions({
  car,
  name,
  locked,
  onChange,
}: {
  car: CalculatorCar;
  name: string;
  locked: boolean;
  onChange: (p: Partial<CalculatorCar>) => void;
}) {
  const setOption = (i: number, p: Partial<DepositOption>) => onChange({ options: car.options.map((o, j) => (j === i ? { ...o, ...p } : o)) });

  return (
    <div className="grid gap-2">
      <RowHeads grid={STOPS_GRID} heads={["Upfront (₹)", "Per day (₹)", "", ""]} />
      {car.options.map((option, i) => (
        <div key={i} className={`grid items-end gap-3 rounded-lg border border-line p-3 sm:items-center sm:rounded-none sm:border-0 sm:p-0 ${STOPS_GRID}`}>
          <Cell label="Upfront (₹)" numeric value={option.deposit} disabled={locked} onChange={(deposit) => setOption(i, { deposit })} />
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
