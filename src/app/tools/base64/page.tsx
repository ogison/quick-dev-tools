import { Metadata } from 'next';

import Base64Encoder from '@/features/tools/base64/components/Base64Encoder';

export const metadata: Metadata = {
  title: 'Base64 エンコード/デコード',
  description:
    'テキストやファイルをBase64形式にエンコード・デコードするオンラインツール。画像、テキスト、バイナリデータの変換に対応。',
  keywords: [
    'Base64',
    'Base64エンコード',
    'Base64デコード',
    'Base64変換',
    'エンコーダー',
    'デコーダー',
    'Base64コンバーター',
  ],
  openGraph: {
    title: 'Base64 エンコード/デコードツール | 開発者ツール集',
    description: 'テキストやファイルをBase64形式にエンコード・デコードするオンラインツール。',
    type: 'website',
  },
};

export default function Base64Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Base64Encoder />
    </div>
  );
}
