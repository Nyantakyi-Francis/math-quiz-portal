import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ??
  "https://math-quiz-portal-j83k.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}

