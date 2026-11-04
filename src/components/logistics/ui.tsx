import type { ReactNode } from "react";

/** The page's one content width: 1104 on the 1440 export. */
export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1136px] px-4 ${className}`}>{children}</div>;
}

/** A centred section title with its line underneath. */
export function Heading({ title, sub, subClass = "" }: { title: ReactNode; sub?: string; subClass?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-[28px] font-bold leading-[34px] tracking-[-0.2px] text-navy lg:text-[40px] lg:leading-[50px]">{title}</h2>
      {sub ? <p className={`mt-2.5 text-lg leading-7 text-ink-soft lg:mt-3 ${subClass}`}>{sub}</p> : null}
    </div>
  );
}
