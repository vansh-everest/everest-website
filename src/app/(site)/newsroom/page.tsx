import type { Metadata } from "next";
import { NewsList } from "@/components/news/news-pages";
import { NEWS } from "@/lib/news";

export const metadata: Metadata = {
  title: "Newsroom",
  description: "Everest Fleet in the news: funding rounds, investors, partnerships and awards.",
  alternates: { canonical: "/newsroom/" },
};

/** The old site's /newsroom/, now listing every story carried over from it. */
export default function Page() {
  return <NewsList posts={NEWS} title="Newsroom" heading="h1" />;
}
