import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Phone, Plus } from "lucide-react";
import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { LeadForm } from "@/components/driver/lead-form";
import { HeroChip, SectionHead, band, tint, wrap } from "@/components/driver/driver-ui";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import { fill, getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import type { SiteContent } from "@/lib/content";
import { jsonLd } from "@/lib/json-ld";
import type { CityCar, PlanRef, PlanTerms } from "@/lib/seo-data";

/** The search pages' structured data, one script per block. */
export function JsonLd({ blocks }: { blocks: unknown[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(block) }} />
      ))}
    </>
  );
}

export type QA = { q: string; a: string };

export const faqLd = (items: QA[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
});

export const crumbsLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: `${SITE_URL}${item.path}` })),
});

/** The driver lead form in English, tagged with where on the page it sits. */
export function SearchForm({
  content,
  source,
  placement,
  defaultCity,
  callHref,
}: {
  content: SiteContent;
  source: string;
  placement: "hero" | "middle";
  defaultCity?: string;
  callHref?: string;
}) {
  const dict = getDictionary("en");
  return (
    <LeadForm
      copy={{ form: dict.form, cta: dict.cta }}
      locale="en"
      cities={content.cities.map((c) => ({ slug: c.slug, label: c.name.en }))}
      defaultCity={defaultCity}
      source={source}
      placement={placement}
      callHref={callHref}
    />
  );
}

/** The hero's chip: a link back to the page above this one. */
export function BackChip({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="transition hover:opacity-85">
      <HeroChip>
        <ArrowLeft aria-hidden size={14} strokeWidth={2.25} />
        {label}
      </HeroChip>
    </Link>
  );
}

const pill = "flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold transition";

/**
 * A search page's first screen: the heading and its key figures beside the lead form, so a
 * visitor from search can apply without scrolling. Phones stack the form under the heading.
 */
