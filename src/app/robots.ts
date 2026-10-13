import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    // Moderation and the Lab API are not for search engines.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/id/lab/admin', '/en/lab/admin'] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
