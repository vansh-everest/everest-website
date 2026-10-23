import type { NextConfig } from "next";
import news from "./src/content/news-posts.json";

/** The press stories carried over from WordPress keep their old root addresses (src/lib/news.ts). */
const NEWS_SLUGS = (news as Array<{ slug: string }>).map((p) => p.slug);

/** Old WordPress pages whose job a new page now does. Permanent, so search engines move their ranking across. */
const MOVED: Array<[string, string]> = [
  ["/about-everest-fleet", "/about-us/"],
  ["/our-team", "/about-us/"],
  ["/gallery", "/about-us/"],
  ["/career", "/careers/"],
  ["/job-opening/:path*", "/careers/"],
  ...["performance-head", "junior-technician", "field-sales-executive", "driver-acquisition-head", "city-lead", "associate-technician", "operation-manager", "field-executive-mumbai", "tele-caller-mitr", "mitr", "no-openings"].map(
    (job): [string, string] => [`/${job}`, "/careers/"]
  ),
  ["/everest-employee-mobility", "/employee-mobility/"],
  ["/everest-fleet-logistics", "/fleet-logistics/"],
  ["/drive-with-us/driver-job-in-chennai-2", "/drive-with-us/driver-job-in-chennai/"],
  // The old form's thank-you pages: back to that city's page.
  ...["mumbai", "delhi", "bengaluru", "hyderabad", "chennai", "pune", "kolkata"].map(
    (city): [string, string] => [`/thank-you-${city}`, `/drive-with-us/driver-job-in-${city}/`]
  ),
  ["/thank-you", "/"],
  // A driver guide under its earlier address.
  ["/blog/rent-or-own-a-car", "/blog/lease-or-own-a-car/"],
  // A PDF the old newsroom linked to.
  ["/wp-content/uploads/2026/05/ESG-Report.pdf", "/investors/"],
  // The old sitemaps, as Search Console and robots.txt know them: all to the one sitemap here.
  ...["sitemap_index", "wp-sitemap", "page-sitemap", "post-sitemap", "category-sitemap", "author-sitemap"].map(
    (name): [string, string] => [`/${name}.xml`, "/sitemap.xml"]
  ),
];

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Next guess the wrong workspace root.
  turbopack: { root: __dirname },
  // The live property serves every address with a trailing slash. Those are the addresses
  // that rank, so this application has to answer on exactly the same ones.
  trailingSlash: true,
  // Images uploaded in /admin live in Vercel Blob. Only that host is allowed, so the image
  // optimiser never fetches from an arbitrary address pasted into the admin.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" },
      // Photos uploaded through Jarvis: its public Cloudflare buckets (production, staging).
      { protocol: "https", hostname: "efpp.everestfleet.com", pathname: "/website/**" },
      { protocol: "https", hostname: "efps.everestfleet.com", pathname: "/website/**" },
      // Jarvis's car photos, used for a car the admin has no photo of.
      { protocol: "https", hostname: "*.r2.dev", pathname: "/onboard/**" },
    ],
  },
  // Until everestfleet.com points here, the site answers only on its host's own addresses
  // (*.vercel.app, *.amplifyapp.com) and on website-admin.everestfleet.com. Those copies must stay
  // out of search results, or they would compete with the real domain at launch. The header is
  // tied to the host, so the real domain never carries it.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(.*\\.(vercel\\.app|amplifyapp\\.com)|website-admin\\.everestfleet\\.com)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  // Addresses from the WordPress site that have a new home here.
  async redirects() {
    return [
      { source: "/OwnNow", destination: "/own-now/", permanent: true },
      { source: "/OwnNow/:path*", destination: "/own-now/", permanent: true },
      ...MOVED.map(([source, destination]) => ({ source, destination, permanent: true })),
      // A story has one address, its old one; the route that renders it is not a second.
      // Named one by one: /news/ also holds the stories' images.
      ...NEWS_SLUGS.map((slug) => ({ source: `/news/${slug}`, destination: `/${slug}/`, permanent: true })),
    ];
  },
  // Each story is served at its old root address by the /news/[slug] route.
  async rewrites() {
    return NEWS_SLUGS.map((slug) => ({ source: `/${slug}`, destination: `/news/${slug}` }));
  },
};

export default nextConfig;
