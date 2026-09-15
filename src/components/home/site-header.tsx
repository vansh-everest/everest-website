import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white drop-shadow-[0_2px_8px_rgba(6,47,80,0.1)]">
      <div className="mx-auto flex h-[79px] max-w-[1280px] items-center justify-between px-4 lg:px-12">
        <Link href="/" className="shrink-0">
          <Image
            src="/figma/logo.png"
            alt="Everest Fleet"
            width={135}
            height={78}
            preload
            className="h-[78px] w-[135px] object-cover"
          />
        </Link>
        <NavLinks />
        <Link
          href="/#apply"
          className="flex h-12 items-center rounded-full bg-brand px-[26px] text-sm font-medium tracking-[-0.15px] text-white transition hover:brightness-110"
        >
          Join as Driver
        </Link>
      </div>
    </header>
  );
}
