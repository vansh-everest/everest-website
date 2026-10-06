/**
 * The plans with a page of their own, and the address each one lives at. An address is fixed
 * once it is published, so the plan it shows is looked up by id rather than derived from a
 * name an editor can change. `wizard` picks the page's step-by-step plan picker: the words it
 * uses, whether it has an upfront step, and which figures the final step leads with.
 */
export const PLAN_PAGES = [
  { path: "/own-now", planId: "own-now", wizard: "now" },
  { path: "/drive-to-own", planId: "drive-to-own", wizard: "own" },
  { path: "/drive-to-earn", planId: "leasing", wizard: "earn" },
  { path: "/revenue-share", planId: "revenue-share", wizard: "share" },
] as const;

export type PlanPagePath = (typeof PLAN_PAGES)[number]["path"];
export type WizardKind = (typeof PLAN_PAGES)[number]["wizard"];

export function planIdFor(path: PlanPagePath): string {
  return PLAN_PAGES.find((p) => p.path === path)?.planId ?? "";
}

export function wizardFor(path: PlanPagePath): WizardKind {
  return PLAN_PAGES.find((p) => p.path === path)?.wizard ?? "earn";
}