export function SearchHero({
  chip,
  title,
  intro,
  facts = [],
  phone,
  form,
}: {
  chip: ReactNode;
  title: string;
  intro: string;
  facts?: { label: string; value: string }[];
  phone?: { href: string; display: string } | null;
  form: ReactNode;
}) {
  const dict = getDictionary("en");
  return (
    <section className="bg-[linear-gradient(to_bottom_right,#062f50,#0b3e6c)] px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-12">
      <div className={`${wrap} grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-14`}>
        <div>
          {chip}
          <h1 className="mt-3 text-[32px] font-bold leading-[40px] tracking-[-0.6px] text-white lg:mt-4 lg:text-[50px] lg:leading-[58px]">{title}</h1>
          <p className="mt-3 max-w-[560px] text-[15px] leading-6 text-white/85 lg:mt-4 lg:text-lg lg:leading-7">{intro}</p>
          {facts.length ? (
            <dl className="mt-5 flex flex-wrap gap-2.5 lg:mt-7">
              {facts.map((f) => (
                <div key={f.label} className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5">
                  <dt className="text-[11px] font-semibold uppercase leading-4 tracking-[0.8px] text-white/80 lg:text-xs">{f.label}</dt>
                  <dd className="text-xl font-bold leading-7 text-white lg:text-2xl lg:leading-8">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <div className="mt-6 hidden flex-wrap gap-3 md:flex lg:mt-8">
            <a href={phone?.href ?? PHONE_HREF} className={`${pill} border-2 border-white text-white hover:bg-white/10`}>
              <Phone aria-hidden size={18} strokeWidth={1.75} />
              {phone?.display ?? PHONE_DISPLAY}
            </a>
            <a href={WHATSAPP_HREF} className={`${pill} bg-whatsapp text-white hover:brightness-95`}>
              <WhatsappLogo aria-hidden size={20} weight="fill" />
              {dict.cta.whatsapp}
            </a>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-6 lg:rounded-3xl lg:p-8">
          <h2 className="mb-4 text-xl font-bold leading-7 text-navy lg:mb-5 lg:text-2xl lg:leading-8">{dict.cta.formTitle}</h2>
          {form}
        </div>
      </div>
    </section>
  );
}

/** The lead form again partway down the page, beside a short reason to apply. */
export function FormBand({ id, title, points, form }: { id: string; title: string; points: string[]; form: ReactNode }) {
  return (
    <section aria-labelledby={id} className={`${band} ${tint}`}>
      <div className={`${wrap} grid gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center lg:gap-14`}>
        <div>
          <h2 id={id} className="text-[26px] font-bold leading-8 tracking-[-0.4px] text-navy lg:text-[34px] lg:leading-10">
            {title}
          </h2>
          <ul className="mt-5 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[16px] leading-6 text-ink-soft lg:text-[17px] lg:leading-7">
                <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                  <Check size={14} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_8px_24px_rgba(6,47,80,0.08)] sm:p-6 lg:rounded-3xl lg:p-8">{form}</div>
      </div>
    </section>
  );
}

/** The page's answer in two or three sentences, first thing under the hero, as answer engines quote it. */
export function AnswerBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="px-4 pt-8 sm:px-6 lg:px-10 lg:pt-12">
      <div className={`${wrap} rounded-2xl border border-[#dfecf6] bg-[#f5f8fc] px-5 py-5 lg:px-8 lg:py-6`}>
        <p className="text-[13px] font-semibold uppercase tracking-[1.2px] text-brand">{title}</p>
        <div className="mt-2 text-[17px] leading-7 text-navy lg:text-lg lg:leading-8">{children}</div>
      </div>
    </section>
  );
}

/** Every car a city runs against the plans it comes on, from Jarvis. */
export function CarsTable({ id, title, sub, cars, plans }: { id: string; title: string; sub?: string; cars: CityCar[]; plans: PlanRef[] }) {
  return (
    <section aria-labelledby={id} className={band}>
      <div className={wrap}>
        <SectionHead id={id} title={title} sub={sub} />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white lg:mt-10">
          <table className="w-full min-w-[520px] text-left text-[15px] leading-6">
            <thead>
              <tr className="border-b border-line bg-[#f5f8fc]">
                <th className="px-4 py-3 text-sm font-semibold text-navy">Car</th>
                {plans.map((p) => (
                  <th key={p.planId} className="px-4 py-3 text-center text-sm font-semibold">
                    <Link href={p.path} className="text-brand hover:underline">
                      {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={`${car.name}|${car.fuel}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <span className="block font-semibold text-navy">{car.name}</span>
                    <span className="block text-sm text-ink-soft">{car.fuel}</span>
                  </td>
                  {plans.map((p) => (
                    <td key={p.planId} className="px-4 py-3 text-center">
                      {car.plans.some((x) => x.planId === p.planId) ? (
                        <Check aria-label="Available" size={18} strokeWidth={2.5} className="mx-auto text-leaf" />
                      ) : (
                        <span aria-label="Not offered" className="text-ink-soft/50">
                          –
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/** The plans as cards, each with its line and the figures a city job page shows. */
export function PlanCards({ id, title, plans }: { id: string; title: string; plans: (PlanRef | PlanTerms)[] }) {
  const dict = getDictionary("en");
  const lines = dict.plans as Record<string, string | undefined>;
  return (
    <section aria-labelledby={id} className={band}>
      <div className={wrap}>
        <SectionHead id={id} title={title} />
        <ul className="mt-8 grid gap-4 md:grid-cols-3 lg:mt-12 lg:gap-6">
          {plans.map((p) => {
            const t = "deposit" in p ? p : null;
            const figures: [string, string][] = t
              ? (
                  [
                    [dict.figures.deposit, t.deposit],
                    [dict.figures.upfront, t.upfront],
                    [dict.figures.term, t.months ? fill(dict.figures.months, { n: String(t.months) }) : ""],
                  ] as [string, string][]
                ).filter(([, v]) => v)
              : [];
            return (
              <li key={p.planId}>
                <Link
                  href={p.path}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-white p-5 shadow-[0_8px_24px_rgba(6,47,80,0.06)] transition hover:-translate-y-0.5 hover:border-brand/40 lg:p-7"
                >
                  <span className="flex items-center justify-between gap-3">
                    <h3 className="text-[22px] font-bold leading-7 text-navy">{p.name}</h3>
                    <ArrowRight aria-hidden size={18} className="shrink-0 text-brand transition group-hover:translate-x-0.5" />
                  </span>
                  {lines[p.planId] ? <p className="mt-2 text-[15px] leading-6 text-ink-soft">{lines[p.planId]}</p> : null}
                  {figures.length ? (
                    <dl className="mt-auto grid grid-cols-2 gap-2 pt-5">
                      {figures.map(([label, value]) => (
                        <div key={label} className={`rounded-xl border border-[#e8eaed] px-3 pb-2.5 pt-3 ${tint}`}>
                          <dt className="text-[11px] font-medium uppercase leading-[13px] tracking-[0.6px] text-ink-soft">{label}</dt>
                          <dd className="mt-1 whitespace-nowrap text-lg font-bold leading-6 text-navy">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** A row of headline figures. */
export function FactTiles({ id, title, items }: { id: string; title: string; items: { label: string; value: string; note?: string }[] }) {
  return (
    <section aria-labelledby={id} className={band}>
      <div className={wrap}>
        <SectionHead id={id} title={title} />
        <dl className="mt-8 grid grid-cols-2 gap-3 lg:mt-10 lg:grid-cols-4 lg:gap-5">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#dfecf6] bg-[#f5f8fc] px-5 py-4 lg:px-6 lg:py-5">
              <dt className="text-xs font-semibold uppercase tracking-[0.8px] text-ink-soft">{item.label}</dt>
              <dd className="mt-1 text-[28px] font-bold leading-9 text-navy lg:text-[34px] lg:leading-10">{item.value}</dd>
              {item.note ? <dd className="text-sm leading-5 text-ink-soft">{item.note}</dd> : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** A guide's body: a heading per section, then its paragraphs and lists. */
export function GuideSection({ id, title, children, shaded = false }: { id: string; title: string; children: ReactNode; shaded?: boolean }) {
  return (
    <section aria-labelledby={id} className={`${band} ${shaded ? tint : ""}`}>
      <div className="mx-auto max-w-[840px]">
        <h2 id={id} className="text-[26px] font-bold leading-8 tracking-[-0.4px] text-navy lg:text-[34px] lg:leading-10">
          {title}
        </h2>
        <div className="mt-4 space-y-4 text-[16px] leading-7 text-ink-soft lg:mt-5 lg:text-[17px] [&_strong]:text-navy [&_a]:font-semibold [&_a]:text-brand [&_a:hover]:underline [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5">
          {children}
        </div>
      </div>
    </section>
  );
}

export function SeoFaq({ id, title, items }: { id: string; title: string; items: QA[] }) {
  return (
    <section aria-labelledby={id} className={band}>
      <div className="mx-auto max-w-[840px]">
        <SectionHead id={id} title={title} />
        <ul className="mt-8 space-y-3 lg:mt-10">
          {items.map((item) => (
            <li key={item.q} className="overflow-hidden rounded-2xl border border-line bg-white">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 lg:px-6 lg:py-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex-1 text-base font-semibold leading-6 text-navy lg:text-lg lg:leading-7">{item.q}</span>
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eaf3fb] text-brand transition group-open:rotate-45">
                    <Plus size={16} strokeWidth={2.25} />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-[15px] leading-6 text-ink-soft lg:px-6 lg:text-base lg:leading-7">{item.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Onward links to the pages a reader of this one goes to next. */
export function RelatedLinks({ id, title, links }: { id: string; title: string; links: { href: string; label: string; note?: string }[] }) {
  return (
    <section aria-labelledby={id} className={`${band} ${tint}`}>
      <div className={wrap}>
        <SectionHead id={id} title={title} />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group flex h-full items-start justify-between gap-3 rounded-2xl border border-[#dfecf6] bg-white px-5 py-4 transition hover:border-brand">
                <span>
                  <span className="block text-base font-semibold leading-6 text-navy">{l.label}</span>
                  {l.note ? <span className="mt-0.5 block text-sm leading-5 text-ink-soft">{l.note}</span> : null}
                </span>
                <ArrowRight aria-hidden size={18} className="mt-0.5 shrink-0 text-brand transition group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Beside the mid-page form on every driver search page. */
export const APPLY_POINTS = [
  "Car, insurance and permit included",
  "Weekly payouts to your bank account",
  "Own the car at the end of the term on Drive To Own or Own Now",
];
