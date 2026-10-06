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
  steps: ["City", "Car", "Your plan"],
  city: "Where do you drive?",
  car: "Which car do you want?",
  year: "Model year",
  mark: "rupee",
  upfront: false,
  apply: ["Check if you qualify", "Apply for this plan"],
};

export const WIZARD_COPY: Record<WizardKind, WizardCopy> = {
  earn: EARN,
  share: EARN,
  own: {
    title: "Own Your Car In 2 Steps",
    steps: ["City", "Car", "Your plan"],
    city: ["Where do you want to drive?", "Where do you drive?"],
    car: ["Which car do you want to drive?", "Which car do you want?"],
    year: ["Choose Model Year", "Model year"],
    mark: "key",
    upfront: false,
    apply: ["Check if you qualify", "Apply for this plan"],
  },
  now: {
    title: "Own Your Car In 3 Steps",
    steps: ["Location", "Car", "Upfront", "Your plan"],
    city: "Where do you drive?",
    car: "Which car do you want?",
    year: "Model year",
    mark: "key",
    upfront: true,
    apply: "Apply for this plan",
  },
};
