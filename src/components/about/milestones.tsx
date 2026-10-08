import { Fragment } from "react";
import { MapPin } from "lucide-react";

/** Everest's journey timeline, oldest first. Words between ** are set in bold, as the timeline sets them. */
const milestones = [
  { date: "Oct 2016", text: "Started Operations In **Mumbai**" },
  { date: "Oct 2018", text: "Started Operations In **Bengaluru**" },
  { date: "Nov 2019", text: "Pivoted To Funding Car Purchase Via **Off Balance Sheet Model**" },
  { date: "Nov 2020", text: "Launched **MITR** Business" },
  { date: "Mar 2021", text: "Started Operations In **Delhi**" },
  { date: "Nov 2021", text: "Started Operations In **Hyderabad**" },
  { date: "Feb 2022", text: "Launched **Refrigerated Vans** Business" },
  { date: "May 2022", text: "Started Operations In **Pune**" },
  { date: "Aug 2022", text: "Started Operations In **Kolkata** And Launched **EV Pilot**" },
  { date: "Nov 2022", text: "Started Operations In **Chennai**" },
  { date: "Jun 2023", text: "Partnered With Uber India To Launch **Uber Green**" },
  { date: "Jul 2023", text: "Launched **Intercity** Business" },
  { date: "Dec 2023", text: "Onboarded First DFI As A Lender, **GuarantCo**" },
  { date: "Jan 2024", text: "Launched **B2B (ETS)** Business" },
  { date: "Oct 2025", text: "**21,000+** Cars In India" },
];

function Text({ text }: { text: string }) {
  return text.split("**").map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-bold text-navy">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

function Pin({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`z-10 grid size-10 shrink-0 place-items-center rounded-full bg-[#d33f27] text-white shadow-[0_0_0_3px_rgba(240,128,105,0.8),0_4px_12px_rgba(0,0,0,0.25)] ${className}`}
    >
      <MapPin className="size-[18px]" strokeWidth={2} />
    </span>
  );
}

function Card({ date, text }: { date: string; text: string }) {
  return (
    <div className="w-full">
      <p className="mx-auto w-fit rounded-t-lg bg-[#d33f27] px-3 text-sm font-extrabold leading-7 text-white">{date}</p>
      <p className="rounded-xl bg-white px-3 py-3 text-center text-[13px] leading-[18px] text-ink-soft shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <Text text={text} />
      </p>
    </div>
  );
}

export function Milestones() {
  return (
    <section className="relative bg-blue-gradient pb-[52px] pt-[15px] lg:pb-28 lg:pt-20">
      <p className="relative flex items-center justify-center gap-2.5 text-[13px] font-semibold uppercase leading-4 tracking-[1px] text-sun lg:hidden">
        <span aria-hidden className="h-0.5 w-[18px] bg-sun" />
        Our milestones
        <span aria-hidden className="h-0.5 w-[18px] bg-sun" />
      </p>
      <h2 className="relative mt-[14px] px-6 text-center text-[34px] font-extrabold leading-[40px] text-white lg:mt-0 lg:text-[64px] lg:leading-[70px] lg:tracking-[-0.5px]">
        Our Journey So Far
      </h2>

      {/* Up to xl: a pin, a date and a card per milestone, joined by a small road down the left. */}
      <ol className="relative mx-auto mt-[45px] max-w-md space-y-[33px] pl-6 pr-4 xl:hidden">
        {milestones.map((m, i) => (
          <li key={m.date} className="relative pl-16">
            <Pin className="absolute left-0 top-[-3px]" />
            {i < milestones.length - 1 && (
              <span
                aria-hidden
                className="absolute -bottom-[30px] left-4 top-[37px] w-2 border-x-2 border-dashed border-sun bg-[#1f2b39]"
              />
            )}
            <p className="w-fit rounded-full bg-[#d33f27] px-4 text-lg font-extrabold leading-[34px] text-white">{m.date}</p>
            <p className="mt-3 rounded-[14px] bg-white px-4 py-4 text-[15px] leading-[22px] text-ink-soft shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <Text text={m.text} />
            </p>
          </li>
        ))}
      </ol>

      {/* From xl: the timeline's own layout. One road runs left to right; milestones alternate above and below it.
          The road sits outside the list so it is not read as a milestone; the list shares its rows through subgrid. */}
      <div className="mx-auto mt-16 hidden max-w-[1320px] grid-cols-8 grid-rows-[auto_56px_auto] gap-x-3 px-10 xl:grid">
        <div aria-hidden className="relative col-span-full row-start-2 mr-6 border-y-4 border-white bg-[#343434]">
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/90" />
          <span className="absolute -right-11 top-1/2 h-[88px] w-11 -translate-y-1/2 bg-white [clip-path:polygon(0_0,100%_50%,0_100%)]" />
          <span className="absolute -right-[38px] top-1/2 h-[72px] w-9 -translate-y-1/2 bg-[#343434] [clip-path:polygon(0_0,100%_50%,0_100%)]" />
        </div>
        <ol className="col-span-full row-span-3 row-start-1 grid grid-cols-subgrid grid-rows-subgrid">
          {milestones.map((m, i) => {
            const above = i % 2 === 0;
            return (
              <li
                key={m.date}
                style={{ gridColumn: Math.floor(i / 2) + 1 }}
                className={`row-span-2 flex flex-col items-center ${above ? "row-start-1 justify-end" : "row-start-2 justify-start"}`}
              >
                {above ? (
                  <>
                    <Card {...m} />
                    <span aria-hidden className="h-6 w-0.5 bg-white/70" />
                    <Pin className="my-2" />
                  </>
                ) : (
                  <>
                    <Pin className="my-2" />
                    <span aria-hidden className="h-6 w-0.5 bg-white/70" />
                    <Card {...m} />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
