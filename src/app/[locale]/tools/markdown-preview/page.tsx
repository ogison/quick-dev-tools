import { Metadata } from 'next';

import { MarkdownPreviewTool } from '@/features/tools/markdown-preview/components';

export const metadata: Metadata = {
  title: 'Markdownプレビュー | Quick Dev Tools',
  description:
    'Markdownをリアルタイムでプレビュー。GitHub Flavored Markdown対応、HTMLエクスポート可能。',
};

export default function MarkdownPreviewPage() {
  return <MarkdownPreviewTool />;
}
