import { ArrowUpRight, Download, FileText, Lock, type LucideIcon } from "lucide-react";
import { COMPANY_PROFILE_URL, ESG_REPORT_URL } from "./data";
import { PRESS, pressDate } from "./press";
import { Heading, Kicker } from "./ui";

type Doc = { icon: LucideIcon; title: string; meta: string; href: string; action: string; short: string; download: boolean };

const DOCS: Doc[] = [
  { icon: FileText, title: "ESG Report, FY 2024-25", meta: "PDF · 44 pages", href: ESG_REPORT_URL, action: "Download", short: "Download", download: true },
  { icon: FileText, title: "Company Profile", meta: "PDF", href: COMPANY_PROFILE_URL, action: "Download", short: "Download", download: true },
  { icon: Lock, title: "Investor Presentation", meta: "Shared on request", href: "#contact", action: "Request Access", short: "Request", download: false },
];

/** "In the news" and the documents row, on one navy band. */
export function NewsAndReports() {
  const docs = DOCS.filter((d) => d.href);
  return (
    <section className="bg-navy px-4 pb-12 pt-[46px] sm:px-6 lg:px-10 lg:pb-[89px] lg:pt-[96px]">
      <div className="mx-auto w-full max-w-[1280px]">
        {PRESS.length ? (
          <>
            <Kicker tone="sun">In the news</Kicker>
            <Heading tone="white" size="md" className="mt-2 lg:mt-3">
              Recent News
            </Heading>
            <ul className="mt-6 grid gap-3 lg:mt-[47px] lg:flex lg:justify-center lg:gap-5">
              {PRESS.map((p) => (
                <li key={p.title} className="flex flex-col rounded-2xl bg-white px-4 pb-4 pt-[18px] lg:w-[305px] lg:px-6 lg:pb-[30px] lg:pt-6">
                  <p className="text-[13px] font-medium leading-[18px] text-brand lg:text-sm">
                    {p.outlet} &middot; {pressDate(p.date, false)}
                  </p>
                  <h3 className="mt-1.5 text-[17px] font-bold leading-6 text-navy lg:mt-[17px] lg:text-[19px] lg:leading-6">{p.title}</h3>
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener"
                      className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-brand lg:mt-auto lg:pt-6 lg:text-[15px]"
                    >
                      Read The Story <ArrowUpRight aria-hidden className="size-4" />
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {docs.length ? (
          <div id="reports" className="scroll-mt-28">
            <p className="mt-[30px] text-[13px] font-bold uppercase leading-4 tracking-[1.5px] text-sun lg:mt-[65px] lg:text-sm">
              Reports &amp; documents
            </p>
            <ul className="mt-6 grid gap-2.5 lg:mt-4 lg:grid-cols-[repeat(auto-fill,minmax(380px,1fr))] lg:gap-5">
              {docs.map((d) => (
                <DocCard key={d.title} doc={d} />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function DocCard({ doc }: { doc: Doc }) {
  const Icon = doc.icon;
  const Arrow = doc.download ? Download : ArrowUpRight;
  return (
    <li className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.08] px-3.5 py-3.5 lg:min-h-[103px] lg:gap-4 lg:rounded-2xl lg:px-5">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-white lg:size-11 lg:rounded-xl">
        <Icon aria-hidden className="size-[18px] lg:size-[22px]" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold leading-5 text-white lg:text-[17px] lg:leading-6">{doc.title}</p>
        <p className="text-[13px] leading-[18px] text-white/70 lg:text-sm lg:leading-5">{doc.meta}</p>
      </div>
      <a
        href={doc.href}
        {...(doc.download ? { download: true } : {})}
        className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-sun hover:brightness-110 lg:text-[15px]"
      >
        <span className="lg:hidden">{doc.short}</span>
        <span className="hidden lg:inline">{doc.action}</span>
        <Arrow aria-hidden className="hidden size-4 lg:block" strokeWidth={2.25} />
      </a>
    </li>
  );
}
