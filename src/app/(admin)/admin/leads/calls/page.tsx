import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { jarvisAdminEnabled } from "@/lib/jarvis";
import { readUnifyCalls, unifyEnabled } from "@/lib/unify";
import { CallsView, rangeOf } from "./view";

export const dynamic = "force-dynamic";

/**
 * Taps on the site's call buttons, kept apart from applications: a call never lands in the CRM
 * as a website lead, so it is counted here and not in Road to 300. Unify stores the taps
 * (/api/public/website-calls); the dialer's own call log can join them later.
 */
export default async function CallsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!jarvisAdminEnabled()) redirect("/admin");
  if (!(await readSession())) redirect("/admin");

  const range = rangeOf(await searchParams);
  // A day early, so taps near midnight IST on the first day are kept.
  const since = new Date(Date.parse(`${range.from}T00:00:00+05:30`) - 86_400_000);
  const loaded = unifyEnabled() ? await readUnifyCalls(since) : null;
  return <CallsView range={range} unifyOn={unifyEnabled()} loaded={loaded} />;
}
