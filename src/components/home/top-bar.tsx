import { Fragment } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { LocaleSwitch } from "./locale-switch";
import { utilityLinksFor } from "./nav-data";
import { PHONE_DISPLAY, PHONE_HREF } from "./ui";

const rule = <span aria-hidden className="h-4 w-px bg-white/20" />;

export function TopBar({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return (
    <div className="relative z-[51] bg-navy">
      {/* On a phone only the number and the language stay; the other links are in the menu. */}
      <div className="mx-auto flex h-11 max-w-[1440px] items-center justify-between gap-5 px-4 text-sm font-semibold leading-5 text-white md:h-12 md:justify-end md:px-6 lg:px-12">
        <div className="hidden items-center gap-5 md:flex">
          {utilityLinksFor(locale).map(({ label, href }) => (
            <Fragment key={href}>
              <Link href={href} className="transition hover:text-sun">
                {label}
              </Link>
              {rule}
            </Fragment>
          ))}
        </div>
        <a href={PHONE_HREF} className="flex items-center gap-2.5 text-sun transition hover:brightness-110">
          <Phone size={17} fill="currentColor" strokeWidth={0} aria-hidden />
          {PHONE_DISPLAY}
        </a>
        <LocaleSwitch />
      </div>
    </div>
  );
}
