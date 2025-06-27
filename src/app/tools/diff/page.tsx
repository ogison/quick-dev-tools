import { Metadata } from 'next';

import DiffChecker from '@/features/tools/diff/components/DiffChecker';

export const metadata: Metadata = {
  title: 'Diff Checker - 開発者ツール集',
  description: '2つのテキストの差分を視覚的に比較するツール',
};

export default function DiffPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Diff Checker</h1>
        <p className="text-lg text-gray-600">
          2つのテキストの差分を視覚的に比較し、追加・削除・変更箇所を確認できます
        </p>
      </div>
      <DiffChecker />
    </div>
  );
}
