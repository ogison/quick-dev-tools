import { Metadata } from 'next';

import PasswordGenerator from '@/features/tools/password/components/PasswordGenerator';

export const metadata: Metadata = {
  title: 'パスワードジェネレーター',
  description:
    '強力で安全なパスワードを自動生成するオンラインツール。文字種、長さ、複雑度をカスタマイズ可能。セキュリティ強度表示機能付き。',
  keywords: [
    'パスワード生成',
    'パスワードジェネレーター',
    '強力なパスワード',
    'セキュリティ',
    'ランダムパスワード',
    'パスワード作成',
  ],
  openGraph: {
    title: 'パスワードジェネレーター | 開発者ツール集',
    description: '強力で安全なパスワードを自動生成するオンラインツール。セキュリティ強度表示付き。',
    type: 'website',
  },
};

export default function PasswordPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PasswordGenerator />
    </div>
  );
}
