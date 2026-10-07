"use client";

import { useActionState, useMemo, useState } from "react";
import { Calculator, Car, ExternalLink, History, ImageIcon, Layers, MapPin, Newspaper } from "lucide-react";
import { discardDraftAction, editAction, type EditState } from "@/app/(admin)/admin/actions";
import type { SiteContent } from "@/lib/content";
import { CalculatorTab } from "./calculator-tab";
import { CarsTab } from "./cars-tab";
import { button } from "./fields";
import { HistoryTab } from "./history-tab";
import { PlansTab } from "./plans-tab";
import { BlogTab, CitiesTab, ImagesTab } from "./site-tabs";

const TABS = [
  { name: "Plans", icon: Layers },
  { name: "Cars", icon: Car },
  { name: "Calculator", icon: Calculator },
  { name: "Cities", icon: MapPin },
  { name: "Blog", icon: Newspaper },
  { name: "Images", icon: ImageIcon },
  { name: "History", icon: History },
] as const;
type Tab = (typeof TABS)[number]["name"];

type Version = { id: string; publishedAt: string; publishedBy: string };

const when = (iso: string) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : "";

export function Editor({
  initial,
  initialBase,
  hasDraft,
  live,
  versions,
  previewPages,
  role,
  storeMode,
  notice,
}: {
  initial: SiteContent;
  /** The marker the first change must send back: the draft's timestamp, or Jarvis's revision. */
  initialBase: string;
  hasDraft: boolean;
  live: { publishedAt: string; publishedBy: string };
  versions: Version[];
  previewPages: { label: string; path: string }[];
  role: "viewer" | "admin";
  storeMode: "file" | "blob" | "jarvis" | "readonly";
  notice?: string;
}) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<Tab>("Plans");
  const [preview, setPreview] = useState(previewPages[0]?.path ?? "/");
  const [confirming, setConfirming] = useState(false);

  const [state, action, pending] = useActionState<EditState, FormData>(editAction, {
    status: "idle",
    message: "",
    base: initialBase,
    seq: 0,
  });

  // Tells whether the screen has unsaved edits. Save times are left out, because the server
  // stamps them and they would otherwise make a just-published copy look edited.
  const body = (c: SiteContent) => JSON.stringify({ ...c, updatedAt: "", updatedBy: "", publishedAt: "", publishedBy: "" });
  const [savedBody, setSavedBody] = useState(() => body(initial));
  const [submittedBody, setSubmittedBody] = useState("");
  const [draftExists, setDraftExists] = useState(hasDraft);
  const [base, setBase] = useState(initialBase);

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
  const serverKey = `${hasDraft}|${initialBase}|${initial.updatedAt}|${live.publishedAt}`;
  const [seenKey, setSeenKey] = useState(serverKey);
  if (serverKey !== seenKey) {
    setSeenKey(serverKey);
    setContent(initial);
    setSavedBody(body(initial));
    setDraftExists(hasDraft);
    setBase(initialBase);
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
  const dot = dirty || draftExists ? "bg-[#e0a100]" : "bg-[#1a8f4a]";

  const counts: Partial<Record<Tab, number>> = {
    Plans: content.plans.length,
    Cars: content.cars.length,
    Cities: content.cities.length,
    Blog: content.posts.length,
    History: versions.length,
  };

  return (
    <form action={action} onSubmit={() => setSubmittedBody(body(content))}>
      <input type="hidden" name="content" value={json} />
      <input type="hidden" name="base" value={base} />

      <div className="mx-auto max-w-[1280px] px-4 lg:grid lg:grid-cols-[196px_minmax(0,1fr)] lg:gap-8 lg:px-6">
        <aside className="hidden lg:block">
          <nav aria-label="Sections" className="sticky top-14 grid gap-0.5 py-6">
            {TABS.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => setTab(name)}
                aria-current={name === tab ? "page" : undefined}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                  name === tab ? "bg-white text-navy shadow-[0_1px_2px_rgba(6,47,80,0.08)] ring-1 ring-line" : "text-ink-soft hover:bg-white/70 hover:text-navy"
                }`}
              >
                <Icon size={17} className={name === tab ? "text-brand" : ""} />
                {name}
                {counts[name] !== undefined ? (
                  <span aria-hidden className="ml-auto text-xs font-normal text-ink-soft">
                    {counts[name]}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 pb-20">
          <div className="sticky top-14 z-20 -mx-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-mist/95 px-4 py-3 backdrop-blur lg:mx-0 lg:px-0">
            <div className="min-w-0 basis-full sm:basis-auto sm:flex-1">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-navy">
                <span aria-hidden className={`size-2 shrink-0 rounded-full ${dot}`} />
                <span className="truncate">{status}</span>
              </p>
              {state.message ? (
                <p className={`mt-0.5 truncate pl-4 text-xs ${state.status === "error" ? "text-[#b3261e]" : "text-ink-soft"}`}>{state.message}</p>
              ) : null}
            </div>
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              {draftExists && !dirty && !locked ? (
                <button type="submit" formAction={discardDraftAction} className={`${button.secondary} text-[#b3261e]`}>
                  Discard draft
                </button>
              ) : null}
              <button type="submit" name="intent" value="save" disabled={locked || pending || !dirty} className={button.secondary}>
                {pending ? "Working" : "Save draft"}
              </button>
              {confirming ? (
                <>
                  <button type="button" onClick={() => setConfirming(false)} className={button.secondary}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    name="intent"
                    value="publish"
                    disabled={pending}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1a8f4a] px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
                  >
                    Publish to the live site
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={locked || pending || (!dirty && !draftExists)}
                  onClick={() => setConfirming(true)}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-sun px-5 text-sm font-semibold text-navy transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Publish
                </button>
              )}
            </div>
          </div>

          <nav aria-label="Sections" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pt-4 [scrollbar-width:none] lg:hidden">
            {TABS.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => setTab(name)}
                aria-current={name === tab ? "page" : undefined}
                className={`flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-[13px] font-medium ${
                  name === tab ? "bg-navy text-white" : "border border-line bg-white text-navy"
                }`}
              >
                <Icon size={15} />
                {name}
              </button>
            ))}
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-3 pb-4 pt-6">
            <h2 className="text-xl font-bold text-navy">{tab}</h2>
            <div className="flex items-center gap-2">
              <select
                aria-label="Page to preview"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                className="h-9 max-w-[200px] cursor-pointer rounded-lg border border-line bg-white px-2.5 text-[13px] font-medium text-navy outline-none focus:border-brand"
              >
                {previewPages.map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.label}
                  </option>
                ))}
              </select>
              {dirty ? (
                <span className="text-xs text-ink-soft">Save to preview</span>
              ) : (
                <a
                  href={`/api/preview/?path=${encodeURIComponent(preview)}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-[13px] font-semibold text-white transition hover:brightness-110"
                >
                  <ExternalLink size={14} />
                  {draftExists ? "Preview draft" : "View page"}
                </a>
              )}
            </div>
          </div>

          {notice ? <p className="mb-4 rounded-lg border border-[#b3261e]/25 bg-[#fdecea] px-4 py-3 text-[13px] text-[#8c1d18]">{notice}</p> : null}
          {storeMode === "readonly" ? (
            <p className="mb-4 rounded-lg border border-[#e0a100]/30 bg-[#fdf3d7] px-4 py-3 text-[13px] text-[#6b5208]">
              Saving is off: no content store is connected to this deployment.
            </p>
          ) : null}

          {tab === "Plans" ? <PlansTab content={content} setContent={setContent} locked={locked} /> : null}
          {tab === "Cars" ? <CarsTab content={content} setContent={setContent} locked={locked} /> : null}
          {tab === "Calculator" ? <CalculatorTab content={content} setContent={setContent} locked={locked} /> : null}
          {tab === "Cities" ? <CitiesTab content={content} setContent={setContent} locked={locked} /> : null}
          {tab === "Blog" ? <BlogTab content={content} setContent={setContent} locked={locked} /> : null}
          {tab === "Images" ? <ImagesTab content={content} setContent={setContent} locked={locked} /> : null}
          {tab === "History" ? <HistoryTab versions={versions} locked={locked} /> : null}
        </div>
      </div>
    </form>
  );
}
