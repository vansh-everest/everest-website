import posts from "@/content/news-posts.json";

/**
 * Press coverage carried over from the WordPress site (wp-json, 12 Oct 2026), newest first.
 * Each story keeps its old address, everestfleet.com/<slug>/, so the links and rankings it has
 * survive the move: next.config rewrites that address to /news/<slug>/, which renders it.
 * The text is the old post's, cleaned to plain paragraphs and links; images are local copies.
 * Re-import with `python3 -I scripts/wp-import.py .` if the old site changes before the switch.
 */
export type NewsPost = {
  id: number;
  slug: string;
  title: string;
  /** ISO date and time the story was first posted. */
  date: string;
  modified: string;
  /** The first sentences, for search results and link previews. */
  description: string;
  image: { src: string; width: number; height: number; alt: string } | null;
  /** Clean HTML: p, h2 to h4, lists, links, strong, em. */
  html: string;
};

export const NEWS: NewsPost[] = posts as NewsPost[];

/** The story's public address: the one it had on the old site. */
export const newsPath = (slug: string) => `/${slug}/`;

export const findNews = (slug: string) => NEWS.find((p) => p.slug === slug);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-12-11T10:00:00" reads "11 Dec 2024". */
export function newsDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1] ?? ""} ${y}`;
}
