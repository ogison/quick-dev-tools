import { Metadata } from 'next';
import CsvJsonConverter from '@/features/tools/csv-json/components/CsvJsonConverter';

export const metadata: Metadata = {
  title: 'CSV to JSON Converter - 開発者ツール集',
  description: 'CSV形式とJSON形式のデータを相互に変換するツール',
};

export default function CsvJsonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">CSV ⇄ JSON Converter</h1>
        <p className="text-lg text-gray-600">
          CSV形式とJSON形式のデータを相互変換し、カスタム設定やデータ型推定が可能です
        </p>
      </div>
      <CsvJsonConverter />
    </div>
  );
}