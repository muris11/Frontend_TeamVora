import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
let apiHostname = "";
let apiPort = "";
let apiProtocol = "https";

try {
  if (apiUrl) {
    const url = new URL(apiUrl);
    apiHostname = url.hostname;
    apiPort = url.port;
    apiProtocol = url.protocol.replace(":", "");
  }
} catch (e) {
  // Ignore invalid URL
}

const remotePatterns: any[] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https",
    hostname: "cdn.teamvora.web.id",
  },
];

if (apiHostname) {
  remotePatterns.push({
    protocol: apiProtocol,
    hostname: apiHostname,
    ...(apiPort ? { port: apiPort } : {}),
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
