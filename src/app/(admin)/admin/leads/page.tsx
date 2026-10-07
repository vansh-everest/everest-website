import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, PenSquare } from "lucide-react";
import { readSession } from "@/lib/auth";
import { jarvisAdmin, jarvisAdminEnabled } from "@/lib/jarvis";
import { updateLeadAction } from "./actions";
import { LEAD_STATUSES, leadFilters, leadQuery } from "./query";

export const dynamic = "force-dynamic";

type Lead = {
  id: number;
  name: string;
  mobile: string;
  city: string;
  source: string;
  page: string;
  details: Record<string, string | number | boolean | null>;
  status: (typeof LEAD_STATUSES)[number];
  note: string;
  created_at: string;
};

type Metadata = { total: number; links: { next: string | null; prev: string | null } };

const FORMS = [
  "home", "drive-with-us", "our-plans", "about-us", "everest-dost", "our-services",
  "fleet-logistics", "employee-mobility", "intercity", "advertise-with-us",
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Jarvis stores Indian time without a zone, so the digits are shown as they are. */
function received(stamp: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(stamp);
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]}, ${m[4]}:${m[5]}` : stamp;
}

const field = "h-9 rounded-lg border border-line bg-white px-3 text-[13px] text-navy outline-none focus:border-brand";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!jarvisAdminEnabled()) redirect("/admin");
  if (!(await readSession())) redirect("/admin");

  const params = await searchParams;
  const filters = leadFilters(params);
  const answer = await jarvisAdmin<Lead[]>("GET", `/website/admin/leads?${leadQuery(params)}&page_size=50`);
  const leads = answer.body.data?.records ?? [];
  const meta = (answer.body.data?.metadata ?? null) as Metadata | null;
  const total = answer.body.data?.countdata ?? leads.length;
  const pageLink = (page: string | null) => (page ? `/admin/leads?${new URLSearchParams({ ...filters, page })}` : null);

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b border-line bg-white">
        <div className="mx-auto flex h-full max-w-[1280px] items-center gap-3 px-4 lg:px-6">
          <Image src="/figma/logo.png" alt="Everest Fleet" width={135} height={78} className="h-11 w-auto" />
          <span aria-hidden className="h-6 w-px bg-line" />
          <h1 className="text-[15px] font-bold text-navy">Leads</h1>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <a
              href={`/admin/leads/export?${leadQuery(params)}`}
              className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-navy hover:bg-mist"
            >
              <Download size={14} />
              Export CSV
            </a>
            <Link href="/admin" className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-navy hover:bg-mist">
              <PenSquare size={14} />
              Site content
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-6 lg:px-6">
        <form className="flex flex-wrap items-end gap-2" action="/admin/leads">
          <input name="q" defaultValue={filters.q} placeholder="Name or mobile" className={`${field} w-48`} aria-label="Search" />
          <select name="status" defaultValue={filters.status ?? ""} className={field} aria-label="Status">
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <select name="source" defaultValue={filters.source ?? ""} className={field} aria-label="Form">
            <option value="">All forms</option>
            {FORMS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-[13px] text-ink-soft">
            From
            <input type="date" name="date_from" defaultValue={filters.date_from} className={field} />
          </label>
          <label className="flex items-center gap-1.5 text-[13px] text-ink-soft">
            To
            <input type="date" name="date_to" defaultValue={filters.date_to} className={field} />
          </label>
          <button type="submit" className="h-9 rounded-lg bg-navy px-4 text-[13px] font-semibold text-white hover:bg-navy/90">
            Filter
          </button>
          <p className="ml-auto text-[13px] text-ink-soft">{total} leads</p>
        </form>

        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[960px] text-left text-[13px]">
            <thead className="border-b border-line bg-mist/60 text-xs font-semibold uppercase tracking-[0.5px] text-ink-soft">
              <tr>
                <th className="px-3 py-2.5">Received</th>
                <th className="px-3 py-2.5">Name</th>
                <th className="px-3 py-2.5">Mobile</th>
                <th className="px-3 py-2.5">City</th>
                <th className="px-3 py-2.5">Form</th>
                <th className="px-3 py-2.5">Details</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {leads.map((lead) => (
                <tr key={lead.id} className="align-top">
                  <td className="whitespace-nowrap px-3 py-2.5 text-ink-soft">{received(lead.created_at)}</td>
                  <td className="px-3 py-2.5 font-medium text-navy">{lead.name}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <a href={`tel:+91${lead.mobile}`} className="text-brand hover:underline">
                      {lead.mobile}
                    </a>
                  </td>
                  <td className="px-3 py-2.5">{lead.city}</td>
                  <td className="px-3 py-2.5">
                    {lead.source}
                    {lead.page ? <span className="block text-xs text-ink-soft">{lead.page}</span> : null}
                  </td>
                  <td className="px-3 py-2.5 text-ink-soft">
                    {Object.entries(lead.details ?? {}).map(([key, value]) => (
                      <span key={key} className="block">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </td>
                  <td className="px-3 py-2.5">
                    <form action={updateLeadAction.bind(null, lead.id)} className="flex flex-col gap-1.5">
                      <div className="flex gap-1.5">
                        <select name="status" defaultValue={lead.status} className={`${field} h-8 capitalize`} aria-label="Status">
                          {LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="h-8 rounded-lg border border-line px-2.5 text-xs font-semibold text-navy hover:bg-mist">
                          Save
                        </button>
                      </div>
                      <input name="note" defaultValue={lead.note} placeholder="Note" className={`${field} h-8`} aria-label="Note" />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 ? <p className="px-4 py-10 text-center text-[13px] text-ink-soft">0 leads for these filters.</p> : null}
        </div>

        <nav className="mt-4 flex justify-end gap-2" aria-label="Pages">
          {pageLink(meta?.links.prev ?? null) ? (
            <Link href={pageLink(meta!.links.prev)!} className="h-9 rounded-lg border border-line bg-white px-3 text-[13px] leading-9 text-navy hover:bg-mist">
              Newer
            </Link>
          ) : null}
          {pageLink(meta?.links.next ?? null) ? (
            <Link href={pageLink(meta!.links.next)!} className="h-9 rounded-lg border border-line bg-white px-3 text-[13px] leading-9 text-navy hover:bg-mist">
              Older
            </Link>
          ) : null}
        </nav>
      </main>
    </>
  );
}
