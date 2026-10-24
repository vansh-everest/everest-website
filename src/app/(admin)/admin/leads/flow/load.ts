import "server-only";
import { jarvisAdmin } from "@/lib/jarvis";
import type { JarvisLead } from "./flow-data";

const PAGE_SIZE = 100;
const MAX_PAGES = 60;
const AT_ONCE = 6;

/**
 * Every website submission Jarvis holds from `from` to `to` (IST dates, inclusive), newest first.
 * Jarvis pages at 100, so the rest are read a few pages at a time; `capped` past 6,000.
 */
export async function readJarvisLeads(from: string, to: string): Promise<{ leads: JarvisLead[]; capped: boolean } | null> {
  const path = (page: number) =>
    `/everest_website/admin/leads?${new URLSearchParams({ date_from: from, date_to: to, page: String(page), page_size: String(PAGE_SIZE) })}`;
  const first = await jarvisAdmin<JarvisLead[]>("GET", path(1));
  if (first.status !== 200) {
    console.error("[leads flow] Jarvis answered", first.status);
    return null;
  }
  const leads = [...(first.body.data?.records ?? [])];
  const total = first.body.data?.countdata ?? leads.length;
  const pages = Math.min(MAX_PAGES, Math.ceil(total / PAGE_SIZE));
  for (let start = 2; start <= pages; start += AT_ONCE) {
    const batch = Array.from({ length: Math.min(AT_ONCE, pages - start + 1) }, (_, k) => start + k);
    const answers = await Promise.all(batch.map((page) => jarvisAdmin<JarvisLead[]>("GET", path(page))));
    for (const answer of answers) leads.push(...(answer.body.data?.records ?? []));
  }
  return { leads, capped: total > leads.length };
}
