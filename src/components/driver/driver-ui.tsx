import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car, Clock, Phone, Wallet, Wrench, type LucideIcon } from "lucide-react";
import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { PHONE_HREF, WHATSAPP_HREF } from "@/components/home/ui";
import { LeadForm } from "@/components/driver/lead-form";
import type { Dictionary } from "@/content/dictionary";
import { cityPath } from "@/lib/city-route";
import { LOCALE_META, LOCALES, localePath, type Locale } from "@/lib/i18n";

/** The content column every band on the driver pages shares, matching the plans and services pages. */
export const wrap = "mx-auto w-full max-w-[1200px]";
/** A band's padding: the rhythm of the plans and services pages. */
export const band = "px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-20";
/** The light blue-grey band and card tint the plan pages use. */
export const tint = "bg-[#f5f8fc]";

/** A centred section heading in the size the home and plan pages use. */
export function SectionHead({ id, title, sub, dark = false }: { id?: string; title: string; sub?: string; dark?: boolean }) {
  return (
    <div className="text-center">
      <h2
        id={id}
        className={`text-[28px] font-bold leading-[36px] tracking-[-0.5px] sm:text-[34px] sm:leading-[42px] lg:text-[43px] lg:leading-[54px] ${
          dark ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {sub ? (
        <p className={`mx-auto mt-3 max-w-[62ch] text-[15px] leading-6 lg:text-lg lg:leading-7 ${dark ? "text-white/85" : "text-ink-soft"}`}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}

/** Every language of the same page, as frosted chips over the hero. */
export function LanguageSwitch({ locale, path, label }: { locale: Locale; path: string; label: string }) {
  return (
    <nav aria-label={label} className="flex flex-wrap items-center gap-1.5 text-[13px] lg:gap-2">
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={localePath(l, path)}
          hrefLang={LOCALE_META[l].htmlLang}
          aria-current={l === locale ? "page" : undefined}
          className={`rounded-full border px-3 py-1 font-semibold leading-5 transition ${
            l === locale
              ? "border-sun bg-sun text-navy"
              : "border-white/30 bg-white/10 text-white backdrop-blur-[2px] hover:border-white hover:bg-white/20"
          }`}
        >
          {LOCALE_META[l].label}
        </Link>
      ))}
    </nav>
  );
}

const pill = "flex h-14 items-center justify-center gap-2.5 rounded-full px-7 text-[17px] font-semibold transition";

/**
 * Apply, call and WhatsApp in one row. Phones show Apply alone: the bar fixed to the bottom of
 * the screen (StickyBar) carries the other two there.
 */
export function HeroActions({ cta }: { cta: Dictionary["cta"] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:flex lg:flex-wrap">
      <a href="#apply" className={`${pill} bg-sun text-navy hover:brightness-95 md:col-span-2 lg:min-w-[220px]`}>
        {cta.apply}
      </a>
      <a href={PHONE_HREF} className={`${pill} hidden border-2 border-white px-4 text-white hover:bg-white/10 md:flex`}>
        <Phone aria-hidden size={20} strokeWidth={1.75} />
        {cta.call}
      </a>
      <a href={WHATSAPP_HREF} className={`${pill} hidden bg-whatsapp px-4 text-white hover:brightness-95 md:flex`}>
        <WhatsappLogo aria-hidden size={22} weight="fill" />
        {cta.whatsapp}
      </a>
    </div>
  );
}

/**
 * Fixed to the bottom on a phone, so the way to reach a person is never scrolled away. The footer
 * makes room for it (data-contact-bar, in the "Drive With Us (batch 9)" block of globals.css).
 */
export function StickyBar({ call, whatsapp }: { call: string; whatsapp: string }) {
  const button = "flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-semibold";
  return (
    <>
      <div
        data-no-reveal
        data-contact-bar
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white/95 p-3 shadow-[0_-8px_24px_rgba(6,47,80,0.1)] backdrop-blur md:hidden"
      >
        <a href={PHONE_HREF} className={`${button} bg-navy text-white`}>
          <Phone aria-hidden size={18} strokeWidth={1.75} />
          {call}
        </a>
        <a href={WHATSAPP_HREF} className={`${button} bg-whatsapp text-white`}>
          <WhatsappLogo aria-hidden size={20} weight="fill" />
          {whatsapp}
        </a>
      </div>
    </>
  );
}

/** One icon per benefit, in the order the dictionary lists them. */
const BENEFIT_ICONS: LucideIcon[] = [Car, Wallet, Wrench, Clock];

/** "Why drivers choose us": the benefit cards of the plan pages, four across on desktop. */
export function Benefits({ heading, items }: { heading: string; items: Dictionary["benefits"] }) {
  return (
    <section aria-labelledby="driver-benefits" className={`${band} ${tint}`}>
      <div className={wrap}>
        <SectionHead id="driver-benefits" title={heading} />
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {items.map((b, i) => {
            const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
            return (
              <li key={b.title} className="rounded-2xl border border-[#dfecf6] bg-white px-4 pb-5 pt-4 lg:rounded-3xl lg:px-6 lg:pb-7 lg:pt-6">
                <span aria-hidden className="grid size-[42px] place-items-center rounded-xl bg-[#eaf3fb] text-brand lg:size-12">
                  <Icon size={22} strokeWidth={1.9} />
                </span>
                <h3 className="mt-4 text-base font-bold leading-[22px] text-navy lg:mt-5 lg:text-xl lg:leading-7">{b.title}</h3>
                <p className="mt-2 text-sm leading-5 text-ink-soft lg:text-[15px] lg:leading-6">{b.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** The city skylines from the home page's cities strip, drawn at half their pixel size. */
const SKYLINES: Record<string, { file: string; w: number; h: number }> = {
  mumbai: { file: "mumbai", w: 291, h: 227 },
  delhi: { file: "delhi", w: 196, h: 237 },
  bengaluru: { file: "bangalore", w: 261, h: 227 },
  hyderabad: { file: "hyderabad", w: 296, h: 241 },
  chennai: { file: "chennai", w: 233, h: 213 },
  pune: { file: "pune", w: 307, h: 217 },
  kolkata: { file: "kolkata", w: 362, h: 199 },
};

export type CityCard = { slug: string; name: string; state: string };

/** City cards: the city's skyline on the brand gradient over its name. */
export function CityCards({ locale, cities, compact = false }: { locale: Locale; cities: CityCard[]; compact?: boolean }) {
  const width = compact
    ? "w-[calc((100%-12px)/2)] sm:w-[calc((100%-32px)/3)] lg:w-[calc((100%-80px)/6)]"
    : "w-[calc((100%-12px)/2)] sm:w-[calc((100%-32px)/3)] lg:w-[calc((100%-72px)/4)]";
  return (
    <ul className={`mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 ${compact ? "" : "lg:mt-12 lg:gap-6"}`}>
      {cities.map((city) => {
        const art = SKYLINES[city.slug];
        return (
          <li key={city.slug} className={width}>
            <Link
              href={localePath(locale, cityPath(city.slug))}
              className="group block overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_24px_rgba(6,47,80,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(6,47,80,0.12)]"
            >
              <span
                aria-hidden
                className={`flex items-end justify-center bg-[linear-gradient(to_bottom_right,#062f50,#006db8)] px-4 pt-4 ${compact ? "h-[96px]" : "h-[112px] lg:h-[150px]"}`}
              >
                {art ? (
                  <Image
                    src={`/figma/home/city-${art.file}.webp`}
                    alt=""
                    width={art.w}
                    height={art.h}
                    style={{ "--w": `${art.w / 2}px` } as CSSProperties}
                    className={`h-auto max-h-full w-[calc(var(--w)*0.62)] object-contain object-bottom opacity-90 transition group-hover:opacity-100 ${
                      compact ? "" : "lg:w-[calc(var(--w)*0.85)]"
                    }`}
                  />
                ) : null}
              </span>
              <span className="flex items-center justify-between gap-2 px-4 py-3 lg:px-5 lg:py-4">
                <span className="min-w-0">
                  <span className={`block truncate font-bold leading-6 text-navy ${compact ? "text-base" : "text-[17px] lg:text-xl"}`}>
                    {city.name}
                  </span>
                  <span className="block truncate text-[13px] leading-5 text-ink-soft">{city.state}</span>
                </span>
                <span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eaf3fb] text-brand transition group-hover:bg-brand group-hover:text-white"
                >
                  <ArrowRight size={16} strokeWidth={2} />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The lead form on navy, as the other pages end with it (StartDriving), in the page's language.
 * It carries the #apply anchor the header's Drive With Us button scrolls to.
 */
export function ApplyBand({
  locale,
  dict,
  cities,
  defaultCity,
  source,
}: {
  locale: Locale;
  dict: Dictionary;
  cities: { slug: string; label: string }[];
  defaultCity?: string;
  source: string;
}) {
  return (
    <section
      id="apply"
      aria-labelledby="apply-title"
      className="scroll-mt-20 overflow-hidden bg-[linear-gradient(to_bottom_right,#062f50,#006db8)] px-4 pb-8 pt-8 sm:bg-[linear-gradient(to_bottom_right,#062f50,#0b3e6c)] sm:px-6 sm:pb-12 sm:pt-12"
    >
      <div className="text-center">
        <p className="mb-3 flex items-center justify-center gap-2.5 text-[13px] font-semibold uppercase leading-4 tracking-[1.3px] text-white">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
          {dict.hub.eyebrow}
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-sun" />
        </p>
        <h2 id="apply-title" className="text-[28px] font-bold leading-[36px] tracking-[-0.5px] text-white sm:text-[34px] sm:leading-tight lg:text-[43px] lg:leading-[52px]">
          {dict.cta.formTitle}
        </h2>
      </div>
      <div className="relative mx-auto mt-5 max-w-[744px] rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:mt-8 sm:rounded-3xl sm:border sm:border-line sm:px-14 sm:pb-8 sm:pt-11">
        <LeadForm copy={{ form: dict.form, cta: dict.cta }} locale={locale} cities={cities} defaultCity={defaultCity} source={source} />
      </div>
    </section>
  );
}

/** A small white pill over the hero, as the plan pages label theirs. */
export function HeroChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-navy bg-white px-3 py-0.5 text-xs font-semibold uppercase leading-[17px] tracking-[0.5px] text-navy lg:px-[18px] lg:py-1 lg:text-[15px] lg:leading-[21px] lg:tracking-[1.5px]">
      {children}
    </span>
  );
}
