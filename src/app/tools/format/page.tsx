import { Metadata } from 'next';

import FormatTool from '@/features/tools/format/components';

export const metadata: Metadata = {
  title: 'なんでもフォーマッター | QuickDevTools',
  description: 'JSON, YAML, SQL, XMLなどのフォーマットを整形します。',
};

export default function FormatPage() {
  return <FormatTool />;
}
