import JsonFormatter from '@/features/tools/json/components/JsonFormatter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON整形ツール',
  description: 'JSONデータを美しく整形・検証するオンラインツール。構文エラーチェック、インデント調整、圧縮機能付き。開発者向けの無料JSONフォーマッター。',
  keywords: ['JSON', 'JSON整形', 'JSONフォーマッター', 'JSON検証', 'JSON美化', 'JSONパーサー', 'JSON構文チェック'],
  openGraph: {
    title: 'JSON整形ツール | 開発者ツール集',
    description: 'JSONデータを美しく整形・検証するオンラインツール。構文エラーチェック、インデント調整、圧縮機能付き。',
    type: 'website',
  },
};

export default function JsonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <JsonFormatter />
    </div>
  );
}