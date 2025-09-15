import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript:{
    ignoreBuildErrors: true,
  },
  experimental: {
    staleTimes:{
      dynamic: 30,
      static: 60 * 5
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      
      
    ],
  }
};

export default nextConfig;
