import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost, postJsonLd } from "@/components/driver/blog-pages";
import { postsFor } from "@/lib/content";
import { EXTRA_LOCALES, alternatesFor, canonical, isLocale, type ExtraLocale } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import { jsonLd } from "@/lib/json-ld";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const content = await getContent();
  return EXTRA_LOCALES.flatMap((locale) =>
    postsFor(content, locale).map((p) => ({ locale, slug: p.slug }))
  );
}

async function findPost(locale: ExtraLocale, slug: string) {
  const content = await getContent();
  return postsFor(content, locale).find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const post = await findPost(locale as ExtraLocale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: canonical(locale, `/blog/${slug}`),
      languages: alternatesFor(`/blog/${slug}`),
    },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  const post = await findPost(locale as ExtraLocale, slug);
  if (!post) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(postJsonLd(post, locale as ExtraLocale)) }}
      />
      <BlogPost locale={locale as ExtraLocale} post={post} />
    </>
  );
}
