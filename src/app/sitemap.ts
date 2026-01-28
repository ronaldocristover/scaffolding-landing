import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://leegoscaffolding.com";

  // Define your routes here
  const routes = [
    "",
    // Add other routes e.g. '/about', '/contact' if they exist independently
  ];

  const locales = ["zh", "en"];

  // Generate sitemap entries for each locale
  const sitemapEntries = routes.flatMap((route) => {
    return locales.map((locale) => {
      return {
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
      };
    });
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...sitemapEntries,
  ];
}
