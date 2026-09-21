import Link from "next/link";
import { LocaleSwitch } from "./locale-switch";
import { PHONE_DISPLAY, PHONE_HREF } from "./ui";

const links = [
  { label: "For Investors", href: "/investors" },
  { label: "Blog", href: "/blog" },
];

export function TopBar() {
  return (
    <div className="hidden border-b border-white/[0.06] bg-navy md:block">
      <div className="mx-auto flex h-[39px] max-w-[1280px] items-center justify-end gap-6 px-12 text-xs font-bold leading-[18px] text-white">
        {links.map(({ label, href }) => (
          <Link key={href} href={href} className="text-white transition hover:text-sun">
            {label}
          </Link>
        ))}
        <a href={PHONE_HREF} className="text-white transition hover:text-sun">
          {PHONE_DISPLAY}
        </a>
        <LocaleSwitch />
      </div>
    </div>
  );
}
