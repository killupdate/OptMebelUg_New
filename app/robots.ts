import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/knowledge';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/optmebelug_adm'] }, sitemap: `${siteUrl}/sitemap.xml` };
}
