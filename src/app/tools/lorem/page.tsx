import { Metadata } from 'next';

import LoremIpsum from '@/features/tools/lorem/components/LoremIpsum';

export const metadata: Metadata = {
  title: 'Lorem Ipsumジェネレーター',
  description:
    'ダミーテキスト（Lorem Ipsum）を生成するオンラインツール。段落数、単語数、文字数を指定してカスタマイズ可能。デザインモックアップに最適。',
  keywords: [
    'Lorem Ipsum',
    'ダミーテキスト',
    'プレースホルダー',
    'モックテキスト',
    'サンプルテキスト',
    'ダミー文章',
  ],
  openGraph: {
    title: 'Lorem Ipsumジェネレーター | 開発者ツール集',
    description:
      'ダミーテキスト（Lorem Ipsum）を生成するオンラインツール。デザインモックアップに最適。',
    type: 'website',
  },
};

export default function LoremPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoremIpsum />
    </div>
  );
}
