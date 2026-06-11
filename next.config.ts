import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.160"],
  images: {
    domains: ["flagcdn.com", "images.unsplash.com", "api.dicebear.com"],
  },
};

export default nextConfig;
