import Image from "next/image";
import { PLAY_STORE_HREF } from "./ui";

function PlayMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 22" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M1 1.2 11 11 1 20.8a1.6 1.6 0 0 1-.4-1.1V2.3c0-.4.1-.8.4-1.1Z" fill="#4caf50" />
      <path d="M1 1.2c.5-.5 1.3-.6 2-.2L14.5 7.6 11 11Z" fill="#8bc34a" />
      <path d="M14.5 7.6 18.4 9.8c.9.5.9 1.9 0 2.4l-3.9 2.2L11 11Z" fill="#ffc107" />
      <path d="M11 11 14.5 14.4 3 21c-.7.4-1.5.3-2-.2Z" fill="#f44336" />
    </svg>
  );
}

const lines: [string, string][] = [
  ["Track Your ", "Trips"],
  ["Know Your ", "Earnings"],
  ["100% ", "Transparent"],
];

/*
 * The section is drawn on the export frame (412 wide on phones, 1440 on desktop). --u is one
 * frame pixel, so the pill, phones and copy scale together; on desktop it stops at 1px past 1440.
 */
export function FleetApp() {
  return (
    <section className="@container overflow-hidden bg-fog">
      <div className="relative mx-auto h-[calc(var(--u)*349)] w-[calc(var(--u)*412)] [--u:calc(100cqw/412)] lg:h-[calc(var(--u)*1082)] lg:w-[calc(var(--u)*1440)] lg:[--u:calc(min(100cqw,1440px)/1440)]">
        <h2 className="absolute inset-x-0 top-[calc(var(--u)*17.8)] text-center text-[length:calc(var(--u)*20)] font-bold leading-[calc(var(--u)*24)] tracking-[calc(var(--u)*0.35)] lg:tracking-[calc(var(--u)*0.5)] text-navy lg:top-[calc(var(--u)*83.7)] lg:text-[length:calc(var(--u)*64)] lg:leading-[calc(var(--u)*77)]">
          Introducing <span className="text-brand">Everest Fleet</span> app
        </h2>

        {/* Past 1440 the pill keeps running to the left edge of the window. */}
        <div className="absolute left-0 right-[calc(100%-var(--u)*384)] top-[calc(var(--u)*107)] h-[calc(var(--u)*197)] rounded-r-full bg-blue-gradient lg:left-[calc((var(--u)*1440-100cqw)/2)] lg:right-[calc(100%-var(--u)*1352)] lg:top-[calc(var(--u)*378)] lg:h-[calc(var(--u)*519)]" />

        <div className="absolute left-[calc(var(--u)*12.75)] top-[calc(var(--u)*59.1)] h-[calc(var(--u)*269.1)] w-[calc(var(--u)*165.6)] drop-shadow-[0_calc(var(--u)*8)_calc(var(--u)*11)_rgba(6,47,80,0.3)] lg:left-[calc(var(--u)*160)] lg:top-[calc(var(--u)*242)] lg:h-[calc(var(--u)*780)] lg:w-[calc(var(--u)*480)] lg:drop-shadow-[0_calc(var(--u)*22)_calc(var(--u)*32)_rgba(6,47,80,0.3)]">
          <Image
            src="/figma/home/fleet-phones.webp"
            alt="Everest Fleet app showing this week's rent paid and a completed payment"
            fill
            sizes="(min-width: 1024px) min(480px, 34vw), 41vw"
          />
        </div>

        <div className="absolute left-[calc(var(--u)*191)] top-[calc(var(--u)*139.7)] lg:left-[calc(var(--u)*734)] lg:top-[calc(var(--u)*509.5)]">
          <h3 className="text-[length:calc(var(--u)*18)] font-bold leading-[calc(var(--u)*22)] text-white lg:text-[length:calc(var(--u)*40)] lg:uppercase lg:leading-[calc(var(--u)*48)] lg:tracking-[calc(var(--u)*-0.2)]">
            {lines.map(([lead, key]) => (
              <span key={key} className="block">
                {lead}
                <span className="text-sun">{key}</span>.
              </span>
            ))}
            <span className="block">All in One App.</span>
          </h3>
          <a
            href={PLAY_STORE_HREF}
            target="_blank"
            rel="noopener"
            className="mt-[calc(var(--u)*12.2)] flex h-[calc(var(--u)*35)] w-[calc(var(--u)*125)] items-center gap-[calc(var(--u)*11)] rounded-full bg-black pl-[calc(var(--u)*14)] text-white lg:mt-[calc(var(--u)*10.5)] lg:h-[calc(var(--u)*55)] lg:w-[calc(var(--u)*174)] lg:pl-[calc(var(--u)*16)]"
          >
            <PlayMark className="h-[calc(var(--u)*21)] w-[calc(var(--u)*19)] lg:h-[calc(var(--u)*22)]" />
            <span className="flex flex-col">
              <span className="text-[length:calc(var(--u)*9.5)] font-medium uppercase leading-[calc(var(--u)*12)] tracking-[0.1em] text-white/80 lg:text-[length:calc(var(--u)*9)] lg:tracking-[0.03em]">
                Get it on
              </span>
              <span className="text-[length:calc(var(--u)*12.5)] font-semibold leading-[calc(var(--u)*15)] lg:text-[length:calc(var(--u)*15.5)] lg:leading-[calc(var(--u)*18)]">
                Google Play
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
