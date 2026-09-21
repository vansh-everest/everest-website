import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Where a lead lands before a CRM exists.
 *
 * Local development appends to a git ignored JSONL file. Production appends to Vercel Blob
 * under a per-day key, because a serverless filesystem does not persist. With neither
 * configured the record is written to the function log, which is still recoverable.
 */

export type Lead = {
  at: string;
  name: string;
  mobile: string;
  city: string;
  locale: string;
  source: string;
  page: string;
  referrer: string;
  campaign: string;
};

const FILE = path.join(process.cwd(), ".leads.jsonl");

export async function appendLead(lead: Lead): Promise<void> {
  const line = `${JSON.stringify(lead)}\n`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    // One object per lead, grouped by day, so nothing races on a shared file.
    const key = `leads/${lead.at.slice(0, 10)}/${lead.at}-${lead.mobile}.json`;
    await put(key, JSON.stringify(lead, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: true,
    });
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    await fs.appendFile(FILE, line, "utf8");
    return;
  }

  console.log("[lead]", line.trim());
}

export async function readLeads(limit = 200): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .slice(-limit)
      .reverse()
      .map((l) => JSON.parse(l) as Lead);
  } catch {
    return [];
  }
}
