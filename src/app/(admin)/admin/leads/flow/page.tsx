import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { jarvisAdminEnabled } from "@/lib/jarvis";
import { readUnifyLeads, unifyEnabled } from "@/lib/unify";
import { joinLeads } from "./flow-data";
import { readJarvisLeads } from "./load";
import { FlowView, readFilters, type Filters } from "./view";

export const dynamic = "force-dynamic";

/** Everything the page shows for one date range, before the city, form and channel cuts. */
async function load(f: Filters) {
  const unifySince = new Date(Date.parse(`${f.from}T00:00:00+05:30`) - 86_400_000);
  const [jarvis, unify] = await Promise.all([readJarvisLeads(f.from, f.to), readUnifyLeads(unifySince)]);
  return { jarvis, unify, all: joinLeads(jarvis?.leads ?? [], unify?.leads ?? []) };
}

/** Website submissions on their way to the CRM, as Jarvis and Unify report them. */
export default async function LeadsFlowPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!jarvisAdminEnabled()) redirect("/admin");
  if (!(await readSession())) redirect("/admin");

  const f = readFilters(await searchParams);
  const loaded = await load(f);
  return <FlowView f={f} unifyOn={unifyEnabled()} {...loaded} />;
}
