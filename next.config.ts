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
};

export default nextConfig;
