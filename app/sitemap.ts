import type { MetadataRoute } from 'next';
import { articles, siteUrl } from '@/lib/knowledge';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/knowledge` },
    ...articles.map((article) => ({ url: `${siteUrl}/knowledge/${article.slug}`, lastModified: article.updatedAt })),
  ];
}
