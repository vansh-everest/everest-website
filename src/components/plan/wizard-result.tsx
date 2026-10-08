import Image from "next/image";
import Link from "next/link";
import { Key, MapPin, Phone } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";
import { rupees } from "@/lib/content";
import type { PlanWizardView, WizardCar } from "@/lib/plan-view";
import type { Said } from "./wizard-copy";
import { RentStrip } from "./wizard-steps";
import { rentLabel, Say, StepHeading, type Figures } from "./wizard-ui";

type Tile = { label: string; value: string; unit?: string; note: Said; accent?: boolean };

/** The two figure boxes each plan leads with, as its design orders them. A blank figure is left out. */
function tiles(view: PlanWizardView, f: Figures): Tile[] {
  const money = rupees(f.money);
  const deposit: Tile = { label: "Deposit", value: money, note: "Refundable" };
  const list: Tile[] =
    view.kind === "now"
      ? [
          {
            label: rentLabel(f.unit),
            value: rupees(f.amount),
            unit: f.unit.replace(/^\+/, ""),
            note: f.months ? [`Fixed for ${f.months} months`, `For ${f.months} months`] : "",
            accent: true,
          },
          f.upfront
            ? { label: "Upfront", value: money, note: ["Paid once, at the start", "Paid once"] }
            : { label: "Deposit", value: money, note: "" },
        ]
      : view.kind === "own"
        ? [{ label: "Tenure", value: f.months, unit: "months", note: "Fixed", accent: true }, deposit]
        : [{ ...deposit, accent: true }, { label: view.term.label, value: view.term.value, note: view.tag }];
  return list.filter((t) => t.label && t.value);
}

function TileBox({ tile }: { tile: Tile }) {
  return (
    <div className={`rounded-xl px-3.5 pb-3 pt-3.5 lg:rounded-2xl lg:px-5 lg:pb-[15px] lg:pt-4 ${tile.accent ? "bg-[#e7f1fa]" : "bg-[#f3f6f9]"}`}>
      <p className="text-[13px] leading-4 text-ink-soft lg:leading-5">{tile.label}</p>
      <p className={`mt-1 flex items-baseline gap-1.5 ${tile.accent ? "text-brand" : "text-navy"}`}>
        <span className="text-[22px] font-bold leading-7 tracking-[-0.3px] lg:text-[32px] lg:leading-10">{tile.value}</span>
        {tile.unit ? <span className="text-sm font-semibold lg:text-base">{tile.unit}</span> : null}
      </p>
      {tile.note ? (
        <p className="mt-0.5 text-xs leading-4 text-ink-soft lg:mt-[3px] lg:text-[13px] lg:leading-5">
          <Say text={tile.note} />
        </p>
      ) : null}
    </div>
  );
}

function YourPlan({ className = "" }: { className?: string }) {
  return <p className={`text-xs font-bold uppercase leading-4 tracking-[1.5px] text-brand lg:text-sm lg:tracking-[2px] ${className}`}>Your plan</p>;
}

function ChangeLink({ onChange, className = "" }: { onChange: () => void; className?: string }) {
  return (
    <button type="button" onClick={onChange} className={`text-sm font-semibold leading-5 text-brand hover:underline lg:text-[15px] lg:leading-6 ${className}`}>
      Change My Choices
    </button>
  );
}

/**
 * The last step: the chosen car and city, the plan's figures for them and the way to apply.
 * Desktop: the car's photo on the left, the figures on the right. Phone: one card, the photo as a
 * thumbnail beside the car's name.
 */
