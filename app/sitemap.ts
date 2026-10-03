import type { MetadataRoute } from "next";
import { getConfiguredSiteUrl } from "@/lib/site/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getConfiguredSiteUrl();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4
    }
  ];
}
