import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@anawiser/backend",
    "@anawiser/ai-scraper",
  ],
  // Required when Vercel Root Directory is `frontend` so serverless
  // functions can include the sibling workspace packages.
  outputFileTracingRoot: path.join(__dirname, ".."),
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
