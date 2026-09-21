import Link from "next/link";
import { LocaleSwitch } from "./locale-switch";
import { PHONE_DISPLAY, PHONE_HREF } from "./ui";

// Restore an entry here only when the route exists. A dead link fails a visitor and
// spends crawl budget on nothing.
const links: Array<{ label: string; href: string }> = [];

export function TopBar() {
  return (
    <div className="hidden border-b border-white/[0.06] bg-navy md:block">
      <div className="mx-auto flex h-[39px] max-w-[1280px] items-center justify-end gap-6 px-12 text-xs font-medium leading-[18px]">
        {links.map(({ label, href }) => (
          <Link key={href} href={href} className="text-white/60 transition hover:text-white">
            {label}
          </Link>
        ))}
        <a href={PHONE_HREF} className="text-sun">
          📞 {PHONE_DISPLAY}
        </a>
        <LocaleSwitch />
      </div>
    </div>
  );
}
