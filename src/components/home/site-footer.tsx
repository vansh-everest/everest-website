import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COMPANY_BLURB } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "./ui";

const CITIES: [slug: string, name: string][] = [
  ["mumbai", "Mumbai"],
  ["delhi", "Delhi NCR"],
  ["bengaluru", "Bengaluru"],
  ["hyderabad", "Hyderabad"],
  ["pune", "Pune"],
  ["kolkata", "Kolkata"],
  ["chennai", "Chennai"],
];

// Only routes that exist are linked. A placeholder link wastes crawl budget and fails a visitor.
const columns = [
  {
    title: "Drivers",
    links: [
      { label: "Drive to Own", href: "/drive-to-own" },
      { label: "Drive to Earn", href: "/drive-to-earn" },
      { label: "Revenue Share", href: "/revenue-share" },
      { label: "Driver FAQs", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Everest Dost", href: "/#dost" },
      { label: "Blog", href: "/blog" },
      { label: "For Investors", href: "/investors" },
    ],
  },
  {
    title: "Cities",
    links: CITIES.map(([slug, name]) => ({ label: name, href: cityPath(slug) })),
  },
];

const heading = "text-[11px] font-bold uppercase leading-[17px] tracking-[1.8px] text-sun";
const list = "mt-4 space-y-2.5 text-sm leading-[21px]";
const item = "text-white transition hover:text-sun";
const emoji = "text-[11px] leading-none";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-[1232px] px-6 pb-12 pt-3">
        {/* The artwork carries transparent padding; the offset lines the wordmark up with the text. */}
        <Image
          src="/figma/logo-white.png"
          alt="Everest Fleet"
          width={205}
          height={118}
          className="-ml-[21px] h-[118px] w-[205px]"
        />
        <div className="grid gap-10 sm:grid-cols-2 lg:-mt-0.5 lg:grid-cols-[1.3fr_repeat(3,1fr)_1.2fr] lg:gap-x-8 xl:grid-cols-[270px_repeat(4,180px)] xl:gap-x-12">
          <p className="text-sm leading-[23px] sm:col-span-2 lg:col-span-1 lg:mt-[53px]">{COMPANY_BLURB}</p>
          {columns.map((col) => (
            <div key={col.title}>
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
          <div>
            <h2 className={heading}>Contact</h2>
            <ul className={list}>
              <li>
                <a href={PHONE_HREF} className={item}>
                  <span aria-hidden className={emoji}>📞</span> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_HREF} className="text-whatsapp transition hover:brightness-110">
                  <span aria-hidden className={emoji}>💬</span> WhatsApp Us
                </a>
              </li>
              <li>
                <a href="mailto:hello@everestfleet.com" className={item}>
                  <span aria-hidden className={emoji}>✉️</span> hello@everestfleet.com
                </a>
              </li>
              <li>Mumbai HQ, Andheri E</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-[13px] leading-5 sm:flex-row sm:items-center sm:justify-between lg:mt-5">
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