export function ResultStep({
  view,
  car,
  year,
  cityName,
  figures,
  apply,
  onChange,
  headingId,
}: {
  view: PlanWizardView;
  car: WizardCar;
  year: string;
  cityName: string;
  figures: Figures;
  apply: Said;
  onChange: () => void;
  headingId: string;
}) {
  const now = view.kind === "now";
  const title = year ? `${car.name} ${year}` : car.name;
  const shown = tiles(view, figures);
  const badge =
    view.kind === "earn" ? "100% Uber Incentive" : view.kind === "own" && figures.months ? `Yours In Month ${figures.months}` : undefined;

  return (
    <div className="rounded-2xl border border-[#dfe4e8] bg-white px-5 pb-[18px] pt-[19px] lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10 lg:border-0 lg:p-0">
      <YourPlan className="lg:hidden" />
      <div className="mt-4 flex items-center gap-3 lg:mt-0 lg:block">
        <div className="relative aspect-[110/72] w-[110px] shrink-0 overflow-hidden rounded-lg bg-mist lg:aspect-[340/230] lg:w-full lg:rounded-xl">
          {car.image.url ? (
            <Image src={car.image.url} alt={car.image.alt} fill sizes="(min-width: 1024px) 340px, 110px" className="object-cover" />
          ) : null}
        </div>
        <div className="min-w-0">
          <StepHeading id={headingId}>
            <span className="block text-lg leading-6 lg:mt-3 lg:text-[25px] lg:leading-8">{title}</span>
          </StepHeading>
          <p className="mt-1 flex items-center gap-1.5 text-sm leading-5 text-ink-soft lg:mt-2.5 lg:gap-2 lg:text-[15px] lg:leading-6">
            <MapPin size={15} strokeWidth={2} className="shrink-0" />
            {cityName}
          </p>
          <ChangeLink onChange={onChange} className="mt-2 hidden lg:block" />
        </div>
      </div>

      <div className="min-w-0">
        <div className="hidden items-center justify-between gap-3 lg:flex">
          <YourPlan />
          {view.byCity ? null : (
            <span className="rounded-full bg-sun px-2.5 py-[3px] text-xs font-semibold leading-[14px] text-navy">Sample numbers</span>
          )}
        </div>

        {shown.length ? (
          <div className="mt-4 grid grid-cols-2 gap-2.5 lg:mt-[18px] lg:gap-3">
            {shown.map((tile) => (
              <TileBox key={tile.label} tile={tile} />
            ))}
          </div>
        ) : null}

        {now ? (
          figures.months ? (
            <p className="mt-4 inline-flex h-[35px] items-center gap-2.5 rounded-full bg-brand px-4 text-[15px] font-bold text-white lg:mt-[18px] lg:h-[38px] lg:bg-sun lg:text-base lg:text-navy">
              <Key size={17} strokeWidth={2} className="rotate-180" />
              The Car Is Yours In Month {figures.months}
            </p>
          ) : null
        ) : (
          <div className="mt-2.5 lg:mt-3">
            <RentStrip figures={figures} badge={badge}>
              {view.kind === "earn" ? "Keep everything you earn above the rent" : null}
            </RentStrip>
          </div>
        )}

        <div className="mt-4 flex gap-2.5 lg:mt-[18px] lg:gap-3">
          <Link
            href="#apply"
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-sun px-3 text-[15px] font-medium text-navy transition hover:brightness-95 lg:h-[53px] lg:text-[17px] lg:font-bold"
          >
            <Say text={apply} />
          </Link>
          <a
            href={PHONE_HREF}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 border-navy text-[15px] font-medium text-navy transition hover:bg-navy/5 lg:h-[53px] lg:w-[120px] lg:flex-none lg:font-semibold"
          >
            <Phone size={18} strokeWidth={1.75} className="lg:hidden" />
            Call Now
          </a>
        </div>

        <div className="mt-3.5 flex items-center justify-between gap-3 lg:mt-[26px] lg:block">
          <ChangeLink onChange={onChange} className="lg:hidden" />
          {now && figures.upfront ? (
            <p className="text-[13px] leading-4 text-ink-soft lg:text-sm lg:leading-5">
              <Say text={["The upfront is non-refundable.", "Upfront is non-refundable"]} />
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
