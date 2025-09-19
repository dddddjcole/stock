import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["assets.aceternity.com"],
  },
  allowedDevOrigins: ["http://8.136.0.86:3000", "http://localhost:3000"],
};

export default nextConfig;
