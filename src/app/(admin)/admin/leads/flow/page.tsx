import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { jarvisAdminEnabled } from "@/lib/jarvis";
import { searchPages } from "@/lib/search-pages";
import { getContent } from "@/lib/store";
import { readUnifyLeads, unifyEnabled } from "@/lib/unify";
import { joinLeads } from "./flow-data";
import { readJarvisLeads } from "./load";
import { FlowView, readFilters, type Filters, type SendResult } from "./view";

export const dynamic = "force-dynamic";

/** Everything the page shows for one date range, before the city, form and channel cuts. */
async function load(f: Filters) {
  const unifySince = new Date(Date.parse(`${f.from}T00:00:00+05:30`) - 86_400_000);
  const [jarvis, unify, content] = await Promise.all([readJarvisLeads(f.from, f.to), readUnifyLeads(unifySince), getContent()]);
  return { jarvis, unify, all: joinLeads(jarvis?.leads ?? [], unify?.leads ?? []), pages: searchPages(content) };
}

/** The counts "Send to Unify" put in the address it returned to. */
function sendResult(params: Record<string, string | string[] | undefined>): SendResult {
  const n = (key: string) => Number([params[key]].flat()[0] ?? "") || 0;
  return params.sent === undefined ? null : { sent: n("sent"), had: n("had"), refused: n("refused"), stopped: params.stopped !== undefined };
}

/** Website submissions on their way to the CRM, as Jarvis and Unify report them. */
export default async function LeadsFlowPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!jarvisAdminEnabled()) redirect("/admin");
  if (!(await readSession())) redirect("/admin");

  const params = await searchParams;
  const f = readFilters(params);
  const loaded = await load(f);
  return <FlowView f={f} unifyOn={unifyEnabled()} result={sendResult(params)} {...loaded} />;
}
