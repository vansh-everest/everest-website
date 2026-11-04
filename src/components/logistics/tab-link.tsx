"use client";

import type { ReactNode } from "react";

export type EnquiryTab = "quote" | "attach";

/** The event a link sends to open a tab of the enquiry card further down the page. */
export const TAB_EVENT = "logistics-enquiry-tab";

/** A link to the enquiry card that opens the matching tab as the page scrolls there. */
export function TabLink({ tab, className, children }: { tab: EnquiryTab; className?: string; children: ReactNode }) {
  return (
    <a href="#enquire" onClick={() => window.dispatchEvent(new CustomEvent<EnquiryTab>(TAB_EVENT, { detail: tab }))} className={className}>
      {children}
    </a>
  );
}
