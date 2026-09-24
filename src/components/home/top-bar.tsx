import { Fragment } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { LocaleSwitch } from "./locale-switch";
import { UTILITY_LINKS } from "./nav-data";
import { PHONE_DISPLAY, PHONE_HREF } from "./ui";

const rule = <span aria-hidden className="h-4 w-px bg-white/20" />;

export function TopBar() {
  return (
    <div className="hidden bg-navy md:block">
      <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-end gap-5 px-6 text-sm font-semibold leading-5 text-white lg:px-12">
        {UTILITY_LINKS.map(({ label, href }) => (
          <Fragment key={href}>
            <Link href={href} className="transition hover:text-sun">
              {label}
            </Link>
            {rule}
          </Fragment>
        ))}
        <a href={PHONE_HREF} className="flex items-center gap-2.5 text-sun transition hover:brightness-110">
          <Phone size={17} fill="currentColor" strokeWidth={0} aria-hidden />
          {PHONE_DISPLAY}
        </a>
        <LocaleSwitch />
      </div>
    </div>
  );
}
