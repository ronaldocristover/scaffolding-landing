import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    remotePatterns: [
      new URL("https://www.edrawsoft.com/templates/images/**"),
      new URL("https://pub-e5f46e0c6d2d4313829c38c984304979.r2.dev/**"),
    ],
  },
  cacheComponents: true,
};

export default withNextIntl(nextConfig);
