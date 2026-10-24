import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { List } from "lucide-react";
import { readSession } from "@/lib/auth";
import { jarvisAdminEnabled } from "@/lib/jarvis";
import { readUnifyLeads, unifyEnabled, type UnifyLeadReport } from "@/lib/unify";

export const dynamic = "force-dynamic";

const DAYS = 30;
const SHOWN_DAYS = 14;
const RECENT = 50;

/** Unify's outbox statuses, in the five stages the page counts. */
type Stage = "sent" | "duplicate" | "waiting" | "held" | "refused";
const STAGE_OF: Record<string, Stage> = {
  sent: "sent",
  duplicate: "duplicate",
  suppressed: "duplicate",
  queued: "waiting",
  retrying: "waiting",
  held: "held",
  blocked: "refused",
  rejected: "refused",
  failed: "refused",
};
const stageOf = (lead: UnifyLeadReport): Stage => (lead.status ? (STAGE_OF[lead.status] ?? "waiting") : "waiting");

const STAGES: { stage: Stage; label: string; note: string; tone: string }[] = [
  { stage: "sent", label: "In the CRM", note: "Added as a new lead", tone: "bg-[#e6f6ec] text-[#17663a]" },
  { stage: "duplicate", label: "Duplicate", note: "The CRM or Unify already had them", tone: "bg-[#eef2f6] text-navy" },
  { stage: "waiting", label: "Waiting", note: "Queued or retrying", tone: "bg-[#fff6db] text-[#7a5a00]" },
  { stage: "held", label: "Held", note: "Waiting for a CRM channel or the Unify switch", tone: "bg-[#fff6db] text-[#7a5a00]" },
  { stage: "refused", label: "Refused", note: "The CRM turned them down", tone: "bg-[#fdecec] text-[#a12a2a]" },
];
const TONE = Object.fromEntries(STAGES.map((s) => [s.stage, s.tone])) as Record<Stage, string>;
const LABEL = Object.fromEntries(STAGES.map((s) => [s.stage, s.label])) as Record<Stage, string>;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const IST_MS = 330 * 60_000;

/** "2026-10-24T09:12:00Z" → the IST day "2026-10-24", and "24 Oct, 14:42". */
const istDay = (iso: string) => new Date(Date.parse(iso) + IST_MS).toISOString().slice(0, 10);
function istTime(iso: string | null): string {
  if (!iso) return "–";
  const d = new Date(Date.parse(iso) + IST_MS).toISOString();
  return `${Number(d.slice(8, 10))} ${MONTHS[Number(d.slice(5, 7)) - 1]}, ${d.slice(11, 16)}`;
}
const dayLabel = (day: string) => `${Number(day.slice(8, 10))} ${MONTHS[Number(day.slice(5, 7)) - 1]}`;

type Counts = Record<Stage, number> & { total: number };
const empty = (): Counts => ({ total: 0, sent: 0, duplicate: 0, waiting: 0, held: 0, refused: 0 });

function tally(leads: UnifyLeadReport[], key: (lead: UnifyLeadReport) => string): Map<string, Counts> {
  const out = new Map<string, Counts>();
  for (const lead of leads) {
    const k = key(lead);
    const c = out.get(k) ?? empty();
    c.total += 1;
    c[stageOf(lead)] += 1;
    out.set(k, c);
  }
  return out;
}

const cell = "px-3 py-2 text-right tabular-nums";
const headBase = "px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-soft";
const head = `${headBase} text-right`;

/** The CRM programme a lead was filed under, as the desk says it. */
const PLAN: Record<string, string> = { own_now: "Own Now", dto: "Drive To Own", ev: "EV", ev_dto: "EV Drive To Own", plain: "General" };

