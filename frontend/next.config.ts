import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@anawiser/backend", "@anawiser/ai-scraper", "@splinetool/runtime"],
};

export default nextConfig;
