import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { rupees } from "@/lib/content";
import type { PlanWizardView, WizardCar } from "@/lib/plan-view";
import type { Said } from "./wizard-copy";

/** Renders words the two exports set differently, one copy per breakpoint. */
export function Say({ text }: { text: Said }) {
  if (typeof text === "string") return <>{text}</>;
  return (
    <>
      <span className="hidden lg:inline">{text[0]}</span>
      <span className="lg:hidden">{text[1]}</span>
    </>
  );
}

/** "150000" becomes "₹1.5L", "50000" becomes "₹50K": the phone slider's end labels. */
export function shortRupees(digits: string): string {
  const n = Number(digits);
  if (!n) return "";
  if (n >= 100000) return `₹${Number((n / 100000).toFixed(2))}L`;
  if (n >= 1000) return `₹${Number((n / 1000).toFixed(1))}K`;
  return rupees(digits);
}

/** The figures the final step shows for the current choices. `upfront` says whether `money` is an upfront or a deposit. */
export type Figures = { amount: string; unit: string; money: string; upfront: boolean; months: string };

/**
 * A car the calculator prices takes the chosen slider point; any other car takes the plan's own
 * figures in the chosen city.
 */
export function figuresFor(view: PlanWizardView, car: WizardCar, city: string, tenure: string, index: number): Figures {
  const base = view.prices[city] ?? { amount: "", unit: "/day", money: "", upfront: false, months: "" };
  // Jarvis's figures for this very car beat both the admin's sample point and the city's.
  const own = view.carPrices[city]?.[car.id];
  if (own) return { ...own, months: tenure || own.months || base.months };
  const option = car.options.length ? car.options[Math.min(index, car.options.length - 1)] : undefined;
  const months = tenure || base.months;
  // The calculator's slider is the upfront on a plan with an upfront step, the deposit elsewhere.
  const upfront = view.kind === "now";
  return option ? { amount: option.daily, unit: "/day", money: option.deposit, upfront, months } : { ...base, months };
}

export const rentLabel = (unit: string) => (unit.includes("day") ? "Daily rent" : "Rent");

export function StepHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      tabIndex={-1}
      className="text-[22px] font-bold leading-7 tracking-[-0.3px] text-navy outline-none lg:text-[32px] lg:leading-10 lg:tracking-[-0.5px]"
    >
      {children}
    </h3>
  );
}

/**
 * The way forward. On a phone it is a white band pinned to the bottom of the screen while the step
 * is in view, the choices so far above the buttons; on a desktop one row at the foot of the card.
 */
export function StepFooter({
  next,
  onNext,
  onBack,
  summary,
  className = "",
}: {
  next: string;
  onNext: () => void;
  onBack?: () => void;
  summary?: string;
  className?: string;
}) {
  return (
    <div
      className={`sticky bottom-0 z-10 -mx-4 border-t border-[#dfe4e8] bg-white px-4 pb-[21px] pt-[13px] sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:flex lg:items-center lg:gap-5 lg:border-0 lg:bg-transparent lg:p-0 ${className}`}
    >
      {summary ? (
        <p className="mb-2 text-[13px] font-semibold leading-4 text-brand lg:order-2 lg:mb-0 lg:rounded-full lg:bg-[#e7f0f8] lg:px-3.5 lg:py-2 lg:text-sm lg:leading-4">
          {summary}
        </p>
      ) : null}
      <div className="flex gap-2.5 lg:contents">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-[49px] items-center gap-2 rounded-full border-[1.5px] border-[#d5dbe1] bg-white px-[21px] text-base font-medium text-navy transition hover:border-navy lg:order-1 lg:h-auto lg:border-0 lg:bg-transparent lg:px-0 lg:text-[17px] lg:text-ink-soft lg:hover:text-navy"
          >
            <ArrowLeft size={17} strokeWidth={2} className="hidden lg:block" />
            Back
          </button>
        ) : null}
        <button
          type="button"
          onClick={onNext}
          className="flex h-[49px] flex-1 items-center justify-center gap-2.5 rounded-full bg-sun text-base font-bold text-navy transition hover:brightness-95 lg:order-3 lg:ml-auto lg:h-[54px] lg:flex-none lg:px-[26px] lg:text-[17px]"
        >
          {next}
          <ArrowRight size={18} strokeWidth={2.25} className="hidden lg:block" />
        </button>
      </div>
    </div>
  );
}
