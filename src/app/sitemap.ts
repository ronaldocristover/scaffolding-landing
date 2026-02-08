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

  const locales = ["zh", "en"];

  // Generate sitemap entries for each locale
  const sitemapEntries = routes.flatMap((route) => {
    return locales.map((locale) => {
      return {
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority * (locale === "en" ? 1 : 0.9), // Slightly lower priority for alternate language
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
