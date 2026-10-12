import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticle, newsJsonLd } from "@/components/news/news-pages";
import { jsonLd } from "@/lib/json-ld";
import { NEWS, findNews, newsPath } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

/**
 * Served at the story's old address (next.config rewrites /<slug>/ here), which is also its
 * canonical; /news/<slug>/ itself redirects there, so each story has one address.
 */
export function generateStaticParams() {
  return NEWS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = findNews((await params).slug);
  if (!post) return {};
  const image = post.image ? [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.image.alt }] : undefined;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: newsPath(post.slug) },
    openGraph: {
      type: "article",
      url: newsPath(post.slug),
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: image,
    },
  };
}

export default async function Page({ params }: Props) {
  const post = findNews((await params).slug);
  if (!post) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(newsJsonLd(post)) }} />
      <NewsArticle post={post} />
    </>
  );
}
