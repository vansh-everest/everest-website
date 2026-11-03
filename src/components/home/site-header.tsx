import { HeaderShell } from "@/components/fx/header-shell";
import { BrandLogo } from "@/components/site/brand-logo";
import { siteCopy } from "@/content/site-copy";
import { DEFAULT_LOCALE, hrefIn, type Locale } from "@/lib/i18n";
import { FormLink } from "./form-link";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

/** The header's phone button: each language's "Apply Now" without its "now" word, to fit beside the menu on a 360px screen. */
const PHONE_APPLY: Record<Locale, string> = {
  en: "Apply Now",
  hi: "अप्लाई करें",
  mr: "अर्ज करा",
  kn: "ಅರ್ಜಿ ಹಾಕಿ",
  te: "దరఖాస్తు చేయండి",
  bn: "আবেদন করুন",
  ta: "விண்ணப்பியுங்கள்",
};

export function SiteHeader({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  // The home page in this language, or the English one where there is none. "Drive With Us" goes to
  // the lead form: this page's, or that home page's.
  const home = hrefIn(locale, "/");
  return (
    <HeaderShell>
      {/* The artwork carries transparent padding; the offsets put the wordmark on the grid. */}
      <BrandLogo href={home} preload twinkle compact className="-ml-[7px] -mr-[5px] mt-1 shrink-0 lg:-ml-2 lg:-mr-1.5 lg:mt-[5px]" />
      <NavLinks />
      <div className="flex items-center gap-2">
        {/* Phones show the short "Apply Now" beside the menu; wider screens the full "Drive With Us". */}
        <FormLink
          home={home}
          className="flex h-9 items-center whitespace-nowrap rounded-full bg-sun px-3.5 text-[13px] font-bold tracking-[-0.2px] text-navy transition hover:brightness-105 sm:h-10 sm:px-4 sm:text-sm lg:h-[45px] lg:px-[25px] lg:text-base"
        >
          <span className="sm:hidden">{PHONE_APPLY[locale]}</span>
          <span className="hidden sm:inline">{siteCopy(locale).header.driveWithUs}</span>
        </FormLink>
        <MobileMenu home={home} />
      </div>
    </HeaderShell>
  );
}
