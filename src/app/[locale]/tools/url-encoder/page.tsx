import { Metadata } from 'next';

import { URLEncoderTool } from '@/features/tools/url-encoder/components';

export const metadata: Metadata = {
  title: 'URLエンコーダー・デコーダー | QuickDevTools',
  description: 'URLを安全にエンコード・デコードするツールです。日本語や特殊文字を含むURLの変換に対応しています。',
};

export default function URLEncoderPage() {
  return <URLEncoderTool />;
}
