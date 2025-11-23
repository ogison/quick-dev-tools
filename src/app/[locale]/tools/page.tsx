import { Metadata } from 'next';

import ToolsDirectory from '@/features/tools/components';

export const metadata: Metadata = {
  title: 'Developer Tools | QuickDevTools',
  description:
    '開発者のためのツールコレクション。フォーマッター、コンバーター、エンコーダーなど様々なツールを提供しています。',
};

export default function ToolsPage() {
  return <ToolsDirectory />;
}
