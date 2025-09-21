import type { NextConfig } from "next";

const DEFAULT_STALE_TIME = 300;

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: DEFAULT_STALE_TIME,
    },
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "reliable-cuttlefish-158.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "adjoining-husky-26.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "impartial-salamander-276.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "sleek-hornet-520.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
