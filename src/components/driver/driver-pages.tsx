import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, FileCheck, Plus } from "lucide-react";
import { DriverHero } from "@/components/driver/driver-hero";
import { StickyBar } from "@/components/driver/sticky-bar";
import {
  ApplyBand,
  CityCards,
  CityLinks,
  HeroActions,
  HeroChip,
  LanguageSwitch,
  SectionHead,
  band,
  tint,
  wrap,
} from "@/components/driver/driver-ui";
import { fill, getDictionary, type Dictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { findCity, planFor, priceIn, rupees, type City, type Plan, type SiteContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { PLAN_PAGES } from "@/lib/plan-pages";

/** The cities as cards, in the page's language. */
function cityCards(content: SiteContent, locale: Locale) {
  return content.cities.map((c) => ({ slug: c.slug, name: c.name[locale], state: c.state }));
}

/** The cities for the form's picker, in the page's language. */
function formCities(content: SiteContent, locale: Locale) {
  return content.cities.map((c) => ({ slug: c.slug, label: c.name[locale] }));
}

/** /drive-with-us/ in every locale. */
export function DriverHub({ locale, content }: { locale: Locale; content: SiteContent }) {
  const dict = getDictionary(locale);

  return (
    <>
      <DriverHero
        photo={content.images["driver-hub-hero"]}
        top={<LanguageSwitch locale={locale} path="/drive-with-us" label={dict.common.languages} />}
        chip={<HeroChip>{dict.hub.eyebrow}</HeroChip>}
        title={dict.hub.title}
        intro={dict.hub.intro}
        actions={<HeroActions cta={dict.cta} />}
      />

      <section aria-labelledby="driver-cities" className={band}>
        <div className={wrap}>
          <SectionHead id="driver-cities" title={dict.hub.pickCity} />
          <CityCards locale={locale} cities={cityCards(content, locale)} />
        </div>
      </section>

      <ApplyBand locale={locale} dict={dict} cities={formCities(content, locale)} source="drive-with-us" />

      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
    </>
  );
}

/** The visible plans a city offers, in the city's order. */
function offeredPlans(content: SiteContent, city: City): Plan[] {
  return city.plans.map((id) => planFor(content, id)).filter((p): p is Plan => Boolean(p?.visible));
}

/** A plan's line on a city page: the dictionary's wording, else the summary set in the admin. */
function planLine(plan: Plan, dict: Dictionary, locale: Locale): string {
  return (dict.plans as Record<string, string | undefined>)[plan.id] ?? plan.summary[locale];
}

/** A plan's figures in one city, blank ones dropped. */
function figuresFor(plan: Plan, city: string, labels: Dictionary["figures"]): [string, string][] {
  const price = priceIn(plan.price, plan.cityPrices, city);
  const rows: [string, string][] = [
    [labels.from, price.amount ? `${rupees(price.amount)}${price.unit}` : ""],
    [labels.deposit, rupees(price.deposit)],
    [labels.upfront, rupees(price.upfront)],
    [labels.term, price.tenureMonths ? fill(labels.months, { n: String(price.tenureMonths) }) : ""],
  ];
  return rows.filter(([, value]) => value);
}

/** The city's name in the sun yellow of the plan heroes, wherever the title's wording puts it. */
function cityTitle(template: string, name: string) {
  const [before, ...rest] = template.split("{city}");
  if (!rest.length) return template;
  return (
    <>
      {before}
      <span className="text-sun">{name}</span>
      {rest.join(name)}
    </>
  );
}

/** One plan as a card that opens the plan's own page: its line and its figures as tiles. */
function PlanCard({ plan, city, locale, dict }: { plan: Plan; city: string; locale: Locale; dict: Dictionary }) {
  const figures = figuresFor(plan, city, dict.figures);
  const page = PLAN_PAGES.find((p) => p.planId === plan.id);
  const body = (
    <>
      <span className="flex items-center justify-between gap-3">
        <h3 className="text-[22px] font-bold leading-7 text-navy lg:text-[26px] lg:leading-8">{plan.name[locale]}</h3>
        {page ? (
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eaf3fb] text-brand transition group-hover:bg-brand group-hover:text-white"
          >
            <ArrowRight size={18} strokeWidth={2} />
          </span>
        ) : null}
      </span>
      <p className="mt-2 text-[15px] leading-6 text-ink-soft">{planLine(plan, dict, locale)}</p>
      {figures.length ? (
        <dl className="mt-auto grid grid-cols-2 gap-2 pt-5 lg:gap-3">
          {figures.map(([label, value]) => (
            <div key={label} className={`rounded-xl border border-[#e8eaed] px-3 pb-2.5 pt-3 lg:rounded-2xl lg:px-4 ${tint}`}>
              <dt className="text-[11px] font-medium uppercase leading-[13px] tracking-[0.6px] text-ink-soft lg:text-xs lg:leading-4">{label}</dt>
              <dd className="mt-1 whitespace-nowrap text-lg font-bold leading-6 text-navy lg:text-[22px] lg:leading-8">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </>
  );
  const card = "flex h-full flex-col rounded-3xl border border-line bg-white p-5 shadow-[0_8px_24px_rgba(6,47,80,0.06)] lg:p-7";
  return (
    <li>
      {page ? (
        <Link
          href={`${page.path}/`}
          className={`group ${card} transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_14px_32px_rgba(6,47,80,0.12)]`}
        >
          {body}
        </Link>
      ) : (
        <div className={card}>{body}</div>
      )}
    </li>
  );
}

/** "Plans in {city}": every visible plan the city offers. */
function Plans({ city, plans, locale, dict }: { city: City; plans: Plan[]; locale: Locale; dict: Dictionary }) {
  return (
    <section aria-labelledby="city-plans" className={band}>
      <div className={wrap}>
        <SectionHead id="city-plans" title={fill(dict.city.plansHeading, { city: city.name[locale] })} />
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} city={city.slug} locale={locale} dict={dict} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A heading for one of two columns, smaller than a band's centred heading. */
const columnHead = "text-2xl font-bold leading-8 tracking-[-0.3px] text-navy lg:text-[30px] lg:leading-[38px]";

/** "What to bring" beside the city's hubs; the documents take the full width when it has none. */
function DocumentsAndHubs({ city, locale, dict }: { city: City; locale: Locale; dict: Dictionary }) {
  const hubs = city.hubs;
  return (
    <section aria-labelledby="city-documents" className={`${band} ${tint}`}>
      <div className={`${wrap} grid gap-10 ${hubs.length ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14" : ""}`}>
        <div>
          <h2 id="city-documents" className={columnHead}>
            {dict.city.documentsHeading}
          </h2>
          <ul className={`mt-4 grid grid-cols-2 gap-2 lg:mt-6 lg:gap-3 ${hubs.length ? "lg:grid-cols-1" : "sm:grid-cols-4"}`}>
            {dict.documents.map((doc) => (
              <li
                key={doc}
                className="flex items-center gap-2.5 rounded-xl border border-[#dfecf6] bg-white px-3 py-3 text-[15px] font-semibold leading-5 text-navy lg:px-4 lg:text-base"
              >
                <FileCheck aria-hidden size={18} strokeWidth={1.9} className="shrink-0 text-brand" />
                {doc}
              </li>
            ))}
          </ul>
        </div>

        {hubs.length ? (
          <div>
            <h2 className={columnHead}>{fill(dict.city.hubsHeading, { city: city.name[locale] })}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:mt-6 lg:gap-3">
              {hubs.map((hub) => (
                <li key={`${hub.name}|${hub.address}`} className="rounded-xl border border-[#dfecf6] bg-white px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold leading-6 text-navy">{hub.name}</h3>
                    {hub.mapUrl ? (
                      <a
                        href={hub.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${dict.city.map}: ${hub.name}`}
                        className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold leading-6 text-brand transition hover:underline"
                      >
                        {dict.city.map}
                        <ArrowUpRight aria-hidden size={15} strokeWidth={2} />
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-sm leading-5 text-ink-soft">{hub.address}</p>
                  {hub.hours ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm leading-5 text-ink-soft">
                      <Clock aria-hidden size={14} strokeWidth={2} className="shrink-0" />
                      {hub.hours}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** The questions as the FAQ page draws them: one card each, opened in place. */
function Faq({ dict }: { dict: Dictionary }) {
  return (
    <section aria-labelledby="city-faq" className={band}>
      <div className="mx-auto max-w-[840px]">
        <SectionHead id="city-faq" title={dict.city.faqHeading} />
        <ul className="mt-8 space-y-3 lg:mt-10">
          {dict.faq.map((item) => (
            <li key={item.q} className="overflow-hidden rounded-2xl border border-line bg-white">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 lg:px-6 lg:py-5 [&::-webkit-details-marker]:hidden">
                  <span className="flex-1 text-base font-semibold leading-6 text-navy lg:text-lg lg:leading-7">{item.q}</span>
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eaf3fb] text-brand transition group-open:rotate-45">
                    <Plus size={16} strokeWidth={2.25} />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-[15px] leading-6 text-ink-soft lg:px-6 lg:text-base lg:leading-7">{item.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** /drive-with-us/driver-job-in-<city>/ in every locale. */
export function CityPage({
  locale,
  slug,
  content,
}: {
  locale: Locale;
  slug: string;
  content: SiteContent;
}) {
  const dict = getDictionary(locale);
  const city = findCity(content, slug);
  if (!city) return null;

  const name = city.name[locale];
  const vars = { city: name };
  const plans = offeredPlans(content, city);

  return (
    <>
      <DriverHero
        photo={city.heroImage}
        top={<LanguageSwitch locale={locale} path={cityPath(slug)} label={dict.common.languages} />}
        chip={
          <Link href={localePath(locale, "/drive-with-us")} className="transition hover:opacity-85">
            <HeroChip>
              <ArrowLeft aria-hidden size={14} strokeWidth={2.25} />
              {dict.hub.eyebrow}
            </HeroChip>
          </Link>
        }
        title={cityTitle(dict.city.title, name)}
        intro={fill(dict.city.intro, vars)}
        figure={city.readyCars > 0 ? { label: fill(dict.city.readyCars, vars), value: String(city.readyCars) } : undefined}
        actions={<HeroActions cta={dict.cta} />}
      />

      {plans.length ? <Plans city={city} plans={plans} locale={locale} dict={dict} /> : null}

      <DocumentsAndHubs city={city} locale={locale} dict={dict} />

      <Faq dict={dict} />

      <CityLinks
        id="city-others"
        label={dict.city.otherCities}
        locale={locale}
        cities={cityCards(content, locale).filter((c) => c.slug !== slug)}
      />

      <ApplyBand locale={locale} dict={dict} cities={formCities(content, locale)} defaultCity={slug} source={`city/${slug}`} />

      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
    </>
  );
}

/** Text for an HTML job description; city names come from the admin. */
const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * JobPosting plus FAQ markup for a city page.
 *
 * The live WordPress city pages carry JobPosting, which is a material reason they rank.
 * Reproducing it here is what stops the migration losing those positions. Salary is omitted
 * entirely rather than guessed, because an unapproved figure is worse than no figure. The
 * description says only what the page itself says: the job, the plans and the documents.
 *
 * Hiring is continuous, so the posting renews each month: it is dated the first of the month
 * and valid to the end of the next, and the page regenerates daily to roll it over. A posting
 * dated "today" on every render reads to Google as a job reposted to stay on top.
 */
export function cityJsonLd({
  locale,
  slug,
  content,
  url,
}: {
  locale: Locale;
  slug: string;
  content: SiteContent;
  url: string;
}) {
  const dict = getDictionary(locale);
  const city = findCity(content, slug);
  if (!city) return null;
  const name = city.name[locale];
  const plans = offeredPlans(content, city);

  const now = new Date();
  const posted = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const validThrough = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0, 23, 59, 59));
  const intro = `<p>${escapeHtml(fill(dict.city.intro, { city: name }))}</p>`;
  const planItems = plans.map((p) => `<li><strong>${escapeHtml(p.name[locale])}</strong>: ${escapeHtml(planLine(p, dict, locale))}</li>`);
  const planList = planItems.length ? `<ul>${planItems.join("")}</ul>` : "";
  const documents = `<p><strong>${escapeHtml(dict.city.documentsHeading)}</strong>: ${dict.documents.map(escapeHtml).join(", ")}</p>`;
  const description = intro + planList + documents;

  const posting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: dict.city.jobTitle,
    description,
    identifier: { "@type": "PropertyValue", name: "Everest Fleet", value: `driver-${city.slug}` },
    datePosted: posted.toISOString().slice(0, 10),
    validThrough: validThrough.toISOString(),
    employmentType: ["FULL_TIME", "CONTRACTOR"],
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: "Everest Fleet",
      sameAs: SITE_URL,
      logo: `${SITE_URL}/figma/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(city.hubs[0]?.address ? { streetAddress: city.hubs[0].address } : {}),
        addressLocality: city.name.en,
        addressRegion: city.state,
        addressCountry: "IN",
      },
    },
    url,
  };

  // Exactly the questions and answers the page shows.
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Drive with us", item: `${SITE_URL}${localePath(locale, "/drive-with-us")}` },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  };

  return [posting, faq, breadcrumb];
}
