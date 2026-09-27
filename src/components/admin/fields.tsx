"use client";

import { useId, useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, ImageIcon, Trash2, Upload } from "lucide-react";
import type { ImageSlot } from "@/lib/content";

/*
 * The admin's building blocks. Every control is 40px tall with its label above it, so fields
 * line up across a row whatever mix of inputs, selects and buttons the row holds.
 */

export const control =
  "block h-10 w-full min-w-0 rounded-lg border border-line bg-white px-3 text-sm text-navy shadow-[0_1px_1px_rgba(6,47,80,0.04)] outline-none transition placeholder:text-ink-soft/45 focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:bg-mist disabled:text-ink-soft";
const labelText = "text-[13px] font-medium leading-4 text-navy";

export const button = {
  primary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-white transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40",
  secondary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40",
  small:
    "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3 text-[13px] font-semibold text-navy transition hover:border-navy/40 hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40",
  add: "inline-flex h-9 items-center justify-center gap-1.5 justify-self-start rounded-lg border border-dashed border-navy/25 bg-white px-3.5 text-[13px] font-semibold text-navy transition hover:border-navy/50 hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40",
};

export function Text({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  type = "text",
  numeric = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder?: string;
  type?: string;
  /** Digits only: the keypad on a phone, and anything else typed is dropped. */
  numeric?: boolean;
}) {
  return (
    <label className="grid min-w-0 content-start gap-1.5">
      <span className={labelText}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={numeric ? "numeric" : undefined}
        onChange={(e) => onChange(numeric ? e.target.value.replace(/\D/g, "") : e.target.value)}
        className={control}
      />
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  disabled,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="grid min-w-0 content-start gap-1.5">
      <span className={labelText}>
        {label}
        {hint ? <span className="ml-2 font-normal text-ink-soft">{hint}</span> : null}
      </span>
      <textarea
        value={value}
        rows={rows}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${control} h-auto resize-y py-2 leading-6`}
      />
    </label>
  );
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled: boolean;
}) {
  return (
    <label className="grid min-w-0 content-start gap-1.5">
      <span className={labelText}>{label}</span>
      <span className="relative block">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as T)}
          className={`${control} cursor-pointer appearance-none pr-9`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft" />
      </span>
    </label>
  );
}

/** An on/off switch. It is a real checkbox, so it keys, labels and submits like one. */
export function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled: boolean;
}) {
  return (
    <label className={`inline-flex items-center gap-3 text-sm font-medium text-navy ${disabled ? "" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="relative h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-[#d5dbe1] transition before:absolute before:left-0.5 before:top-0.5 before:size-4 before:rounded-full before:bg-white before:shadow before:transition checked:bg-brand checked:before:translate-x-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
      />
      {label}
    </label>
  );
}

/** A set of checkboxes over named items, e.g. the cars a plan offers, shown as chips. */
export function Checks({
  label,
  items,
  selected,
  onChange,
  disabled,
}: {
  label: string;
  items: { id: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className={`${labelText} mb-2`}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const on = selected.includes(item.id);
          return (
            <label
              key={item.id}
              className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition ${
                on ? "border-brand/40 bg-brand/[0.06] text-navy" : "border-line bg-white text-ink-soft"
              } ${disabled ? "" : "cursor-pointer hover:border-brand/50"}`}
            >
              <input
                type="checkbox"
                checked={on}
                disabled={disabled}
                // Keeps the existing order and appends new picks at the end.
                onChange={(e) => onChange(e.target.checked ? [...selected, item.id] : selected.filter((id) => id !== item.id))}
                className="size-4 cursor-pointer accent-brand disabled:cursor-not-allowed"
              />
              {item.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** A plain card with a heading, for settings that are always open. */
export function Panel({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(6,47,80,0.04)]">
      <div className="flex min-h-14 flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
        <h3 className="text-[15px] font-bold text-navy">{title}</h3>
        {aside ? <div className="ml-auto flex flex-wrap items-center gap-2">{aside}</div> : null}
      </div>
      <div className="grid gap-5 px-4 py-5 sm:px-5">{children}</div>
    </section>
  );
}

/**
 * A row that opens into its editor: a plan, a car, a city, a post. The heading holds the
 * toggle, as in the WAI accordion pattern; the reorder and remove buttons sit beside it.
 */
export function Collapsible({
  title,
  meta,
  thumb,
  actions,
  defaultOpen = false,
  children,
}: {
  title: string;
  meta?: React.ReactNode;
  thumb?: React.ReactNode;
  actions?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(6,47,80,0.04)]">
      <div className="flex min-h-16 items-center gap-3 px-3 py-2.5 sm:px-4">
        <h3 className="min-w-0 flex-1">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen(!open)}
            className="flex w-full min-w-0 items-center gap-3 rounded-lg py-1 text-left text-[15px] font-bold text-navy outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          >
            <ChevronRight size={18} className={`shrink-0 text-ink-soft transition ${open ? "rotate-90" : ""}`} />
            {thumb}
            <span className="truncate">{title}</span>
          </button>
        </h3>
        {meta ? <div className="hidden shrink-0 flex-wrap items-center justify-end gap-1.5 md:flex">{meta}</div> : null}
        {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
      </div>
      {open ? (
        <div id={id} className="divide-y divide-line border-t border-line">
          {children}
        </div>
      ) : null}
    </section>
  );
}

/** One group of fields inside an open row: its name on the left, the fields on the right. */
export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 px-4 py-5 sm:px-5 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-8">
      <div>
        <h4 className="text-sm font-semibold text-navy">{title}</h4>
        {hint ? <p className="mt-1 text-xs leading-5 text-ink-soft">{hint}</p> : null}
      </div>
      <div className="grid min-w-0 gap-4">{children}</div>
    </div>
  );
}

const COLS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 xl:grid-cols-4",
  5: "sm:grid-cols-3 xl:grid-cols-5",
} as const;

/** Fields side by side on a wide screen, one under another on a phone. */
export function Row({ cols, children }: { cols: keyof typeof COLS; children: React.ReactNode }) {
  return <div className={`grid gap-4 ${COLS[cols]}`}>{children}</div>;
}

type Tone = "green" | "amber" | "grey" | "blue";
const TONES: Record<Tone, string> = {
  green: "bg-[#e8f7ee] text-[#17794a]",
  amber: "bg-[#fdf3d7] text-[#80610a]",
  grey: "bg-mist text-ink-soft",
  blue: "bg-brand/10 text-brand",
};

export function Badge({ tone = "grey", children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`inline-flex h-6 items-center rounded-md px-2 text-xs font-semibold ${TONES[tone]}`}>{children}</span>;
}

const iconButton =
  "grid size-8 place-items-center rounded-lg text-ink-soft transition hover:bg-mist hover:text-navy disabled:pointer-events-none disabled:opacity-30";

/** Up, down and remove for an item in an ordered list. */
export function ListControls({
  index,
  count,
  onMove,
  onRemove,
  disabled,
  removeLabel = "Remove",
  hideMove = false,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove?: () => void;
  disabled: boolean;
  removeLabel?: string;
  /** For lists whose order carries no meaning. */
  hideMove?: boolean;
}) {
  return (
    <>
      {hideMove ? null : (
        <>
          <button type="button" className={iconButton} disabled={disabled || index === 0} onClick={() => onMove(index - 1)} aria-label="Move up">
            <ChevronUp size={17} />
          </button>
          <button type="button" className={iconButton} disabled={disabled || index === count - 1} onClick={() => onMove(index + 1)} aria-label="Move down">
            <ChevronDown size={17} />
          </button>
        </>
      )}
      {onRemove ? (
        <button type="button" className={`${iconButton} hover:bg-[#fdecea] hover:text-[#b3261e]`} disabled={disabled} onClick={onRemove} aria-label={removeLabel}>
          <Trash2 size={16} />
        </button>
      ) : null}
    </>
  );
}

export function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** A name box and an Add button, for creating a plan or a car. */
export function AddByName({ label, onAdd, disabled }: { label: string; onAdd: (name: string) => void; disabled: boolean }) {
  const [name, setName] = useState("");
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-navy/20 bg-white/60 p-4">
      <div className="min-w-[220px] flex-1">
        <Text label={label} value={name} disabled={disabled} onChange={setName} />
      </div>
      <button
        type="button"
        disabled={disabled || !name.trim()}
        onClick={() => {
          onAdd(name.trim());
          setName("");
        }}
        className={button.primary}
      >
        Add
      </button>
    </div>
  );
}

/** A column heading shown once above a list of rows, and hidden where the rows stack. */
export function RowHeads({ grid, heads }: { grid: string; heads: string[] }) {
  return (
    <div aria-hidden className={`hidden gap-3 text-xs font-medium text-ink-soft sm:grid ${grid}`}>
      {heads.map((h, i) => (
        <span key={i}>{h}</span>
      ))}
    </div>
  );
}

/** An input inside a list row. Its label is visible only where the rows stack on a phone. */
export function Cell({
  label,
  value,
  onChange,
  disabled,
  numeric = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  numeric?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid min-w-0 gap-1">
      <span className="text-xs font-medium text-ink-soft sm:sr-only">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={numeric ? "numeric" : undefined}
        onChange={(e) => onChange(numeric ? e.target.value.replace(/\D/g, "") : e.target.value)}
        className={control}
      />
    </label>
  );
}

/** An image slot: the current picture, the upload and clear buttons, its address and alt text. */
export function ImageField({
  slot,
  onChange,
  disabled,
}: {
  slot: ImageSlot;
  onChange: (next: ImageSlot) => void;
  disabled: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    try {
      const res = await fetch("/api/admin/upload/", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error === "too_large" ? "Image is over 8 MB." : "Upload failed.");
      } else {
        onChange({ ...slot, url: data.url });
      }
    } catch {
      setError("Upload failed.");
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-4 rounded-xl border border-line bg-paper p-4 sm:grid-cols-[200px_minmax(0,1fr)]">
      <div className="grid content-start gap-2.5">
        <div className="grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-lg border border-line bg-white">
          {slot.url ? (
            // Uploaded files live on Blob or in public, so a plain img keeps this editor simple.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slot.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={26} className="text-ink-soft/40" />
          )}
        </div>
        <div className="flex gap-2">
          <label className={`${button.small} flex-1 cursor-pointer has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40`}>
            <Upload size={14} />
            {busy ? "Uploading" : "Upload"}
            <input
              type="file"
              accept="image/*"
              disabled={disabled || busy}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
                e.target.value = "";
              }}
            />
          </label>
          {slot.url ? (
            <button type="button" disabled={disabled} onClick={() => onChange({ ...slot, url: "" })} className={button.small}>
              Clear
            </button>
          ) : null}
        </div>
      </div>
      <div className="grid min-w-0 content-start gap-3">
        <p className="text-sm font-semibold text-navy">{slot.label}</p>
        <Text label="Address" placeholder="Upload, or a /figma/ path" value={slot.url} disabled={disabled} onChange={(url) => onChange({ ...slot, url })} />
        <Text label="Alt text" value={slot.alt} disabled={disabled} onChange={(alt) => onChange({ ...slot, alt })} />
        {error ? <p className="text-[13px] text-[#b3261e]">{error}</p> : null}
      </div>
    </div>
  );
}
