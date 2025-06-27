import { Metadata } from 'next';

import MarkdownLoader from '@/features/tools/markdown/components/MarkdownLoader';

export const metadata: Metadata = {
  title: 'Markdown Preview - 開発者ツール集',
  description: 'Markdownをリアルタイムでプレビューし、HTML形式でエクスポートできるツール',
};

export default function MarkdownPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Markdown Preview</h1>
        <p className="text-lg text-gray-600">
          Markdownをリアルタイムでプレビューし、目次生成や統計情報の確認も可能です
        </p>
      </div>
      <MarkdownLoader />
    </div>
  );
}
