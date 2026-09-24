"use client";

import { useActionState, useMemo, useState } from "react";
import { discardDraftAction, editAction, type EditState } from "@/app/(admin)/admin/actions";
import type { SiteContent } from "@/lib/content";
import { CalculatorTab } from "./calculator-tab";
import { CarsTab } from "./cars-tab";
import { HistoryTab } from "./history-tab";
import { PlansTab } from "./plans-tab";
import { BlogTab, CitiesTab, ImagesTab } from "./site-tabs";

const TABS = ["Plans", "Cars", "Calculator", "Cities", "Blog", "Images", "History"] as const;
type Tab = (typeof TABS)[number];

type Version = { id: string; publishedAt: string; publishedBy: string };

const when = (iso: string) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";

const button =
  "h-10 rounded-full px-5 text-sm font-bold transition disabled:cursor-default disabled:opacity-50";

export function Editor({
  initial,
  hasDraft,
  live,
  versions,
  previewPages,
  role,
  storeMode,
}: {
  initial: SiteContent;
  hasDraft: boolean;
  live: { publishedAt: string; publishedBy: string };
  versions: Version[];
  previewPages: { label: string; path: string }[];
  role: "viewer" | "admin";
  storeMode: "file" | "blob" | "readonly";
}) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<Tab>("Plans");
  const [preview, setPreview] = useState(previewPages[0]?.path ?? "/");
  const [confirming, setConfirming] = useState(false);

  const [state, action, pending] = useActionState<EditState, FormData>(editAction, {
    status: "idle",
    message: "",
    base: hasDraft ? initial.updatedAt : "",
    seq: 0,
  });

  // Tells whether the screen has unsaved edits. Save times are left out, because the server
  // stamps them and they would otherwise make a just-published copy look edited.
  const body = (c: SiteContent) => JSON.stringify({ ...c, updatedAt: "", updatedBy: "", publishedAt: "", publishedBy: "" });
  const [savedBody, setSavedBody] = useState(() => body(initial));
  const [submittedBody, setSubmittedBody] = useState("");
  const [draftExists, setDraftExists] = useState(hasDraft);
  const [base, setBase] = useState(hasDraft ? initial.updatedAt : "");

  // Both adjustments happen while rendering the new result, not in an effect.
  // A save or publish from this screen:
  const [seenSeq, setSeenSeq] = useState(0);
  if (state.seq !== seenSeq) {
    setSeenSeq(state.seq);
    setSavedBody(submittedBody);
    setDraftExists(state.status === "saved");
    setBase(state.base);
    setConfirming(false);
  }
  // The stored copy changed underneath (publish, discard, restore): start again from it.
  const serverKey = `${hasDraft}|${initial.updatedAt}|${live.publishedAt}`;
  const [seenKey, setSeenKey] = useState(serverKey);
  if (serverKey !== seenKey) {
    setSeenKey(serverKey);
    setContent(initial);
    setSavedBody(body(initial));
    setDraftExists(hasDraft);
    setBase(hasDraft ? initial.updatedAt : "");
  }

  const json = useMemo(() => JSON.stringify(content), [content]);
  const dirty = useMemo(() => body(content), [content]) !== savedBody;
  const locked = role !== "admin" || storeMode === "readonly";

  const status = dirty
    ? "Unsaved changes"
    : draftExists
      ? "Draft saved, not yet live"
      : live.publishedAt
        ? `Live since ${when(live.publishedAt)} · ${live.publishedBy}`
        : "Live content";

  return (
    <form action={action} onSubmit={() => setSubmittedBody(body(content))} className="grid gap-6">
      <input type="hidden" name="content" value={json} />
      <input type="hidden" name="base" value={base} />

      <div className="sticky top-0 z-10 grid gap-3 border-b border-line bg-mist/95 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <p className={`text-[13px] font-bold ${dirty ? "text-[#b3261e]" : draftExists ? "text-[#8a6b09]" : "text-[#1a8f4a]"}`}>
            {status}
          </p>
          {state.message ? (
            <p className={`text-[13px] ${state.status === "error" ? "text-[#b3261e]" : "text-ink-soft"}`}>{state.message}</p>
          ) : null}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {draftExists && !dirty && !locked ? (
              <button type="submit" formAction={discardDraftAction} className={`${button} border border-line bg-white text-navy`}>
                Discard draft
              </button>
            ) : null}
            <button
              type="submit"
              name="intent"
              value="save"
              disabled={locked || pending || !dirty}
              className={`${button} border border-navy bg-white text-navy`}
            >
              {pending ? "Working" : "Save draft"}
            </button>
            {confirming ? (
              <>
                <button type="button" onClick={() => setConfirming(false)} className={`${button} text-ink-soft`}>
                  Cancel
                </button>
                <button type="submit" name="intent" value="publish" disabled={pending} className={`${button} bg-[#1a8f4a] text-white`}>
                  Publish to the live site
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={locked || pending || (!dirty && !draftExists)}
                onClick={() => setConfirming(true)}
                className={`${button} bg-sun text-navy hover:brightness-95`}
              >
                Publish
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-current={t === tab ? "page" : undefined}
                className={`h-9 rounded-full px-4 text-[13px] font-bold transition ${
                  t === tab ? "bg-navy text-white" : "border border-line bg-white text-navy hover:border-navy"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <select
              aria-label="Page to preview"
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              className="h-9 rounded-full border border-line bg-white px-3 text-[13px] font-semibold text-navy"
            >
              {previewPages.map((p) => (
                <option key={p.path} value={p.path}>
                  {p.label}
                </option>
              ))}
            </select>
            {dirty ? (
              <span className="text-[12px] text-ink-soft">Save to preview</span>
            ) : (
              <a
                href={`/api/preview/?path=${encodeURIComponent(preview)}`}
                target="_blank"
                rel="noopener"
                className="flex h-9 items-center rounded-full bg-brand px-4 text-[13px] font-bold text-white"
              >
                {draftExists ? "Preview draft" : "View page"}
              </a>
            )}
          </div>
        </div>
      </div>

      {tab === "Plans" ? <PlansTab content={content} setContent={setContent} locked={locked} /> : null}
      {tab === "Cars" ? <CarsTab content={content} setContent={setContent} locked={locked} /> : null}
      {tab === "Calculator" ? <CalculatorTab content={content} setContent={setContent} locked={locked} /> : null}
      {tab === "Cities" ? <CitiesTab content={content} setContent={setContent} locked={locked} /> : null}
      {tab === "Blog" ? <BlogTab content={content} setContent={setContent} locked={locked} /> : null}
      {tab === "Images" ? <ImagesTab content={content} setContent={setContent} locked={locked} /> : null}
      {tab === "History" ? <HistoryTab versions={versions} locked={locked} /> : null}
    </form>
  );
}
