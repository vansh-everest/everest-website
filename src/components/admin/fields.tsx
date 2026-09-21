"use client";

import { useState } from "react";
import type { ImageSlot } from "@/lib/content";

const input =
  "mt-1.5 block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy outline-none focus:border-brand disabled:bg-mist disabled:text-ink-soft";

export function Text({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-soft">
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  rows?: number;
}) {
  return (
    <label className="block text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-soft">
      {label}
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

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h3 className="text-base font-bold text-navy">{title}</h3>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
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
      <p className="text-[12px] font-semibold uppercase tracking-[0.6px] text-ink-soft">{slot.label}</p>
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
          <Text label="Address" value={slot.url} disabled={disabled} onChange={(url) => onChange({ ...slot, url })} />
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
