import type { ReactNode } from "react";

/** Section label above a heading. `tone` follows the band: brand blue on light, sun on navy. */
export function Kicker({
  children,
  tone = "brand",
  align = "center",
  className = "",
}: {
  children: ReactNode;
  tone?: "brand" | "sun";
  align?: "center" | "left" | "responsive";
  className?: string;
}) {
  const alignment = align === "center" ? "text-center" : align === "left" ? "text-left" : "text-center lg:text-left";
  return (
    <p
      className={`text-xs font-semibold uppercase leading-4 tracking-[1.2px] lg:text-[13px] lg:tracking-[1.3px] ${
        tone === "sun" ? "text-sun" : "text-brand"
      } ${alignment} ${className}`}
    >
      {children}
    </p>
  );
}

const SIZES = {
  xl: "lg:text-[52px] lg:leading-[58px]",
  lg: "lg:text-[48px] lg:leading-[54px]",
  md: "lg:text-[40px] lg:leading-[48px]",
};

export function Heading({
  children,
  tone = "navy",
  align = "center",
  size = "xl",
  className = "",
}: {
  children: ReactNode;
  tone?: "navy" | "white";
  align?: "center" | "responsive";
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <h2
      className={`text-2xl font-bold leading-[30px] tracking-[-0.3px] ${SIZES[size]} ${
        tone === "white" ? "text-white" : "text-navy"
      } ${align === "center" ? "text-center" : "text-center lg:text-left"} ${className}`}
    >
      {children}
    </h2>
  );
}

/** Small uppercase label inside a section ("Founding team", "Milestones"). */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[13px] font-bold uppercase leading-4 tracking-[1.3px] text-brand ${className}`}>{children}</p>
  );
}
