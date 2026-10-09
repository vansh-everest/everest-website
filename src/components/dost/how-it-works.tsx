import Image from "next/image";
import type { CSSProperties } from "react";
import { Carousel } from "@/components/site/carousel";
import { JourneyCards, JourneyRow } from "./journey-play";

const STEPS = [
  { title: "Log In To The App", body: "Enter your mobile number and you’re in.", alt: "Everest Dost app login screen asking for a mobile number" },
  { title: "Set Up Your Profile", body: "Details, documents, bank account. Three steps and you’re ready to refer.", alt: "Everest Dost app screen for uploading address details and documents" },
  { title: "Add Lead Details", body: "You know a driver who needs a car. Add a name, number and city.", alt: "Everest Dost app form for adding a driver lead" },
  { title: "Lead Gets Referred", body: "From interview to car allotted, see every stage as it happens.", alt: "Everest Dost app lead list showing each referral’s stage" },
  { title: "Earn At Each Milestone", body: "Car allotted, first trip, trip targets. Each one pays you.", alt: "Everest Dost app lead details with the payout for each milestone" },
];

/**
 * Five app screens in a row on a wide screen; on a phone, one card at a time with a peek of the next.
 * They play once as a journey when they come into view (JourneyRow, JourneyCards).
 */
export function HowItWorks() {
  return (
    <section className="bg-white pb-[47px] pt-12 lg:pb-[117px] lg:pt-24">
      <div className="px-4 text-center">
        <p className="text-[12.5px] font-medium uppercase leading-4 tracking-[0.6px] text-brand lg:text-[13px] lg:font-semibold lg:tracking-[1px]">
          How it works
        </p>
        <h2 className="mx-auto mt-1.5 max-w-[360px] text-2xl font-bold leading-[30px] text-navy sm:max-w-none lg:mt-3 lg:text-[52px] lg:leading-[60px]">
          From Your First Login To Your First Payout
        </h2>
      </div>

      <JourneyCards className="mt-[33px] px-4 sm:px-6 lg:hidden">
        <Carousel item="w-[252px]" label="How Everest Dost works">
          {STEPS.map((step, i) => (
            <div key={step.title} data-dj-card className="dj-play h-full rounded-3xl bg-[#f1f5fd] px-[26px] pb-[38px] pt-4">
              <Phone index={i} alt={step.alt} className="w-[200px]" />
              <Number index={i} className="mt-3.5 size-8 text-[13px]" />
              <h3 className="dj-title mt-[3px] text-base font-semibold leading-[22px] text-navy">{step.title}</h3>
              <p className="dj-body mt-2 text-[13px] leading-5 text-ink-soft">{step.body}</p>
            </div>
          ))}
        </Carousel>
      </JourneyCards>

      <JourneyRow className="mx-auto mt-[56px] hidden w-[calc(100%-48px)] max-w-[1104px] grid-cols-5 gap-[21px] lg:grid">
        {STEPS.map((step, i) => (
          <li key={step.title} className="dj-step relative" style={{ "--i": i } as CSSProperties}>
            <Phone index={i} alt={step.alt} className="w-full" />
            <div aria-hidden className="dj-floor h-[50px] bg-[linear-gradient(180deg,#dae0e5_0%,rgba(255,255,255,0)_100%)]" />
            <div className="relative -mt-[21px] pl-2.5 pr-3">
              {i < STEPS.length - 1 ? (
                <span aria-hidden className="absolute left-[50px] right-[-27px] top-[17px] h-0.5">
                  <span className="dj-line absolute inset-0 bg-[radial-gradient(circle,#9cc3e6_0.9px,transparent_1.1px)] bg-[length:6.5px_2px]" />
                  {/* The marker that rides the head of the line while it draws. */}
                  <span className="dj-car absolute inset-0">
                    <span className="dj-car-dot absolute right-0 top-1/2 size-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand ring-[3px] ring-white" />
                  </span>
                </span>
              ) : null}
              <Number index={i} />
              <h3 className="dj-title mt-[9px] text-lg font-semibold leading-[23px] text-navy">{step.title}</h3>
              <p className="dj-body mt-2 text-[14.5px] leading-[22px] text-ink-soft">{step.body}</p>
            </div>
          </li>
        ))}
      </JourneyRow>
    </section>
  );
}

function Phone({ index, alt, className }: { index: number; alt: string; className: string }) {
  return (
    <Image
      src={`/figma/dost/step-${index + 1}.webp`}
      alt={alt}
      width={408}
      height={856}
      sizes="(min-width: 1024px) 204px, 200px"
      className={`dj-phone h-auto ${className}`}
    />
  );
}

function Number({ index, className = "" }: { index: number; className?: string }) {
  const last = index === STEPS.length - 1;
  return (
    <span
      className={`dj-badge relative grid size-9 place-items-center rounded-full text-[15px] font-bold text-navy ${
        last ? "dj-badge-end bg-sun" : "bg-[#e6eff9]"
      } ${className}`}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}
