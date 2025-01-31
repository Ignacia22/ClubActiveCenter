import { NextConfig } from "next";

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
        source: "/login",
        destination: "/api/auth/login",
        permanent: true,
      },
    ];
  },
  env: {
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  },
};

export default nextConfig;
