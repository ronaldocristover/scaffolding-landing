import { MetadataRoute } from "next";
import { SUPPORTED_DOMAINS } from "@/lib/domain";

// Define routes with their priorities and change frequencies
const routes = [
  {
    path: "",
    priority: 1.0,
    changeFrequency: "weekly" as const,
  },
  {
    path: "#about",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "#contact",
    priority: 0.9,
    changeFrequency: "monthly" as const,
  },
  {
    path: "#company-logos",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "#video",
    priority: 0.6,
    changeFrequency: "weekly" as const,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Generate sitemap entries for both domains
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Get primary domains (without www) for cleaner sitemap
  const primaryDomains = SUPPORTED_DOMAINS.filter(
    (domain) => !domain.startsWith('www.')
  );

  // Generate entries for each domain
  for (const domain of primaryDomains) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `https://${domain}/${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  return sitemapEntries;
}
