export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="text-center">
      <p className="flex items-start justify-center gap-3 text-[13px] font-medium uppercase leading-4 tracking-[1.5px] text-brand">
        <span aria-hidden className="-mt-1.5 h-[3px] w-7 rounded-full bg-sun" />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[40px] lg:leading-[53px]">{title}</h2>
      <p className="mt-3 text-lg leading-7 text-ink-soft">{sub}</p>
    </div>
  );
}
