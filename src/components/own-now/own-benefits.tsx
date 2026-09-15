import { Calendar, Coins, CreditCard, Key, ShieldCheck, Wrench } from "lucide-react";

const items = [
  { icon: CreditCard, tone: "bg-brand", title: "No CIBIL Needed", body: "Just licence + basic KYC" },
  { icon: Coins, tone: "bg-sun", title: "Low Upfront", body: "Start with only 10% down" },
  { icon: Calendar, tone: "bg-lime", title: "Fixed Daily Pay", body: "₹950/day, no surprises" },
  { icon: Key, tone: "bg-plum", title: "Own in 24 Months", body: "Car is 100% yours at the end" },
  { icon: ShieldCheck, tone: "bg-navy", title: "Insurance & Permits", body: "Included from Day 1" },
  { icon: Wrench, tone: "bg-[#005a99]", title: "24×7 Support", body: "On-road breakdown help, always" },
];

export function OwnBenefits() {
  return (
    <section className="bg-blue-gradient px-6 pb-20 pt-16 lg:pb-[122px] lg:pt-20">
      <div className="text-center">
        <p className="inline-flex h-[33px] items-center rounded-full bg-brand px-4 text-sm font-bold uppercase text-white">Why Own Now</p>
        <h2 className="mt-6 text-[34px] font-bold leading-tight tracking-[-0.5px] text-white lg:text-[64px] lg:leading-[64px]">
          Own a car without a bank or CIBIL
        </h2>
        <p className="mt-6 text-xl text-white/90 lg:text-2xl lg:leading-[29px]">Built for drivers, not paperwork.</p>
      </div>
      <ul className="mx-auto mt-16 grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:mt-[94px] lg:grid-cols-3">
        {items.map(({ icon: Icon, tone, title, body }) => (
          <li key={title} className="rounded-3xl bg-white p-8 lg:h-[220px]">
            <span className={`grid size-12 place-items-center rounded-[10px] text-white ${tone}`}>
              <Icon size={24} strokeWidth={2} />
            </span>
            <h3 className="mt-4 text-[28px] font-bold leading-[39px] text-navy lg:text-[32px]">{title}</h3>
            <p className="mt-4 text-lg leading-[26px] text-ink-soft/80">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
