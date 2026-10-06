import { getImageProps } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { PHONE_HREF } from "@/components/home/ui";
import { Carousel } from "@/components/site/carousel";
import { SiteImage } from "@/components/site/site-image";
import { PRESS, pressDate } from "@/components/investors/press";
import type { Post } from "@/lib/content";
import { LOCALE_META, localePath, type Locale } from "@/lib/i18n";
import type { BlogCopy } from "./copy";
import { LoadMore } from "./load-more";
import { STORIES, type Story } from "./stories";

export const wrap = "mx-auto w-full max-w-[1104px]";

export function postDate(date: string, locale: Locale): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(LOCALE_META[locale].htmlLang, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function readMinutes(post: Post): number {
  const words = post.body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function postHref(locale: Locale, post: Post): string {
  return localePath(locale, `/blog/${post.slug}`);
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[13px] font-semibold uppercase leading-4 tracking-[1.3px] text-brand ${className}`}>{children}</p>
  );
}

/** Section heading: centred on phones, left-aligned and title-cased from lg. */
export function Title({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`text-center text-[28px] font-bold leading-[34px] tracking-[-0.3px] text-navy lg:text-left lg:text-[52px] lg:capitalize lg:leading-[58px] lg:tracking-[-0.3px] ${className}`}
    >
      {children}
    </h2>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[22px] items-center rounded-full bg-[#e8f2fa] px-2.5 text-xs font-medium text-brand lg:h-6 lg:px-3 lg:text-[13px]">
      {children}
    </span>
  );
}

function Meta({ parts, className = "" }: { parts: string[]; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-[13px] leading-5 text-ink-soft lg:text-[15px] ${className}`}>
      {parts.filter(Boolean).map((part, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 ? <span aria-hidden>&middot;</span> : null}
          {part}
        </span>
      ))}
    </p>
  );
}

const HERO_ALT = "A driver smiling at the wheel of a white car, holding up its key";

/**
 * Phones: a rounded card of the tight crop under the title. From lg: the wide crop, already
 * shaded navy towards the bottom, fills the band and the title sits on the shade.
 */
export function BlogHero({ copy }: { copy: BlogCopy }) {
  const common = { alt: HERO_ALT, sizes: "100vw" };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: "/figma/blog/hero-wide.webp", width: 2880, height: 1200 });
  const {
    props: { srcSet: tight, ...img },
  } = getImageProps({ ...common, src: "/figma/blog/hero.webp", width: 1472, height: 832, loading: "eager", fetchPriority: "high" });
  return (
    <section className="bg-navy px-4 pb-10 pt-[32px] sm:px-6 lg:relative lg:h-[600px] lg:p-0">
      <h1 className="text-[36px] font-bold leading-[42px] tracking-[-0.5px] text-white lg:absolute lg:bottom-[50px] lg:left-14 lg:z-10 lg:text-[64px] lg:capitalize lg:leading-[74px] lg:tracking-[-0.5px]">
        {copy.heroTitle}
      </h1>
      <picture className="relative mt-[12px] block aspect-[380/220] overflow-hidden rounded-2xl sm:aspect-[16/7] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto lg:rounded-none">
        <source media="(min-width: 1024px)" srcSet={wide} />
        <source srcSet={tight} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...img} className="absolute inset-0 size-full object-cover lg:object-bottom" />
      </picture>
    </section>
  );
}

