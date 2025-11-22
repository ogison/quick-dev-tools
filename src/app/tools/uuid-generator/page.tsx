import { Metadata } from 'next';

import { UUIDGeneratorTool } from '@/features/tools/uuid-generator/components';

export const metadata: Metadata = {
  title: 'UUID生成ツール | QuickDevTools',
  description: 'UUID（Universally Unique Identifier）を簡単に生成できるツールです。v1、v4、Nil UUIDに対応しています。',
};

export default function UUIDGeneratorPage() {
  return <UUIDGeneratorTool />;
}
