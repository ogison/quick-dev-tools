import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CharacterCountTool from '@/features/tools/character-count/components';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.characterCount' });

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    keywords: locale === 'ja'
      ? '文字数カウント, 文字カウンター, ワードカウント, テキスト解析, オンラインツール'
      : 'character count, word count, character counter, text analysis, online tool',
    openGraph: {
      title,
      description,
      url: `https://quick-dev-tools.vercel.app/${locale}/tools/character-count`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://quick-dev-tools.vercel.app/${locale}/tools/character-count`,
      languages: {
        ja: 'https://quick-dev-tools.vercel.app/ja/tools/character-count',
        en: 'https://quick-dev-tools.vercel.app/en/tools/character-count',
      },
    },
  };
}

export default function CharacterCountPage() {
  return <CharacterCountTool />;
}