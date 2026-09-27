import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The development badge otherwise covers the mobile Windows Start button.
  devIndicators: false,
  outputFileTracingRoot: path.join(__dirname, ".."),
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ghchart.rshah.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
