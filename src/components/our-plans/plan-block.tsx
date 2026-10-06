import Link from "next/link";
import { SiteImage } from "@/components/site/site-image";
import type { PlanOverviewView } from "@/lib/plan-view";

const panel = "bg-[#f7f9fc]";
const panelLg = "lg:bg-[#f7f9fc]";
// Phones frame panels and figure cards with a hairline; desktop panels are borderless.
const hairline = "border border-[#e8eaed] lg:border-0";

/**
 * One plan on the Our Plans page: name and figures, how it works, what drivers get, and the way in.
 * Phones get a centred heading under a small label, and one button in place of the desktop strip.
 */
export function PlanBlock({ plan }: { plan: PlanOverviewView }) {
  const photoPlan = plan.steps.length === 0;
  return (
    <article aria-labelledby={`plan-${plan.id}`} className="mx-auto max-w-[1200px] px-4 pb-[18px] pt-6 sm:px-6 lg:max-w-[1176px] lg:p-0">
      <Head plan={plan} />
      {photoPlan ? <Showcase plan={plan} /> : <Steps plan={plan} />}
      <Apply plan={plan} />
    </article>
  );
}

function Head({ plan }: { plan: PlanOverviewView }) {
  const title = plan.name;
  // Phones label each plan: its note ("Leasing Plan") or else its first tag ("Ownership plan").
  const eyebrow = plan.note || plan.tags[0]?.full;
  return (
    <header className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
        {/* Repeats the note or the first tag, so it stays out of the accessibility tree. */}
        {eyebrow && (
          <p
            aria-hidden
            className="mb-[11px] flex items-center justify-center gap-2.5 text-[13px] font-semibold uppercase leading-4 tracking-[1px] text-brand lg:hidden"
          >
            <span className="h-[3px] w-4 rounded-full bg-sun" />
            {eyebrow}
          </p>
        )}
        <div className="flex flex-col items-center gap-y-3 text-center lg:flex-row lg:flex-wrap lg:items-baseline lg:gap-x-2.5 lg:gap-y-1 lg:text-left">
          <h2
            id={`plan-${plan.id}`}
            className="text-[28px] font-bold leading-[34px] tracking-[-0.3px] text-navy lg:text-[44px] lg:font-extrabold lg:leading-[52px] lg:tracking-[-0.5px]"
          >
            {plan.href ? (
              <Link href={plan.href} className="transition hover:text-brand">
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          {plan.note && <p className="hidden text-[13px] leading-5 text-gray-900 lg:block">({plan.note})</p>}
        </div>
        {plan.tags.length > 0 && (
          <ul className="mt-[22px] flex flex-wrap gap-x-2 gap-y-[7px] lg:mt-3 lg:gap-2">
            {plan.tags.map((tag, i) => (
              <li
                key={i}
                className="rounded-full bg-sun px-3 py-[5px] text-xs font-medium uppercase leading-[13px] tracking-[0.5px] text-navy lg:py-1 lg:text-[11px] lg:font-bold lg:leading-4"
              >
                <span className="lg:hidden">{tag.short}</span>
                <span className="hidden lg:inline">{tag.full}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {plan.figures.length > 0 && (
        <dl className="grid grid-cols-3 gap-2 lg:flex lg:flex-wrap lg:gap-3 xl:shrink-0 xl:flex-nowrap">
          {plan.figures.map((f, i) => (
            <div
              key={i}
              className={`min-w-0 rounded-xl px-3 pb-[9px] pt-[13px] lg:flex-auto lg:rounded-2xl lg:px-4 lg:pb-2.5 lg:pt-4 xl:flex-none ${hairline} ${panel}`}
            >
              <dt className="text-[11px] font-medium uppercase leading-[13px] tracking-[0.6px] text-ink-soft lg:text-xs lg:leading-4">{f.label}</dt>
              <dd className="mt-[3px] flex flex-wrap items-baseline gap-x-1.5 text-navy lg:mt-1 lg:gap-x-1.5">
                <span className="whitespace-nowrap text-[17px] font-bold leading-6 lg:text-[28px] lg:leading-9">
                  <span className="lg:hidden">{f.short}</span>
                  <span className="hidden lg:inline">{f.value}</span>
                </span>
                {f.suffix && <span className="text-[13px] text-ink-soft lg:text-xs">{f.suffix}</span>}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}

/** Numbered photo cards; stacked on phones, three across from tablets up. */
function Steps({ plan }: { plan: PlanOverviewView }) {
  return (
    <ol role="list" aria-label={`${plan.name} steps`} className="mt-6 flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-[26px] lg:mt-14">
      {plan.steps.map((step, i) => (
        <li
          key={i}
          className="overflow-hidden rounded-2xl border border-[#e0e0e2] bg-white md:border-line md:shadow-[0_8px_24px_rgba(6,47,80,0.06)]"
        >
          <div className="relative aspect-[380/140] md:aspect-[382/190]">
            <SiteImage slot={step.image} sizes="(min-width: 768px) 33vw, 100vw" />
          </div>
          <div className="p-4 md:px-5 md:pb-6 md:pt-5 lg:px-6 lg:pt-[26px]">
            <h3 className="flex items-start gap-3 text-base font-bold leading-6 text-navy md:text-[17px] lg:text-lg">
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center rounded-full bg-navy text-xs font-semibold text-white md:size-7 md:text-sm"
              >
                {i + 1}
              </span>
              <span className="md:pt-0.5">{step.title}</span>
            </h3>
            {step.body && <p className="mt-2 text-sm leading-[18px] text-ink-soft md:mt-3 md:leading-[22px]">{step.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** The plan's photo beside a light panel of what it includes; on phones the list sits under the photo, unboxed. */
function Showcase({ plan }: { plan: PlanOverviewView }) {
  const photo = Boolean(plan.image.url);
  if (!photo && plan.points.length === 0) return null;
  return (
    <div className="mt-6 grid gap-[25px] lg:mt-12 lg:grid-cols-[minmax(0,560px)_minmax(0,568px)] lg:gap-12">
      {photo && (
        <div className="relative aspect-[380/180] overflow-hidden rounded-2xl lg:aspect-[560/340] lg:rounded-3xl">
          <SiteImage slot={plan.image} sizes="(min-width: 1024px) 560px, 100vw" />
        </div>
      )}
      {plan.points.length > 0 && (
        <ul
          className={`flex flex-col gap-3 px-1.5 lg:justify-center lg:rounded-3xl lg:px-8 lg:py-10 ${panelLg}`}
        >
          {plan.points.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-3.5 text-[15px] leading-5 text-black lg:gap-3 lg:text-xl lg:leading-[30px] lg:text-gray-900 xl:text-2xl xl:leading-[34px]"
            >
              <span aria-hidden className="mt-1.5 size-[7px] shrink-0 rounded-full bg-sun lg:mt-3 lg:size-2 xl:mt-[15px]" />
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Desktop: "Why drivers pick …" on a light strip over a yellow bar with the Get Started link.
 * Phones: the Apply Now button alone.
 */
function Apply({ plan }: { plan: PlanOverviewView }) {
  return (
    <>
      <a
        href="#apply"
        aria-label={`Apply for ${plan.name}`}
        className="mx-[7px] mt-[26px] flex h-12 items-center justify-center rounded-full bg-brand text-base font-medium text-white transition hover:brightness-110 lg:hidden"
      >
        Apply Now
      </a>
      <div className="mt-12 hidden overflow-hidden rounded-3xl lg:block">
        {plan.highlights.length > 0 && (
          <div className={`px-10 pb-[30px] pt-[34px] ${panelLg}`}>
            <h3 className="text-xs font-bold uppercase leading-4 tracking-[2px] text-brand">{plan.highlightsTitle}</h3>
            <ul className="mt-[22px] grid grid-cols-4">
              {plan.highlights.map((item, i) => (
                <li
                  key={item}
                  className={`text-xl font-semibold leading-7 text-navy xl:text-[22px] xl:leading-8 ${i > 0 ? "border-l border-line pl-7" : ""}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex items-center justify-between gap-4 bg-sun px-10 py-[22px]">
          <p className="text-lg font-semibold leading-6 text-navy">Ready to start? Most drivers finish the form in under 2 minutes.</p>
          <a
            href="#apply"
            aria-label={`Get started with ${plan.name}`}
            className="flex h-14 w-[350px] shrink-0 items-center justify-center rounded-full border-2 border-brand text-2xl font-semibold text-brand transition hover:bg-white/30"
          >
            Get Started
          </a>
        </div>
      </div>
    </>
  );
}
