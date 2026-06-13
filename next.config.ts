import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    unoptimized: process.env.NODE_ENV === "production",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
