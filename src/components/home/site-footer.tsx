import Image from "next/image";
import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "./ui";

const columns = [
  { title: "Drivers", links: ["Drive to Own", "Drive to Earn", "Revenue Share", "EIP Programme", "Driver FAQs"] },
  { title: "Company", links: ["About Us", "Our Story", "Newsroom", "Careers", "Franchise"] },
  { title: "Cities", links: ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Pune", "Kolkata", "Chennai"] },
];

const legal = ["Privacy Policy", "Terms of Use", "Cookie Policy", "For Investors & Partners →"];

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
            India&apos;s largest fleet management company. 35,000+ cars. 50,000+ drivers. 7 cities. Powering driver earnings
            and Uber India network since 2016.
          </p>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className={heading}>{col.title}</h4>
              <ul className="mt-[14px] space-y-2.5 text-sm leading-[21px]">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className={item}>
                      {l}
                    </a>
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
          <p>© 2026 Everest Fleet Pvt Ltd. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l}>
                <a href="#" className="transition hover:text-white">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
