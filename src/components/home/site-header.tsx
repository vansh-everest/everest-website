import { HeaderShell } from "@/components/fx/header-shell";
import { BrandLogo } from "@/components/site/brand-logo";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/lib/i18n";
import { FormLink } from "./form-link";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

export function SiteHeader({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  // "Drive With Us" goes to the lead form: this page's, or the home page's.
  const home = localePath(locale, "/");
  return (
    <HeaderShell>
      {/* The artwork carries transparent padding; the offsets put the wordmark on the grid. */}
      <BrandLogo preload className="-ml-2 -mr-1.5 mt-[5px] shrink-0" />
      <NavLinks />
      <div className="flex items-center gap-2">
        <FormLink
          home={home}
          className="hidden h-10 items-center rounded-full bg-sun px-4 text-sm font-bold tracking-[-0.2px] text-navy transition hover:brightness-105 sm:flex lg:h-[45px] lg:px-[25px] lg:text-base"
        >
          Drive With Us
        </FormLink>
        <MobileMenu home={home} />
      </div>
    </HeaderShell>
  );
}
