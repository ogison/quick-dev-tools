import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { MarkdownPreviewTool } from '@/features/tools/markdown-preview/components';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.markdownPreview' });

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    keywords: locale === 'ja'
      ? 'Markdownプレビュー, マークダウンエディタ, GFM, GitHub Flavored Markdown, リアルタイムプレビュー, オンラインツール'
      : 'Markdown preview, markdown editor, GFM, GitHub Flavored Markdown, real-time preview, online tool',
    openGraph: {
      title,
      description,
      url: `https://quick-dev-tools.vercel.app/${locale}/tools/markdown-preview`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://quick-dev-tools.vercel.app/${locale}/tools/markdown-preview`,
      languages: {
        ja: 'https://quick-dev-tools.vercel.app/ja/tools/markdown-preview',
        en: 'https://quick-dev-tools.vercel.app/en/tools/markdown-preview',
      },
    },
  };
}

export default function MarkdownPreviewPage() {
  return <MarkdownPreviewTool />;
}
