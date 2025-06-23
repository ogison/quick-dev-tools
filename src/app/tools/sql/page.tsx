import { Metadata } from 'next';
import SqlFormatter from '@/features/tools/sql/components/SqlFormatter';

export const metadata: Metadata = {
  title: 'SQL Formatter - 開発者ツール集',
  description: 'SQLクエリを整形・最適化・検証するツール',
};

export default function SqlPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">SQL Formatter</h1>
        <p className="text-lg text-gray-600">
          SQLクエリを美しく整形し、構文エラーの検出やクエリの解析を行います
        </p>
      </div>
      <SqlFormatter />
    </div>
  );
}