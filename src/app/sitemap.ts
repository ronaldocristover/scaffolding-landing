import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://leegoscaffolding.com";

  // Define your routes here
  const routes = [
    {
      path: "",
      priority: 1,
      changeFrequency: "weekly" as const,
    },
    // Add other routes e.g. '/about', '/contact' if they exist independently
  ];

  const locales = [
    { code: "zh", lang: "zh-HK" },
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

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8, // Lower priority for root, it redirects
    },
    ...sitemapEntries,
  ];
}
