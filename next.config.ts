import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.160"],
  images: {
    domains: ["flagcdn.com"],
  },
};

export default nextConfig;
