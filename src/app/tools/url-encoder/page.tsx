import { Metadata } from 'next';

import UrlEncoder from '@/features/tools/url-encoder/components/UrlEncoder';

export const metadata: Metadata = {
  title: 'URLエンコード/デコード',
  description:
    'URLをエンコード・デコードするオンラインツール。パーセントエンコーディングの変換やクエリパラメータのエスケープ処理に対応。',
  keywords: [
    'URLエンコード',
    'URLデコード',
    'パーセントエンコーディング',
    'URIエンコード',
    'encodeURIComponent',
    'decodeURIComponent',
  ],
  openGraph: {
    title: 'URLエンコード/デコードツール | 開発者ツール集',
    description:
      'URLをエンコード・デコードするオンラインツール。パーセントエンコーディングの変換に対応。',
    type: 'website',
  },
};

export default function UrlEncoderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <UrlEncoder />
    </div>
  );
}
