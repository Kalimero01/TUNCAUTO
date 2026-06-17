import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/admin/chat", destination: "/admin/submissions", permanent: true },
      { source: "/admin/chat/:id", destination: "/admin/submissions/:id", permanent: true },
      { source: "/admin/vision-mission", destination: "/admin", permanent: true },
      { source: "/vizyon-misyon", destination: "/hakkimizda", permanent: true },
      { source: "/sat/mesaj/:id", destination: "/sat", permanent: true },
    ];
  },
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
