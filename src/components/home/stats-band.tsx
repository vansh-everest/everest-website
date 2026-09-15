import { Fragment } from "react";

const stats = [
  { value: "35,000+", label: "Cars on the road" },
  { value: "7", label: "Cities" },
  { value: "50,000+", label: "Drivers" },
  { value: "9+ Yrs", label: "Of operations" },
  { value: "✓ Uber", label: "Official partner" },
];

export function StatsBand() {
  return (
    <section className="bg-sun px-6 pb-11 pt-12">
      <ul className="mx-auto grid max-w-[1184px] grid-cols-2 gap-y-8 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:px-6">
        {stats.map((stat, i) => (
          <Fragment key={stat.label}>
            {i > 0 && <li aria-hidden className="hidden h-12 w-px bg-navy/40 lg:block" />}
            <li className="flex flex-col items-center text-center">
              <span className="text-[36px] font-extrabold leading-10 text-navy lg:text-[48px]">{stat.value}</span>
              <span className="mt-2 text-xs font-semibold uppercase leading-[18px] tracking-[1px] text-navy">
                {stat.label}
              </span>
            </li>
          </Fragment>
        ))}
      </ul>
    </section>
  );
}
