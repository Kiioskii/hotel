import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // <- poprawiony host
      },
      {
        protocol: "https",
        hostname: "unsplash.com", // <- poprawiony host
      },
    ],
  },
};

export default nextConfig;
