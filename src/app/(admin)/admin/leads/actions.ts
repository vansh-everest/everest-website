"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { jarvisAdmin } from "@/lib/jarvis";
import { LEAD_STATUSES } from "./query";

/** Bound to a lead id: `updateLeadAction.bind(null, id)`. */
export async function updateLeadAction(id: number, form: FormData): Promise<void> {
  await requireAdmin();
  const status = String(form.get("status") ?? "");
  const note = String(form.get("note") ?? "").slice(0, 2000);
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) return;
  await jarvisAdmin("PATCH", `/everest_website/admin/leads/${Number(id) || 0}`, { status, note });
  revalidatePath("/admin/leads");
}
