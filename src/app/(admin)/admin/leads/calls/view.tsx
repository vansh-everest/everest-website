import Image from "next/image";
import Link from "next/link";
import { GitBranch, List } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";
import { CITY_PHONES } from "@/lib/city-phones";
import type { CallTapReport } from "@/lib/unify";
import { Legend, StackedColumns, type Datum, type Series } from "../flow/charts";
import { dayLabel, daySpan } from "../flow/flow-data";

const IST_MS = 330 * 60_000;
const istDay = (iso: string) => new Date(Date.parse(iso) + IST_MS).toISOString().slice(0, 10);
const istToday = () => istDay(new Date().toISOString());
const PRESETS = [7, 30, 90];

export type Range = { days: number; from: string; to: string };

export function rangeOf(params: Record<string, string | string[] | undefined>): Range {
  const asked = Number([params.days].flat()[0]);
  const days = PRESETS.includes(asked) ? asked : 30;
  const to = istToday();
  const from = new Date(Date.parse(`${to}T00:00:00Z`) - (days - 1) * 86_400_000).toISOString().slice(0, 10);
  return { days, from, to };
}

const CITY_NAMES: Record<string, string> = {
  mumbai: "Mumbai",
  delhi: "Delhi NCR",
  bengaluru: "Bengaluru",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
  pune: "Pune",
  kolkata: "Kolkata",
};
const NO_CITY = "No city chosen";
/** Okabe-Ito hues, as the flow page uses, grey for no city. */
const COLORS = ["#0072b2", "#56b4e9", "#009e73", "#e69f00", "#cc79a7", "#d55e00", "#f0e442"];
const SERIES: Series[] = [
  ...Object.keys(CITY_NAMES).map((slug, i) => ({ key: slug, label: CITY_NAMES[slug], color: COLORS[i] })),
  { key: "", label: NO_CITY, color: "#9aa4b2" },
];

const digits = (n: string) => n.replace(/\D/g, "");
const NUMBER_NAMES = new Map<string, string>([
  [digits(PHONE_HREF), "Main line"],
  ["919970732823", "Advertise With Us"],
  ...Object.entries(CITY_PHONES).map(([slug, n]) => [digits(n), `${CITY_NAMES[slug] ?? slug} line`] as [string, string]),
]);
const numberLabel = (n: string) => {
  const local = n.replace(/^91/, "");
  return `${NUMBER_NAMES.get(n) ?? "Other"} · ${local.slice(0, 5)} ${local.slice(5)}`;
};

const card = "rounded-xl border border-line bg-white";
const cardTitle = "text-[13px] font-bold text-navy";
const cell = "px-3 py-2 text-right tabular-nums";
const head = "px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-ink-soft whitespace-nowrap";
const link = "flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-navy hover:bg-mist";

function tally<T>(rows: T[], key: (row: T) => string): [string, number][] {
  const m = new Map<string, number>();
  for (const r of rows) m.set(key(r), (m.get(key(r)) ?? 0) + 1);
  return [...m].sort((a, b) => b[1] - a[1]);
}

function Tile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className={`${card} px-4 py-3`}>
      <p className="text-[12px] text-ink-soft">{label}</p>
      <p className="mt-1 text-2xl font-bold text-navy">{value}</p>
      <p className="mt-0.5 text-[11px] leading-4 text-ink-soft">{note}</p>
    </div>
  );
}

