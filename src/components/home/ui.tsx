import type { ReactNode } from "react";
import { CaretDown, CheckCircle, GooglePlayLogo, MapPin } from "@phosphor-icons/react/ssr";

export const PHONE_DISPLAY = "91262 14248";
export const PHONE_HREF = "tel:+919126214248";
export const PLAY_STORE_HREF = "https://play.google.com/store/apps/details?id=com.everest.fleet";
export const WHATSAPP_HREF = "https://wa.me/919126214248";

export function CityPill({ city = "Mumbai" }: { city?: string }) {
  return (
    <button
      type="button"
      className="mx-auto flex h-[30px] items-center gap-[5px] rounded-full border border-line bg-white px-[13px] text-[13px] font-medium text-navy"
    >
      <MapPin size={13} weight="bold" className="text-ink-soft" />
      {city}
      <CaretDown size={12} weight="bold" className="text-ink-soft" />
    </button>
  );
}

export function SunButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={`inline-flex h-14 w-56 items-center justify-center rounded-full bg-sun text-[15px] font-medium tracking-[-0.23px] text-navy transition hover:brightness-95 ${className}`}
    >
      {children}
    </a>
  );
}

export function GooglePlayButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={PLAY_STORE_HREF}
      target="_blank"
      rel="noopener"
      className={`inline-flex h-14 w-[174px] items-center justify-center gap-2.5 rounded-full bg-black text-white ${className}`}
    >
      <GooglePlayLogo size={20} weight="fill" />
      <span className="flex flex-col text-left leading-none">
        <span className="text-[9px] font-medium uppercase tracking-[0.5px]">Get it on</span>
        <span className="text-base font-semibold leading-5">Google Play</span>
      </span>
    </a>
  );
}

export function CheckItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <li className={`flex items-center gap-1.5 ${className}`}>
      <CheckCircle size={14} weight="fill" className="shrink-0 text-lime" />
      {children}
    </li>
  );
}

export function Eyebrow({ children, trailingBar = true }: { children: ReactNode; trailingBar?: boolean }) {
  return (
    <p className="flex items-center justify-center gap-[22px] text-xs font-bold uppercase leading-4 tracking-[2px] text-brand">
      <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
      {children}
      {trailingBar && <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />}
    </p>
  );
}
