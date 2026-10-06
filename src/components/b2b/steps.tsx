import { Eyebrow, SectionTitle } from "./ui";

export type Step = { title: string; body: string };

/**
 * "How it works": four columns split by hairlines on a desktop, stacked cards on a phone.
 * The last step's number sits on yellow.
 */
export function Steps({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <section className="bg-white px-4 pb-[38px] pt-[55px] lg:px-10 lg:pb-[89px] lg:pt-[89px]">
      <div className="text-center">
        <Eyebrow className="justify-center">How it works</Eyebrow>
        <SectionTitle className="mx-auto mt-2 max-w-[380px] lg:mt-[11px] lg:max-w-none">{title}</SectionTitle>
      </div>
      <ol className="mx-auto mt-[30px] grid max-w-[560px] gap-[21px] lg:mt-[49px] lg:max-w-[1104px] lg:grid-cols-4 lg:items-start lg:gap-x-[58px]">
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className={`relative flex items-start gap-4 rounded-xl border border-[#e8e9ed] bg-mist px-4 py-[15px] lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 ${
                i > 0 ? "lg:before:absolute lg:before:-left-[29px] lg:before:top-0 lg:before:h-full lg:before:w-px lg:before:bg-[#eaecef]" : ""
              }`}
            >
              <span
                className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-[15px] font-bold lg:mt-0 lg:size-[46px] lg:text-[17px] ${
                  last ? "bg-sun text-navy" : "bg-[#e8f2fa] text-brand"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[17px] font-bold leading-[22px] text-navy lg:mt-[12px] lg:text-[21px] lg:leading-7">{step.title}</h3>
                <p className="mt-0.5 text-sm leading-[19px] text-ink-soft lg:mt-[13px] lg:text-[15px] lg:leading-[21px]">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
