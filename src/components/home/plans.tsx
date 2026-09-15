import Image from "next/image";
import type { ReactNode } from "react";
import { CityPill } from "./ui";

type Plan = {
  tag: string;
  name: string;
  price: string;
  unit: string;
  dark?: boolean;
  chip: string;
  rows: { label: string; value: ReactNode }[];
  benefits: string[];
};

const plans: Plan[] = [
  {
    tag: "Ownership model",
    name: "Own Now",
    price: "650",
    unit: "/day",
    dark: true,
    chip: "border-sun/60 bg-sun/10 text-sun",
    rows: [
      { label: "Deposit", value: <>₹15,000 <span className="text-[11px] opacity-80">Onwards</span></> },
      { label: "Vehicles available", value: "Swift Dezire, Wagonr, Tigor, S-presso" },
      { label: "Ownership", value: "Car transferred to your name at tenure end" },
    ],
    benefits: ["No CIBIL", "Daily Instalments", "No Insurance", "No Regulatory Charges", "100% Uber incentive"],
  },
  {
    tag: "Ownership model",
    name: "Drive to Own",
    price: "499",
    unit: "+/mo",
    chip: "border-[#8fc27a] bg-[#eef7e9] text-[#3f7a2a]",
    rows: [
      { label: "Deposit", value: "₹5,000" },
      { label: "Vehicles available", value: "Swift Dezire, Wagonr, Tigor, S-presso" },
      { label: "Flexible", value: "No fixed rent - earnings-linked model" },
    ],
    benefits: ["No Insurance", "No Regulatory Charges", "Free Repair & Maintenance", "24×7 Support"],
  },
  {
    tag: "Renting model",
    name: "Drive to Earn",
    price: "399",
    unit: "/day",
    chip: "border-brand/50 bg-[#e8f3fb] text-brand",
    rows: [
      { label: "Deposit", value: "₹5,000" },
      { label: "Vehicles available", value: "Swift Dezire, Wagonr, Tigor, S-presso" },
      { label: "Zero asset", value: "No ownership or loan liability" },
    ],
    benefits: ["24/7 Support", "100% Uber incentive", "free repair and maintenance"],
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  const { dark } = plan;
  const divider = dark ? "border-white/25" : "border-line";
  return (
    <article className="flex flex-col items-center">
      <p className="flex h-9 w-[186px] items-center justify-center rounded-t-lg bg-sun text-xs font-semibold text-navy">
        {plan.tag}
      </p>
      <div className="w-full overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(6,47,80,0.12)]">
        <h3 className={`flex h-12 items-center justify-center text-xl font-semibold text-white ${dark ? "bg-navy" : "bg-brand"}`}>
          {plan.name}
        </h3>
        <div
          className={`px-[26px] pb-7 pt-3 lg:min-h-[444px] ${dark ? "bg-[linear-gradient(180deg,#0d3458_0%,#44627f_100%)] text-white" : "text-navy"}`}
        >
          <p className={`text-sm ${dark ? "text-sun" : "text-brand"}`}>Rent starting from</p>
          <div className={`flex items-center gap-2 border-b border-dashed pb-5 ${divider}`}>
            <p className="flex items-baseline gap-0.5">
              <span className="text-base">₹</span>
              <span className="text-[40px] font-bold leading-10">{plan.price}</span>
              <span className={`text-[13px] ${dark ? "text-white/70" : "text-ink-soft"}`}>{plan.unit}</span>
            </p>
            <a
              href="#apply"
              className="ml-2 flex h-9 w-[104px] items-center justify-center rounded-full bg-sun text-[13px] font-semibold text-navy"
            >
              Join Now
            </a>
          </div>
          <dl>
            {plan.rows.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-[86px_1fr] items-center gap-[11px] border-b border-dashed py-4 ${divider}`}>
                <dt className={`w-fit rounded border px-2.5 py-1 text-[10px] font-bold uppercase leading-[12px] tracking-[0.5px] ${plan.chip}`}>
                  {row.label}
                </dt>
                <dd className={`leading-5 ${i === 0 ? "text-base font-medium" : "text-[13px]"} ${dark ? "text-white/90" : "text-navy/80"}`}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className={`mt-3 text-[11px] font-semibold uppercase tracking-[1px] ${dark ? "text-white/60" : "text-ink-soft"}`}>
            Key Benefits
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {plan.benefits.map((b) => (
              <li
                key={b}
                className={`rounded-md px-2.5 py-[5px] text-[11px] leading-4 ${
                  dark ? "bg-brand text-white" : "border border-line bg-mist text-ink-soft"
                }`}
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function Plans() {
  return (
    <section id="plans" className="relative bg-fog pt-[60px]">
      <div className="px-6 text-center">
        <h2 className="text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[53px]">
          We have plans for everyone
        </h2>
        <p className="mt-6 text-lg text-ink-soft lg:text-xl">Pick the earning model that works best for you</p>
        <div className="mt-[21px]">
          <CityPill />
        </div>
      </div>
      <div className="relative z-10 mx-auto mt-[50px] grid max-w-[1192px] gap-10 px-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-[38px] lg:px-0">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
      <div className="relative -mt-6 ml-auto aspect-[1355/500] w-[94.1%]">
        <Image
          src="/figma/plans-car.jpg"
          alt="White Everest Fleet sedan"
          fill
          sizes="95vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
