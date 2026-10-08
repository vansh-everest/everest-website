import type { WizardKind } from "@/lib/plan-pages";

/** Words the desktop and phone exports set differently: [desktop, phone]. One string serves both. */
export type Said = string | readonly [string, string];

export type WizardCopy = {
  title: string;
  /** Every step's name, the final "Your plan" included. */
  steps: readonly string[];
  city: Said;
  car: Said;
  year: Said;
  /** The mark on the final step's circle. */
  mark: "rupee" | "key";
  /** Ownership plans add a step for the tenure and the upfront. */
  upfront: boolean;
  apply: Said;
};

const EARN: WizardCopy = {
  title: "Start Earning In 2 Steps",
  steps: ["City", "Car", "Your Plan"],
  city: "Where Do You Drive?",
  car: "Which Car Do You Want?",
  year: "Model Year",
  mark: "rupee",
  upfront: false,
  apply: ["Check If You Qualify", "Apply For This Plan"],
};

export const WIZARD_COPY: Record<WizardKind, WizardCopy> = {
  earn: EARN,
  share: EARN,
  own: {
    title: "Own Your Car In 2 Steps",
    steps: ["City", "Car", "Your Plan"],
    city: ["Where Do You Want To Drive?", "Where Do You Drive?"],
    car: ["Which Car Do You Want To Drive?", "Which Car Do You Want?"],
    year: ["Choose Model Year", "Model Year"],
    mark: "key",
    upfront: false,
    apply: ["Check If You Qualify", "Apply For This Plan"],
  },
  now: {
    title: "Own Your Car In 3 Steps",
    steps: ["Location", "Car", "Upfront", "Your Plan"],
    city: "Where Do You Drive?",
    car: "Which Car Do You Want?",
    year: "Model Year",
    mark: "key",
    upfront: true,
    apply: "Apply For This Plan",
  },
};
