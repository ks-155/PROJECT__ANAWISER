import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@anawiser/backend",
    "@anawiser/ai-scraper",
    "@splinetool/runtime",
    "@splinetool/react-spline",
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
