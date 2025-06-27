import { Metadata } from 'next';

import MarkdownEditorLoader from '@/features/tools/markdown-editor/components/MarkdownEditorLoader';

export const metadata: Metadata = {
  title: 'Markdown Editor - 開発者ツール集',
  description: 'リアルタイムプレビュー付きMarkdownエディター',
};

export default function MarkdownEditorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Markdown Editor</h1>
        <p className="text-lg text-gray-600">
          リアルタイムプレビュー、ツールバー、キーボードショートカット対応のMarkdownエディター
        </p>
      </div>
      <MarkdownEditorLoader />
    </div>
  );
}
