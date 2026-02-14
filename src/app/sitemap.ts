import { MetadataRoute } from "next";

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
  const baseUrl = "https://leegoscaffolding.com";

  return routes.map((route) => ({
    url: `${baseUrl}/${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
