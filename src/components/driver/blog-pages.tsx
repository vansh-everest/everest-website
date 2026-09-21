import Link from "next/link";
import { SiteImage } from "@/components/site/site-image";
import { getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { postsFor, type Post, type SiteContent } from "@/lib/content";
import { LOCALE_META, localePath, type Locale } from "@/lib/i18n";

const wrap = "mx-auto w-full max-w-[1120px] px-5";

function formatDate(date: string, locale: Locale): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(LOCALE_META[locale].htmlLang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** /blog/ in every locale. */
export function BlogIndex({ locale, content }: { locale: Locale; content: SiteContent }) {
  const dict = getDictionary(locale);
  const posts = postsFor(content, locale);

  return (
    <>
      <section className="bg-blue-gradient pb-12 pt-10 text-white">
        <div className={`${wrap} grid gap-4`}>
          <h1 className="text-[32px] font-extrabold leading-tight lg:text-[48px]">{dict.blog.title}</h1>
          <p className="max-w-[60ch] text-base leading-7 text-white/85">{dict.blog.intro}</p>
        </div>
      </section>

      <section className={`${wrap} py-12`}>
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-line bg-white px-5 py-8 text-center text-sm text-ink-soft">
            {dict.blog.empty}
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug} className="overflow-hidden rounded-2xl border border-line bg-white">
                <Link href={localePath(locale, `/blog/${post.slug}`)} className="block">
                  <div className="relative aspect-[16/9] w-full">
                    <SiteImage slot={post.coverImage} className="h-full w-full" sizes="(max-width: 768px) 100vw, 360px" />
                  </div>
                  <div className="grid gap-2 p-5">
                    <time dateTime={post.date} className="text-xs font-semibold uppercase tracking-[1px] text-ink-soft">
                      {formatDate(post.date, locale)}
                    </time>
                    <h2 className="text-lg font-bold leading-snug text-navy">{post.title}</h2>
                    <p className="text-sm leading-6 text-ink-soft">{post.excerpt}</p>
                    <span className="text-sm font-bold text-brand">{dict.blog.readMore}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

/** /blog/<slug>/ in every locale. */
export function BlogPost({ locale, post }: { locale: Locale; post: Post }) {
  const dict = getDictionary(locale);

  return (
    <div className={`${wrap} py-12`}>
      <article className="mx-auto max-w-[720px]">
        <Link href={localePath(locale, "/blog")} className="text-sm font-bold text-brand">
          {dict.blog.back}
        </Link>
        <h1 className="mt-4 text-[30px] font-extrabold leading-tight text-navy lg:text-[40px]">{post.title}</h1>
        <time dateTime={post.date} className="mt-3 block text-xs font-semibold uppercase tracking-[1px] text-ink-soft">
          {formatDate(post.date, locale)}
        </time>
        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-3xl">
          <SiteImage slot={post.coverImage} className="h-full w-full" sizes="(max-width: 760px) 100vw, 720px" />
        </div>
        <div className="mt-8 grid gap-5">
          {post.body.map((paragraph, i) => (
            <p key={i} className="text-base leading-7 text-ink-soft">
              {paragraph}
            </p>
          ))}
        </div>
        <Link
          href={localePath(locale, "/drive-with-us")}
          className="mt-10 flex h-12 w-fit items-center rounded-full bg-sun px-7 text-sm font-bold text-navy"
        >
          {dict.cta.apply}
        </Link>
      </article>
    </div>
  );
}

export function postJsonLd(post: Post, locale: Locale) {
  const url = `${SITE_URL}${localePath(locale, `/blog/${post.slug}`)}/`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: LOCALE_META[locale].htmlLang,
    mainEntityOfPage: url,
    url,
    author: { "@type": "Organization", name: "Everest Fleet" },
    publisher: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
    ...(post.coverImage.url ? { image: `${SITE_URL}${post.coverImage.url}` } : {}),
  };
}
