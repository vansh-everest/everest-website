"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isDriverForm, sendManyToUnify } from "@/lib/unify";
import { toUnifyLead } from "./flow-data";
import { readJarvisLeads } from "./load";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Sends every driver application Jarvis holds for the page's date range to Unify. Unify keys each
 * by its lead id, so ones it already has come back as duplicates; the rest are stored there, and
 * reach the CRM only if they applied after the Website source was switched on.
 */
export async function sendToUnifyAction(form: FormData): Promise<void> {
  await requireAdmin();
  const from = String(form.get("from") ?? "");
  const to = String(form.get("to") ?? "");
  if (!DATE.test(from) || !DATE.test(to)) return;
  const jarvis = await readJarvisLeads(from, to);
  const leads = (jarvis?.leads ?? []).filter((l) => isDriverForm(l.source) && l.mobile);
  const result = await sendManyToUnify(leads.map(toUnifyLead));
  revalidatePath("/admin/leads/flow");
  const q = new URLSearchParams({ from, to });
  if (result) {
    q.set("sent", String(result.new));
    q.set("had", String(result.duplicates));
    if (result.rejected) q.set("refused", String(result.rejected));
    if (result.failed) q.set("stopped", "1");
  }
  redirect(`/admin/leads/flow?${q}`);
}
