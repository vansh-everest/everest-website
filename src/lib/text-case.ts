import type { Feature, Plan, SiteContent, Testimonial } from "@/lib/content";

/** Units and abbreviations that stay lower case inside a title. */
const KEEP = new Set(["km", "kms", "mo", "hr", "hrs", "kg", "x", "vs"]);

function capitalise(part: string): string {
  // A word with a capital after its first letter (eMpower, iPhone) is spelt that way on purpose.
  if (!/^[a-z]/.test(part) || /[A-Z]/.test(part.slice(1)) || KEEP.has(part)) return part;
  return part[0].toUpperCase() + part.slice(1);
}

/**
 * Title Case: every word starts with a capital, short words included ("Free Repair & Maintenance",
 * "Drive To Own"). Words already carrying capitals (CIBIL, WagonR, eMpower), numbers, symbols and
 * units are left as written. Each part of a hyphenated word is capitalised ("Real-Time").
 */
export function titleCase(text: string): string {
  return text.replace(/[^\s]+/g, (word) => word.split("-").map(capitalise).join("-"));
}

const tc = (text: string) => titleCase(text);
const tcAll = (list: string[]) => list.map(tc);
const feature = (f: Feature): Feature => ({ ...f, title: tc(f.title) });

function plan(p: Plan): Plan {
  return {
    ...p,
    name: Object.fromEntries(Object.entries(p.name).map(([k, v]) => [k, tc(v)])) as Plan["name"],
    tag: tc(p.tag),
    priceLabel: tc(p.priceLabel),
    depositNote: tc(p.depositNote),
    tenureNote: tc(p.tenureNote),
    rows: p.rows.map((r) => ({ label: tc(r.label), value: tc(r.value) })),
    benefits: tcAll(p.benefits),
    page: {
      ...p.page,
      headline: tc(p.page.headline),
      highlight: tc(p.page.highlight),
      term: { label: tc(p.page.term.label), value: tc(p.page.term.value) },
      tags: tcAll(p.page.tags),
      whyTitle: tc(p.page.whyTitle),
      storiesTitle: tc(p.page.storiesTitle),
      features: p.page.features.map(feature),
    },
    overview: {
      ...p.overview,
      title: tc(p.overview.title),
      note: tc(p.overview.note),
      steps: p.overview.steps.map((s) => ({ ...s, title: tc(s.title) })),
      points: tcAll(p.overview.points),
      highlights: tcAll(p.overview.highlights),
    },
  };
}

const testimonial = (t: Testimonial): Testimonial => ({ ...t, name: tc(t.name) });

/**
 * The public site's copy with every title and short line in Title Case, whatever case the admin
 * typed it in. Paragraphs, descriptions and quotes stay as written. The stored copy is unchanged.
 */
export function withTitleCase(content: SiteContent): SiteContent {
  return {
    ...content,
    plans: content.plans.map(plan),
    cars: content.cars.map((c) => ({ ...c, name: tc(c.name), subtitle: tc(c.subtitle), condition: tc(c.condition), highlight: tc(c.highlight) })),
    cities: content.cities.map((c) => ({
      ...c,
      name: Object.fromEntries(Object.entries(c.name).map(([k, v]) => [k, tc(v)])) as typeof c.name,
      hubs: c.hubs.map((h) => ({ ...h, name: tc(h.name) })),
    })),
    calculators: content.calculators.map((c) => ({ ...c, depositLabel: tc(c.depositLabel), perks: tcAll(c.perks) })),
    posts: content.posts.map((p) => ({ ...p, title: tc(p.title) })),
    testimonials: content.testimonials.map(testimonial),
  };
}
