import { MetadataRoute } from 'next';

const baseUrl = 'https://quick-dev-tools.vercel.app';

// 全ツールのリスト
const tools = [
  'format',
  'timestamp',
  'url-encoder',
  'character-count',
  'uuid-generator',
  'markdown-preview',
];

// その他の静的ページ
const staticPages = [
  '',
  '/tools',
  '/contact',
  '/privacy',
  '/terms',
];

// サポートされているロケール
const locales = ['ja', 'en'];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  // ロケールごとにページを生成
  locales.forEach((locale) => {
    // 静的ページ
    staticPages.forEach((page) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            ja: `${baseUrl}/ja${page}`,
            en: `${baseUrl}/en${page}`,
          },
        },
      });
    });

    // ツールページ
    tools.forEach((tool) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/tools/${tool}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            ja: `${baseUrl}/ja/tools/${tool}`,
            en: `${baseUrl}/en/tools/${tool}`,
          },
        },
      });
    });
  });

  return sitemap;
}
