import type { Dispatch, SetStateAction } from "react";
import type { SiteContent } from "@/lib/content";

export type Setter = Dispatch<SetStateAction<SiteContent>>;

/** An id from a display name that no sibling already uses: "Revenue Share" becomes "revenue-share". */
export function newId(name: string, taken: string[]): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 36) || "item";
  let id = base;
  for (let n = 2; taken.includes(id); n++) id = `${base}-${n}`;
  return id;
}
