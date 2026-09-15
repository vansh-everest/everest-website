import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Globe } from "lucide-react";
import { PageNavLinks } from "./page-nav-links";

export function PageNav() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-sun bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center px-4 lg:px-12">
        <Link href="/" className="shrink-0">
          <Image src="/figma/logo.png" alt="Everest Fleet" width={115} height={66} preload className="h-[66px] w-[115px] object-cover" />
        </Link>
        <PageNavLinks />
        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            className="hidden h-[34px] items-center gap-1.5 rounded-full border border-[#cbd5e1] px-3 text-base font-semibold text-navy sm:flex"
          >
            <Globe size={16} strokeWidth={1.75} />
            EN
            <ChevronDown size={14} strokeWidth={2.25} />
          </button>
          <span aria-hidden className="hidden h-[26px] w-px bg-line sm:block" />
          <Link
            href="/#apply"
            className="flex h-[45px] items-center rounded-full bg-sun px-6 text-base font-semibold text-navy transition hover:brightness-95"
          >
            Join as Driver
          </Link>
        </div>
      </div>
    </header>
  );
}
