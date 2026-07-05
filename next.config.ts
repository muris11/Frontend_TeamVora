import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.teamvora.web.id',
      },
      {
        protocol: 'https',
        hostname: 'cdnteamvora.center.biz.id',
      },
    ],
  },
};

export default nextConfig;
