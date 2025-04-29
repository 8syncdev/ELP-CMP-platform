import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/nextjs-djninex-store.appspot.com/**"
      }
    ],
    unoptimized: true
  },
};

export default nextConfig;
