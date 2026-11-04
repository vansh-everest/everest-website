import type { ReactNode } from "react";
import { Eyebrow } from "@/components/b2b/ui";

const STEPS: { title: string; body: ReactNode }[] = [
  { title: "Share Your Brief", body: "Your audience, cities and campaign dates" },
  { title: "Campaign Strategy And Creative Development", body: "We plan the campaign and design your ads" },
  { title: "Creative Mock Sharing", body: "See and approve mock-ups before printing" },
  { title: "Production", body: "We print and prepare your branding" },
  { title: "Deployment", body: "Ads go live inside the cab, outside it, or both" },
  {
    title: "Post-Campaign Reporting",
    body: (
      <>
        A report with <span className="lg:hidden">AI-</span>verified photos of every placement
      </>
    ),
  },
];

/** Three columns split by hairlines on a desktop, stacked cards on a phone. */
export function AdSteps() {
  return (
    <section className="bg-[#eaf4fc] px-4 pb-12 pt-[47px] lg:px-10 lg:pb-[53px] lg:pt-[55px]">
      <div className="text-center">
        <Eyebrow className="justify-center">How it works</Eyebrow>
        <h2 className="mt-[7px] text-[clamp(21px,5.85vw,24px)] font-bold leading-[34px] text-navy lg:mt-[11px] lg:text-[52px] lg:leading-[60px]">
          Six Steps From Brief To Street
        </h2>
      </div>
      <ol className="mx-auto mt-[29px] grid max-w-[560px] gap-5 lg:mt-12 lg:max-w-[1104px] lg:grid-cols-3 lg:gap-x-0 lg:gap-y-[46px]">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className={`flex items-start gap-[15px] rounded-2xl border border-line bg-mist px-[17px] py-4 lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 ${
              i % 3 ? "lg:border-l lg:border-solid lg:border-[#bbb] lg:pl-7" : ""
            }`}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e8f2fa] text-[15px] font-bold text-navy lg:size-[46px] lg:bg-[#d3e8f8] lg:text-[17px] lg:text-brand">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-base font-bold leading-[19px] text-navy lg:mt-[13px] lg:max-w-[300px] lg:text-[21px] lg:leading-[27px] lg:text-black">{step.title}</h3>
              <p className="mt-1 text-[13px] leading-[19px] text-ink-soft lg:mt-3.5 lg:text-[15px] lg:leading-[21px] lg:tracking-[-0.25px] lg:text-[#3d3f42]">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