function CountTable({ title, first, rows, total }: { title: string; first: string; rows: [string, number][]; total: number }) {
  return (
    <section className={`${card} overflow-hidden`}>
      <h2 className={`${cardTitle} px-4 pt-4`}>{title}</h2>
      <div className="overflow-x-auto">
        <table className="mt-2 w-full text-[13px] text-navy">
          <thead>
            <tr className="border-b border-line">
              <th className={`${head} text-left`}>{first}</th>
              <th className={`${head} text-right`}>Taps</th>
              <th className={`${head} text-right`}>Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map(([name, n]) => (
                <tr key={name} className="border-b border-line last:border-0">
                  <td className="px-3 py-2 text-left">
                    <span className="block max-w-[170px] truncate sm:max-w-[360px]" title={name}>
                      {name}
                    </span>
                  </td>
                  <td className={cell}>{n.toLocaleString("en-IN")}</td>
                  <td className={cell}>{total ? `${Math.round((n / total) * 100)}%` : "–"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-ink-soft">
                  No taps in range
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function CallsView({
  range,
  unifyOn,
  loaded,
}: {
  range: Range;
  unifyOn: boolean;
  loaded: { calls: CallTapReport[]; truncated: boolean } | null;
}) {
  const calls = (loaded?.calls ?? []).filter((c) => {
    const d = istDay(c.clicked_at);
    return d >= range.from && d <= range.to;
  });
  const days = daySpan(range.from, range.to);
  const today = range.to;

  const byDayCity = new Map<string, Map<string, number>>();
  for (const c of calls) {
    const d = istDay(c.clicked_at);
    const m = byDayCity.get(d) ?? new Map<string, number>();
    m.set(c.city ?? "", (m.get(c.city ?? "") ?? 0) + 1);
    byDayCity.set(d, m);
  }
  const data: Datum[] = days.map((d) => ({
    key: d,
    label: dayLabel(d),
    values: SERIES.map((s) => byDayCity.get(d)?.get(s.key) ?? 0),
  }));
  const shown = SERIES.filter((_, i) => data.some((d) => d.values[i] > 0));

  const perDay = (d: string) => [...(byDayCity.get(d)?.values() ?? [])].reduce((a, b) => a + b, 0);
  const week = days.filter((d) => d < today).slice(-7);
  const weekAvg = week.length ? Math.round(week.reduce((a, d) => a + perDay(d), 0) / week.length) : 0;

  const pages = tally(calls, (c) => c.page).slice(0, 15);
  const numbers = tally(calls, (c) => numberLabel(c.phone));
  const cities = tally(calls, (c) => (c.city ? CITY_NAMES[c.city] ?? c.city : NO_CITY));
  const sources = tally(calls, (c) => c.utm_source ?? "No campaign tag");

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b border-line bg-white">
        <div className="mx-auto flex h-full max-w-[1280px] items-center gap-3 px-4 lg:px-6">
          <Image src="/figma/logo.png" alt="Everest Fleet" width={135} height={78} className="h-11 w-auto" />
          <span aria-hidden className="h-6 w-px bg-line" />
          <h1 className="text-[15px] font-bold text-navy">Inbound calls</h1>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link href="/admin/leads/flow" className={link}>
              <GitBranch size={14} />
              <span className="hidden sm:inline">Leads flow</span>
            </Link>
            <Link href="/admin/leads" className={link}>
              <List size={14} />
              All leads
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-5 px-4 py-6 lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((n) => (
            <Link
              key={n}
              href={`/admin/leads/calls?days=${n}`}
              className={`flex h-8 items-center rounded-full border px-3 text-[13px] font-medium ${
                n === range.days ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:bg-mist"
              }`}
            >
              Last {n} days
            </Link>
          ))}
          <span className="text-[12px] text-ink-soft">Call button taps on the website</span>
        </div>

        {!unifyOn ? (
          <p className="rounded-xl border border-[#f3e7a0] bg-[#fdfae2] px-4 py-3 text-[13px] text-navy">Unify link: set UNIFY_LEADS_URL and UNIFY_LEADS_KEY in Amplify</p>
        ) : !loaded ? (
          <p className="rounded-xl border border-[#f5c2c2] bg-[#fdecec] px-4 py-3 text-[13px] text-[#a12a2a]">Unify offline</p>
        ) : loaded.truncated ? (
          <p className="rounded-xl border border-[#f3e7a0] bg-[#fdfae2] px-4 py-3 text-[13px] text-navy">Range too large: shorten it for complete counts</p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Tile label="Today" value={perDay(today).toLocaleString("en-IN")} note="Taps so far" />
          <Tile label="Per day, last 7 days" value={week.length ? weekAvg.toLocaleString("en-IN") : "–"} note="Full days only" />
          <Tile label={`Last ${range.days} days`} value={calls.length.toLocaleString("en-IN")} note="Taps" />
          <Tile label="Top city" value={cities[0]?.[0] ?? "–"} note={cities[0] ? `${cities[0][1].toLocaleString("en-IN")} taps` : "No taps yet"} />
        </div>

        <section className={`${card} p-4`}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className={cardTitle}>Taps per day, by city</h2>
            {shown.length ? <Legend series={shown} /> : null}
          </div>
          <StackedColumns series={SERIES} data={data} />
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <CountTable title="By page" first="Page" rows={pages} total={calls.length} />
          <CountTable title="By number" first="Number" rows={numbers} total={calls.length} />
          <CountTable title="By city chosen" first="City" rows={cities} total={calls.length} />
          <CountTable title="By campaign source" first="utm_source" rows={sources} total={calls.length} />
        </div>
      </main>
    </>
  );
}
