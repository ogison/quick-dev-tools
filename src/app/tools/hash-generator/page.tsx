import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const HashGenerator = dynamic(() => import('@/features/tools/hash-generator/components/HashGenerator'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-96" />,
  ssr: false
});

export const metadata: Metadata = {
  title: 'ハッシュ生成ツール',
  description: 'テキストからMD5、SHA-1、SHA-256、SHA-512などのハッシュ値を生成するオンラインツール。パスワードのハッシュ化やデータ整合性確認に最適。',
  keywords: ['ハッシュ生成', 'MD5', 'SHA-256', 'SHA-512', 'SHA-1', 'ハッシュ関数', 'チェックサム', '暗号化ハッシュ'],
  openGraph: {
    title: 'ハッシュ生成ツール | 開発者ツール集',
    description: 'テキストからMD5、SHA-1、SHA-256、SHA-512などのハッシュ値を生成するオンラインツール。',
    type: 'website',
  },
};

export default function HashGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HashGenerator />
    </div>
  );
}