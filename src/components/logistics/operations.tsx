import { FileCheck, MapPin, Thermometer, Truck } from "lucide-react";
import { OPERATIONS } from "./data";
import { Heading, Wrap } from "./ui";

/** The trip card: what a client sees while a load is on the road. */
function LiveTrip() {
  return (
    <div className="rounded-3xl bg-[linear-gradient(160deg,#062f50_0%,#0a4378_100%)] p-5 text-white lg:p-7">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-base font-semibold">
          <span aria-hidden className="size-2.5 rounded-full bg-lime" />
          Live trip
        </p>
        <p className="rounded-full bg-lime px-3 py-[3px] text-sm font-semibold leading-5 text-navy">In transit</p>
      </div>
      <div aria-hidden className="mt-[18px] flex items-center gap-2 lg:mt-5">
        <span className="size-3.5 shrink-0 rounded-full border-[3px] border-white" />
        <span className="h-[3px] flex-1 rounded-full bg-sun" />
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sun text-navy">
          <Truck size={20} strokeWidth={2} />
        </span>
        <span className="h-[3px] flex-1 rounded-full bg-white/20" />
        <MapPin size={20} strokeWidth={1.75} className="shrink-0" />
      </div>
      <div className="mt-2 flex justify-between text-sm leading-5 text-white/75">
        <span>Pick-up</span>
        <span>Drop</span>
      </div>
      <div className="mt-3.5 rounded-[20px] bg-white/10 p-5 pb-8 lg:mt-[17px] lg:pb-[42px]">
        <div className="flex items-center gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15">
            <Thermometer aria-hidden size={22} strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-4 text-white/75 lg:text-sm">Inside the vehicle</p>
            <p className="text-[30px] font-bold leading-9">−18°C</p>
          </div>
          <p className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[13px] font-semibold leading-[18px] text-lime">
            <span aria-hidden className="size-2 rounded-full bg-lime" />
            In range
          </p>
        </div>
        <div aria-hidden className="relative mt-[22px] h-9 rounded bg-lime/10 lg:mt-[37px]">
          <svg viewBox="0 0 424 36" preserveAspectRatio="none" className="size-full" fill="none">
            <path
              d="M0 22 C 22 18, 48 25, 72 21 S 110 11, 140 13 S 182 26, 214 24 S 262 12, 290 14 S 340 27, 372 23 S 408 15, 424 15"
              stroke="#b9d532"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="absolute -right-0.5 top-[12px] size-[7px] rounded-full bg-lime" />
        </div>
      </div>
      <p className="mt-[17px] flex items-center gap-2.5 text-[15px] leading-5 text-white/75 lg:mt-5">
        <FileCheck aria-hidden size={18} strokeWidth={1.75} />
        Trip log saved for audits
      </p>
    </div>
  );
}

export function Operations() {
  return (
    <section className="bg-white pb-[49px] pt-[47px] lg:pb-[98px] lg:pt-[97px]">
      <Wrap>
        <Heading title="Operations & Control" sub="Tracking, temperature logs, documentation and hygiene on every trip." />
        <div className="mt-[27px] grid gap-5 lg:mt-[50px] lg:grid-cols-[520fr_536fr] lg:gap-8 xl:gap-12">
          <LiveTrip />
          <ul className="grid lg:grid-cols-2 lg:gap-4 lg:self-start">
            {OPERATIONS.map(({ icon: Icon, label }, i) => (
              <li
                key={label}
                className={`flex items-center gap-3.5 border-b border-[#e4e9ef] py-[14px] last:border-0 lg:h-[92px] lg:rounded-2xl lg:border-0 lg:bg-[#f6f9fc] lg:px-4 lg:py-0 ${
                  i === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e8f2fa] text-brand lg:size-11 lg:bg-white">
                  <Icon aria-hidden size={22} strokeWidth={1.75} />
                </span>
                <span className="text-base font-semibold leading-5 text-navy lg:text-[15px]">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}
