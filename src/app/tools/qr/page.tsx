import { Metadata } from 'next';
import { Suspense } from 'react';

import QrGenerator from '@/features/tools/qr/components/QrGenerator';

export const metadata: Metadata = {
  title: 'QRコードジェネレーター',
  description:
    'テキストやURLからQRコードを生成するオンラインツール。サイズ、色、エラー訂正レベルのカスタマイズが可能。PNG、SVG形式でダウンロード可能。',
  keywords: [
    'QRコード',
    'QRコード生成',
    'QRコード作成',
    '二次元コード',
    'QRジェネレーター',
    'QRコードメーカー',
  ],
  openGraph: {
    title: 'QRコードジェネレーター | 開発者ツール集',
    description: 'テキストやURLからQRコードを生成するオンラインツール。カスタマイズ可能。',
    type: 'website',
  },
};

export default function QrPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-gray-200" />}>
        <QrGenerator />
      </Suspense>
    </div>
  );
}
