import { Metadata } from 'next';
import ImageCompressor from '@/features/tools/image/components/ImageCompressor';

export const metadata: Metadata = {
  title: 'Image Compressor - 開発者ツール集',
  description: '画像圧縮・リサイズ・WebP変換を行うツール',
};

export default function ImagePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Image Compressor</h1>
        <p className="text-lg text-gray-600">
          画像の圧縮、リサイズ、フォーマット変換を行い、ファイルサイズを最適化します
        </p>
      </div>
      <ImageCompressor />
    </div>
  );
}