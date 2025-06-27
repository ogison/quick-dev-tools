import { Metadata } from 'next';

import JwtDecoder from '@/features/tools/jwt/components/JwtDecoder';

export const metadata: Metadata = {
  title: 'JWT Decoder - 開発者ツール集',
  description: 'JSON Web Token (JWT) のデコード・検証・解析を行うツール',
};

export default function JwtPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">JWT Decoder</h1>
        <p className="text-lg text-gray-600">
          JSON Web Token (JWT) をデコードして、ヘッダー、ペイロード、署名の情報を確認できます
        </p>
      </div>
      <JwtDecoder />
    </div>
  );
}
