import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InstagramLogo, LinkedinLogo } from "@phosphor-icons/react/ssr";
import { BrandLogo } from "@/components/site/brand-logo";
import { siteCopy, type LinkKey } from "@/content/site-copy";
import { COMPANY } from "@/lib/company";
import { DEFAULT_LOCALE, fill, hrefIn, type Locale } from "@/lib/i18n";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "./ui";

// Only routes that exist are linked. A placeholder link wastes crawl budget and fails a visitor.
const columns: { title: "drivers" | "company" | "investors"; links: { key: LinkKey; href: string }[] }[] = [
  {
    title: "drivers",
    links: [
      { key: "ownNow", href: "/own-now" },
      { key: "driveToOwn", href: "/drive-to-own" },
      { key: "driveToEarn", href: "/drive-to-earn" },
      { key: "faq", href: "/faq" },
      { key: "benefits", href: "/our-services" },
    ],
  },
  {
    title: "company",
    links: [
      { key: "about", href: "/about-us" },
      { key: "careers", href: "/careers" },
      { key: "esg", href: "/investors#esg" },
      { key: "dost", href: "/everest-dost" },
    ],
  },
  {
    title: "investors",
    links: [
      { key: "investorHub", href: "/investors" },
      { key: "metrics", href: "/investors#metrics" },
      { key: "leadership", href: "/investors#leadership" },
      { key: "reports", href: "/investors#reports" },
    ],
  },
];

const heading = "text-[11px] font-bold uppercase leading-[17px] tracking-[1.8px] text-sun";
const list = "mt-3 space-y-1.5 text-sm leading-[21px]";
const item = "text-white transition hover:text-sun";
const social =
  "group grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-sun hover:bg-sun hover:text-navy hover:shadow-[0_8px_20px_-8px_rgba(241,214,20,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95";
const socialIcon = "size-[18px] transition-transform duration-300 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110";

export function SiteFooter({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const { links, footer } = siteCopy(locale);
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-[1440px] px-4 pb-6 pt-[29px] md:px-10 lg:pb-[37px] lg:pt-[52px] xl:px-20">
        <div className="grid grid-cols-2 gap-x-4 gap-y-[26px] lg:grid-cols-[1.25fr_1fr_1fr_1fr_1fr] lg:gap-x-6 xl:grid-cols-[328px_250px_250px_250px_1fr] xl:gap-x-0">
          <div className="col-span-2 lg:col-span-1">
            {/* The artwork carries transparent padding; the offset lines the wordmark up with the text. */}
            <BrandLogo href={hrefIn(locale, "/")} tone="light" className="-ml-[7px] w-fit" />
            <p className="-mt-[3px] text-[15px] leading-[23px] lg:-mt-px lg:max-w-[270px] lg:text-sm">
              {fill(footer.blurb, { vehicles: COMPANY.vehicles, cities: COMPANY.cities, founded: COMPANY.founded })}
            </p>
            <div className="mt-4 flex gap-2.5 lg:mt-5">
              <a
                href="https://www.instagram.com/everest_fleet/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.instagram}
                className={social}
              >
                <InstagramLogo aria-hidden className={socialIcon} />
              </a>
              <a
                href="https://www.linkedin.com/company/everest-fleet-pvt-ltd/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.linkedin}
                className={social}
              >
                <LinkedinLogo aria-hidden className={socialIcon} />
              </a>
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="lg:pt-3">
              <h2 className={heading}>{footer[col.title]}</h2>
              <ul className={list}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={hrefIn(locale, l.href)} className={item}>
                      {links[l.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:pt-3">
            <h2 className={heading}>{footer.contact}</h2>
            <ul className={list}>
              <li>
                <a href={PHONE_HREF} className={item}>
                  +91 {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_HREF} className="text-whatsapp transition hover:brightness-110">
                  {links.whatsapp}
                </a>
              </li>
              <li>
                <a href="mailto:hello@everestfleet.com" className={`${item} [overflow-wrap:anywhere]`}>
                  hello@everestfleet.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-[30px] flex flex-col-reverse items-center gap-2 border-t border-white/[0.1] pt-[22px] text-center text-[13px] leading-5 lg:mt-[80px] lg:flex-row lg:justify-between lg:pt-[26px] lg:text-left">
          <p>{fill(footer.rights, { year: new Date().getFullYear() })}</p>
          <Link href="/investors" className="flex items-center gap-1 transition hover:text-sun">
            {links.investorsPartners}
            <ArrowRight size={13} aria-hidden />
          </Link>
        </div>
      </div>
    </footer>
  );
}
