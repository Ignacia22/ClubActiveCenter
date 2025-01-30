import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite cualquier dominio HTTPS
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/api/auth/login', 
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
