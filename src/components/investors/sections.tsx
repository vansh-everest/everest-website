import type { CSSProperties } from "react";
import { Leaf, ShieldCheck, Users } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { ESG_REPORT_URL, HIGHLIGHTS, IMPACT, MARKET, MILESTONES, STEPS, type ImpactCard } from "./data";
import { Heading, Kicker, Label } from "./ui";

const wrap = "mx-auto w-full max-w-[1104px]";

export function Opportunity() {
  const market = MARKET.filter((m) => m.value);
  return (
    <section className="bg-[#f2f5fd] px-4 pb-[46px] pt-[47px] sm:px-6 lg:py-[99px]">
      <div className={`${wrap} grid gap-8 lg:items-end ${market.length ? "lg:grid-cols-[1fr_620px] lg:items-start" : "lg:grid-cols-2 lg:gap-16"}`}>
        <div className="lg:max-w-[440px]">
          <Kicker align="responsive">The opportunity</Kicker>
          <Heading align="responsive" className="mt-3 lg:mt-[22px]">
            <span className="block lg:inline">Drivers Want To Earn. </span>
            <span className="block lg:inline">Most Can&rsquo;t Buy The Car.</span>
          </Heading>
          {market.length ? <Pitch className="mt-3 lg:mt-[22px]" /> : null}
        </div>
        {market.length ? (
          <ul className="grid grid-cols-2 gap-3 lg:gap-x-8 lg:gap-y-[22px]">
            {market.map((m) => (
              <li key={m.label} className="rounded-2xl border border-line bg-white p-4 lg:px-[23px] lg:py-[22px]">
                <p className="text-xl font-bold text-navy lg:text-[34px] lg:leading-10">{m.value}</p>
                <p className="mt-1 text-[13px] leading-[18px] text-ink-soft lg:mt-2 lg:text-base">{m.label}</p>
              </li>
            ))}
          </ul>
        ) : (
          <Pitch className="-mt-5 lg:mt-0 lg:pb-1.5" />
        )}
      </div>
    </section>
  );
}

function Pitch({ className = "" }: { className?: string }) {
  return (
    <p className={`text-center text-[15px] leading-[21px] text-ink-soft lg:text-left lg:text-lg lg:leading-[26px] ${className}`}>
      Platforms need reliable supply. Drivers need a car and a fair start. Everest sits in between.
    </p>
  );
}

