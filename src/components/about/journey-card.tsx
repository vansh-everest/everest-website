import { Fragment, type CSSProperties } from "react";

/** One year on the journey: its milestones in order, each with its month. */
export type JourneyStop = { year: string; entries: { month: string; text: string }[] };

/** Words between ** are set in bold, as the timeline sets them. */
export function Bolded({ text }: { text: string }) {
  return text.split("**").map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-bold text-[#0e162a]">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

/** The road map's red location pin, its point at the bottom centre. */
export function JourneyPin({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 28 36" className={`h-9 w-7 drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)] ${className}`}>
      <path d="M14 0C6.3 0 0 6.2 0 13.9 0 24.3 14 36 14 36s14-11.7 14-22.1C28 6.2 21.7 0 14 0z" fill="#d63b24" />
      <circle cx="14" cy="13.5" r="5" fill="#0b3a63" />
    </svg>
  );
}

/** A cream milestone card under a red year tab, one line per milestone with its month. */
export function JourneyCard({ stop, className = "", style }: { stop: JourneyStop; className?: string; style?: CSSProperties }) {
  return (
    <div className={`flex flex-col items-center ${className}`} style={style}>
      <p className="rounded-t-[14px] bg-[#cc3119] px-5 pb-0.5 pt-1 text-[22px] font-extrabold leading-8 text-white">{stop.year}</p>
      <ul className="w-full space-y-2 rounded-xl bg-[#fdffe4] px-3.5 py-3 text-left shadow-[0_10px_28px_rgba(0,0,0,0.22)]">
        {stop.entries.map((e) => (
          <li key={`${e.month}${e.text}`} className="flex items-baseline gap-2 text-[13px] leading-[18px] text-[#4b5563]">
            <span className="w-9 shrink-0 rounded bg-[#e3ecff] py-px text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.4px] text-[#2d5bd3]">
              {e.month}
            </span>
            <span>
              <Bolded text={e.text} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
