"use client";

import { Plus } from "lucide-react";
import type { City, Hub, Post, SiteContent } from "@/lib/content";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";
import { Area, Badge, Checks, Collapsible, ImageField, ListControls, Panel, Row, Section, Select, Text, Toggle, button } from "./fields";
import { JarvisHubs, ReadOnly } from "./jarvis-fields";
import type { JarvisView, Setter } from "./shared";

type Props = { content: SiteContent; setContent: Setter; locked: boolean };

/** On Jarvis, ready cars are its count and hubs its list wherever it has one, both read only. */
export function CitiesTab({ content, setContent, locked, jarvis = null }: Props & { jarvis?: JarvisView | null }) {
  const plans = content.plans.map((p) => ({ id: p.id, label: p.name.en || p.id }));
  const patch = (i: number, p: Partial<City>) =>
    setContent((c) => ({ ...c, cities: c.cities.map((x, j) => (j === i ? { ...x, ...p } : x)) }));

  return (
    <div className="grid gap-3">
      {content.cities.map((city, i) => (
        <Collapsible
          key={city.slug}
          title={city.name.en}
          meta={
            <>
              <Badge>/drive-with-us/driver-job-in-{city.slug}/</Badge>
              <Badge tone="blue">{city.plans.length === 1 ? "1 plan" : `${city.plans.length} plans`}</Badge>
            </>
          }
        >
          <Section title="Name">
            <Row cols={3}>
              {LOCALES.map((l) => (
                <Text
                  key={l}
                  label={`Name, ${LOCALE_META[l].label}`}
                  value={city.name[l]}
                  disabled={locked}
                  onChange={(v) => patch(i, { name: { ...city.name, [l]: v } as Record<Locale, string> })}
                />
              ))}
            </Row>
          </Section>
          <Section title="Details">
            <Row cols={2}>
              <Text label="State" value={city.state} disabled={locked} onChange={(v) => patch(i, { state: v })} />
              {jarvis ? (
                <ReadOnly label="Cars ready" value={(jarvis.cities[city.slug]?.readyCars ?? 0).toLocaleString("en-IN")} />
              ) : (
                <Text
                  label="Cars ready"
                  numeric
                  value={String(city.readyCars)}
                  disabled={locked}
                  onChange={(v) => patch(i, { readyCars: Number(v) || 0 })}
                />
              )}
            </Row>
          </Section>
          <Section title="Plans">
            <Checks label="Plans on this driver page" items={plans} selected={city.plans} disabled={locked} onChange={(ids) => patch(i, { plans: ids })} />
          </Section>
          <Section title="Hero image">
            <ImageField slot={city.heroImage} disabled={locked} onChange={(heroImage) => patch(i, { heroImage })} />
          </Section>
          <Section title="Hubs">
            {jarvis?.cities[city.slug]?.hubs.length ? (
              <JarvisHubs hubs={jarvis.cities[city.slug].hubs} />
            ) : (
              <HubList hubs={city.hubs} disabled={locked} onChange={(hubs) => patch(i, { hubs })} />
            )}
          </Section>
        </Collapsible>
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
    <div className="grid gap-3">
      {content.posts.map((post, i) => (
        <Collapsible
          key={i}
          title={post.title || "Untitled post"}
          meta={
            <>
              <Badge>{LOCALE_META[post.locale].label}</Badge>
              <Badge tone={post.published ? "green" : "amber"}>{post.published ? "Published" : "Not published"}</Badge>
            </>
          }
          actions={
            <ListControls
              index={i}
              count={content.posts.length}
              disabled={locked}
              onMove={() => {}}
              onRemove={() => setContent((c) => ({ ...c, posts: c.posts.filter((_, x) => x !== i) }))}
              removeLabel="Remove post"
              hideMove
            />
          }
        >
          <Section title="Status">
            <Toggle label="Published" checked={post.published} disabled={locked} onChange={(v) => patch(i, { published: v })} />
          </Section>
          <Section title="Details">
            <Row cols={3}>
              <Text label="Address" value={post.slug} disabled={locked} onChange={(v) => patch(i, { slug: v })} />
              <Select
                label="Language"
                value={post.locale}
                disabled={locked}
                options={LOCALES.map((l) => ({ value: l, label: LOCALE_META[l].label }))}
                onChange={(v) => patch(i, { locale: v })}
              />
              <Text label="Date" type="date" value={post.date} disabled={locked} onChange={(v) => patch(i, { date: v })} />
            </Row>
          </Section>
          <Section title="Text">
            <Text label="Title" value={post.title} disabled={locked} onChange={(v) => patch(i, { title: v })} />
            <Area rows={2} label="Excerpt" value={post.excerpt} disabled={locked} onChange={(v) => patch(i, { excerpt: v })} />
            <Area
              rows={10}
              label="Body"
              hint="blank line between paragraphs"
              value={post.body.join("\n\n")}
              disabled={locked}
              onChange={(v) => patch(i, { body: v.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) })}
            />
          </Section>
          <Section title="Cover image">
            <ImageField slot={post.coverImage} disabled={locked} onChange={(coverImage) => patch(i, { coverImage })} />
          </Section>
        </Collapsible>
      ))}
      <button
        type="button"
        disabled={locked}
        onClick={() => setContent((c) => ({ ...c, posts: [...c.posts, blankPost()] }))}
        className={`${button.add} h-11 w-full justify-self-stretch`}
      >
        <Plus size={15} />
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
      {hubs.map((hub, i) => (
        <div key={i} className="grid gap-3 rounded-xl border border-line bg-paper p-4">
          <div className="flex items-end gap-3">
            <div className="min-w-0 flex-1">
              <Text label="Hub name" value={hub.name} disabled={disabled} onChange={(v) => patch(i, { name: v })} />
            </div>
            <div className="flex h-10 items-center">
              <ListControls index={i} count={hubs.length} disabled={disabled} onMove={() => {}} onRemove={() => onChange(hubs.filter((_, x) => x !== i))} removeLabel="Remove hub" hideMove />
            </div>
          </div>
          <Area rows={2} label="Address" value={hub.address} disabled={disabled} onChange={(v) => patch(i, { address: v })} />
          <Row cols={2}>
            <Text label="Hours" value={hub.hours} disabled={disabled} onChange={(v) => patch(i, { hours: v })} />
            <Text label="Map link" value={hub.mapUrl ?? ""} disabled={disabled} onChange={(v) => patch(i, { mapUrl: v })} />
          </Row>
        </div>
      ))}
      <button type="button" disabled={disabled} onClick={() => onChange([...hubs, { name: "", address: "", hours: "" }])} className={button.add}>
        <Plus size={14} />
        Add hub
      </button>
    </div>
  );
}
