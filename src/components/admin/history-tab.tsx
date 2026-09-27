"use client";

import { RotateCcw } from "lucide-react";
import { restoreVersionAction } from "@/app/(admin)/admin/actions";
import { Badge, Panel, button } from "./fields";

type Version = { id: string; publishedAt: string; publishedBy: string };

const when = (iso: string) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : "";

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
        <ul className="-my-2 divide-y divide-line">
          {versions.map((v, i) => (
            <li key={v.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-navy">
                  {when(v.publishedAt)}
                  {i === 0 ? <Badge tone="green">Live</Badge> : null}
                </p>
                <p className="mt-0.5 truncate text-[13px] text-ink-soft">{v.publishedBy}</p>
              </div>
              <button type="submit" formAction={restoreVersionAction.bind(null, v.id)} disabled={locked} className={button.small}>
                <RotateCcw size={14} />
                Load into draft
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
