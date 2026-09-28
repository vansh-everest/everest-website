import Link from "next/link";
import { SiteImage } from "@/components/site/site-image";
import type { PlanOverviewView } from "@/lib/plan-view";

const panel = "bg-[#f7f9fc]";
const panelLg = "lg:bg-[#f7f9fc]";
// Phones frame panels and figure cards with a hairline; desktop panels are borderless.
const hairline = "border border-[#e8eaed] lg:border-0";

/**
 * One plan on the Our Plans page: name and figures, how it works, what drivers get, and the way in.
 * Phones get a full-width band per plan (`shade` tints every other one) and a centred heading.
 */
export function PlanBlock({ plan, shade = false }: { plan: PlanOverviewView; shade?: boolean }) {
  const photoPlan = plan.steps.length === 0;
  return (
    <div className={shade ? `${panel} lg:bg-transparent` : undefined}>
      <article aria-labelledby={`plan-${plan.id}`} className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:p-0">
        <Head plan={plan} />
        {photoPlan ? <Showcase plan={plan} /> : <Steps plan={plan} />}
        <Apply plan={plan} dash={photoPlan} />
      </article>
    </div>
  );
}

function Head({ plan }: { plan: PlanOverviewView }) {
  const title = `${plan.name} Plan`;
  const eyebrow = plan.tags[0];
  return (
    <header className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
        {/* Repeats the first tag, so it stays out of the accessibility tree. */}
        {eyebrow && (
          <p
            aria-hidden
            className="mb-[11px] flex items-center justify-center gap-2 text-[13px] font-semibold uppercase leading-4 tracking-[0.5px] text-brand lg:hidden"
          >
            <span className="h-[3px] w-4 bg-sun" />
            {eyebrow}
          </p>
        )}
        <div className="flex flex-col items-center gap-y-3 text-center lg:flex-row lg:flex-wrap lg:items-baseline lg:gap-x-2.5 lg:gap-y-1 lg:text-left">
          <h2
            id={`plan-${plan.id}`}
            className="text-[28px] font-bold leading-[34px] tracking-[-0.3px] text-navy lg:text-5xl lg:font-extrabold lg:leading-[58px] lg:tracking-[-0.5px]"
          >
            {plan.href ? (
              <Link href={plan.href} className="transition hover:text-brand">
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          {plan.note && <p className="text-sm leading-5 text-ink-soft lg:text-[13px] lg:text-gray-900">({plan.note})</p>}
        </div>
        {plan.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2 lg:mt-2">
            {plan.tags.map((tag, i) => (
              <li
                key={i}
                className="rounded-full bg-sun px-3 py-1 text-[11px] font-medium uppercase leading-[13px] tracking-[0.5px] text-navy lg:font-bold lg:leading-4"
              >
                {tag}
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
              className={`min-w-0 rounded-xl px-3 py-3 lg:flex-auto lg:rounded-2xl lg:px-4 lg:pb-2.5 lg:pt-4 xl:flex-none ${hairline} ${panel}`}
            >
              <dt className="text-[11px] font-medium uppercase leading-4 tracking-[0.6px] text-ink-soft lg:text-[13px]">{f.label}</dt>
              <dd className="mt-1 flex flex-wrap items-baseline gap-x-1 text-navy lg:gap-x-0">
                <span className="whitespace-nowrap text-xl font-bold leading-6 lg:text-[30px] lg:leading-9">{f.value}</span>
                {f.suffix && <span className="text-xs text-ink-soft lg:text-sm">{f.suffix}</span>}
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
    <div className="mt-6 grid gap-6 lg:mt-14 lg:grid-cols-[minmax(0,560px)_minmax(0,568px)] lg:gap-12">
      {photo && (
        <div className="relative aspect-[380/180] overflow-hidden rounded-2xl lg:aspect-[560/340] lg:rounded-3xl">
          <SiteImage slot={plan.image} sizes="(min-width: 1024px) 560px, 100vw" />
        </div>
      )}
      {plan.points.length > 0 && (
        <ul
          className={`flex flex-col gap-2.5 px-1 lg:justify-center lg:gap-[27px] lg:rounded-3xl lg:px-8 lg:py-10 ${panelLg}`}
        >
          {plan.points.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-3.5 text-[15px] leading-[22px] text-black lg:gap-3 lg:text-gray-900 lg:text-xl lg:leading-7 xl:text-2xl"
            >
              <span aria-hidden className="mt-[7px] size-2 shrink-0 rounded-full bg-sun lg:mt-2.5" />
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * "Why drivers pick …" and the Get Started link. Desktop: a light strip over a yellow bar.
 * Phones: one bordered panel, the list on the left and the link on the right; the two wrappers
 * turn into `display: contents` so their children join the panel's grid.
 */
function Apply({ plan, dash }: { plan: PlanOverviewView; dash: boolean }) {
  const list = plan.highlights.length > 0;
  const side = list ? "col-start-2" : "";
  return (
    <div
      className={`mt-6 grid gap-x-4 rounded-2xl px-4 pb-4 pt-3.5 lg:mt-14 lg:block lg:overflow-hidden lg:rounded-3xl lg:bg-transparent lg:p-0 ${
        list ? "grid-cols-[minmax(0,1fr)_166px]" : "grid-cols-1"
      } ${hairline} ${panel}`}
    >
      {list && (
        <div className={`contents lg:block lg:px-10 lg:pb-[30px] lg:pt-10 ${panelLg}`}>
          <h3 className="col-span-2 text-xs font-bold uppercase leading-4 tracking-[0.5px] text-brand lg:tracking-[2px]">
            {plan.highlightsTitle}
          </h3>
          <ul className="row-span-2 mt-[15px] flex flex-col lg:mt-5 lg:grid lg:grid-cols-4">
            {plan.highlights.map((item, i) => (
              <li
                key={item}
                className={`flex items-start gap-2 text-[13px] font-semibold leading-[23px] text-navy lg:block lg:text-xl lg:leading-7 xl:text-2xl xl:leading-8 ${
                  i > 0 ? "lg:border-l lg:border-line lg:pl-7" : ""
                }`}
              >
                <span
                  aria-hidden
                  className={`shrink-0 lg:hidden ${dash ? "mt-[11px] h-0.5 w-3 bg-navy" : "mt-2 size-1.5 rounded-full bg-sun"}`}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="contents lg:flex lg:items-center lg:justify-between lg:gap-4 lg:bg-sun lg:px-10 lg:py-[22px]">
        <p className={`mt-2.5 self-start text-xs leading-[15px] text-ink-soft lg:mt-0 lg:self-auto lg:text-lg lg:font-semibold lg:leading-6 lg:text-navy ${side}`}>
          Apply for {plan.name}
        </p>
        <a
          href="#apply"
          aria-label={`Get started with ${plan.name}`}
          className={`mt-2 flex h-12 w-full items-center justify-center self-end rounded-full border-2 border-brand text-base font-medium text-brand transition hover:bg-white/30 lg:mt-0 lg:self-auto lg:h-14 lg:w-[350px] lg:text-2xl lg:font-semibold ${side}`}
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
