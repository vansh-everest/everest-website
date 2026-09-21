"use client";

import { useActionState, useState } from "react";
import { saveAction, type SaveState } from "@/app/(admin)/admin/actions";
import { Area, ImageField, Panel, Text, Toggle } from "@/components/admin/fields";
import type { City, Hub, Plan, Post, SiteContent } from "@/lib/content";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";

const TABS = ["Cities", "Plans", "Blog", "Images"] as const;
type Tab = (typeof TABS)[number];

const initialSave: SaveState = { status: "idle", message: "" };

function blankPost(): Post {
  return {
    slug: "",
    locale: "en",
    title: "",
    excerpt: "",
    body: [""],
    published: false,
    date: new Date().toISOString().slice(0, 10),
    coverImage: { label: "Cover image", url: "", alt: "" },
  };
}

export function Editor({
  initial,
  role,
  storeMode,
}: {
  initial: SiteContent;
  role: "viewer" | "admin";
  storeMode: "file" | "blob" | "readonly";
}) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<Tab>("Cities");
  const [state, action, pending] = useActionState(saveAction, initialSave);
  const locked = role !== "admin";

  function patchCity(index: number, patch: Partial<City>) {
    setContent((c) => ({ ...c, cities: c.cities.map((x, i) => (i === index ? { ...x, ...patch } : x)) }));
  }
  function patchPlan(index: number, patch: Partial<Plan>) {
    setContent((c) => ({ ...c, plans: c.plans.map((x, i) => (i === index ? { ...x, ...patch } : x)) }));
  }
  function patchPost(index: number, patch: Partial<Post>) {
    setContent((c) => ({ ...c, posts: c.posts.map((x, i) => (i === index ? { ...x, ...patch } : x)) }));
  }

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="content" value={JSON.stringify(content)} />

      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-line bg-mist/95 py-4 backdrop-blur">
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
        <div className="ml-auto flex items-center gap-3">
          {state.message ? (
            <span className={`text-[13px] ${state.status === "error" ? "text-[#b3261e]" : "text-ink-soft"}`}>
              {state.message}
            </span>
          ) : null}
          <button
            type="submit"
            disabled={locked || pending || storeMode === "readonly"}
            className="h-10 rounded-full bg-sun px-6 text-sm font-bold text-navy transition hover:brightness-95 disabled:opacity-60"
          >
            {pending ? "Saving" : "Save changes"}
          </button>
        </div>
      </div>

      {tab === "Cities" ? (
        <div className="grid gap-5">
          {content.cities.map((city, i) => (
            <Panel key={city.slug} title={`${city.name.en} · /drive-with-us/driver-job-in-${city.slug}/`}>
              <div className="grid gap-4 sm:grid-cols-3">
                {LOCALES.map((l) => (
                  <Text
                    key={l}
                    label={`Name, ${LOCALE_META[l].label}`}
                    value={city.name[l]}
                    disabled={locked}
                    onChange={(v) => patchCity(i, { name: { ...city.name, [l]: v } as Record<Locale, string> })}
                  />
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Text label="State" value={city.state} disabled={locked} onChange={(v) => patchCity(i, { state: v })} />
                <Text
                  label="Cars ready"
                  type="number"
                  value={String(city.readyCars)}
                  disabled={locked}
                  onChange={(v) => patchCity(i, { readyCars: Number(v) || 0 })}
                />
              </div>
              <ImageField slot={city.heroImage} disabled={locked} onChange={(heroImage) => patchCity(i, { heroImage })} />
              <HubList hubs={city.hubs} disabled={locked} onChange={(hubs) => patchCity(i, { hubs })} />
            </Panel>
          ))}
        </div>
      ) : null}

      {tab === "Plans" ? (
        <div className="grid gap-5">
          {content.plans.map((plan, i) => (
            <Panel key={plan.id} title={plan.name.en || plan.id}>
              <div className="grid gap-4 sm:grid-cols-3">
                {LOCALES.map((l) => (
                  <Text
                    key={l}
                    label={`Name, ${LOCALE_META[l].label}`}
                    value={plan.name[l]}
                    disabled={locked}
                    onChange={(v) => patchPlan(i, { name: { ...plan.name, [l]: v } as Record<Locale, string> })}
                  />
                ))}
              </div>
              {LOCALES.map((l) => (
                <Area
                  key={l}
                  rows={3}
                  label={`Summary, ${LOCALE_META[l].label}`}
                  value={plan.summary[l]}
                  disabled={locked}
                  onChange={(v) => patchPlan(i, { summary: { ...plan.summary, [l]: v } as Record<Locale, string> })}
                />
              ))}
              <div className="grid gap-4 sm:grid-cols-3">
                <Text
                  label="Upfront"
                  placeholder="Blank hides the row"
                  value={plan.upfront ?? ""}
                  disabled={locked}
                  onChange={(v) => patchPlan(i, { upfront: v })}
                />
                <Text
                  label="Per day"
                  placeholder="Blank hides the row"
                  value={plan.perDay ?? ""}
                  disabled={locked}
                  onChange={(v) => patchPlan(i, { perDay: v })}
                />
                <Text
                  label="Months"
                  placeholder="Blank hides the row"
                  value={plan.months ?? ""}
                  disabled={locked}
                  onChange={(v) => patchPlan(i, { months: v })}
                />
              </div>
            </Panel>
          ))}
        </div>
      ) : null}

      {tab === "Blog" ? (
        <div className="grid gap-5">
          {content.posts.map((post, i) => (
            <Panel key={i} title={post.title || "Untitled post"}>
              <div className="grid gap-4 sm:grid-cols-3">
                <Text label="Address" value={post.slug} disabled={locked} onChange={(v) => patchPost(i, { slug: v })} />
                <label className="block text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-soft">
                  Language
                  <select
                    value={post.locale}
                    disabled={locked}
                    onChange={(e) => patchPost(i, { locale: e.target.value as Locale })}
                    className="mt-1.5 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand disabled:bg-mist"
                  >
                    {LOCALES.map((l) => (
                      <option key={l} value={l}>
                        {LOCALE_META[l].label}
                      </option>
                    ))}
                  </select>
                </label>
                <Text label="Date" type="date" value={post.date} disabled={locked} onChange={(v) => patchPost(i, { date: v })} />
              </div>
              <Text label="Title" value={post.title} disabled={locked} onChange={(v) => patchPost(i, { title: v })} />
              <Area rows={2} label="Excerpt" value={post.excerpt} disabled={locked} onChange={(v) => patchPost(i, { excerpt: v })} />
              <Area
                rows={10}
                label="Body, one paragraph per line"
                value={post.body.join("\n\n")}
                disabled={locked}
                onChange={(v) => patchPost(i, { body: v.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) })}
              />
              <ImageField slot={post.coverImage} disabled={locked} onChange={(coverImage) => patchPost(i, { coverImage })} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Toggle label="Published" checked={post.published} disabled={locked} onChange={(v) => patchPost(i, { published: v })} />
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setContent((c) => ({ ...c, posts: c.posts.filter((_, x) => x !== i) }))}
                  className="h-9 rounded-full border border-line px-4 text-[13px] font-bold text-[#b3261e] disabled:opacity-60"
                >
                  Remove post
                </button>
              </div>
            </Panel>
          ))}
          <button
            type="button"
            disabled={locked}
            onClick={() => setContent((c) => ({ ...c, posts: [...c.posts, blankPost()] }))}
            className="h-11 rounded-full border border-dashed border-line bg-white text-sm font-bold text-navy disabled:opacity-60"
          >
            Add post
          </button>
        </div>
      ) : null}

      {tab === "Images" ? (
        <Panel title="Site images">
          {Object.entries(content.images).map(([key, slot]) => (
            <ImageField
              key={key}
              slot={slot}
              disabled={locked}
              onChange={(next) => setContent((c) => ({ ...c, images: { ...c.images, [key]: next } }))}
            />
          ))}
        </Panel>
      ) : null}
    </form>
  );
}

