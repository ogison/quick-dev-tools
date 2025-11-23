import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { URLEncoderTool } from '@/features/tools/url-encoder/components';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.urlEncoder' });

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    keywords: locale === 'ja'
      ? 'URLエンコード, URLデコード, パーセントエンコーディング, URL変換, オンラインツール'
      : 'URL encode, URL decode, percent encoding, URL converter, online tool',
    openGraph: {
      title,
      description,
      url: `https://quick-dev-tools.vercel.app/${locale}/tools/url-encoder`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://quick-dev-tools.vercel.app/${locale}/tools/url-encoder`,
      languages: {
        ja: 'https://quick-dev-tools.vercel.app/ja/tools/url-encoder',
        en: 'https://quick-dev-tools.vercel.app/en/tools/url-encoder',
      },
    },
  };
}

export default function URLEncoderPage() {
  return <URLEncoderTool />;
}
