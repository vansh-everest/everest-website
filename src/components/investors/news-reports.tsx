import { ArrowUpRight, Download, FileText, Lock } from "lucide-react";
import { DOCUMENTS, type InvestorDocument } from "./data";
import { PRESS, pressDate } from "./press";
import { Heading, Kicker } from "./ui";

const ICONS = { file: FileText, lock: Lock };

/** A document without a file is requested through the investor relations form at the foot of the page. */
const REQUEST_HREF = "#contact";

/** "In the news" and the documents row, on one navy band. */
export function NewsAndReports() {
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

        <div id="reports" className={`scroll-mt-28 ${PRESS.length ? "mt-[30px] lg:mt-[65px]" : ""}`}>
          <p className="text-[13px] font-bold uppercase leading-4 tracking-[1.5px] text-sun lg:text-sm">Reports &amp; documents</p>
          <ul className="mt-4 grid gap-3 lg:mt-5 lg:grid-cols-3 lg:gap-5">
            {DOCUMENTS.map((d) => (
              <DocCard key={d.title} doc={d} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * One document as a card that is its own link. With a file it downloads ("PDF · N pages");
 * without one it leads to the request form. The title gets the card's full width and the action
 * sits at the right of the line under it, so titles stay on one line at every width.
 */
function DocCard({ doc }: { doc: InvestorDocument }) {
  const Icon = ICONS[doc.icon];
  const ready = Boolean(doc.url);
  const Arrow = ready ? Download : ArrowUpRight;
  const meta = ready ? (doc.pages ? `PDF · ${doc.pages} pages` : "PDF") : "Shared on request";
  return (
    <li className="@container">
      {/* A card under 330px wide (three across on a small laptop) stacks icon, title, line and action. */}
      <a
        href={ready ? doc.url : REQUEST_HREF}
        {...(ready ? { download: "" } : {})}
        className="fx-doc group grid h-full content-center justify-items-start gap-y-0.5 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-4 hover:border-white/25 hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun @min-[330px]:grid-cols-[auto_minmax(0,1fr)_auto] @min-[330px]:gap-x-3.5 lg:rounded-2xl lg:px-5 lg:py-[22px] @min-[330px]:lg:gap-x-4"
      >
        <span className="mb-3 grid size-10 place-items-center self-center rounded-lg bg-white/10 text-white @min-[330px]:row-span-2 @min-[330px]:mb-0 lg:size-12 lg:rounded-xl">
          <Icon aria-hidden className="size-[18px] lg:size-[22px]" strokeWidth={1.75} />
        </span>
        <span className="text-[15px] font-bold leading-5 text-white @min-[330px]:col-span-2 lg:text-[17px] lg:leading-6">{doc.title}</span>
        <span className="self-baseline text-[13px] leading-[18px] text-white/60 lg:text-sm lg:leading-5">{meta}</span>
        <span className="mt-2.5 inline-flex items-center gap-1.5 self-baseline text-sm font-semibold leading-5 text-sun @min-[330px]:mt-0 lg:text-[15px]">
          {ready ? "Download" : "Request Access"}
          <Arrow aria-hidden className={`fx-doc-arrow size-4 ${ready ? "fx-doc-arrow-down" : ""}`} strokeWidth={2.25} />
        </span>
      </a>
    </li>
  );
}