function HubList({
  hubs,
  onChange,
  disabled,
}: {
  hubs: Hub[];
  onChange: (hubs: Hub[]) => void;
  disabled: boolean;
}) {
  function patch(index: number, next: Partial<Hub>) {
    onChange(hubs.map((h, i) => (i === index ? { ...h, ...next } : h)));
  }

  return (
    <div className="grid gap-3">
      <p className="text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-soft">Hubs</p>
      {hubs.map((hub, i) => (
        <div key={i} className="grid gap-3 rounded-xl border border-line bg-paper p-4">
          <Text label="Hub name" value={hub.name} disabled={disabled} onChange={(v) => patch(i, { name: v })} />
          <Area rows={2} label="Address" value={hub.address} disabled={disabled} onChange={(v) => patch(i, { address: v })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Text label="Hours" value={hub.hours} disabled={disabled} onChange={(v) => patch(i, { hours: v })} />
            <Text label="Map link" value={hub.mapUrl ?? ""} disabled={disabled} onChange={(v) => patch(i, { mapUrl: v })} />
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(hubs.filter((_, x) => x !== i))}
            className="h-9 justify-self-start rounded-full border border-line px-4 text-[13px] font-bold text-[#b3261e] disabled:opacity-60"
          >
            Remove hub
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange([...hubs, { name: "", address: "", hours: "" }])}
        className="h-10 justify-self-start rounded-full border border-dashed border-line bg-white px-5 text-[13px] font-bold text-navy disabled:opacity-60"
      >
        Add hub
      </button>
    </div>
  );
}
