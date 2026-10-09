import { JourneyCard, JourneyPin, type JourneyStop } from "./journey-card";
import { JourneyMap } from "./journey-map";

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

/** One stop per year, so the road carries a pin a year rather than fifteen. */
const stops: JourneyStop[] = milestones.reduce<JourneyStop[]>((years, m) => {
  const [month, year] = m.date.split(" ");
  const last = years[years.length - 1];
  if (last?.year === year) last.entries.push({ month, text: m.text });
  else years.push({ year, entries: [{ month, text: m.text }] });
  return years;
}, []);

export function Milestones() {
  return (
    <section data-no-reveal className="relative overflow-x-clip bg-blue-gradient pb-[52px] pt-[150px] lg:pb-24 lg:pt-[300px]">
      {/* The blue rises out of the values section's colour through lighter blues, never through grey. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[140px] bg-[linear-gradient(180deg,#f2f5fd_0%,#e8f0fa_10%,rgb(205_222_243/0.94)_26%,rgb(150_185_226/0.78)_44%,rgb(86_136_196/0.52)_64%,rgb(30_86_150/0.22)_84%,rgb(6_47_80/0)_100%)] lg:h-[280px]"
      />
      <p className="relative flex items-center justify-center gap-2.5 text-[13px] font-semibold uppercase leading-4 tracking-[1px] text-sun lg:hidden">
        <span aria-hidden className="h-0.5 w-[18px] bg-sun" />
        Our Milestones
        <span aria-hidden className="h-0.5 w-[18px] bg-sun" />
      </p>
      <h2 className="relative mt-[14px] px-6 text-center text-[34px] font-extrabold leading-[40px] text-white lg:mt-0 lg:text-[64px] lg:leading-[70px] lg:tracking-[-0.5px]">
        Our Journey So Far
      </h2>

      {/* Up to xl: the same road runs down the page, a pin and a card for every year, the arrow at the end. */}
      <div className="relative mx-auto mt-[45px] max-w-xl px-4 sm:px-6 xl:hidden">
        <span aria-hidden className="absolute bottom-10 left-[33px] top-2 w-[26px] border-x-[4px] border-[#f1f1f1] bg-[#373739] sm:left-[41px]">
          <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-white" />
        </span>
        <span
          aria-hidden
          className="absolute bottom-0 left-[22px] h-11 w-12 bg-[#373739] [clip-path:polygon(0_0,100%_0,50%_100%)] sm:left-[30px]"
        />
        <ol className="relative space-y-7 sm:space-y-9">
          {stops.map((stop) => (
            <li key={stop.year} className="relative flex items-start gap-4 pl-1.5">
              <JourneyPin className="relative z-10 mt-1 shrink-0" />
              <JourneyCard stop={stop} className="min-w-0 flex-1 items-start [&>p]:ml-3" />
            </li>
          ))}
        </ol>
      </div>

      <JourneyMap stops={stops} />
    </section>
  );
}
