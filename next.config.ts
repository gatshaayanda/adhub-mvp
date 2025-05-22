import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Any other config options below
};

export default nextConfig;
