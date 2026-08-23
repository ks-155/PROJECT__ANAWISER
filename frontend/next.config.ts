import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@anawiser/backend",
    "@anawiser/ai-scraper",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
