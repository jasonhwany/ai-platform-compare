import type { MetadataRoute } from "next";
import { platforms } from "./data/platforms";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-platform-compare.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const platformPages: MetadataRoute.Sitemap = platforms.map((platform) => ({
    url: `${siteUrl}/platform/${platform.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const comparePages: MetadataRoute.Sitemap = platforms.flatMap((a, i) =>
    platforms.slice(i + 1).map((b) => ({
      url: `${siteUrl}/compare/${a.id}-vs-${b.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
  );

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...platformPages,
    ...comparePages,
  ];
}
