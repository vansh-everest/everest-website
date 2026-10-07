"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { FLEET_DATA_TAG } from "@/lib/fleet-data";
import { fleetSend } from "@/lib/jarvis";
import { EXTRA_LOCALES } from "@/lib/i18n";

/** Reads Jarvis again now instead of at the next fifteen-minute refresh, past fleet_connect's cache too. */
export async function refreshLiveDataAction(): Promise<void> {
  await requireAdmin();
  try {
    await fleetSend("DELETE", "/everest_website/fleet/cache");
  } catch {
    // An unreachable fleet_connect still answers from its own cache, which the next read shows.
  }
  updateTag(FLEET_DATA_TAG);
  for (const path of ["/", ...EXTRA_LOCALES.map((l) => `/${l}`)]) revalidatePath(path, "layout");
  revalidatePath("/admin/live-data");
}
