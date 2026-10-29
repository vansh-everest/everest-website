import "server-only";
import autoPosts from "@/content/auto-posts.json";
import { postsFor, type Post, type SiteContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { titleCase } from "@/lib/text-case";

/**
 * The daily posts written by the job on the everest-intercity EC2 (scripts/autoblog). Each one is a
 * commit to this file plus its cover in public/blog/auto/, so a post goes live with the build that
 * commit triggers and comes down with a revert. The admin lists them (dailyPostList) and can take
 * one off the site through `hiddenDailyPosts`; the posts themselves stay out of its saved content.
 */
const AUTO_POSTS = (autoPosts as Post[]).map((p) => ({ ...p, title: titleCase(p.title) }));

export type DailyPost = Pick<Post, "slug" | "locale" | "title" | "date">;

/** The daily posts for the admin's Blog tab, newest first: enough to list them and switch one off. */
export function dailyPostList(): DailyPost[] {
  return AUTO_POSTS.filter((p) => p.published)
    .map(({ slug, locale, title, date }) => ({ slug, locale, title, date }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * A locale's published posts, newest first. The job cannot see the admin's posts, so a daily post
 * whose address an admin post already holds moves to the same address with its date added.
 */
export function blogPostsFor(content: SiteContent, locale: Locale): Post[] {
  const own = postsFor(content, locale);
  const taken = new Set(own.map((p) => p.slug));
  const hidden = new Set(content.hiddenDailyPosts ?? []);
  const daily = AUTO_POSTS.filter((p) => p.published && p.locale === locale && !hidden.has(p.slug)).map((p) =>
    taken.has(p.slug) ? { ...p, slug: `${p.slug}-${p.date}` } : p
  );
  return [...own, ...daily].sort((a, b) => b.date.localeCompare(a.date));
}
