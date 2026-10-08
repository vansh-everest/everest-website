import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";
import { LocalePosts } from "@/components/home/locale-switch";
import { Analytics } from "@/components/site/analytics";
import { PreviewBanner } from "@/components/site/preview-banner";
import { CardSpotlight } from "@/components/fx/card-spotlight";
import { RevealOnScroll } from "@/components/fx/reveal-on-scroll";
import { SmoothScroll } from "@/components/fx/smooth-scroll";
import { postsFor } from "@/lib/content";
import { FONT_VARS } from "@/lib/fonts";
import { LOCALE_META, MAIN_LOCALES, type Locale } from "@/lib/i18n";
import { getContent } from "@/lib/store";

/**
 * The document for a public page.
 *
 * The locale sets both the document language and the typeface, so Devanagari and Telugu
 * render in a face designed for them rather than in a Latin fallback.
 */
export async function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const meta = LOCALE_META[locale];
  // The language picker opens a blog post in another language only where that post is published.
  const content = await getContent();
  const posts = Object.fromEntries(MAIN_LOCALES.map((l) => [l, postsFor(content, l).map((p) => p.slug)]));
  return (
    <html lang={meta.htmlLang} className={`${FONT_VARS} antialiased`}>
      <body className={meta.fontVar}>
        <LocalePosts posts={posts}>
          <SmoothScroll />
          <div aria-hidden className="fx-progress" />
          <TopBar locale={locale} />
          <SiteHeader locale={locale} />
          <main className="overflow-x-clip">{children}</main>
          <RevealOnScroll />
          <CardSpotlight />
          <SiteFooter />
          <PreviewBanner />
          <Analytics />
        </LocalePosts>
      </body>
    </html>
  );
}
