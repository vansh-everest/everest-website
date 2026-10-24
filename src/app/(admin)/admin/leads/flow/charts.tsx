"use client";

import { useState } from "react";

/** One coloured part of a stack: a CRM stage, or the single series of a plain chart. */
export type Series = { key: string; label: string; color: string };
/** One column or bar: its name, and a value per series in series order. */
export type Datum = { key: string; label: string; short?: string; values: number[]; note?: string };

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** 0..top in four or fewer clean steps (whole numbers only: these are lead counts). */
function ticks(max: number): number[] {
  if (max <= 0) return [0, 1];
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw);
  const top = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let t = 0; t <= top; t += step) out.push(t);
  return out;
}

const compact = (n: number) => (n >= 1000 ? `${Math.round(n / 100) / 10}K` : String(n));

export function Legend({ series }: { series: Series[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5 text-[12px] text-ink-soft">
          <span aria-hidden className="size-2.5 rounded-[2px]" style={{ background: s.color }} />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

function Tip({ datum, series, style }: { datum: Datum; series: Series[]; style: React.CSSProperties }) {
  const total = sum(datum.values);
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 min-w-[150px] rounded-lg border border-line bg-white px-3 py-2 text-[12px] shadow-[0_6px_20px_rgba(6,47,80,0.12)]"
      style={style}
    >
      <p className="font-semibold text-navy">{datum.label}</p>
      {series.length > 1 ? (
        <p className="mt-0.5 text-ink-soft">
          <span className="font-semibold text-navy tabular-nums">{total}</span> total
        </p>
      ) : null}
      <ul className="mt-1.5 space-y-1">
        {series.map((s, i) => (
          <li key={s.key} className="flex items-center gap-2">
            <span aria-hidden className="h-[2px] w-3 rounded-full" style={{ background: s.color }} />
            <span className={`tabular-nums font-semibold ${datum.values[i] ? "text-navy" : "text-ink-soft/60"}`}>{datum.values[i]}</span>
            <span className="text-ink-soft">{s.label}</span>
          </li>
        ))}
      </ul>
      {datum.note ? <p className="mt-1.5 border-t border-line pt-1.5 text-ink-soft">{datum.note}</p> : null}
    </div>
  );
}

/** Columns over time (or hour), each stacked by series; the tallest one carries its total. */
export function StackedColumns({ series, data, height = 200 }: { series: Series[]; data: Datum[]; height?: number }) {
  const [active, setActive] = useState<number | null>(null);
  const totalsList = data.map((d) => sum(d.values));
  const max = Math.max(0, ...totalsList);
  // Headroom above the tallest column, so its total never touches the card title.
  const marks = ticks(max * 1.12);
  const top = marks[marks.length - 1];
  const peak = max > 0 ? totalsList.indexOf(max) : -1;
  const every = Math.max(1, Math.ceil(data.length / 7));
  const n = data.length;

  const tipStyle = (i: number): React.CSSProperties => {
    const left = ((i + 0.5) / n) * 100;
    const shift = left < 20 ? "0" : left > 80 ? "-100%" : "-50%";
    return { left: `${left}%`, top: 0, transform: `translate(${shift}, 0)` };
  };

  return (
    <div className="flex">
      <div className="relative w-8 shrink-0" style={{ height }} aria-hidden>
        {marks.map((t) => (
          <span key={t} className="absolute right-2 translate-y-1/2 text-[11px] tabular-nums text-ink-soft" style={{ bottom: `${(t / top) * 100}%` }}>
            {compact(t)}
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative" style={{ height }} onPointerLeave={() => setActive(null)}>
          {marks.map((t) => (
            <span key={t} aria-hidden className={`absolute inset-x-0 h-px ${t === 0 ? "bg-[#c3c2b7]" : "bg-[#eceae4]"}`} style={{ bottom: `${(t / top) * 100}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end">
            {data.map((d, i) => {
              const total = totalsList[i];
              const parts = series.map((s, j) => ({ s, v: d.values[j] })).filter((p) => p.v > 0);
              return (
                <div
                  key={d.key}
                  tabIndex={0}
                  aria-label={`${d.label}: ${total}`}
                  className={`relative flex h-full flex-1 items-end justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-brand ${active === i ? "bg-mist" : ""}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                >
                  {total > 0 ? (
                    <div className="flex w-[70%] max-w-[24px] flex-col-reverse gap-[2px]" style={{ height: `${(total / top) * 100}%`, minHeight: 3 }}>
                      {parts.map((p, k) => (
                        <div
                          key={p.s.key}
                          className={k === parts.length - 1 ? "rounded-t-[4px]" : ""}
                          style={{ background: p.s.color, flexGrow: p.v, flexBasis: 0, minHeight: 1 }}
                        />
                      ))}
                    </div>
                  ) : null}
                  {i === peak ? (
                    <span className="absolute left-1/2 -translate-x-1/2 text-[11px] font-semibold tabular-nums text-navy" style={{ bottom: `calc(${(total / top) * 100}% + 4px)` }}>
                      {total}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          {active !== null ? <Tip datum={data[active]} series={series} style={tipStyle(active)} /> : null}
        </div>
        <div className="relative mt-1.5 flex h-4" aria-hidden>
          {data.map((d, i) => (
            <span key={d.key} className="relative flex-1">
              {i % every === 0 || i === n - 1 ? (
                <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-ink-soft">{d.short ?? d.label}</span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** One horizontal bar per row, stacked by series, its total at the tip and its note under the name. */
export function StackedBars({ series, data }: { series: Series[]; data: Datum[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => sum(d.values)));
  return (
    <ul className="relative" onPointerLeave={() => setActive(null)}>
      {data.map((d, i) => {
        const total = sum(d.values);
        const parts = series.map((s, j) => ({ s, v: d.values[j] })).filter((p) => p.v > 0);
        return (
          <li
            key={d.key}
            tabIndex={0}
            aria-label={`${d.label}: ${total}${d.note ? `, ${d.note}` : ""}`}
            className={`relative grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] items-center gap-3 rounded-md sm:grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] px-1.5 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-brand ${active === i ? "bg-mist" : ""}`}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <span className="min-w-0">
              <span className="block break-words text-[12px] leading-4 text-navy">{d.label}</span>
              {d.note ? <span className="block text-[11px] leading-4 text-ink-soft">{d.note}</span> : null}
            </span>
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex h-3.5 shrink-0 gap-[2px]" style={{ width: `${(total / max) * 75}%`, minWidth: total ? 3 : 0 }}>
                {parts.map((p, k) => (
                  <span
                    key={p.s.key}
                    className={k === parts.length - 1 ? "rounded-r-[4px]" : ""}
                    style={{ background: p.s.color, flexGrow: p.v, flexBasis: 0, minWidth: 1 }}
                  />
                ))}
              </span>
              <span className="text-[12px] font-semibold tabular-nums text-navy">{total}</span>
            </span>
            {active === i && series.length > 1 ? (
              <Tip datum={d} series={series} style={{ right: 8, bottom: "100%", marginBottom: 4 }} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/** Each step of the way from form to CRM: one bar, its count and its share of the step before. */
export function Funnel({ steps }: { steps: { label: string; value: number; note: string }[] }) {
  const first = Math.max(1, steps[0]?.value ?? 1);
  return (
    <ol className="space-y-2.5">
      {steps.map((s) => (
        <li key={s.label} className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)]">
          <span className="min-w-0">
            <span className="block text-[12px] leading-4 text-navy">{s.label}</span>
            <span className="block text-[11px] leading-4 text-ink-soft">{s.note}</span>
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <span className="h-5 shrink-0 rounded-r-[4px] bg-[#2a78d6]" style={{ width: `${(s.value / first) * 75}%`, minWidth: s.value ? 3 : 0 }} />
            <span className="text-[12px] font-semibold tabular-nums text-navy">{s.value}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
