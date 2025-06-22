import { Metadata } from 'next';

import RegexTester from '@/features/tools/regex/components/RegexTester';

export const metadata: Metadata = {
  title: '正規表現テスター',
  description:
    '正規表現パターンをリアルタイムでテスト・検証するオンラインツール。マッチ結果のハイライト、グループ抽出、フラグ設定に対応。',
  keywords: [
    '正規表現',
    'regex',
    '正規表現テスター',
    'パターンマッチング',
    'regexp',
    '正規表現チェッカー',
    '正規表現検証',
  ],
  openGraph: {
    title: '正規表現テスター | 開発者ツール集',
    description: '正規表現パターンをリアルタイムでテスト・検証するオンラインツール。',
    type: 'website',
  },
};

export default function RegexPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <RegexTester />
    </div>
  );
}
