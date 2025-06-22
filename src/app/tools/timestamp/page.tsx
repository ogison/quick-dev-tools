import TimestampConverter from '@/features/tools/timestamp/components/TimestampConverter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'タイムスタンプ変換ツール',
  description: 'Unixタイムスタンプと日付を相互変換するオンラインツール。ミリ秒、秒単位に対応し、タイムゾーン考慮、現在時刻表示機能付き。',
  keywords: ['タイムスタンプ', 'Unixタイムスタンプ', 'UNIX時間', 'エポック秒', '日付変換', 'timestamp変換', '時刻変換'],
  openGraph: {
    title: 'タイムスタンプ変換ツール | 開発者ツール集',
    description: 'Unixタイムスタンプと日付を相互変換するオンラインツール。ミリ秒、秒単位に対応。',
    type: 'website',
  },
};

export default function TimestampPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TimestampConverter />
    </div>
  );
}