import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { FONT_VARS } from "@/lib/fonts";
import { LOCALE_META, type Locale } from "@/lib/i18n";

/**
 * The document for a public page.
 *
 * The locale sets both the document language and the typeface, so Devanagari and Telugu
 * render in a face designed for them rather than in a Latin fallback.
 */
export function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const meta = LOCALE_META[locale];
  return (
    <html lang={meta.htmlLang} className={`${FONT_VARS} antialiased`}>
      <body className={meta.fontVar}>
        <TopBar />
        <SiteHeader locale={locale} />
        <main className="overflow-x-clip">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
