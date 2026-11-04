import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/company";

/**
 * Crawlers are named explicitly rather than relying on a blanket allow.
 *
 * The AI search crawlers are separate from the AI training crawlers and are what decide
 * whether we can be cited in an answer: OAI-SearchBot feeds ChatGPT's search index,
 * PerplexityBot feeds Perplexity, and Google-Extended governs Gemini grounding.
 *
 * Cloudflare prepends its own managed block to this file on the live site, which disallows
 * GPTBot, ClaudeBot, Google-Extended and other training crawlers. That block is a Cloudflare
 * dashboard setting, not this code. Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User and
 * PerplexityBot are not in it, so search and ChatGPT answers are unaffected.
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
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/thank-you"] },
      { userAgent: searchAndAssistants, allow: "/", disallow: ["/api/", "/admin/", "/thank-you"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
