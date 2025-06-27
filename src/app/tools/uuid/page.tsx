import { Metadata } from 'next';

import UuidGenerator from '@/features/tools/uuid/components/UuidGenerator';

export const metadata: Metadata = {
  title: 'UUID Generator - 開発者ツール集',
  description: 'UUID (Universally Unique Identifier) の生成・検証・一括生成ツール',
};

export default function UuidPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">UUID Generator</h1>
        <p className="text-lg text-gray-600">
          Version 1、4、5のUUIDを生成し、既存のUUIDの検証や一括生成が可能です
        </p>
      </div>
      <UuidGenerator />
    </div>
  );
}
