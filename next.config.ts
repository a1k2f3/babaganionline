import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  swcMinify: false,

  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  webpack: (config) => {
    config.cache = false;
    config.parallelism = 1;

    // reduce memory usage
    config.optimization = {
      ...config.optimization,
      minimize: false,
    };

    return config;
  },
};

export default nextConfig;