export function Featured({ post, locale, copy }: { post: Post; locale: Locale; copy: BlogCopy }) {
  const href = postHref(locale, post);
  return (
    <section className="bg-white px-4 pb-12 pt-[46px] sm:px-6 lg:pb-[92px] lg:pt-[97px]">
      <div className={wrap}>
        <Kicker className="text-center lg:text-left">{copy.featuredKicker}</Kicker>
        <Title className="mt-2 lg:mt-[13px]">{copy.featuredTitle}</Title>
        <article className="mt-6 overflow-hidden rounded-2xl border border-line bg-white lg:mt-[50px] lg:grid lg:min-h-[401px] lg:grid-cols-[minmax(0,600fr)_minmax(0,504fr)] lg:rounded-[20px]">
          <Link href={href} className="relative block aspect-[380/200] lg:aspect-auto" tabIndex={-1} aria-hidden>
            <SiteImage slot={post.coverImage} sizes="(min-width: 1024px) 600px, 100vw" />
          </Link>
          <div className="px-5 pb-5 pt-4 lg:px-12 lg:pb-12 lg:pt-12">
            <Tag>{copy.forDrivers}</Tag>
            <h3 className="mt-2.5 text-center text-[22px] font-bold leading-7 text-navy lg:mt-[18px] lg:text-left lg:text-[40px] lg:leading-[44px] lg:tracking-[-0.3px]">
              <Link href={href} className="hover:text-brand">
                {post.title}
              </Link>
            </h3>
            <p className="mt-3 text-[15px] leading-[23px] text-ink-soft lg:mt-[18px] lg:max-w-[380px] lg:text-lg lg:leading-[27px]">{post.excerpt}</p>
            <Meta
              className="mt-2.5 lg:mt-[14px]"
              parts={[postDate(post.date, locale), copy.minRead(readMinutes(post)), copy.author]}
            />
            <Link
              href={href}
              className="mt-2.5 flex h-[46px] w-full items-center justify-center gap-3 rounded-full bg-sun px-6 text-[17px] font-semibold text-navy transition hover:brightness-95 lg:mt-[18px] lg:h-12 lg:w-fit lg:px-[19px]"
            >
              {copy.readStory}
              <ArrowRight aria-hidden className="hidden size-[18px] lg:block" strokeWidth={2.25} />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

const STORY_TONE: Record<Story["tone"], string> = { lime: "bg-lime", sun: "bg-sun", sky: "bg-[#e8f2fa]" };

function StoryCard({ story }: { story: Story }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white px-5 pb-5 pt-5 lg:rounded-[20px] lg:px-8 lg:pb-8 lg:pt-8">
      <p className={`w-fit rounded-lg px-3 py-0.5 text-[19px] font-bold leading-[30px] text-navy lg:px-3.5 lg:py-1.5 lg:text-[22px] ${STORY_TONE[story.tone]}`}>
        {story.badge}
      </p>
      <blockquote className="mt-4 text-[16px] leading-[23px] text-navy lg:mt-5 lg:text-[19px] lg:leading-7">
        &ldquo;{story.quote}&rdquo;
      </blockquote>
      <div className="mt-auto flex items-center gap-3 pt-6 lg:pt-[27px]">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-[15px] font-bold text-white lg:size-12 lg:text-[17px]">
          {story.initials}
        </span>
        <div>
          <p className="text-[15px] font-bold leading-5 text-navy lg:text-lg lg:leading-6">{story.name}</p>
          <p className="text-[13px] leading-[18px] text-ink-soft lg:text-[15px] lg:leading-5">{story.meta}</p>
        </div>
      </div>
      {story.href ? (
        <Link href={story.href} className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-brand lg:mt-6 lg:text-base">
          Read the story <ArrowRight aria-hidden className="size-4" />
        </Link>
      ) : null}
    </article>
  );
}

export function DriverStories({ copy }: { copy: BlogCopy }) {
  return (
    <section className="bg-[#f0f4f8] py-[50px] lg:px-6 lg:pb-[97px] lg:pt-[97px]">
      <div className={`${wrap} px-4 sm:px-6 lg:px-0`}>
        <Kicker className="text-center lg:text-left">{copy.storiesKicker}</Kicker>
        <Title className="mt-2.5 lg:mt-[13px]">{copy.storiesTitle}</Title>
        <p className="mt-2.5 text-center text-[15px] leading-[22px] text-ink-soft lg:mt-[15px] lg:text-left lg:text-lg">{copy.storiesSub}</p>
        <div className="mt-6 lg:hidden">
          <Carousel item="w-[300px]" label={copy.storiesKicker}>
            {STORIES.map((s) => (
              <StoryCard key={s.name} story={s} />
            ))}
          </Carousel>
        </div>
        <ul className="mt-[50px] hidden grid-cols-3 gap-[25px] lg:grid">
          {STORIES.map((s) => (
            <li key={s.name}>
              <StoryCard story={s} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PostCard({ post, locale, copy }: { post: Post; locale: Locale; copy: BlogCopy }) {
  const href = postHref(locale, post);
  return (
    <li className="border-b border-line lg:border-0">
      <Link
        href={href}
        className="group flex gap-3.5 py-4 lg:h-full lg:flex-col lg:gap-0 lg:overflow-hidden lg:rounded-[20px] lg:border lg:border-line lg:bg-white lg:py-0"
      >
        <span className="relative size-24 shrink-0 overflow-hidden rounded-lg lg:aspect-[351/200] lg:size-auto lg:w-full lg:rounded-none">
          <SiteImage slot={post.coverImage} sizes="(min-width: 1024px) 351px, 96px" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col items-start lg:px-6 lg:pb-6 lg:pt-6">
          <Tag>{copy.forDrivers}</Tag>
          <span className="mt-1.5 text-[17px] font-bold leading-[22px] text-navy group-hover:text-brand lg:mt-[18px] lg:text-xl lg:leading-[26px]">
            {post.title}
          </span>
          <Meta className="mt-1 lg:mt-auto lg:pt-6" parts={[postDate(post.date, locale), copy.minRead(readMinutes(post))]} />
        </span>
      </Link>
    </li>
  );
}

export function Latest({ posts, locale, copy }: { posts: Post[]; locale: Locale; copy: BlogCopy }) {
  return (
    <section className="bg-white px-4 pb-12 pt-[50px] sm:px-6 lg:pb-24 lg:pt-[96px]">
      <div className={wrap}>
        <Kicker className="text-center lg:text-left">{copy.latestKicker}</Kicker>
        <Title className="mt-2.5 lg:mt-[13px]">{copy.latestTitle}</Title>
        <LoadMore step={6} label={copy.loadMore} className="mt-5 grid border-t border-line lg:mt-12 lg:grid-cols-3 lg:gap-[25px] lg:border-0">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} locale={locale} copy={copy} />
          ))}
        </LoadMore>
      </div>
    </section>
  );
}

export function Guides({
  posts,
  locale,
  copy,
  title,
  sub,
}: {
  posts: Post[];
  locale: Locale;
  copy: BlogCopy;
  title: string;
  sub?: string;
}) {
  return (
    <section className="bg-[#f0f4f8] px-4 pb-12 pt-[50px] sm:px-6 lg:pb-24 lg:pt-[96px]">
      <div className={wrap}>
        <Kicker className="text-center lg:text-left">{copy.guidesKicker}</Kicker>
        <Title className="mt-2.5 lg:mt-[13px]">{title}</Title>
        {sub ? <p className="mt-2.5 text-center text-[15px] leading-[22px] text-ink-soft lg:mt-[15px] lg:text-left lg:text-lg">{sub}</p> : null}
        <ol className="mt-6 grid gap-3 lg:mt-[50px] lg:grid-cols-4 lg:gap-[22px]">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={postHref(locale, p)}
                className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-white py-4 pl-4 pr-3.5 lg:block lg:rounded-[20px] lg:px-7 lg:pb-7 lg:pt-7"
              >
                <span className="text-[26px] font-bold leading-none text-brand lg:text-[30px] lg:leading-9">{String(i + 1).padStart(2, "0")}</span>
                <span className="block min-w-0 flex-1">
                  <span className="block text-[16px] font-bold leading-[21px] text-navy group-hover:text-brand lg:mt-4 lg:text-[21px] lg:leading-[26px]">
                    {p.title}
                  </span>
                  <span className="mt-1 block text-[13px] text-ink-soft lg:mt-4 lg:text-[15px]">{copy.minRead(readMinutes(p))}</span>
                </span>
                <ChevronRight aria-hidden className="size-5 shrink-0 text-brand lg:hidden" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Press mentions. A row links out only once its article address is known. */
export function InTheNews({ copy }: { copy: BlogCopy }) {
  if (!PRESS.length) return null;
  return (
    <section className="bg-white px-4 pb-12 pt-[50px] sm:px-6 lg:pb-24 lg:pt-[96px]">
      <div className={wrap}>
        <Kicker className="text-center lg:text-left">{copy.newsKicker}</Kicker>
        <Title className="mt-2.5 lg:mt-[13px]">{copy.newsTitle}</Title>
        <ul className="mt-5 border-t border-line lg:mt-10">
          {PRESS.map((p) => (
            <li
              key={p.title}
              className="grid gap-1 border-b border-line py-4 lg:min-h-[88px] lg:grid-cols-[172px_1fr_auto] lg:items-center lg:gap-0 lg:py-5"
            >
              <time dateTime={p.date} className="text-[13px] leading-5 text-ink-soft lg:text-[15px]">
                {pressDate(p.date)}
              </time>
              <p className="text-[17px] font-bold leading-[22px] text-navy lg:text-2xl lg:leading-8">{p.title}</p>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand lg:pl-6">
                  {copy.read} <ArrowRight aria-hidden className="size-4" />
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BlogCta({ locale, copy }: { locale: Locale; copy: BlogCopy }) {
  return (
    <section className="bg-brand px-4 pb-[50px] pt-[50px] text-center sm:px-6 lg:pb-[88px] lg:pt-[89px]">
      <h2 className="mx-auto max-w-[340px] text-[28px] font-bold leading-[34px] tracking-[-0.3px] text-white sm:max-w-none lg:text-[48px] lg:leading-[56px] lg:tracking-[-0.5px]">
        {copy.ctaTitle}
      </h2>
      <p className="mt-3 text-[15px] leading-[22px] text-white/85 lg:mt-[18px] lg:text-xl lg:leading-7">{copy.ctaSub}</p>
      <div className="mx-auto mt-6 grid max-w-[380px] gap-3 sm:flex sm:max-w-none sm:justify-center sm:gap-4 lg:mt-[30px]">
        <Link
          href={localePath(locale, "/drive-with-us")}
          className="flex h-[52px] items-center justify-center gap-3 rounded-full bg-sun px-7 text-[17px] font-semibold text-navy transition hover:brightness-95 lg:h-[54px] lg:text-lg"
        >
          {copy.ctaDrive}
          <ArrowRight aria-hidden className="hidden size-[18px] lg:block" strokeWidth={2.25} />
        </Link>
        <a
          href={PHONE_HREF}
          className="flex h-[52px] items-center justify-center rounded-full border-2 border-white px-7 text-[17px] font-medium text-white transition hover:bg-white/10 lg:h-[57px] lg:text-lg"
        >
          {copy.ctaTalk}
        </a>
      </div>
    </section>
  );
}
