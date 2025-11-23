import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import ToolsDirectory from '@/features/tools/components';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools' });

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    keywords: locale === 'ja'
      ? '開発ツール, プログラミングツール, フォーマッター, コンバーター, エンコーダー, ジェネレーター, ユーティリティ, 無料ツール'
      : 'developer tools, programming tools, formatter, converter, encoder, generator, utility, free tools',
    openGraph: {
      title,
      description,
      url: `https://quick-dev-tools.vercel.app/${locale}/tools`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://quick-dev-tools.vercel.app/${locale}/tools`,
      languages: {
        ja: 'https://quick-dev-tools.vercel.app/ja/tools',
        en: 'https://quick-dev-tools.vercel.app/en/tools',
      },
    },
  };
}

export default function ToolsPage() {
  return <ToolsDirectory />;
}