function CountsTable({ title, first, rows }: { title: string; first: string; rows: [string, Counts][] }) {
  return (
    <section className="rounded-xl border border-line bg-white">
      <h2 className="border-b border-line px-4 py-3 text-[13px] font-bold text-navy">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-navy">
          <thead>
            <tr className="border-b border-line">
              <th className={`${headBase} text-left`}>{first}</th>
              <th className={head}>Leads</th>
              {STAGES.map((s) => (
                <th key={s.stage} className={head}>
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, c]) => (
              <tr key={name} className="border-b border-line last:border-0">
                <td className="whitespace-nowrap px-3 py-2 font-medium">{name}</td>
                <td className={`${cell} font-semibold`}>{c.total}</td>
                {STAGES.map((s) => (
                  <td key={s.stage} className={`${cell} ${c[s.stage] ? "" : "text-ink-soft/50"}`}>
                    {c[s.stage]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** The last DAYS days of website leads from Unify. */
function load() {
  return readUnifyLeads(new Date(Date.now() - DAYS * 86_400_000));
}

/** Driver leads from the website on their way to the CRM, as Unify reports them. */
export default async function LeadsFlowPage() {
  if (!jarvisAdminEnabled()) redirect("/admin");
  if (!(await readSession())) redirect("/admin");

  const answer = await load();
  const leads = answer?.leads ?? [];
  const totals = tally(leads, () => "all").get("all") ?? empty();

  const byDay = tally(
    leads.filter((l) => l.received_at),
    (l) => istDay(l.received_at as string)
  );
  const days: [string, Counts][] = [...byDay.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, SHOWN_DAYS).map(([d, c]) => [dayLabel(d), c]);
  const forms: [string, Counts][] = [...tally(leads, (l) => l.form || "unknown").entries()].sort((a, b) => b[1].total - a[1].total);
  const cities: [string, Counts][] = [...tally(leads, (l) => l.city || "No city").entries()].sort((a, b) => b[1].total - a[1].total);
  const recent = [...leads].reverse().slice(0, RECENT);

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b border-line bg-white">
        <div className="mx-auto flex h-full max-w-[1280px] items-center gap-3 px-4 lg:px-6">
          <Image src="/figma/logo.png" alt="Everest Fleet" width={135} height={78} className="h-11 w-auto" />
          <span aria-hidden className="h-6 w-px bg-line" />
          <h1 className="text-[15px] font-bold text-navy">Leads flow</h1>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link href="/admin/leads" className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-navy hover:bg-mist">
              <List size={14} />
              All leads
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-5 px-4 py-6 lg:px-6">
        <p className="text-[13px] text-ink-soft">Driver leads, website to CRM, last {DAYS} days.</p>

        {!unifyEnabled() ? (
          <p className="rounded-xl border border-[#f3e7a0] bg-[#fdfae2] px-4 py-3 text-[13px] text-navy">
            Unify link: set UNIFY_LEADS_URL and UNIFY_LEADS_KEY in Amplify
          </p>
        ) : !answer ? (
          <p className="rounded-xl border border-[#f5c2c2] bg-[#fdecec] px-4 py-3 text-[13px] text-[#a12a2a]">Unify offline</p>
        ) : null}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl border border-line bg-white px-4 py-3">
            <p className="text-[12px] text-ink-soft">Reached Unify</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-navy">{totals.total}</p>
          </div>
          {STAGES.map((s) => (
            <div key={s.stage} className="rounded-xl border border-line bg-white px-4 py-3">
              <p className="text-[12px] text-ink-soft">{s.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-navy">{totals[s.stage]}</p>
              <p className="mt-0.5 text-[11px] leading-4 text-ink-soft">{s.note}</p>
            </div>
          ))}
        </section>

        {leads.length ? (
          <>
            <CountsTable title="By day" first="Day" rows={days} />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <CountsTable title="By form" first="Form" rows={forms} />
              <CountsTable title="By city" first="City" rows={cities} />
            </div>

            <section className="rounded-xl border border-line bg-white">
              <h2 className="border-b border-line px-4 py-3 text-[13px] font-bold text-navy">Latest {recent.length}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] text-navy">
                  <thead>
                    <tr className="border-b border-line">
                      {["Received", "Form", "City", "Plan", "Mobile", "Stage", "CRM says", "CRM lead"].map((h) => (
                        <th key={h} className={`${headBase} whitespace-nowrap text-left`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((l) => {
                      const stage = stageOf(l);
                      return (
                        <tr key={l.lead_id} className="border-b border-line last:border-0">
                          <td className="whitespace-nowrap px-3 py-2">{istTime(l.received_at)}</td>
                          <td className="px-3 py-2">{l.form ?? "–"}</td>
                          <td className="px-3 py-2">{l.city ?? "–"}</td>
                          <td className="whitespace-nowrap px-3 py-2">{l.programme ? (PLAN[l.programme] ?? l.programme) : "–"}</td>
                          <td className="px-3 py-2 tabular-nums">{l.phone_last4 ? `•••••• ${l.phone_last4}` : "–"}</td>
                          <td className="px-3 py-2">
                            <span className={`rounded-full px-2 py-0.5 text-[12px] font-semibold ${TONE[stage]}`}>{LABEL[stage]}</span>
                          </td>
                          <td className="px-3 py-2 text-ink-soft">{l.crm_message || "–"}</td>
                          <td className="px-3 py-2 tabular-nums">{l.crm_lead_id ?? "–"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : answer ? (
          <p className="rounded-xl border border-line bg-white px-4 py-6 text-center text-[13px] text-ink-soft">0 driver leads in the last {DAYS} days</p>
        ) : null}
      </main>
    </>
  );
}
