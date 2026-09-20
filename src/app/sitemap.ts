import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/company";

/**
 * Routes are listed here rather than discovered, so a page cannot ship without a
 * deliberate decision about whether search engines should see it.
 *
 * The eight driver addresses on the live WordPress property are the only pages the
 * company currently ranks for. They are not in this application yet and must be added
 * at their exact existing paths before the domain is pointed here.
 */
const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/own-now", priority: 0.9, changeFrequency: "weekly" },
  { path: "/our-services", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about-us", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
