import Link from "next/link";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import { LeadForm } from "@/components/driver/lead-form";
import { SiteImage } from "@/components/site/site-image";
import { fill, getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { findCity, planFor, type SiteContent } from "@/lib/content";
import { LOCALE_META, LOCALES, localePath, type Locale } from "@/lib/i18n";

const wrap = "mx-auto w-full max-w-[1120px] px-5";

function LanguageSwitch({ locale, path, label }: { locale: Locale; path: string; label: string }) {
  return (
    <nav aria-label={label} className="flex flex-wrap items-center gap-2 text-[13px]">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={localePath(l, path)}
          hrefLang={LOCALE_META[l].htmlLang}
          aria-current={l === locale ? "page" : undefined}
          className={`rounded-full border px-3 py-1 font-semibold transition ${
            l === locale
              ? "border-sun bg-sun text-navy"
              : "border-white/35 text-white hover:border-white"
          }`}
        >
          {LOCALE_META[l].label}
        </Link>
      ))}
    </nav>
  );
}

function Actions({ apply, call, whatsapp }: { apply: string; call: string; whatsapp: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <a href="#apply" className="flex h-12 items-center rounded-full bg-sun px-7 text-sm font-bold text-navy">
        {apply}
      </a>
      <a href={PHONE_HREF} className="flex h-12 items-center rounded-full bg-navy px-7 text-sm font-bold text-white">
        {call} {PHONE_DISPLAY}
      </a>
      <a href={WHATSAPP_HREF} className="flex h-12 items-center rounded-full bg-whatsapp px-7 text-sm font-bold text-white">
        {whatsapp}
      </a>
    </div>
  );
}

/** Fixed to the bottom on a phone, so the way to reach a person is never scrolled away. */
function StickyBar({ call, whatsapp }: { call: string; whatsapp: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white p-3 shadow-[0_-4px_16px_rgba(6,47,80,0.08)] md:hidden">
      <a href={PHONE_HREF} className="flex h-12 flex-1 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
        {call}
      </a>
      <a href={WHATSAPP_HREF} className="flex h-12 flex-1 items-center justify-center rounded-full bg-whatsapp text-sm font-bold text-white">
        {whatsapp}
      </a>
    </div>
  );
}

