import ColorPalette from '@/features/tools/color/components/ColorPalette';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'カラーパレットジェネレーター',
  description: '美しいカラーパレットを自動生成するオンラインツール。HEX、RGB、HSL形式に対応し、グラデーションや補色、類似色の生成が可能。',
  keywords: ['カラーパレット', '色生成', 'カラーピッカー', '配色ツール', 'HEX', 'RGB', 'HSL', 'グラデーション'],
  openGraph: {
    title: 'カラーパレットジェネレーター | 開発者ツール集',
    description: '美しいカラーパレットを自動生成するオンラインツール。HEX、RGB、HSL形式に対応。',
    type: 'website',
  },
};

export default function ColorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ColorPalette />
    </div>
  );
}