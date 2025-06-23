import { Metadata } from 'next';
import MarkdownEditor from '@/features/tools/markdown-editor/components/MarkdownEditor';

export const metadata: Metadata = {
  title: 'Markdown Editor - 開発者ツール集',
  description: 'リアルタイムプレビュー付きMarkdownエディター',
};

export default function MarkdownEditorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Markdown Editor</h1>
        <p className="text-lg text-gray-600">
          リアルタイムプレビュー、ツールバー、キーボードショートカット対応のMarkdownエディター
        </p>
      </div>
      <MarkdownEditor />
    </div>
  );
}