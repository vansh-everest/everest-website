import Image from "next/image";
import { Check, Clock } from "lucide-react";
import { OWNER_GETS, OWNER_STEPS } from "./data";
import { TabLink } from "./tab-link";

/** "For Vehicle Owners". The two lists under the photo appear on phones only, as in the export. */
export function Owners() {
  return (
    <section className="bg-[linear-gradient(180deg,#062f50_0%,#0a3e6e_100%)] pb-[26px] pt-[52px] text-white lg:pb-24 lg:pt-[92px]">
      <div className="mx-auto grid w-full max-w-[1136px] gap-5 px-4 lg:grid-cols-[1fr_420px] lg:gap-x-10 xl:grid-cols-[1fr_500px] xl:gap-x-[72px]">
        <div>
          <p className="inline-flex h-[24px] items-center rounded-full bg-sun px-3 text-xs font-bold uppercase tracking-[1px] text-navy lg:h-[30px] lg:px-3.5 lg:text-[13px]">
            For Vehicle Owners
          </p>
          <h2 className="mt-[11px] text-[30px] font-bold leading-[35px] tracking-[-0.3px] lg:mt-[56px] lg:text-[44px] lg:leading-[50px] xl:text-[52px] xl:leading-[57px] xl:tracking-[-0.5px]">
            Regular Earnings.
            <br />
            On-Time Payments.
          </h2>
          <p className="mt-3 text-[17px] leading-[25px] text-white/70 lg:mt-[17px] lg:text-lg lg:leading-7">Attach your truck, reefer van or EV 3-wheeler to Everest.</p>
          <p className="mt-3.5 text-[22px] font-bold leading-7 text-sun lg:mt-[29px] lg:text-[32px] lg:leading-9">₹0</p>
          <p className="text-[13px] leading-5 text-white/75 lg:mt-1 lg:text-sm">Hidden deductions</p>
          <TabLink
            tab="attach"
            className="mt-[18px] flex h-14 items-center justify-center rounded-full bg-sun text-[17px] font-semibold text-navy transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun lg:mt-[33px] lg:inline-flex lg:w-[237px]"
          >
            Register Your Vehicle
          </TabLink>
          <p className="mt-3.5 flex items-center gap-2 text-[15px] leading-5 text-white/75 lg:mt-[17px]">
            <Clock aria-hidden size={17} strokeWidth={1.75} />
            We call you back within one business day.
          </p>
        </div>

        <div className="relative mt-2 h-[230px] overflow-hidden rounded-3xl sm:h-[320px] md:h-[400px] lg:mt-[74px]">
          <Image src="/figma/logistics/truck.webp" alt="Everest Logistics truck with shelves of fresh fruit and vegetables" fill sizes="(min-width: 1024px) 500px, 100vw" className="object-cover" />
          <div className="absolute left-3 top-3 flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2 lg:left-5 lg:top-5 lg:gap-3 lg:px-3 lg:py-3">
            <span className="grid size-8 place-items-center rounded-full bg-lime text-navy lg:size-10">
              <Check aria-hidden size={20} strokeWidth={2.25} />
            </span>
            <span>
              <span className="block text-sm font-bold leading-[18px] text-navy lg:text-base lg:leading-[22px]">Trip payment credited</span>
              <span className="block text-[13px] leading-4 text-ink-soft lg:text-sm lg:leading-5">Today</span>
            </span>
          </div>
        </div>

        <div className="mt-1 rounded-2xl bg-white/10 p-5 lg:hidden">
          <h3 className="text-[19px] font-bold leading-6">What you get</h3>
          <ul className="mt-3.5 grid gap-3.5">
            {OWNER_GETS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-[16px] font-semibold leading-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-sun">
                  <Icon aria-hidden size={20} strokeWidth={1.75} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white/10 p-5 lg:hidden">
          <h3 className="text-[19px] font-bold leading-6">Start in 4 steps</h3>
          <ol className="mt-3 grid gap-[18px]">
            {OWNER_STEPS.map((step, i) => (
              <li key={step.title} className="relative flex items-center gap-3">
                <span aria-hidden className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-sun text-[15px] font-bold text-navy">
                  {i + 1}
                </span>
                {i < OWNER_STEPS.length - 1 ? <span aria-hidden className="absolute left-[15px] top-8 h-[22px] w-0.5 bg-white/25" /> : null}
                <span>
                  <span className="block text-[15px] font-bold leading-5">{step.title}</span>
                  <span className="block text-[13px] leading-[18px] text-white/75">{step.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
