import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // You can add other config options here if needed
  // Example:
  // reactStrictMode: true,
  // swcMinify: true,

  images: {
    // Allows images from Cloudinary (very common for Next.js apps)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // pathname: "/**" is optional but fine — it allows any path under the domain
        pathname: "/**",
      },
      // Optional: add more patterns if you use other CDNs / hosts
      // {
      //   protocol: "https",
      //   hostname: "images.unsplash.com",
      // },
    ],
    unoptimized: true,
  },
};

export default nextConfig;