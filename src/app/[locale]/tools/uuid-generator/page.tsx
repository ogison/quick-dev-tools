import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { UUIDGeneratorTool } from '@/features/tools/uuid-generator/components';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.uuidGenerator' });

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    keywords: locale === 'ja'
      ? 'UUID生成, GUID生成, ユニークID, v1 UUID, v4 UUID, オンラインツール'
      : 'UUID generator, GUID generator, unique ID, v1 UUID, v4 UUID, online tool',
    openGraph: {
      title,
      description,
      url: `https://quick-dev-tools.vercel.app/${locale}/tools/uuid-generator`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://quick-dev-tools.vercel.app/${locale}/tools/uuid-generator`,
      languages: {
        ja: 'https://quick-dev-tools.vercel.app/ja/tools/uuid-generator',
        en: 'https://quick-dev-tools.vercel.app/en/tools/uuid-generator',
      },
    },
  };
}

export default function UUIDGeneratorPage() {
  return <UUIDGeneratorTool />;
}
