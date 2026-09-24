"use client";

import { restoreVersionAction } from "@/app/(admin)/admin/actions";
import { Panel } from "./fields";

type Version = { id: string; publishedAt: string; publishedBy: string };

const when = (iso: string) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";

/**
 * Rendered inside the editor's form, so each restore is a button with its own form action
 * rather than a nested form. The id is bound to the action because React replaces the name
 * and value of a button whose form action is a function.
 */
export function HistoryTab({ versions, locked }: { versions: Version[]; locked: boolean }) {
  return (
    <Panel title="Published versions">
      {versions.length === 0 ? (
        <p className="text-sm text-ink-soft">Each publish is listed here</p>
      ) : (
        <ul className="divide-y divide-line">
          {versions.map((v, i) => (
            <li key={v.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="text-sm text-navy">
                <span className="font-bold">{when(v.publishedAt)}</span>
                <span className="text-ink-soft"> · {v.publishedBy}</span>
                {i === 0 ? (
                  <span className="ml-2 rounded-full bg-[#e8f9ee] px-2 py-0.5 text-[11px] font-bold text-[#1a8f4a]">Live</span>
                ) : null}
              </div>
              <button
                type="submit"
                formAction={restoreVersionAction.bind(null, v.id)}
                disabled={locked}
                className="ml-auto h-8 rounded-full border border-line px-3 text-[12px] font-bold text-navy transition hover:border-navy disabled:opacity-40"
              >
                Load into draft
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
