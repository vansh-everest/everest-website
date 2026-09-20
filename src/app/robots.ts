import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/company";

/**
 * Crawlers are named explicitly rather than relying on a blanket allow.
 *
 * The AI search crawlers are separate from the AI training crawlers and are what decide
 * whether we can be cited in an answer: OAI-SearchBot feeds ChatGPT's search index,
 * PerplexityBot feeds Perplexity, and Google-Extended governs Gemini grounding.
 * All three are already reaching the live property, so the citation gap is content.
 */
export default function robots(): MetadataRoute.Robots {
  const searchAndAssistants = [
    "Googlebot",
    "Bingbot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "GPTBot",
    "PerplexityBot",
    "Google-Extended",
    "ClaudeBot",
    "Applebot",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you"] },
      { userAgent: searchAndAssistants, allow: "/", disallow: ["/api/", "/thank-you"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
