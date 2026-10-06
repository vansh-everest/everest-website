import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Next guess the wrong workspace root.
  turbopack: { root: __dirname },
  // The live property serves every address with a trailing slash. Those are the addresses
  // that rank, so this application has to answer on exactly the same ones.
  trailingSlash: true,
  // Images uploaded in /admin live in Vercel Blob. Only that host is allowed, so the image
  // optimiser never fetches from an arbitrary address pasted into the admin.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/**" }],
  },
  // Until everestfleet.com points here, the site answers only on *.vercel.app. Those copies
  // must stay out of search results, or they would compete with the real domain at launch.
  // The header is tied to the host, so it disappears on its own once the domain moves.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  // Addresses from the WordPress site that have a new home here.
  async redirects() {
    return [
      { source: "/OwnNow", destination: "/own-now/", permanent: true },
      { source: "/OwnNow/:path*", destination: "/own-now/", permanent: true },
    ];
  },
};

export default nextConfig;
