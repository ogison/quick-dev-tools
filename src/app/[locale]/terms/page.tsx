import { Metadata } from 'next';

import TermsPage from '@/features/terms/components/TermsPage';

export const metadata: Metadata = {
  title: '利用規約 | QuickDevTools',
  description: 'QuickDevToolsの利用規約とよくある質問をご確認ください。',
};

export default function Terms() {
  return <TermsPage />;
}
