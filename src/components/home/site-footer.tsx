import Image from "next/image";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "./ui";
import Link from "next/link";
import { COMPANY_BLURB } from "@/lib/company";

// Only routes that exist are linked. A placeholder link wastes crawl budget and fails a visitor.
const columns = [
  {
    title: "Drivers",
    links: [
      { label: "Own Now", href: "/own-now" },
      { label: "Our Services", href: "/our-services" },
    ],
  },
  { title: "Company", links: [{ label: "About Us", href: "/about-us" }] },
];

const heading = "text-[11px] font-bold uppercase leading-[17px] tracking-[1.5px] text-sun";
const item = "text-sm leading-[21px] text-white/80 transition hover:text-white";

export function SiteFooter() {
  return (
    <footer className="relative bg-navy px-6 pb-9 pt-32 text-white lg:pt-[136px]">
      <Image
        src="/figma/logo-white.png"
        alt="Everest Fleet"
        width={191}
        height={109}
        className="absolute left-6 top-[19px] h-[109px] w-[191px] object-cover lg:left-[114px]"
      />
      <div className="mx-auto max-w-[1184px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[270px_repeat(4,180px)] lg:gap-12">
          <p className="text-sm leading-[23px] text-white/80 lg:mt-[46px]">
            {COMPANY_BLURB}
          </p>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className={heading}>{col.title}</h4>
              <ul className="mt-[14px] space-y-2.5 text-sm leading-[21px]">
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
            <h4 className={heading}>Contact</h4>
            <ul className="mt-[14px] space-y-2.5 text-sm leading-[21px]">
              <li>
                <a href={PHONE_HREF} className={item}>
                  📞 {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_HREF} className="text-sm leading-[21px] text-whatsapp">
                  💬 WhatsApp Us
                </a>
              </li>
              <li>
                <a href="mailto:hello@everestfleet.com" className={item}>
                  ✉ hello@everestfleet.com
                </a>
              </li>
              <li className="text-sm leading-[21px] text-white/80">Mumbai HQ — Andheri E</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-8 text-[13px] leading-5 text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} Everest Fleet Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
