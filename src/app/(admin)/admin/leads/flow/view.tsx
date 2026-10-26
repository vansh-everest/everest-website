import Image from "next/image";
import Link from "next/link";
import { List } from "lucide-react";
import { sendToUnifyAction } from "./actions";
import { Funnel, Legend, StackedBars, StackedColumns, type Datum, type Series } from "./charts";
import {
  STAGES,
  dayLabel,
  daySpan,
  emptyCounts,
  median,
  pct,
  tally,
  totals,
  type Counts,
  type FlowLead,
  type Stage,
} from "./flow-data";

const DEFAULT_DAYS = 30;
const MAX_DAYS = 366;
const TOP = 10;
const RECENT = 50;
const PRESETS = [
  { days: 1, label: "Today" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];
const IST_MS = 330 * 60_000;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const shiftDay = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const istToday = () => new Date(Date.now() + IST_MS).toISOString().slice(0, 10);

export type Filters = { from: string; to: string; city: string; form: string; channel: string; today: string };

export function readFilters(params: Record<string, string | string[] | undefined>): Filters {
  const get = (key: string) => ([params[key]].flat()[0] ?? "").trim();
  const today = istToday();
  let to = DATE.test(get("to")) ? get("to") : today;
  let from = DATE.test(get("from")) ? get("from") : shiftDay(to, -(DEFAULT_DAYS - 1));
  if (from > to) [from, to] = [to, from];
  if (daySpan(from, to).length > MAX_DAYS) from = shiftDay(to, -(MAX_DAYS - 1));
  return { from, to, city: get("city").slice(0, 60), form: get("form").slice(0, 80), channel: get("channel").slice(0, 60), today };
}

function matches(lead: FlowLead, f: Filters): boolean {
  if (f.city && lead.city !== f.city) return false;
  if (f.channel && lead.channel !== f.channel) return false;
  if (f.form === "driver") return lead.driver;
  if (f.form === "other") return !lead.driver;
  return !f.form || lead.form === f.form;
}

const formLabel = (form: string) => (form === "driver" ? "Driver forms" : form === "other" ? "Business and Dost forms" : form || "All forms");

const options = (leads: FlowLead[], key: (l: FlowLead) => string) => tally(leads, key).map(([name]) => name);

const SERIES: Series[] = STAGES.map((s) => ({ key: s.stage, label: s.label, color: s.color }));
const stageValues = (c: Counts) => STAGES.map((s) => c[s.stage]);
const newNote = (c: Counts) => `${pct(c.sent, c.driver)} new`;

/** The biggest TOP rows, the rest folded into one "Other" row. */
function topRows(rows: [string, Counts][]): [string, Counts][] {
  if (rows.length <= TOP) return rows;
  const rest = emptyCounts();
  for (const [, c] of rows.slice(TOP - 1)) {
    for (const k of Object.keys(rest) as (keyof Counts)[]) rest[k] += c[k];
  }
  return [...rows.slice(0, TOP - 1), ["Other", rest]];
}

const barData = (rows: [string, Counts][]): Datum[] =>
  topRows(rows.filter(([, c]) => c.driver > 0)).map(([name, c]) => ({ key: name, label: name, values: stageValues(c), note: newNote(c) }));

/** One bar per CRM stage, for a single day where a day-by-day chart would be one column. */
const stageRows = (c: Counts): Datum[] =>
  STAGES.filter((s) => c[s.stage] > 0).map((s) => ({
    key: s.stage,
    label: s.label,
    values: STAGES.map((x) => (x.stage === s.stage ? c[s.stage] : 0)),
    note: pct(c[s.stage], c.driver),
  }));

const hourLabel = (h: number) => `${h % 12 || 12} ${h < 12 ? "am" : "pm"}`;

const field = "h-9 rounded-lg border border-line bg-white px-3 text-[13px] text-navy outline-none focus:border-brand";
const card = "rounded-xl border border-line bg-white";
const cardTitle = "text-[13px] font-bold text-navy";

function FiltersBar({ f, cities, forms, channels }: { f: Filters; cities: string[]; forms: string[]; channels: string[] }) {
  const keep = { city: f.city, form: f.form, channel: f.channel };
  const presetHref = (days: number) => {
    const q = new URLSearchParams({ from: shiftDay(f.today, -(days - 1)), to: f.today });
    for (const [k, v] of Object.entries(keep)) if (v) q.set(k, v);
    return `/admin/leads/flow?${q}`;
  };
  return (
    <form action="/admin/leads/flow" className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1 rounded-lg bg-mist p-1">
        {PRESETS.map((p) => {
          const on = f.to === f.today && f.from === shiftDay(f.today, -(p.days - 1));
          return (
            <Link key={p.days} href={presetHref(p.days)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${on ? "bg-white text-navy shadow-sm" : "text-ink-soft hover:text-navy"}`}>
              {p.label}
            </Link>
          );
        })}
      </div>
      <input type="date" name="from" defaultValue={f.from} max={f.today} className={field} aria-label="From" />
      <input type="date" name="to" defaultValue={f.to} max={f.today} className={field} aria-label="To" />
      <select name="city" defaultValue={f.city} className={field} aria-label="City">
        <option value="">All cities</option>
        {cities.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <select name="form" defaultValue={f.form} className={field} aria-label="Form">
        <option value="">All forms</option>
        <option value="driver">Driver forms</option>
        <option value="other">Business and Dost forms</option>
        {forms.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <select name="channel" defaultValue={f.channel} className={field} aria-label="Channel">
        <option value="">All channels</option>
        {channels.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <button type="submit" className="h-9 rounded-lg bg-brand px-4 text-[13px] font-semibold text-white hover:bg-brand/90">
        Apply
      </button>
      {f.city || f.form || f.channel ? (
        <Link href={`/admin/leads/flow?${new URLSearchParams({ from: f.from, to: f.to })}`} className="px-2 text-[13px] font-medium text-ink-soft hover:text-navy">
          Clear
        </Link>
      ) : null}
    </form>
  );
}

function Tile({ label, value, note, strong }: { label: string; value: string; note: string; strong?: boolean }) {
  return (
    <div className={`${card} px-4 py-3 ${strong ? "border-[#0ca30c]/40 bg-[#f1faf1]" : ""}`}>
      <p className="text-[12px] text-ink-soft">{label}</p>
      <p className="mt-1 text-2xl font-bold text-navy">{value}</p>
      <p className="mt-0.5 text-[11px] leading-4 text-ink-soft">{note}</p>
    </div>
  );
}

const cell = "px-3 py-2 text-right tabular-nums";
const headBase = "px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-soft whitespace-nowrap";
const head = `${headBase} text-right`;

function CountsTable({ title, first, rows }: { title: string; first: string; rows: [string, Counts][] }) {
  return (
    <section className={card}>
      <h2 className={`border-b border-line px-4 py-3 ${cardTitle}`}>{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-navy">
          <thead>
            <tr className="border-b border-line">
              <th className={`${headBase} text-left`}>{first}</th>
              <th className={head}>Submissions</th>
              <th className={head}>Driver</th>
              <th className={head}>New in CRM</th>
              <th className={head}>New %</th>
              {STAGES.filter((s) => s.stage !== "sent").map((s) => (
                <th key={s.stage} className={head}>
                  {s.label}
                </th>
              ))}
              <th className={head}>Converted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, c]) => (
              <tr key={name} className="border-b border-line last:border-0">
                <td className="max-w-[16rem] break-words px-3 py-2 font-medium">{name}</td>
                <td className={`${cell} font-semibold`}>{c.total}</td>
                <td className={cell}>{c.driver}</td>
                <td className={cell}>{c.sent}</td>
                <td className={cell}>{pct(c.sent, c.driver)}</td>
                {STAGES.filter((s) => s.stage !== "sent").map((s) => (
                  <td key={s.stage} className={`${cell} ${c[s.stage] ? "" : "text-ink-soft/50"}`}>
                    {c[s.stage]}
                  </td>
                ))}
                <td className={`${cell} ${c.converted ? "" : "text-ink-soft/50"}`}>{c.converted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const STAGE_INFO = Object.fromEntries(STAGES.map((s) => [s.stage, s]));

function LatestTable({ leads }: { leads: FlowLead[] }) {
  return (
    <section className={card}>
      <h2 className={`border-b border-line px-4 py-3 ${cardTitle}`}>Latest {leads.length}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-navy">
          <thead>
            <tr className="border-b border-line">
              {["Received", "Form", "City", "Channel", "Mobile", "CRM stage", "CRM says", "CRM lead", "Desk"].map((h) => (
                <th key={h} className={`${headBase} text-left`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-line last:border-0">
                <td className="whitespace-nowrap px-3 py-2">{l.receivedLabel}</td>
                <td className="px-3 py-2">{l.form}</td>
                <td className="px-3 py-2">{l.city}</td>
                <td className="whitespace-nowrap px-3 py-2">{l.channel}</td>
                <td className="px-3 py-2 tabular-nums">{l.phoneLast4 ? `•••••• ${l.phoneLast4}` : "–"}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  {l.stage ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden className="size-2 rounded-full" style={{ background: STAGE_INFO[l.stage].color }} />
                      {STAGE_INFO[l.stage].label}
                    </span>
                  ) : (
                    <span className="text-ink-soft">Other form</span>
                  )}
                </td>
                <td className="px-3 py-2 text-ink-soft">{l.crmMessage || "–"}</td>
                <td className="px-3 py-2 tabular-nums">{l.crmLeadId ?? "–"}</td>
                <td className="px-3 py-2 capitalize">{l.deskStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ChartCard({ title, children, legend }: { title: string; children: React.ReactNode; legend?: Series[] }) {
  return (
    <section className={`${card} p-4`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className={cardTitle}>{title}</h2>
        {legend ? <Legend series={legend} /> : null}
      </div>
      {children}
    </section>
  );
}

type Loaded = { jarvis: { capped: boolean } | null; unify: { truncated: boolean } | null; unifyOn: boolean; all: FlowLead[] };

/** What the last "Send to Unify" did, from the address it returned to. */
export type SendResult = { sent: number; had: number; refused: number; stopped: boolean } | null;

function SendBar({ f, missing, result }: { f: Filters; missing: number; result: SendResult }) {
  if (!result && !missing) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-[13px] text-navy">
      {result ? (
        <p>
          Sent to Unify: <span className="font-semibold">{result.sent}</span> new, {result.had} already there
          {result.refused ? `, ${result.refused} refused` : ""}
          {result.stopped ? ", stopped early" : ""}
        </p>
      ) : null}
      {missing ? (
        <form action={sendToUnifyAction} className="ml-auto flex items-center gap-3">
          <input type="hidden" name="from" value={f.from} />
          <input type="hidden" name="to" value={f.to} />
          <span>
            Not in Unify: <span className="font-semibold">{missing}</span>
          </span>
          <button type="submit" className="h-9 rounded-lg bg-navy px-4 text-[13px] font-semibold text-white hover:bg-navy/90">
            Send to Unify
          </button>
        </form>
      ) : null}
    </div>
  );
}

/** Website submissions on their way to the CRM: where they come from and what became of them. */
export function FlowView({ f, jarvis, unify, unifyOn, all, result }: { f: Filters; result: SendResult } & Loaded) {
  const leads = all.filter((l) => matches(l, f));
  const t = totals(leads);
  const reached = t.driver - t.missing;
  const minutes = median(leads.flatMap((l) => (l.minutesToCrm === null ? [] : [l.minutesToCrm])));
  const days = daySpan(f.from, f.to);
  const shown = new Set(STAGES.filter((s) => t[s.stage] > 0).map((s) => s.stage));
  const legend = SERIES.filter((s) => shown.has(s.key as Stage));

  const byDay = new Map(tally(leads.filter((l) => l.driver), (l) => l.day));
  const dayData: Datum[] = days.map((d) => {
    const c = byDay.get(d) ?? emptyCounts();
    return { key: d, label: dayLabel(d), values: stageValues(c), note: c.driver ? newNote(c) : undefined };
  });
  const byHour = new Map(tally(leads, (l) => String(l.hour)));
  const hourData: Datum[] = Array.from({ length: 24 }, (_, h) => ({
    key: String(h),
    label: `${hourLabel(h)} – ${hourLabel((h + 1) % 24)}`,
    short: hourLabel(h),
    values: [byHour.get(String(h))?.total ?? 0],
  }));

  const cities = tally(leads, (l) => l.city);
  const forms = tally(leads, (l) => l.form);
  const channels = tally(leads, (l) => l.channel);
  const campaigns = tally(leads, (l) => l.campaign);
  const languages = tally(leads, (l) => l.locale);
  const daysTable: [string, Counts][] = [...tally(leads, (l) => l.day)].sort((a, b) => b[0].localeCompare(a[0])).map(([d, c]) => [dayLabel(d), c]);

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
        <FiltersBar f={f} cities={options(all, (l) => l.city)} forms={options(all, (l) => l.form)} channels={options(all, (l) => l.channel)} />

        {!jarvis ? (
          <p className="rounded-xl border border-[#f5c2c2] bg-[#fdecec] px-4 py-3 text-[13px] text-[#a12a2a]">Jarvis offline</p>
        ) : null}
        {!unifyOn ? (
          <p className="rounded-xl border border-[#f3e7a0] bg-[#fdfae2] px-4 py-3 text-[13px] text-navy">Unify link: set UNIFY_LEADS_URL and UNIFY_LEADS_KEY in Amplify</p>
        ) : !unify ? (
          <p className="rounded-xl border border-[#f5c2c2] bg-[#fdecec] px-4 py-3 text-[13px] text-[#a12a2a]">Unify offline</p>
        ) : null}
        {jarvis?.capped || unify?.truncated ? (
          <p className="rounded-xl border border-[#f3e7a0] bg-[#fdfae2] px-4 py-3 text-[13px] text-navy">Range too large: shorten it for complete counts</p>
        ) : null}

        {unifyOn && unify ? <SendBar f={f} missing={all.filter((l) => l.stage === "missing").length} result={result} /> : null}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Tile label="Submissions" value={t.total.toLocaleString("en-IN")} note={formLabel(f.form)} />
          <Tile label="Driver applications" value={t.driver.toLocaleString("en-IN")} note={`${pct(t.driver, t.total)} of submissions`} />
          <Tile label="New in CRM" value={t.sent.toLocaleString("en-IN")} note={`${pct(t.sent, t.driver)} of applications`} strong />
          <Tile label="Duplicate" value={t.duplicate.toLocaleString("en-IN")} note={`${pct(t.duplicate, t.driver)} of applications`} />
          <Tile label="Marked converted" value={t.converted.toLocaleString("en-IN")} note={`${pct(t.converted, t.total)} of submissions`} />
          <Tile label="Time to CRM" value={minutes === null ? "–" : `${minutes} min`} note="Median, new leads" />
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <ChartCard title="Conversion">
            <Funnel
              steps={[
                { label: "Submissions", value: t.total, note: formLabel(f.form) },
                { label: "Driver applications", value: t.driver, note: `${pct(t.driver, t.total)} of submissions` },
                { label: "Reached Unify", value: reached, note: `${pct(reached, t.driver)} of applications` },
                { label: "New in CRM", value: t.sent, note: `${pct(t.sent, reached)} of Unify` },
                { label: "Marked converted", value: t.converted, note: `${pct(t.converted, t.total)} of submissions` },
              ]}
            />
          </ChartCard>
          <ChartCard title={days.length > 1 ? "Driver applications per day" : "Driver applications by CRM stage"} legend={days.length > 1 ? legend : undefined}>
            {days.length > 1 ? <StackedColumns series={SERIES} data={dayData} /> : <StackedBars series={SERIES} data={stageRows(t)} />}
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartCard title="By city" legend={legend}>
            {t.driver ? <StackedBars series={SERIES} data={barData(cities)} /> : <p className="text-[13px] text-ink-soft">0 driver applications</p>}
          </ChartCard>
          <ChartCard title="By channel" legend={legend}>
            {t.driver ? <StackedBars series={SERIES} data={barData(channels)} /> : <p className="text-[13px] text-ink-soft">0 driver applications</p>}
          </ChartCard>
          <ChartCard title="By form" legend={legend}>
            {t.driver ? <StackedBars series={SERIES} data={barData(forms)} /> : <p className="text-[13px] text-ink-soft">0 driver applications</p>}
          </ChartCard>
          <ChartCard title="Submissions by hour">
            <StackedColumns series={[{ key: "all", label: "Submissions", color: "#2a78d6" }]} data={hourData} height={160} />
          </ChartCard>
        </div>

        {leads.length ? (
          <>
            <CountsTable title="By day" first="Day" rows={daysTable} />
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <CountsTable title="By city" first="City" rows={cities} />
              <CountsTable title="By channel" first="Channel" rows={channels} />
              <CountsTable title="By form" first="Form" rows={forms} />
              <CountsTable title="By campaign" first="utm_campaign" rows={campaigns} />
              <CountsTable title="By language" first="Language" rows={languages} />
            </div>
            <LatestTable leads={leads.slice(0, RECENT)} />
          </>
        ) : jarvis ? (
          <p className={`${card} px-4 py-6 text-center text-[13px] text-ink-soft`}>0 submissions in this range</p>
        ) : null}
      </main>
    </>
  );
}
