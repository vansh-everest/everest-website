import type { Metadata } from "next";
import { BlogIndex } from "@/components/driver/blog-pages";
import { getDictionary } from "@/content/dictionary";
import { DEFAULT_LOCALE, alternatesFor, canonical } from "@/lib/i18n";
import { getContent } from "@/lib/store";

const dict = getDictionary(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: dict.blog.title,
  description: dict.blog.metaDescription,
  alternates: { canonical: canonical(DEFAULT_LOCALE, "/blog"), languages: alternatesFor("/blog") },
};

export default async function Page() {
  return <BlogIndex locale={DEFAULT_LOCALE} content={await getContent()} />;
}
