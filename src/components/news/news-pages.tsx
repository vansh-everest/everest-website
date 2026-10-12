import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { blogCopy } from "@/components/blog/copy";
import { BlogCta } from "@/components/blog/sections";
import { SITE_URL } from "@/lib/company";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { NEWS, newsDate, newsPath, type NewsPost } from "@/lib/news";
import { PROSE } from "./prose";

/** One press story at its old address. */
export function NewsArticle({ post }: { post: NewsPost }) {
  const more = NEWS.filter((p) => p.slug !== post.slug).slice(0, 4);
  return (
    <>
      <article className="bg-white px-4 pb-12 pt-8 sm:px-6 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-[760px]">
          <Link href="/newsroom/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand lg:text-[15px]">
            <ArrowLeft aria-hidden className="size-4" />
            Newsroom
          </Link>
          <p className="mt-6 text-[13px] font-bold uppercase leading-5 tracking-[1.5px] text-brand lg:mt-8">In The News</p>
          <h1 className="mt-3 text-[28px] font-bold leading-[34px] tracking-[-0.3px] text-navy lg:mt-[18px] lg:text-[44px] lg:leading-[52px] lg:tracking-[-0.5px]">
            {post.title}
          </h1>
          <p className="mt-3 text-[13px] leading-5 text-ink-soft lg:mt-5 lg:text-[15px]">
            <time dateTime={post.date}>{newsDate(post.date)}</time>
          </p>
          {post.image ? (
            <Image
              src={post.image.src}
              alt={post.image.alt}
              width={post.image.width}
              height={post.image.height}
              sizes="(max-width: 800px) 100vw, 760px"
              preload
              className="mt-6 h-auto w-full rounded-2xl bg-mist lg:mt-8 lg:rounded-[20px]"
            />
          ) : null}
          <div className={`mt-8 ${PROSE}`} dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </article>
      {more.length ? <NewsList posts={more} title="More From The Newsroom" all /> : null}
      <BlogCta locale={DEFAULT_LOCALE} copy={blogCopy(DEFAULT_LOCALE)} />
    </>
  );
}

/** Stories as dated rows, each linking to its own address. */
export function NewsList({ posts, title, all = false, heading = "h2" }: { posts: NewsPost[]; title: string; all?: boolean; heading?: "h1" | "h2" }) {
  const Heading = heading;
  return (
    <section className="bg-white px-4 pb-12 pt-[50px] sm:px-6 lg:pb-24 lg:pt-[96px]">
      <div className="mx-auto w-full max-w-[1104px]">
        <p className="text-center text-[13px] font-bold uppercase leading-5 tracking-[1.5px] text-brand lg:text-left">In The News</p>
        <Heading className="mt-2.5 text-center text-[28px] font-bold leading-[34px] tracking-[-0.3px] text-navy lg:mt-[13px] lg:text-left lg:text-[44px] lg:leading-[52px]">
          {title}
        </Heading>
        <ul className="mt-5 border-t border-line lg:mt-10">
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-line">
              <Link
                href={newsPath(p.slug)}
                className="group grid gap-1 py-4 lg:min-h-[88px] lg:grid-cols-[172px_1fr_auto] lg:items-center lg:gap-0 lg:py-5"
              >
                <time dateTime={p.date} className="text-[13px] leading-5 text-ink-soft lg:text-[15px]">
                  {newsDate(p.date)}
                </time>
                <span className="text-[17px] font-bold leading-[22px] text-navy group-hover:text-brand lg:text-[22px] lg:leading-8">{p.title}</span>
                <span className="hidden items-center gap-2 pl-6 text-[15px] font-semibold text-brand lg:inline-flex">
                  Read <ArrowRight aria-hidden className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {all ? (
          <Link href="/newsroom/" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-brand">
            All News <ArrowRight aria-hidden className="size-4" />
          </Link>
        ) : null}
      </div>
    </section>
  );
}

export function newsJsonLd(post: NewsPost) {
  const url = `${SITE_URL}${newsPath(post.slug)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.modified,
        inLanguage: "en-IN",
        mainEntityOfPage: url,
        url,
        ...(post.image ? { image: `${SITE_URL}${post.image.src}` } : {}),
        author: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
        publisher: { "@type": "Organization", name: "Everest Fleet", url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Newsroom", item: `${SITE_URL}/newsroom/` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}
