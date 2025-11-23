import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { TimestampTool } from '@/features/tools/timestamp/components/TimestampTool';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.timestamp' });

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    keywords: locale === 'ja'
      ? 'UNIX時間, タイムスタンプ変換, エポック時間, 日付変換, 時間変換ツール, オンラインツール'
      : 'Unix timestamp, epoch time, timestamp converter, date converter, time conversion tool, online tool',
    openGraph: {
      title,
      description,
      url: `https://quick-dev-tools.vercel.app/${locale}/tools/timestamp`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://quick-dev-tools.vercel.app/${locale}/tools/timestamp`,
      languages: {
        ja: 'https://quick-dev-tools.vercel.app/ja/tools/timestamp',
        en: 'https://quick-dev-tools.vercel.app/en/tools/timestamp',
      },
    },
  };
}

export default function TimestampPage() {
  return <TimestampTool />;
}
