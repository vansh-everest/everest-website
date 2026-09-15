import Image from "next/image";
import { PHONE_DISPLAY, PHONE_HREF } from "./ui";

const links = ["Blog", "ESG Report", "For Partners & Investors →"];

export function TopBar() {
  return (
    <div className="hidden border-b border-white/[0.06] bg-navy md:block">
      <div className="mx-auto flex h-[39px] max-w-[1280px] items-center justify-end gap-6 px-12 text-xs font-medium leading-[18px]">
        {links.map((label) => (
          <a key={label} href="#" className="text-white/60 transition hover:text-white">
            {label}
          </a>
        ))}
        <a href={PHONE_HREF} className="text-sun">
          📞 {PHONE_DISPLAY}
        </a>
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.08] px-[13px] text-white/85"
        >
          <span aria-hidden>🌐</span>
          EN
          <Image src="/figma/chevron-down.svg" alt="" width={12} height={12} />
        </button>
      </div>
    </div>
  );
}
