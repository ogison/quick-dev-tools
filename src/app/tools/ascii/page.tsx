import { Metadata } from 'next';
import AsciiGenerator from '@/features/tools/ascii/components/AsciiGenerator';

export const metadata: Metadata = {
  title: 'ASCII Art Generator - 開発者ツール集',
  description: 'テキストや画像からASCIIアートを生成するツール',
};

export default function AsciiPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">ASCII Art Generator</h1>
        <p className="text-lg text-gray-600">
          テキスト、画像、パターンからASCIIアートを生成できます
        </p>
      </div>
      <AsciiGenerator />
    </div>
  );
}