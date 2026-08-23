import path from "node:path";
import fs from "node:fs";
import type { NextConfig } from "next";

function monorepoRoot() {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, "backend", "package.json"))) {
    return cwd;
  }
  const parent = path.join(cwd, "..");
  if (fs.existsSync(path.join(parent, "backend", "package.json"))) {
    return parent;
  }
  return cwd;
}

const nextConfig: NextConfig = {
  transpilePackages: [
    "@anawiser/backend",
    "@anawiser/ai-scraper",
  ],
  outputFileTracingRoot: monorepoRoot(),
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
