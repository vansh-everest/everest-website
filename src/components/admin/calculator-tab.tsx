"use client";

import { placeholder, rupees, type Calculator, type CalculatorCar, type DepositOption, type SiteContent } from "@/lib/content";
import { Area, ImageField, ListControls, Panel, Select, Text, move } from "./fields";
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
    <div className="grid gap-5">
      <Panel title="Own Now calculator">
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
        <Area
          label="Ticks beside the car"
          hint="one per line, {months} prints the tenure"
          rows={3}
          value={calc.perks.join("\n")}
          disabled={locked}
          onChange={(v) => patch({ perks: v.split("\n").map((s) => s.trim()).filter(Boolean) })}
        />
      </Panel>

      <p className="text-[13px] text-ink-soft">Order in the car picker, top to bottom</p>
      {calc.cars.map((car, i) => (
        <Panel
          key={car.carId}
          title={carName(car.carId)}
          aside={
            <ListControls
              index={i}
              count={calc.cars.length}
              disabled={locked}
              onMove={(to) => patch({ cars: move(calc.cars, i, to) })}
              onRemove={() => patch({ cars: calc.cars.filter((_, j) => j !== i) })}
            />
          }
        >
          <ImageField slot={car.image} disabled={locked} onChange={(image) => patchCar(i, { image })} />
          <DepositOptions car={car} name={`default-${car.carId}`} locked={locked} onChange={(p) => patchCar(i, p)} />
        </Panel>
      ))}

      {addable.length ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-line bg-white p-4">
          <span className="text-sm font-semibold text-navy">Add a car</span>
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
              className="h-9 rounded-full bg-navy px-4 text-[13px] font-bold text-white disabled:opacity-50"
            >
              {carName(id)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Slider stops for one car: pay this deposit, then this much a day. */
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
  const setOption = (i: number, p: Partial<DepositOption>) =>
    onChange({ options: car.options.map((o, j) => (j === i ? { ...o, ...p } : o)) });
  const start = car.options[car.defaultOption];

  return (
    <div className="grid gap-3">
      <p className="text-[13px] text-ink-soft">Slider stops, shown once there are two or more</p>
      {car.options.map((option, i) => (
        <div key={i} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
          <Text label="Upfront (₹)" numeric value={option.deposit} disabled={locked} onChange={(deposit) => setOption(i, { deposit })} />
          <Text label="Per day (₹)" numeric value={option.daily} disabled={locked} onChange={(daily) => setOption(i, { daily })} />
          <label className="flex h-10 items-center gap-2 text-sm font-semibold text-navy">
            <input
              type="radio"
              name={name}
              checked={car.defaultOption === i}
              disabled={locked}
              onChange={() => onChange({ defaultOption: i })}
              className="h-4 w-4 accent-brand"
            />
            Starts here
          </label>
          <button
            type="button"
            disabled={locked || car.options.length <= 1}
            onClick={() =>
              onChange({
                options: car.options.filter((_, j) => j !== i),
                defaultOption: Math.max(0, car.defaultOption - (i <= car.defaultOption ? 1 : 0)),
              })
            }
            className="h-10 rounded-full border border-line px-4 text-[13px] font-bold text-[#b3261e] disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={locked || car.options.length >= 20}
        onClick={() => onChange({ options: [...car.options, { deposit: "", daily: "" }] })}
        className="h-9 justify-self-start rounded-full border border-dashed border-line bg-white px-4 text-[13px] font-bold text-navy disabled:opacity-50"
      >
        Add slider stop
      </button>
      {start?.deposit && start.daily ? (
        <p className="text-[13px] text-navy">
          Opens at {rupees(start.deposit)} upfront, {rupees(start.daily)} a day
        </p>
      ) : null}
    </div>
  );
}
