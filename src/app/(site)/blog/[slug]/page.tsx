import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost, postJsonLd } from "@/components/driver/blog-pages";
import { DEFAULT_LOCALE, alternatesFor, canonical } from "@/lib/i18n";
import { postsFor } from "@/lib/content";
import { getContent } from "@/lib/store";
import { jsonLd } from "@/lib/json-ld";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const content = await getContent();
  return postsFor(content, DEFAULT_LOCALE).map((p) => ({ slug: p.slug }));
}

async function findPost(slug: string) {
  const content = await getContent();
  return postsFor(content, DEFAULT_LOCALE).find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonical(DEFAULT_LOCALE, `/blog/${slug}`), languages: alternatesFor(`/blog/${slug}`) },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(postJsonLd(post, DEFAULT_LOCALE)) }}
      />
      <BlogPost locale={DEFAULT_LOCALE} post={post} />
    </>
  );
}
