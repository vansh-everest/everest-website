import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stats = [
  { label: "Fleet size", value: "5,000+" },
  { label: "Cities", value: "12+" },
  { label: "Happy drivers", value: "10k+" },
];

const lines = [0, 1, 2, 3, 4];

export function JoinCta() {
  return (
    <section className="relative overflow-hidden bg-blue-gradient px-6 py-16 lg:h-[560px] lg:px-[100px] lg:py-0">
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute left-[840px] top-[-120px] size-[800px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
        {lines.map((i) => (
          <span
            key={i}
            className="absolute top-[-100px] h-[726px] w-[340px] origin-top-left rotate-[25deg] border-l border-white/15"
            style={{ left: 1100 + i * 40 }}
          />
        ))}
      </div>
      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-12 lg:h-full lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[720px]">
          <p className="inline-flex h-[27px] items-center rounded-full border border-white/30 bg-white/10 px-3 text-[13px] font-bold uppercase text-white">
            Accelerate with Everest
          </p>
          <h2 className="mt-3 text-5xl font-extrabold uppercase leading-[0.95] tracking-[-1px] text-white lg:text-[80px] lg:leading-[76px]">
            Join the
            <br />
            Everest Fleet
          </h2>
          <p className="mt-8 max-w-[580px] text-xl leading-[34px] text-white/90 lg:text-2xl">
            Drive on your terms. Earn what you deserve. Own your future.
          </p>
          <div className="mt-8 flex items-center gap-5">
            <Link
              href="/#apply"
              className="flex h-[70px] w-[218px] items-center justify-center rounded-2xl bg-white text-xl font-bold text-brand shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            >
              Join as Driver
            </Link>
            <Link
              href="/#apply"
              aria-label="Apply to drive"
              className="grid size-[72px] place-items-center rounded-full border border-white/40 text-white"
            >
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
        <dl className="flex flex-wrap gap-10 lg:flex-col">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-sm font-semibold uppercase leading-[17px] text-white/60">{stat.label}</dt>
              <dd className="mt-1 text-[40px] font-extrabold leading-[58px] text-white lg:text-[56px]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
