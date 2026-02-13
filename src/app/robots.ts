import { MetadataRoute } from "next";

/**
 * Robots.txt configuration for search engine crawlers
 * 
 * This configuration:
 * 1. Allows all crawlers to access the site (including root path)
 * 2. Disallows crawling of API routes, Next.js internals, and favicon directory
 * 3. Points crawlers to the sitemap which contains only final destination URLs
 * 
 * Note: While we allow crawlers to access "/", the sitemap only includes
 * localized URLs (/zh, /en) to avoid redirect errors during indexing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/favicon/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: "https://leegoscaffolding.com/sitemap.xml",
    host: "https://leegoscaffolding.com",
  };
}
