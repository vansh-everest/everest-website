"use client";

import { emptyPrice, headline, placeholder, type Car, type SiteContent } from "@/lib/content";
import { AddByName, Badge, Checks, Collapsible, ImageField, ListControls, Row, Section, Select, Text, Toggle, move } from "./fields";
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
      calculators: c.calculators.map((calc) => ({ ...calc, cars: calc.cars.filter((x) => x.carId !== id) })),
    }));
  }

  return (
    <div className="grid gap-3">
      <p className="text-[13px] text-ink-soft">The home page car slider shows the cars with a card, in this order</p>
      {content.cars.map((car, i) => {
        const price = headline(car.price);
        return (
          <Collapsible
            key={car.id}
            title={[car.make, car.name].filter(Boolean).join(" ") || car.id}
            thumb={
              <span className="hidden h-9 w-12 shrink-0 overflow-hidden rounded-md border border-line bg-mist sm:block">
                {car.image.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={car.image.url} alt="" className="h-full w-full object-cover" />
                ) : null}
              </span>
            }
            meta={
              <>
                {price ? <Badge tone="blue">{price}</Badge> : null}
                {car.fuel ? <Badge>{car.fuel}</Badge> : null}
                <Badge tone={car.visible ? "green" : "grey"}>{car.visible ? "Card shown" : "Hidden"}</Badge>
              </>
            }
            actions={
              <ListControls
                index={i}
                count={content.cars.length}
                disabled={locked}
                onMove={(to) => setContent((c) => ({ ...c, cars: move(c.cars, i, to) }))}
                onRemove={() => remove(i)}
                removeLabel={`Remove ${car.name || "car"}`}
              />
            }
          >
            <Section title="Status">
              <Toggle label="Show in the home page car slider" checked={car.visible} disabled={locked} onChange={(visible) => patch(i, { visible })} />
            </Section>

            <Section title="Details">
              <Row cols={3}>
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
              </Row>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px]">
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
            </Section>

            <Section title="Photo">
              <ImageField slot={car.image} disabled={locked} onChange={(image) => patch(i, { image })} />
            </Section>

            <Section title="Price" hint="Shown on the home page car cards">
              <PriceGrid value={car.price} fields={[...CAR_FIELDS]} disabled={locked} onChange={(price) => patch(i, { price })} />
              <CityPriceTable
                cities={cities}
                base={car.price}
                fields={[...CAR_FIELDS]}
                value={car.cityPrices}
                disabled={locked}
                onChange={(cityPrices) => patch(i, { cityPrices })}
              />
            </Section>

            <Section title="Plans">
              <Checks
                label="Offered under"
                items={plans}
                selected={content.plans.filter((p) => p.carIds.includes(car.id)).map((p) => p.id)}
                disabled={locked}
                onChange={(ids) => setPlans(car.id, ids)}
              />
            </Section>
          </Collapsible>
        );
      })}
      <AddByName label="New car model" disabled={locked} onAdd={add} />
    </div>
  );
}
