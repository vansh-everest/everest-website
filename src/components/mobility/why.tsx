import type { ReactNode } from "react";
import { Headset, IndianRupee, Leaf, RefreshCw, ShieldCheck, type LucideIcon } from "lucide-react";
import { Chips, Heading } from "./ui";

function Feature({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <li className="rounded-[20px] bg-[#f2f5f9] px-[18px] pb-[18px] pt-[18px] lg:rounded-3xl lg:px-7 lg:pb-[29px] lg:pt-7">
      <Icon aria-hidden strokeWidth={1.5} className="size-8 text-brand lg:size-9" />
      <h3 className="mt-[9px] text-lg font-bold leading-[21px] text-navy lg:mt-[15px] lg:text-[22px] lg:leading-7">{title}</h3>
      <p className="mt-[9px] text-[15px] leading-[21px] text-ink-soft lg:mt-[13px] lg:leading-5">{children}</p>
    </li>
  );
}

/** "Why teams pick Everest": the title to the left of a two-by-two grid with a green band through it. */
export function WhyEverest() {
  return (
    <section className="bg-white px-4 pt-[44px] lg:px-6 lg:pt-[96px]">
      <div className="mx-auto grid max-w-[1104px] gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,708px)] lg:gap-x-6">
        <div>
          <Chips items={["On time", "Comfort", "Savings"]} />
          <Heading className="mt-[9px] lg:mt-2.5">
            Why teams <br className="hidden lg:block" />
            pick <span className="text-brand">Everest</span>
          </Heading>
        </div>
        <ul className="grid grid-cols-2 gap-x-[11px] gap-y-3 lg:gap-x-5 lg:gap-y-[20px]">
          <Feature icon={RefreshCw} title="Backup cabs">
            A spare cab if one breaks down.
          </Feature>
          <Feature icon={IndianRupee} title="Fuel-proof pricing">
            Rates that fuel prices can&apos;t move.
          </Feature>
          <li className="relative col-span-2 flex items-center justify-between gap-3 overflow-hidden rounded-[20px] bg-[#f0f6d2] py-5 pl-5 pr-[26px] lg:rounded-3xl lg:pb-8 lg:pl-8 lg:pr-[46px] lg:pt-[30px]">
            <div>
              <span className="grid size-10 place-items-center rounded-xl bg-lime text-navy lg:size-11">
                <Leaf aria-hidden size={22} strokeWidth={1.75} />
              </span>
              <h3 className="mt-[9px] text-xl font-bold leading-[23px] text-navy lg:mt-[9px] lg:text-2xl lg:leading-8">
                Lower carbon, <br className="lg:hidden" />
                every ride
              </h3>
              <p className="mt-2.5 text-[15px] leading-[21px] text-ink-soft lg:leading-5">Electric cabs for a smaller footprint.</p>
            </div>
            <div aria-hidden className="flex shrink-0 items-center lg:gap-[5px]">
              <Leaf strokeWidth={1} className="size-[35px] text-[#5f7d0c] lg:size-[65px] lg:translate-y-3" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.75} strokeLinejoin="round" className="size-[50px] text-navy lg:size-24">
                <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
              </svg>
            </div>
          </li>
          <Feature icon={ShieldCheck} title="100% compliant">
            Every transport regulation, covered.
          </Feature>
          <Feature icon={Headset} title="Dedicated support">
            A real team, not a call queue.
          </Feature>
        </ul>
      </div>
    </section>
  );
}
