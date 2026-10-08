"use client";

import type { SiteContent, Testimonial } from "@/lib/content";
import { isShort, youtubeId } from "@/lib/youtube";
import { AddByName, Badge, Collapsible, ListControls, Row, Section, Text, Toggle, move } from "./fields";
import type { Setter } from "./shared";

/** The driver videos in "Real Drivers Real Stories", in the order the carousel shows them. */
export function StoriesTab({ content, setContent, locked }: { content: SiteContent; setContent: Setter; locked: boolean }) {
  const patch = (i: number, p: Partial<Testimonial>) =>
    setContent((c) => ({ ...c, testimonials: c.testimonials.map((x, j) => (j === i ? { ...x, ...p } : x)) }));

  function add(video: string) {
    const testimonial: Testimonial = { video, pillarboxed: !isShort(video), name: "", detail: "", quote: "" };
    setContent((c) => ({ ...c, testimonials: [...c.testimonials, testimonial] }));
  }

  return (
    <div className="grid gap-3">
      <p className="text-[13px] text-ink-soft">Videos in carousel order, first one in the middle</p>
      {content.testimonials.map((t, i) => {
        const id = youtubeId(t.video);
        return (
          <Collapsible
            key={`${i}-${t.video}`}
            title={t.name || `Video ${i + 1}`}
            thumb={
              <span className="hidden h-9 w-12 shrink-0 overflow-hidden rounded-md border border-line bg-mist sm:block">
                {id ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`} alt="" className="h-full w-full object-cover" />
                ) : null}
              </span>
            }
            meta={id ? <Badge tone="green">YouTube</Badge> : <Badge tone="grey">Link not recognised</Badge>}
            actions={
              <ListControls
                index={i}
                count={content.testimonials.length}
                disabled={locked}
                onMove={(to) => setContent((c) => ({ ...c, testimonials: move(c.testimonials, i, to) }))}
                onRemove={() => setContent((c) => ({ ...c, testimonials: c.testimonials.filter((_, j) => j !== i) }))}
                removeLabel="Remove video"
              />
            }
          >
            <Section title="Video">
              <Text label="YouTube link" value={t.video} disabled={locked} onChange={(video) => patch(i, { video })} />
              <Toggle
                label="Crop the black side bars"
                checked={t.pillarboxed}
                disabled={locked}
                onChange={(pillarboxed) => patch(i, { pillarboxed })}
              />
            </Section>
            <Section title="Driver">
              <Row cols={2}>
                <Text label="Name" value={t.name} disabled={locked} onChange={(name) => patch(i, { name })} />
                <Text label="Line under the name" value={t.detail} placeholder="Mumbai · 1.5 years with Everest" disabled={locked} onChange={(detail) => patch(i, { detail })} />
              </Row>
              <Text label="Line under the video" value={t.quote} disabled={locked} onChange={(quote) => patch(i, { quote })} />
            </Section>
          </Collapsible>
        );
      })}
      <AddByName label="YouTube link of a new video" disabled={locked} onAdd={add} />
    </div>
  );
}
