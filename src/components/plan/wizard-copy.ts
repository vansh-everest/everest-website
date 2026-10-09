import type { WizardKind } from "@/lib/plan-pages";

/** Words the desktop and phone exports set differently: [desktop, phone]. One string serves both. */
export type Said = string | readonly [string, string];

/** The step between the car and the plan on pickers that have one: Own Now's upfront, Drive to Earn's deposit. */
export type MoneyStepCopy = {
  title: string;
  /** The small label over the figure paid first. */
  label: string;
  /** The car step's way into it. */
  next: string;
  /** The tenure is chosen on this step. */
  tenure: boolean;
  /** The model year is chosen here, beside the figures it changes, rather than with the car. */
  years: boolean;
  /** The yellow note on the rent strip; `{months}` prints the chosen tenure. */
  badge: string;
};

export type WizardCopy = {
  title: string;
  /** Every step's name, the final "Your plan" included. */
  steps: readonly string[];
  city: Said;
  car: Said;
  year: Said;
  /** The mark on the final step's circle. */
  mark: "rupee" | "key";
  /** A step for what is paid first, or none. A picker with one is priced by Jarvis per car and year. */
  money: MoneyStepCopy | null;
  apply: Said;
};

const EARN: WizardCopy = {
  title: "Start Earning In 2 Steps",
  steps: ["City", "Car", "Your Plan"],
  city: "Where Do You Drive?",
  car: "Which Car Do You Want?",
  year: "Model Year",
  mark: "rupee",
  money: null,
  apply: ["Check If You Qualify", "Apply For This Plan"],
};

export const WIZARD_COPY: Record<WizardKind, WizardCopy> = {
  earn: {
    title: "Start Driving In 3 Steps",
    steps: ["Location", "Car", "Deposit", "Your Plan"],
    city: "Where Do You Drive?",
    car: "Which Car Do You Want?",
    year: "Model Year",
    mark: "rupee",
    money: {
      title: "Your Deposit & Rent",
      label: "Deposit · refundable",
      next: "Next: See Deposit",
      tenure: false,
      years: true,
      badge: "",
    },
    apply: EARN.apply,
  },
  share: EARN,
  own: {
    title: "Own Your Car In 2 Steps",
    steps: ["City", "Car", "Your Plan"],
    city: ["Where Do You Want To Drive?", "Where Do You Drive?"],
    car: ["Which Car Do You Want To Drive?", "Which Car Do You Want?"],
    year: ["Choose Model Year", "Model Year"],
    mark: "key",
    money: null,
    apply: ["Check If You Qualify", "Apply For This Plan"],
  },
  now: {
    title: "Own Your Car In 3 Steps",
    steps: ["Location", "Car", "Upfront", "Your Plan"],
    city: "Where Do You Drive?",
    car: "Which Car Do You Want?",
    year: "Model Year",
    mark: "key",
    money: {
      title: "Choose Your Tenure & Upfront",
      label: "Upfront · paid once",
      next: "Next: Choose Upfront",
      tenure: true,
      years: false,
      badge: "Yours In Month {months}",
    },
    apply: "Apply For This Plan",
  },
};
