import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this section to disable type errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  /* other config options here, if any */
};

export default nextConfig;
