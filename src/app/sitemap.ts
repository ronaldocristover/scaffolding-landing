import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://leegoscaffolding.com";

  /**
   * IMPORTANT: Only include final destination URLs in the sitemap
   * 
   * The root URL (/) is intentionally excluded because:
   * 1. Middleware redirects / to /zh with a 301 permanent redirect
   * 2. Google Search Console reports "Redirect error" when encountering redirect chains
   * 3. Best practice is to submit only the final destination URLs for indexing
   * 
   * This sitemap only includes localized URLs (/zh, /en) which are accessible
   * without any redirects, ensuring clean indexing by search engines.
   */
  const routes = [
    {
      path: "", // Empty path generates /zh and /en (homepage for each locale)
      priority: 1,
      changeFrequency: "weekly" as const,
    },
    // Add other routes here as they are created (e.g. '/about', '/services', '/contact')
    // Ensure all routes are accessible without redirects
  ];

  const locales = [
    { code: "zh", lang: "zh-HK" }, // Primary market
    { code: "en", lang: "en-US" },
  ];

  // Generate sitemap entries for each locale
  const sitemapEntries = routes.flatMap((route) => {
    return locales.map((locale) => {
      return {
        url: `${baseUrl}/${locale.code}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority * (locale.code === "zh" ? 1 : 0.9), // Higher priority for Chinese (primary market)
        alternates: {
          languages: {
            zh: `${baseUrl}/zh${route.path}`,
            "zh-HK": `${baseUrl}/zh${route.path}`,
            en: `${baseUrl}/en${route.path}`,
          },
        },
      };
    });
  });

  return sitemapEntries;
}
