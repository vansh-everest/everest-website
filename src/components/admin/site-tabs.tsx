"use client";

import type { City, Hub, Post, SiteContent } from "@/lib/content";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";
import { Area, Checks, ImageField, Panel, Text, Toggle } from "./fields";
import type { Setter } from "./shared";

type Props = { content: SiteContent; setContent: Setter; locked: boolean };

export function CitiesTab({ content, setContent, locked }: Props) {
  const plans = content.plans.map((p) => ({ id: p.id, label: p.name.en || p.id }));
  const patch = (i: number, p: Partial<City>) =>
    setContent((c) => ({ ...c, cities: c.cities.map((x, j) => (j === i ? { ...x, ...p } : x)) }));

  return (
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
                onChange={(v) => patch(i, { name: { ...city.name, [l]: v } as Record<Locale, string> })}
              />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="State" value={city.state} disabled={locked} onChange={(v) => patch(i, { state: v })} />
            <Text
              label="Cars ready"
              numeric
              value={String(city.readyCars)}
              disabled={locked}
              onChange={(v) => patch(i, { readyCars: Number(v) || 0 })}
            />
          </div>
          <Checks
            label="Plans on this driver page"
            items={plans}
            selected={city.plans}
            disabled={locked}
            onChange={(ids) => patch(i, { plans: ids })}
          />
          <ImageField slot={city.heroImage} disabled={locked} onChange={(heroImage) => patch(i, { heroImage })} />
          <HubList hubs={city.hubs} disabled={locked} onChange={(hubs) => patch(i, { hubs })} />
        </Panel>
      ))}
    </div>
  );
}

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

export function BlogTab({ content, setContent, locked }: Props) {
  const patch = (i: number, p: Partial<Post>) =>
    setContent((c) => ({ ...c, posts: c.posts.map((x, j) => (j === i ? { ...x, ...p } : x)) }));

  return (
    <div className="grid gap-5">
      {content.posts.map((post, i) => (
        <Panel key={i} title={post.title || "Untitled post"}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Text label="Address" value={post.slug} disabled={locked} onChange={(v) => patch(i, { slug: v })} />
            <label className="block text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-soft">
              Language
              <select
                value={post.locale}
                disabled={locked}
                onChange={(e) => patch(i, { locale: e.target.value as Locale })}
                className="mt-1.5 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand disabled:bg-mist"
              >
                {LOCALES.map((l) => (
                  <option key={l} value={l}>
                    {LOCALE_META[l].label}
                  </option>
                ))}
              </select>
            </label>
            <Text label="Date" type="date" value={post.date} disabled={locked} onChange={(v) => patch(i, { date: v })} />
          </div>
          <Text label="Title" value={post.title} disabled={locked} onChange={(v) => patch(i, { title: v })} />
          <Area rows={2} label="Excerpt" value={post.excerpt} disabled={locked} onChange={(v) => patch(i, { excerpt: v })} />
          <Area
            rows={10}
            label="Body, one paragraph per line"
            value={post.body.join("\n\n")}
            disabled={locked}
            onChange={(v) => patch(i, { body: v.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) })}
          />
          <ImageField slot={post.coverImage} disabled={locked} onChange={(coverImage) => patch(i, { coverImage })} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Toggle label="Published" checked={post.published} disabled={locked} onChange={(v) => patch(i, { published: v })} />
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
  );
}

export function ImagesTab({ content, setContent, locked }: Props) {
  return (
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
  );
}

function HubList({ hubs, onChange, disabled }: { hubs: Hub[]; onChange: (hubs: Hub[]) => void; disabled: boolean }) {
  const patch = (index: number, next: Partial<Hub>) => onChange(hubs.map((h, i) => (i === index ? { ...h, ...next } : h)));

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
