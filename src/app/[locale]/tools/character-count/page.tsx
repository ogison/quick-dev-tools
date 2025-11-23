import { Metadata } from 'next';

import CharacterCountTool from '@/features/tools/character-count/components';

export const metadata: Metadata = {
  title: '文字数カウント | QuickDevTools',
  description: 'テキストの文字数、単語数、バイト数を詳細にカウントします。',
};

export default function CharacterCountPage() {
  return <CharacterCountTool />;
}