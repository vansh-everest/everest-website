import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/lib/i18n";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

export function SiteHeader({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const drive = localePath(locale, "/drive-with-us");
  return (
    <header className="sticky top-0 z-50 border-b-4 border-sun bg-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 md:px-6 lg:h-[76px] lg:px-12">
        {/* The artwork carries transparent padding; the offsets put the wordmark on the grid. */}
        <Link href="/" className="-ml-2 -mr-1.5 mt-[5px] shrink-0">
          <Image src="/figma/logo.png" alt="Everest Fleet" width={98} height={56} preload className="h-14 w-[98px]" />
        </Link>
        <NavLinks />
        <div className="flex items-center gap-2">
          <Link
            href={drive}
            className="flex h-10 items-center rounded-full bg-sun px-4 text-sm font-bold tracking-[-0.2px] text-navy transition hover:brightness-105 lg:h-[45px] lg:px-[25px] lg:text-base"
          >
            Drive With Us
          </Link>
          <MobileMenu driveHref={drive} />
        </div>
      </div>
    </header>
  );
}
