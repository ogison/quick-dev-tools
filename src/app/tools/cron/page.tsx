import { Metadata } from 'next';
import CronGenerator from '@/features/tools/cron/components/CronGenerator';

export const metadata: Metadata = {
  title: 'Cron Expression Generator - 開発者ツール集',
  description: 'Cron式の生成・解析・検証を行うビジュアルエディター',
};

export default function CronPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Cron Expression Generator</h1>
        <p className="text-lg text-gray-600">
          ビジュアルエディターでCron式を生成し、次回実行時刻の確認ができます
        </p>
      </div>
      <CronGenerator />
    </div>
  );
}