/**
 * The plans with a page of their own, and the address each one lives at. An address is fixed
 * once it is published, so the plan it shows is looked up by id rather than derived from a
 * name an editor can change.
 */
export const PLAN_PAGES = [
  { path: "/own-now", planId: "own-now" },
  { path: "/drive-to-own", planId: "drive-to-own" },
  { path: "/drive-to-earn", planId: "leasing" },
  { path: "/revenue-share", planId: "revenue-share" },
] as const;

export type PlanPagePath = (typeof PLAN_PAGES)[number]["path"];

export function planIdFor(path: PlanPagePath): string {
  return PLAN_PAGES.find((p) => p.path === path)?.planId ?? "";
}
