import type { ReactNode } from "react";
import { ArrowRight, Phone } from "lucide-react";

/** The small uppercase line above a section title. `bars` adds the yellow dashes either side. */
export function Eyebrow({
  children,
  tone = "brand",
  bars = false,
  className = "",
}: {
  children: ReactNode;
  tone?: "brand" | "sun" | "white";
  bars?: boolean;
  className?: string;
}) {
  const color = tone === "brand" ? "text-brand" : tone === "sun" ? "text-sun" : "text-white";
  /* The yellow eyebrows on navy run a size larger in the export. */
  const size = tone === "sun" ? "lg:text-sm lg:tracking-[1.5px]" : "lg:text-xs lg:tracking-[1.65px]";
  return (
    <p className={`flex items-center gap-3.5 text-xs font-semibold uppercase leading-4 tracking-[1px] ${size} ${color} ${className}`}>
      {bars ? <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" /> : null}
      {children}
      {bars ? <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" /> : null}
    </p>
  );
}

const TITLE_SIZE = {
  xl: "text-[22px] lg:text-[52px] lg:leading-[60px] lg:tracking-normal",
  lg: "text-[24px] lg:text-[48px] lg:leading-[56px] lg:tracking-normal",
  md: "text-[24px] lg:text-[40px] lg:leading-[48px] lg:tracking-[-0.25px]",
};

/** A centred section title. Phones get the compact size from the phone exports. */
export function SectionTitle({
  children,
  tone = "navy",
  size = "xl",
  className = "",
}: {
  children: ReactNode;
  tone?: "navy" | "white";
  size?: keyof typeof TITLE_SIZE;
  className?: string;
}) {
  return (
    <h2
      className={`font-bold leading-[30px] ${TITLE_SIZE[size]} ${
        tone === "navy" ? "text-navy" : "text-white"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

/** The white label pill at the top of each hero. */
export function HeroLabel({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex h-[23px] items-center rounded-full bg-white px-3 text-[11px] font-medium uppercase tracking-[0.6px] text-navy lg:h-[33px] lg:px-5 lg:text-[12px] lg:font-bold lg:tracking-[1px]">
      {children}
    </p>
  );
}

/** `compact` is the tighter phone size of the Fleet Logistics export; the other exports set it larger. */
export function HeroTitle({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <h1
      className={`font-bold text-white ${compact ? "mt-2.5 text-[28px] leading-[34px]" : "mt-[9px] text-[30px] leading-[38px]"}  lg:mt-[14px] lg:text-[52px] lg:leading-[60px] lg:tracking-normal xl:text-[64px] xl:leading-[72px]`}
    >
      {children}
    </h1>
  );
}

export type Action = { label: string; href: string };

/**
 * The hero's two buttons. `size` follows the export: most pages carry the large pair, Employee Mobility
 * a smaller one. Phones stack both at full width.
 */
export function HeroActions({
  primary,
  secondary,
  size = "lg",
  arrow = false,
  className = "",
}: {
  primary: Action;
  secondary: Action & { phoneIcon?: boolean };
  size?: "lg" | "md";
  arrow?: boolean;
  className?: string;
}) {
  const lg = size === "lg";
  return (
    <div className={`flex flex-col gap-3 lg:flex-row ${className}`}>
      <a
        href={primary.href}
        className={`inline-flex h-14 items-center justify-center gap-2 rounded-full bg-sun text-[17px] font-semibold text-navy transition hover:brightness-95 lg:font-medium ${
          lg ? "lg:w-[272px] lg:text-xl" : "lg:h-[52px] lg:px-[30px] lg:text-base lg:font-semibold"
        }`}
      >
        {primary.label}
        {arrow ? <ArrowRight aria-hidden size={20} className="lg:hidden" /> : null}
      </a>
      <a
        href={secondary.href}
        className={`inline-flex h-14 items-center justify-center gap-2.5 rounded-full border-2 border-white text-[17px] font-medium text-white transition hover:bg-white/10 ${
          lg ? "lg:px-[30px]" : "lg:h-[54px] lg:border-[1.5px] lg:border-white/60 lg:px-[30px] lg:text-base lg:font-semibold"
        }`}
      >
        {secondary.phoneIcon ? <Phone aria-hidden size={20} strokeWidth={1.75} className="hidden lg:block" /> : null}
        {secondary.label}
      </a>
    </div>
  );
}

/** The light blue square behind a line icon. */
export function IconTile({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`grid shrink-0 place-items-center bg-[#e8f2fa] text-brand ${className}`}>{children}</span>;
}
