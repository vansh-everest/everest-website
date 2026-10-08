import { FleetMixBars, type MixRow } from "./fleet-mix-bars";
import { Eyebrow, SectionTitle } from "./ui";

/** A navy strip with one headline figure. */
export function FigureBand({
  eyebrow,
  title,
  eyebrowLeft = false,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  eyebrowLeft?: boolean;
  /** The Fleet Logistics phone export sets this band tighter than the others. */
  compact?: boolean;
}) {
  return (
    <section className={`bg-navy px-4 text-center ${compact ? "pb-[9px] pt-2" : "pb-[22px] pt-[34px]"} lg:px-10 lg:pb-[52px] lg:pt-[53px]`}>
      <Eyebrow tone="sun" className={`justify-center lg:mx-auto lg:max-w-[1104px] ${eyebrowLeft ? "lg:justify-start" : ""}`}>
        {eyebrow}
      </Eyebrow>
      <SectionTitle tone="white" size="lg" className="mx-auto mt-2 max-w-[380px] lg:mt-[9px] lg:max-w-none">
        {title}
      </SectionTitle>
    </section>
  );
}

/** The white card on the pale band that follows a FigureBand. */
function FigureCard({ eyebrow, children, flush = false }: { eyebrow: string; children: React.ReactNode; flush?: boolean }) {
  return (
    <section className={`bg-paper px-4 pt-6 ${flush ? "pb-0" : "pb-5"} lg:px-10 lg:pb-20 lg:pt-[62px]`}>
      <div className="mx-auto max-w-[560px] rounded-2xl border border-line bg-white px-[19px] pb-5 pt-5 lg:max-w-[1104px] lg:px-[28px] lg:pb-[25px] lg:pt-[27px]">
        <p className="text-[11px] font-bold uppercase leading-4 tracking-[1.3px] text-brand">{eyebrow}</p>
        {children}
      </div>
    </section>
  );
}

export type { MixRow } from "./fleet-mix-bars";

/** Vehicle mix as bars, each scaled against the largest group; they fill as the card scrolls in. */
export function FleetMix({ eyebrow, rows, note }: { eyebrow: string; rows: MixRow[]; note: string }) {
  return (
    <FigureCard eyebrow={eyebrow}>
      <FleetMixBars rows={rows} />
      <p className="mt-[21px] hidden text-[13px] leading-[18px] text-ink-soft lg:block">{note}</p>
    </FigureCard>
  );
}

export type Stat = { value: string; label: string };

/* Per-stat placement. Phones: two across in source order with a rule above each later row. Desktop:
   three across with the city count (last) lifted into the first row, hairlines between columns, and
   one rule between the rows. */
const PLACE = [
  "lg:order-1 pb-[15px] lg:pb-0",
  "lg:order-2 pb-[15px] pl-2 lg:pb-0 lg:pl-[28px] lg:before:block",
  "lg:order-5 border-t py-[15px] lg:border-t-0 lg:py-0",
  "lg:order-6 border-t py-[15px] pl-2 lg:border-t-0 lg:py-0 lg:pl-[28px] lg:before:block",
  "lg:order-7 border-t pt-[15px] lg:border-t-0 lg:pl-[28px] lg:pt-0 lg:before:block",
  "lg:order-3 border-t pt-[15px] pl-2 lg:border-t-0 lg:pl-[28px] lg:pt-0 lg:before:block",
];

/** Reach figures as a grid of value and label. */
export function ReachNumbers({ eyebrow, stats, note }: { eyebrow: string; stats: Stat[]; note: string }) {
  return (
    <FigureCard eyebrow={eyebrow} flush>
      <div className="mt-4 grid grid-cols-2 lg:mt-[38px] lg:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`relative border-line before:absolute before:inset-y-0 before:left-0 before:hidden before:w-px before:bg-[#eaecef] ${PLACE[i] ?? ""}`}
          >
            <p className="text-[23px] font-bold leading-7 text-brand lg:text-[36px] lg:leading-[46px]">{s.value}</p>
            <p className="mt-0.5 text-sm leading-5 text-ink-soft lg:mt-[3px] lg:text-[15px]">{s.label}</p>
          </div>
        ))}
        <span aria-hidden className="hidden lg:order-4 lg:col-span-3 lg:my-[21px] lg:block lg:h-px lg:bg-[#eaecef]" />
      </div>
      <p className="mt-4 text-sm leading-[19px] text-ink-soft lg:mt-[42px] lg:text-[13px] lg:leading-[18px]">{note}</p>
    </FigureCard>
  );
}
