"use client";

import { useState } from "react";
import type { ImageSlot } from "@/lib/content";

const input =
  "mt-1.5 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy outline-none placeholder:text-ink-soft/50 focus:border-brand disabled:bg-mist disabled:text-ink-soft";
const labelCls = "block text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-soft";

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
    <label className={labelCls}>
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        inputMode={numeric ? "numeric" : undefined}
        onChange={(e) => onChange(numeric ? e.target.value.replace(/\D/g, "") : e.target.value)}
        className={input}
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
    <label className={labelCls}>
      {label}
      {hint ? <span className="ml-2 normal-case tracking-normal text-ink-soft/70">{hint}</span> : null}
      <textarea
        value={value}
        rows={rows}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${input} resize-y leading-6`}
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
    <label className={labelCls}>
      {label}
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value as T)} className={input}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

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
    <label className="flex items-center gap-2.5 text-sm font-semibold text-navy">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-brand"
      />
      {label}
    </label>
  );
}

/** A set of checkboxes over named items, e.g. the cars a plan offers. */
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
    <fieldset>
      <legend className={labelCls}>{label}</legend>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
        {items.map((item) => (
          <Toggle
            key={item.id}
            label={item.label}
            checked={selected.includes(item.id)}
            disabled={disabled}
            onChange={(on) =>
              // Keeps the existing order and appends new picks at the end.
              onChange(on ? [...selected, item.id] : selected.filter((id) => id !== item.id))
            }
          />
        ))}
      </div>
    </fieldset>
  );
}

export function Panel({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-base font-bold text-navy">{title}</h3>
        {aside ? <div className="ml-auto flex flex-wrap items-center gap-2">{aside}</div> : null}
      </div>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

const small =
  "h-8 rounded-full border border-line px-3 text-[12px] font-bold text-navy transition hover:border-navy disabled:opacity-40";

/** Up, down and remove for an item in an ordered list. */
export function ListControls({
  index,
  count,
  onMove,
  onRemove,
  disabled,
  removeLabel = "Remove",
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove?: () => void;
  disabled: boolean;
  removeLabel?: string;
}) {
  return (
    <>
      <button type="button" className={small} disabled={disabled || index === 0} onClick={() => onMove(index - 1)} aria-label="Move up">
        ↑
      </button>
      <button type="button" className={small} disabled={disabled || index === count - 1} onClick={() => onMove(index + 1)} aria-label="Move down">
        ↓
      </button>
      {onRemove ? (
        <button type="button" className={`${small} text-[#b3261e]`} disabled={disabled} onClick={onRemove}>
          {removeLabel}
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
export function AddByName({
  label,
  onAdd,
  disabled,
}: {
  label: string;
  onAdd: (name: string) => void;
  disabled: boolean;
}) {
  const [name, setName] = useState("");
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-dashed border-line bg-white p-4">
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
        className="h-10 rounded-full bg-navy px-5 text-[13px] font-bold text-white disabled:opacity-50"
      >
        Add
      </button>
    </div>
  );
}

/** An image slot: the current picture, a file picker, and the address it resolves to. */
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
    <div className="grid gap-3 rounded-xl border border-line bg-paper p-4">
      <p className={labelCls}>{slot.label}</p>
      <div className="flex items-start gap-4">
        <div className="grid h-20 w-32 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-mist">
          {slot.url ? (
            // Uploaded files live on Blob or in public, so a plain img keeps this editor simple.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slot.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[11px] font-semibold text-ink-soft">Placeholder</span>
          )}
        </div>
        <div className="grid flex-1 gap-3">
          <Text label="Address" placeholder="Upload, or a /figma/ path" value={slot.url} disabled={disabled} onChange={(url) => onChange({ ...slot, url })} />
          <Text label="Alt text" value={slot.alt} disabled={disabled} onChange={(alt) => onChange({ ...slot, alt })} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex h-9 cursor-pointer items-center rounded-full bg-navy px-4 text-[13px] font-bold text-white has-[:disabled]:cursor-default has-[:disabled]:opacity-60">
          {busy ? "Uploading" : "Upload image"}
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
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange({ ...slot, url: "" })}
            className="h-9 rounded-full border border-line px-4 text-[13px] font-bold text-navy disabled:opacity-60"
          >
            Clear
          </button>
        ) : null}
        {error ? <span className="text-[13px] text-[#b3261e]">{error}</span> : null}
      </div>
    </div>
  );
}