function Benefits({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((b) => (
        <li key={b.title} className="rounded-2xl border border-line bg-white p-5">
          <h3 className="text-base font-bold text-navy">{b.title}</h3>
          <p className="mt-1.5 text-sm leading-6 text-ink-soft">{b.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** /drive-with-us/ in every locale. */
export function DriverHub({ locale, content }: { locale: Locale; content: SiteContent }) {
  const dict = getDictionary(locale);
  const cities = content.cities.map((c) => ({ slug: c.slug, label: c.name[locale] }));

  return (
    <>
      <section className="bg-blue-gradient pb-14 pt-10 text-white">
        <div className={`${wrap} grid gap-7`}>
          <LanguageSwitch locale={locale} path="/drive-with-us" label={dict.common.languages} />
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-sun">{dict.hub.eyebrow}</p>
          <h1 className="max-w-[18ch] text-[34px] font-extrabold leading-tight lg:text-[56px]">{dict.hub.title}</h1>
          <p className="max-w-[60ch] text-base leading-7 text-white/85">{dict.hub.intro}</p>
          <Actions apply={dict.cta.apply} call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
        </div>
      </section>

      <section className={`${wrap} py-12`}>
        <h2 className="text-2xl font-bold text-navy">{dict.hub.pickCity}</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.cities.map((city) => (
            <li key={city.slug}>
              <Link
                href={localePath(locale, cityPath(city.slug))}
                className="flex items-center justify-between rounded-2xl border border-line bg-white px-5 py-4 transition hover:border-brand"
              >
                <span className="text-lg font-bold text-navy">{city.name[locale]}</span>
                <span className="text-sm text-ink-soft">{city.state}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-mist py-12">
        <div className={wrap}>
          <Benefits items={dict.benefits} />
        </div>
      </section>

      <section id="apply" className={`${wrap} scroll-mt-6 py-12`}>
        <div className="mx-auto max-w-[520px] rounded-3xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-navy">{dict.cta.formTitle}</h2>
          <div className="mt-5">
            <LeadForm dict={dict} locale={locale} cities={cities} source="drive-with-us" />
          </div>
        </div>
      </section>

      <div className="h-16 md:hidden" />
      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
    </>
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
  const cities = content.cities.map((c) => ({ slug: c.slug, label: c.name[locale] }));
  const plans = city.plans.map((id) => planFor(content, id)).filter((p) => p !== undefined);

  return (
    <>
      <section className="bg-blue-gradient pb-14 pt-10 text-white">
        <div className={`${wrap} grid gap-7`}>
          <LanguageSwitch
            locale={locale}
            path={cityPath(slug)}
            label={dict.common.languages}
          />
          <h1 className="max-w-[20ch] text-[32px] font-extrabold leading-tight lg:text-[52px]">
            {fill(dict.city.title, vars)}
          </h1>
          <p className="max-w-[60ch] text-base leading-7 text-white/85">{fill(dict.city.intro, vars)}</p>
          {city.readyCars > 0 ? (
            <p className="text-lg font-bold text-sun">
              {city.readyCars} · {fill(dict.city.readyCars, vars)}
            </p>
          ) : null}
          <Actions apply={dict.cta.apply} call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
        </div>
      </section>

      <section className={`${wrap} py-12`}>
        <div className="relative aspect-[16/6] overflow-hidden rounded-3xl">
          <SiteImage slot={city.heroImage} sizes="(max-width: 1120px) 100vw, 1120px" priority />
        </div>
      </section>

      <section className={`${wrap} pb-12`}>
        <Benefits items={dict.benefits} />
      </section>

      <section className="bg-mist py-12">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_420px]`}>
          <div className="grid gap-10">
            <div>
              <h2 className="text-2xl font-bold text-navy">{fill(dict.city.plansHeading, vars)}</h2>
              <ul className="mt-5 grid gap-3">
                {plans.map((plan) => (
                  <li key={plan.id} className="rounded-2xl border border-line bg-white p-5">
                    <h3 className="text-lg font-bold text-navy">{plan.name[locale]}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-ink-soft">{plan.summary[locale]}</p>
                    {plan.upfront || plan.perDay || plan.months ? (
                      <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm text-navy">
                        {plan.upfront ? <div><dt className="inline text-ink-soft">Upfront </dt><dd className="inline font-bold">{plan.upfront}</dd></div> : null}
                        {plan.perDay ? <div><dt className="inline text-ink-soft">Per day </dt><dd className="inline font-bold">{plan.perDay}</dd></div> : null}
                        {plan.months ? <div><dt className="inline text-ink-soft">Term </dt><dd className="inline font-bold">{plan.months}</dd></div> : null}
                      </dl>
                    ) : (
                      <p className="mt-3 inline-block rounded-full bg-sun/25 px-3 py-1 text-xs font-semibold text-navy">
                        {dict.common.pending}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-soft">{dict.city.earningsNote}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-navy">{dict.city.documentsHeading}</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {dict.documents.map((doc) => (
                  <li key={doc} className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 text-sm text-navy">
                    <span aria-hidden className="size-2 rounded-full bg-sun" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {city.hubs.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-navy">{fill(dict.city.hubsHeading, vars)}</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {city.hubs.map((hub) => (
                    <li key={hub.name} className="rounded-2xl bg-white p-5">
                      <h3 className="text-base font-bold text-navy">{hub.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-ink-soft">{hub.address}</p>
                      <p className="mt-1 text-sm text-ink-soft">{hub.hours}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div id="apply" className="scroll-mt-6">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-navy">{dict.cta.formTitle}</h2>
              <div className="mt-5">
                <LeadForm dict={dict} locale={locale} cities={cities} defaultCity={slug} source={`city:${slug}`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${wrap} py-12`}>
        <h2 className="text-2xl font-bold text-navy">{dict.city.faqHeading}</h2>
        <dl className="mt-5 grid gap-3">
          {dict.faq.map((item) => (
            <div key={item.q} className="rounded-2xl border border-line bg-white p-5">
              <dt className="text-base font-bold text-navy">{item.q}</dt>
              <dd className="mt-1.5 text-sm leading-6 text-ink-soft">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${wrap} pb-16`}>
        <h2 className="text-lg font-bold text-navy">{dict.city.otherCities}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {content.cities
            .filter((c) => c.slug !== slug)
            .map((c) => (
              <li key={c.slug}>
                <Link
                  href={localePath(locale, cityPath(c.slug))}
                  className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:border-brand"
                >
                  {c.name[locale]}
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <div className="h-16 md:hidden" />
      <StickyBar call={dict.cta.call} whatsapp={dict.cta.whatsapp} />
    </>
  );
}

/**
 * JobPosting plus FAQ markup for a city page.
 *
 * The live WordPress city pages carry JobPosting, which is a material reason they rank.
 * Reproducing it here is what stops the migration losing those positions. Salary is omitted
 * entirely rather than guessed, because an unapproved figure is worse than no figure.
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

  const posting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: fill(dict.city.title, { city: name }),
    description: fill(dict.city.intro, { city: name }),
    datePosted: new Date().toISOString().slice(0, 10),
    employmentType: "CONTRACTOR",
    directApply: true,
    hiringOrganization: { "@type": "Organization", name: "Everest Fleet", sameAs: "https://everestfleet.com" },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: city.name.en,
        addressRegion: city.state,
        addressCountry: "IN",
      },
    },
    applicantLocationRequirements: { "@type": "Country", name: "India" },
    url,
  };

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
