"use client";

import { emptyPrice, placeholder, type Car, type SiteContent } from "@/lib/content";
import { AddByName, Checks, ImageField, ListControls, Panel, Select, Text, Toggle, move } from "./fields";
import { CityPriceTable, PriceGrid } from "./price-fields";
import { newId, type Setter } from "./shared";

const CAR_FIELDS = ["amount", "unit", "deposit", "tenureMonths"] as const;

export function CarsTab({ content, setContent, locked }: { content: SiteContent; setContent: Setter; locked: boolean }) {
  const cities = content.cities.map((c) => ({ slug: c.slug, name: c.name.en }));
  const plans = content.plans.map((p) => ({ id: p.id, label: p.name.en || p.id }));

  const patch = (i: number, p: Partial<Car>) =>
    setContent((c) => ({ ...c, cars: c.cars.map((x, j) => (j === i ? { ...x, ...p } : x)) }));

  /** The plans a car is offered under live on the plans, so both tabs edit the same list. */
  function setPlans(carId: string, planIds: string[]) {
    setContent((c) => ({
      ...c,
      plans: c.plans.map((p) => {
        const has = p.carIds.includes(carId);
        const wants = planIds.includes(p.id);
        if (has === wants) return p;
        return { ...p, carIds: wants ? [...p.carIds, carId] : p.carIds.filter((id) => id !== carId) };
      }),
    }));
  }

  function add(name: string) {
    setContent((c) => {
      const id = newId(name, c.cars.map((x) => x.id));
      const car: Car = {
        id,
        visible: false,
        make: "",
        name,
        subtitle: "",
        fuel: "CNG",
        condition: "",
        highlight: "",
        highlightTone: "brand",
        image: placeholder(`${name} photo`, `White Everest Fleet ${name}`),
        modelYears: "",
        price: emptyPrice(),
        cityPrices: {},
      };
      return { ...c, cars: [...c.cars, car] };
    });
  }

  function remove(i: number) {
    const id = content.cars[i].id;
    setContent((c) => ({
      ...c,
      cars: c.cars.filter((_, j) => j !== i),
      plans: c.plans.map((p) => ({ ...p, carIds: p.carIds.filter((x) => x !== id) })),
      calculator: { ...c.calculator, cars: c.calculator.cars.filter((x) => x.carId !== id) },
    }));
  }

  return (
    <div className="grid gap-5">
      <p className="text-[13px] text-ink-soft">Car card order, left to right</p>
      {content.cars.map((car, i) => (
        <Panel
          key={car.id}
          title={[car.make, car.name].filter(Boolean).join(" ") || car.id}
          aside={
            <ListControls
              index={i}
              count={content.cars.length}
              disabled={locked}
              onMove={(to) => setContent((c) => ({ ...c, cars: move(c.cars, i, to) }))}
              onRemove={() => remove(i)}
            />
          }
        >
          <Toggle label="Show a card for this car" checked={car.visible} disabled={locked} onChange={(visible) => patch(i, { visible })} />

          <div className="grid gap-4 sm:grid-cols-3">
            <Text label="Make" value={car.make} disabled={locked} onChange={(make) => patch(i, { make })} />
            <Text label="Model" value={car.name} disabled={locked} onChange={(name) => patch(i, { name })} />
            <Text label="Line under the model" value={car.subtitle} disabled={locked} onChange={(subtitle) => patch(i, { subtitle })} />
            <Text label="Fuel" value={car.fuel} disabled={locked} onChange={(fuel) => patch(i, { fuel })} />
            <Select
              label="Condition"
              value={car.condition}
              disabled={locked}
              options={[
                { value: "", label: "Not shown" },
                { value: "Pre-owned", label: "Pre-owned" },
                { value: "Brand new", label: "Brand new" },
              ]}
              onChange={(condition) => patch(i, { condition })}
            />
            <Text label="Model years" value={car.modelYears} disabled={locked} onChange={(modelYears) => patch(i, { modelYears })} />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
            <Text label="Tab above the card" value={car.highlight} disabled={locked} onChange={(highlight) => patch(i, { highlight })} />
            <Select
              label="Tab colour"
              value={car.highlightTone}
              disabled={locked}
              options={[
                { value: "brand", label: "Blue" },
                { value: "leaf", label: "Green" },
              ]}
              onChange={(highlightTone) => patch(i, { highlightTone })}
            />
          </div>

          <ImageField slot={car.image} disabled={locked} onChange={(image) => patch(i, { image })} />

          <PriceGrid value={car.price} fields={[...CAR_FIELDS]} disabled={locked} onChange={(price) => patch(i, { price })} />
          <CityPriceTable
            cities={cities}
            base={car.price}
            fields={[...CAR_FIELDS]}
            value={car.cityPrices}
            disabled={locked}
            onChange={(cityPrices) => patch(i, { cityPrices })}
          />

          <Checks
            label="Offered under"
            items={plans}
            selected={content.plans.filter((p) => p.carIds.includes(car.id)).map((p) => p.id)}
            disabled={locked}
            onChange={(ids) => setPlans(car.id, ids)}
          />
        </Panel>
      ))}
      <AddByName label="New car model" disabled={locked} onAdd={add} />
    </div>
  );
}
