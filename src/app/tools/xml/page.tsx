import { Metadata } from 'next';

import XmlFormatter from '@/features/tools/xml/components/XmlFormatter';

export const metadata: Metadata = {
  title: 'XML Formatter - 開発者ツール集',
  description: 'XMLの整形・検証・JSON変換を行うツール',
};

export default function XmlPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">XML Formatter</h1>
        <p className="text-lg text-gray-600">
          XMLの整形、検証、圧縮、JSON変換を行い、構造を分析できます
        </p>
      </div>
      <XmlFormatter />
    </div>
  );
}
