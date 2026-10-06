import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { blogCopy } from "@/components/blog/copy";
import {
  BlogCta,
  BlogHero,
  DriverStories,
  Featured,
  Guides,
  InTheNews,
  Latest,
  Tag,
  postDate,
  readMinutes,
} from "@/components/blog/sections";
import { GUIDE_SLUGS } from "@/components/blog/stories";
import { SiteImage } from "@/components/site/site-image";
import { getDictionary } from "@/content/dictionary";
import { SITE_URL } from "@/lib/company";
import { postsFor, type Post, type SiteContent } from "@/lib/content";
import { LOCALE_META, localePath, type Locale } from "@/lib/i18n";

/** /blog/ in every locale. Driver stories and press are English only, so they show on /blog/ alone. */
export function BlogIndex({ locale, content }: { locale: Locale; content: SiteContent }) {
  const dict = getDictionary(locale);
  const copy = blogCopy(locale);
  const posts = postsFor(content, locale);
  const [featured, ...rest] = posts;
  const guides = GUIDE_SLUGS.map((slug) => posts.find((p) => p.slug === slug)).filter((p): p is Post => Boolean(p));
  const english = locale === "en";

  return (
    <>
      <BlogHero copy={copy} />
      {featured ? (
        <Featured post={featured} locale={locale} copy={copy} />
      ) : (
        <p className="mx-auto my-16 max-w-[1104px] px-4 text-center text-base text-ink-soft">{dict.blog.empty}</p>
      )}
      {english ? <DriverStories copy={copy} /> : null}
      {rest.length ? <Latest posts={rest} locale={locale} copy={copy} /> : null}
      {guides.length ? <Guides posts={guides} locale={locale} copy={copy} title={copy.guidesTitle} sub={copy.guidesSub} /> : null}
      {english ? <InTheNews copy={copy} /> : null}
      <BlogCta locale={locale} copy={copy} />
    </>
  );
}

/** /blog/<slug>/ in every locale. */
export function BlogPost({ locale, post, related = [] }: { locale: Locale; post: Post; related?: Post[] }) {
  const dict = getDictionary(locale);
  const copy = blogCopy(locale);

  return (
    <>
      <article className="bg-white px-4 pb-12 pt-8 sm:px-6 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-[760px]">
          <Link href={localePath(locale, "/blog")} className="inline-flex items-center gap-2 text-sm font-semibold text-brand lg:text-[15px]">
            <ArrowLeft aria-hidden className="size-4" />
            {dict.blog.back}
          </Link>
          <div className="mt-6 lg:mt-8">
            <Tag>{copy.forDrivers}</Tag>
          </div>
          <h1 className="mt-3 text-[30px] font-bold leading-9 tracking-[-0.3px] text-navy lg:mt-[18px] lg:text-[48px] lg:leading-[54px] lg:tracking-[-0.5px]">
            {post.title}
          </h1>
          <p className="mt-3 text-[13px] leading-5 text-ink-soft lg:mt-5 lg:text-[15px]">
            <time dateTime={post.date}>{postDate(post.date, locale)}</time> &middot; {copy.minRead(readMinutes(post))} &middot; {copy.author}
          </p>
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl lg:mt-8 lg:rounded-[20px]">
            <SiteImage slot={post.coverImage} sizes="(max-width: 800px) 100vw, 760px" />
          </div>
          <p className="mt-8 text-lg leading-8 text-navy lg:text-xl">{post.excerpt}</p>
          <div className="mt-5 grid gap-5">
            {post.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-7 text-ink-soft lg:text-lg lg:leading-[30px]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
      {related.length ? <Guides posts={related} locale={locale} copy={copy} title={copy.moreTitle} /> : null}
      <BlogCta locale={locale} copy={copy} />
    </>
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
