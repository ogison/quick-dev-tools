import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://quick-dev-tools.vercel.app/sitemap.xml',
    host: 'https://quick-dev-tools.vercel.app',
  };
}
