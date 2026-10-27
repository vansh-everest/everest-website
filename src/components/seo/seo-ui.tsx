import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { SectionHead, band, tint, wrap } from "@/components/driver/driver-ui";
import { SITE_URL } from "@/lib/company";
import { jsonLd } from "@/lib/json-ld";
import { inr, type PlanFigure, type RentCar } from "@/lib/seo-data";

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

function Cell({ f }: { f: PlanFigure | undefined }) {
  if (!f) return <span className="text-ink-soft/60">–</span>;
  return (
    <span className="block">
      {f.rent ? <span className="block font-semibold text-navy">{inr(f.rent)}/day</span> : null}
      {f.deposit ? <span className="block text-ink-soft">{inr(f.deposit)} deposit</span> : null}
      {f.upfront ? <span className="block text-ink-soft">{inr(f.upfront)} upfront</span> : null}
    </span>
  );
}

/** Every car a city offers against every plan, from Jarvis. */
export function PriceTable({ id, title, sub, cars, plans }: { id: string; title: string; sub?: string; cars: RentCar[]; plans: PlanFigure[] }) {
  return (
    <section aria-labelledby={id} className={band}>
      <div className={wrap}>
        <SectionHead id={id} title={title} sub={sub} />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white lg:mt-10">
          <table className="w-full min-w-[560px] text-left text-[15px] leading-6">
            <thead>
              <tr className="border-b border-line bg-[#f5f8fc]">
                <th className="px-4 py-3 text-sm font-semibold text-navy">Car</th>
                {plans.map((p) => (
                  <th key={p.planId} className="px-4 py-3 text-sm font-semibold">
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
                  <td className="px-4 py-3 align-top">
                    <span className="block font-semibold text-navy">{car.name}</span>
                    <span className="block text-sm text-ink-soft">{car.fuel}</span>
                  </td>
                  {plans.map((p) => (
                    <td key={p.planId} className="px-4 py-3 align-top text-sm">
                      <Cell f={car.plans.find((x) => x.planId === p.planId)} />
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