export function BusinessModel() {
  return (
    <section className="bg-white px-4 pb-12 pt-[50px] sm:px-6 lg:pb-[81px] lg:pt-[92px]">
      <div className={wrap}>
        <Kicker>Business model</Kicker>
        <Heading className="mt-3 lg:mt-3">
          <span className="block sm:inline">One Fleet, </span>Many Ways To Earn
        </Heading>
        <ol className="mt-[34px] grid gap-5 lg:mt-[50px] lg:grid-cols-4 lg:gap-14">
          {STEPS.map((s, i) => {
            const last = i === STEPS.length - 1;
            return (
              <li
                key={s.title}
                className="relative flex gap-4 rounded-xl border border-line bg-mist px-4 py-[18px] lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:[&:not(:first-child)]:before:absolute lg:[&:not(:first-child)]:before:-left-7 lg:[&:not(:first-child)]:before:inset-y-0 lg:[&:not(:first-child)]:before:w-px lg:[&:not(:first-child)]:before:bg-line"
              >
                <span
                  className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-[15px] font-bold lg:mt-0 lg:size-[46px] lg:text-[17px] ${
                    last ? "bg-sun text-navy" : "bg-[#e8f2fa] text-brand"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[17px] font-bold leading-6 text-navy lg:mt-3 lg:text-[21px] lg:leading-7">{s.title}</h3>
                  <p className="mt-0.5 text-sm leading-[19px] text-ink-soft lg:mt-3 lg:text-[15px] lg:leading-[21px]">{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** The growth band and the highlights card under it. */
export function Growth() {
  const highlights = HIGHLIGHTS.filter((h) => h.value);
  return (
    <section id="metrics" className="scroll-mt-28">
      <div className="bg-navy px-4 pb-[34px] pt-[37px] sm:px-6 lg:pb-[50px] lg:pt-[51px]">
        <div className={wrap}>
          <Kicker tone="sun" align="responsive" className="hidden lg:block">
            Growth
          </Kicker>
          <Heading tone="white" size="lg" className="lg:mt-2">
            <span className="block sm:inline">From 10 Cars In {COMPANY.founded} </span>
            <span className="block sm:inline">To {COMPANY.vehicles} Today</span>
          </Heading>
        </div>
      </div>
      <div className="bg-white px-4 pb-10 pt-6 sm:px-6 lg:bg-paper lg:pb-20 lg:pt-16">
        <div className={`${wrap} rounded-[20px] border border-line bg-white px-5 pb-6 pt-7 lg:px-[29px] lg:pb-[30px] lg:pt-[30px]`}>
          {highlights.length ? (
            <>
              <Label>Financial highlights</Label>
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 border-b border-line pb-6 lg:mt-8 lg:grid-cols-3 lg:pb-8">
                {highlights.map((h) => (
                  <div key={h.label} className="flex flex-col-reverse">
                    <dt className="text-sm leading-5 text-ink-soft lg:text-base">{h.label}</dt>
                    <dd className="text-[22px] font-bold leading-8 text-brand lg:text-[40px] lg:leading-[48px]">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}
          <Label className={highlights.length ? "mt-6 lg:mt-10" : ""}>Milestones</Label>
          <ol
            className="mt-4 grid gap-[14px] lg:mt-[22px] lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-0"
            style={{ "--n": MILESTONES.length } as CSSProperties}
          >
            {MILESTONES.map((m, i) => (
              <li key={m.year} className="flex items-baseline gap-3 lg:block">
                <div className="flex items-center self-center lg:self-auto">
                  <span aria-hidden className={`size-2.5 shrink-0 rounded-full lg:size-3 ${m.current ? "bg-sun" : "bg-brand"}`} />
                  {i < MILESTONES.length - 1 ? (
                    <span aria-hidden className="ml-2 mr-[26px] hidden h-0.5 flex-1 bg-[#d7e4f2] lg:block" />
                  ) : null}
                </div>
                <p className="w-[44px] shrink-0 text-[17px] font-bold leading-6 text-navy lg:mt-3 lg:w-auto lg:text-xl lg:leading-7">{m.year}</p>
                <p className="text-sm leading-5 text-ink-soft lg:mt-1.5 lg:max-w-[118px] lg:text-[15px]">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const ICONS = { leaf: Leaf, users: Users, shield: ShieldCheck };

export function Impact() {
  const cards = IMPACT.map((c) => ({ ...c, points: c.points.filter((p) => p.value !== null) })).filter((c) => c.points.length);
  return (
    <section id="esg" className="scroll-mt-28 bg-[#f0f4f8] px-4 pb-12 pt-[50px] sm:px-6 lg:pb-[97px] lg:pt-[96px]">
      <div className={wrap}>
        <Kicker>Impact</Kicker>
        <Heading className="mt-3 lg:mt-3">Impact You Can Measure</Heading>
        <p className="mt-2 text-center text-[15px] leading-[22px] text-ink-soft lg:mt-2 lg:text-lg lg:leading-7">
          From our ESG report, FY 2024-25.
        </p>
        <ul className="mt-6 grid gap-4 lg:mt-[46px] lg:flex lg:justify-center lg:gap-[25px]">
          {cards.map((c) => (
            <ImpactTile key={c.title} card={c} />
          ))}
        </ul>
        {ESG_REPORT_URL ? (
          <a
            href={ESG_REPORT_URL}
            className="mx-auto mt-6 flex h-14 w-full items-center justify-center rounded-full bg-sun px-8 text-[17px] font-medium tracking-[0.2px] text-navy transition hover:brightness-95 lg:mt-[49px] lg:w-[272px] lg:text-xl"
          >
            Download the ESG report
          </a>
        ) : null}
      </div>
    </section>
  );
}

function ImpactTile({ card }: { card: ImpactCard }) {
  const Icon = ICONS[card.icon];
  return (
    <li className="rounded-2xl border border-line bg-white px-5 pb-5 pt-[18px] lg:w-[351px] lg:rounded-[20px] lg:px-[30px] lg:pb-[30px] lg:pt-8">
      <div className="flex items-center gap-2.5 lg:block">
        <span className="grid size-7 place-items-center rounded-lg bg-[#e8f2fa] text-brand lg:size-[50px] lg:rounded-xl">
          <Icon aria-hidden className="size-4 lg:size-6" strokeWidth={1.75} />
        </span>
        <h3 className="text-[17px] font-bold leading-6 text-navy lg:mt-[25px] lg:text-[26px] lg:leading-8">{card.title}</h3>
      </div>
      <ul className="mt-2.5 space-y-0.5 lg:mt-[22px] lg:space-y-[14px]">
        {card.points.map((p) => (
          <li key={p.label} className="flex items-baseline gap-2.5 text-sm leading-5 text-ink-soft lg:gap-3 lg:text-base lg:leading-[22px] lg:text-navy/80">
            <span aria-hidden className="size-1 shrink-0 -translate-y-0.5 rounded-full bg-ink-soft lg:size-1.5 lg:bg-sun" />
            {p.value ? `${p.value} ${p.label}` : p.label}
          </li>
        ))}
      </ul>
    </li>
  );
}
