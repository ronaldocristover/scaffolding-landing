import createNextIntlPlugin from "next-intl/plugin";

import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.edrawsoft.com",
        pathname: "/templates/images/**",
      },
      {
        protocol: "https",
        hostname: "pub-e5f46e0c6d2d4313829c38c984304979.r2.dev",
        pathname: "/**",
      },
    ],
  },
  compress: true,
  reactStrictMode: true,
  cacheComponents: true,
  output: "standalone" as const,
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
