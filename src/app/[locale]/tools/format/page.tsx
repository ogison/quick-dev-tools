import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import FormatTool from '@/features/tools/format/components';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.format' });

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    keywords: locale === 'ja'
      ? 'JSON整形, YAML整形, XML整形, SQL整形, フォーマッター, コード整形, オンラインツール, 無料ツール'
      : 'JSON formatter, YAML formatter, XML formatter, SQL formatter, code formatter, online tool, free tool',
    openGraph: {
      title,
      description,
      url: `https://quick-dev-tools.vercel.app/${locale}/tools/format`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://quick-dev-tools.vercel.app/${locale}/tools/format`,
      languages: {
        ja: 'https://quick-dev-tools.vercel.app/ja/tools/format',
        en: 'https://quick-dev-tools.vercel.app/en/tools/format',
      },
    },
  };
}

export default function FormatPage() {
  return <FormatTool />;
}
