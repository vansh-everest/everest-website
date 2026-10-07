import { readSession } from "@/lib/auth";
import { jarvisAdminEnabled, jarvisAdminRaw } from "@/lib/jarvis";
import { leadQuery } from "../query";

export const dynamic = "force-dynamic";

/** The leads CSV, fetched from Jarvis with the signed-in person's token and the page's filters. */
export async function GET(request: Request) {
  if (!jarvisAdminEnabled() || !(await readSession())) return new Response("Not found", { status: 404 });
  const res = await jarvisAdminRaw(`/everest_website/admin/leads/export?${leadQuery(new URL(request.url).searchParams)}`);
  if (!res.ok) return new Response("The export could not be made.", { status: 502 });
  return new Response(res.body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="everest-website-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
