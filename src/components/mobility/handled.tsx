import Image from "next/image";
import { Car, Zap } from "lucide-react";
import { CardRow } from "./card-row";
import { Chips, Heading, OfficeIcon } from "./ui";

const shell = "flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_rgba(6,47,80,0.06)]";
const title = "text-xl font-semibold leading-7 tracking-[-0.2px] text-navy lg:text-[22px]";
const body = "mt-1.5 text-[15px] leading-[23px] text-ink-soft lg:mt-2 lg:text-base";
const frame = "relative aspect-[352/260] shrink-0 overflow-hidden";

function Card({ heading, text, children }: { heading: string; text: string; children: React.ReactNode }) {
  return (
    <article className={shell}>
      {children}
      <div className="px-5 pb-[22px] pt-4 lg:px-6 lg:pb-7 lg:pt-[22px]">
        <h3 className={title}>{heading}</h3>
        <p className={body}>{text}</p>
      </div>
    </article>
  );
}

/** A little street map of the ride to the office, drawn so it stays sharp at every width. */
function RouteMap() {
  return (
    <div className={`${frame} bg-[#eaf4fc]`}>
      <svg aria-hidden viewBox="0 0 352 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <g stroke="#cfe2f2" strokeWidth={10}>
          <path d="M70 0v260M230 0v260M300 0v260M0 59.5h352M0 169.5h352" />
        </g>
        <g stroke="#dfeef9" strokeWidth={5}>
          <path d="M150 0v260M0 114.5h352" />
        </g>
        <path d="M70 213.5v-44h80v-55h80v-55h70" fill="none" stroke="#006db8" strokeWidth={5} strokeLinejoin="round" />
        <circle cx="70" cy="213.5" r="6" fill="#fff" stroke="#006db8" strokeWidth={4} />
      </svg>
      <p className="absolute left-3.5 top-3.5 flex h-7 items-center gap-2 rounded-full bg-white px-2.5 text-[13px] font-semibold text-navy shadow-[0_6px_18px_rgba(6,47,80,0.1)] lg:left-5 lg:top-5 lg:h-8 lg:px-3.5 lg:text-sm">
        <span aria-hidden className="size-2 rounded-full bg-leaf" />
        On the way to office
      </p>
      <span aria-hidden className="absolute left-[42.6%] top-[44%] grid size-[30px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sun text-navy shadow-[0_6px_16px_rgba(6,47,80,0.2)] lg:size-9">
        <Car size={18} strokeWidth={2} />
      </span>
      <span aria-hidden className="absolute left-[85.2%] top-[22.9%] grid size-[30px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg bg-navy text-white lg:size-9 lg:rounded-[10px]">
        <OfficeIcon className="size-[18px] lg:size-5" />
      </span>
    </div>
  );
}

/** "One contract, everything handled": three cards, a swipeable row on a phone. */
export function Handled() {
  return (
    <section className="bg-[#f6f9fc] px-4 pb-[23px] pt-[45px] lg:px-6 lg:pb-[98px] lg:pt-[94px]">
      <div className="mx-auto max-w-[1104px]">
        <Chips items={["Vehicle", "Driver", "Technology", "Team"]} />
        <Heading className="mt-[9px] lg:mt-3">
          One contract, <br className="sm:hidden" />
          <span className="text-brand">everything handled</span>
        </Heading>
        <div className="mt-7 lg:mt-[42px]">
          <CardRow label="What the contract covers">
            <Card heading="Electric cabs" text="Ready for tomorrow's emission rules.">
              <div className={`${frame} bg-navy`}>
                <Image src="/figma/mobility/electric.webp" alt="White Everest electric sedan on a blue studio backdrop" fill sizes="(min-width: 1024px) 352px, 292px" className="object-cover" />
                <p className="absolute left-4 top-4 flex h-[25px] items-center gap-1.5 rounded-full bg-lime px-2.5 text-[13px] font-semibold text-navy lg:left-5 lg:top-5 lg:h-[29px] lg:px-3 lg:text-sm">
                  <Zap aria-hidden size={14} strokeWidth={2.25} />
                  Electric
                </p>
              </div>
            </Card>
            <Card heading="Certified drivers" text="Trained and certified, every shift.">
              <div className={frame}>
                <Image src="/figma/mobility/driver.webp" alt="Smiling Everest driver giving a thumbs up from the cab window" fill sizes="(min-width: 1024px) 352px, 292px" className="object-cover" />
              </div>
            </Card>
            <Card heading="Live tracking" text="Every ride visible, end to end.">
              <RouteMap />
            </Card>
          </CardRow>
        </div>
      </div>
    </section>
  );
}
