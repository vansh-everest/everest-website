import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "./ui";

// Only routes that exist are linked. A placeholder link wastes crawl budget and fails a visitor.
const columns = [
  {
    title: "Drivers",
    links: [
      { label: "Own Now", href: "/own-now" },
      { label: "Drive to Own", href: "/drive-to-own" },
      { label: "Drive to Earn", href: "/drive-to-earn" },
      { label: "Driver FAQs", href: "/faq" },
      { label: "Benefits", href: "/our-services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Careers", href: "/careers" },
      { label: "ESG Report", href: "/investors#esg" },
      { label: "Everest Dost", href: "/everest-dost" },
    ],
  },
  {
    title: "Investors",
    links: [
      { label: "Investor Hub", href: "/investors" },
      { label: "Metrics & Impact", href: "/investors#metrics" },
      { label: "Leadership", href: "/investors#leadership" },
      { label: "Reports & Downloads", href: "/investors#reports" },
    ],
  },
];

const heading = "text-[11px] font-bold uppercase leading-[17px] tracking-[1.8px] text-sun";
const list = "mt-3 space-y-1.5 text-sm leading-[21px]";
const item = "text-white transition hover:text-sun";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-[1440px] px-4 pb-6 pt-[29px] md:px-10 lg:pb-[37px] lg:pt-[52px] xl:px-20">
        <div className="grid grid-cols-2 gap-x-4 gap-y-[26px] lg:grid-cols-[1.25fr_1fr_1fr_1fr_1fr] lg:gap-x-6 xl:grid-cols-[328px_250px_250px_250px_1fr] xl:gap-x-0">
          <div className="col-span-2 lg:col-span-1">
            {/* The artwork carries transparent padding; the offset lines the wordmark up with the text. */}
            <Link href="/" className="-ml-[7px] block w-fit">
              <Image src="/figma/logo-white.png" alt="Everest Fleet" width={98} height={56} className="h-14 w-[98px]" />
            </Link>
            <p className="-mt-[3px] text-[15px] leading-[23px] lg:-mt-px lg:max-w-[270px] lg:text-sm">
              India&apos;s Largest Fleet Management Company. {COMPANY.vehicles} vehicles. {COMPANY.cities} cities.
              Powering driver earnings and investor returns since {COMPANY.founded}.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="lg:pt-3">
              <h2 className={heading}>{col.title}</h2>
              <ul className={list}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={item}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:pt-3">
            <h2 className={heading}>Contact</h2>
            <ul className={list}>
              <li>
                <a href={PHONE_HREF} className={item}>
                  +91 {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_HREF} className="text-whatsapp transition hover:brightness-110">
                  WhatsApp Us
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
          <p>© {new Date().getFullYear()} Everest Fleet Pvt Ltd. All rights reserved.</p>
          <Link href="/investors" className="flex items-center gap-1 transition hover:text-sun">
            For Investors &amp; Partners
            <ArrowRight size={13} aria-hidden />
          </Link>
        </div>
      </div>
    </footer>
  );
}
