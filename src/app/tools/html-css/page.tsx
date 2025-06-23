import { Metadata } from 'next';
import HtmlCssBeautifier from '@/features/tools/html-css/components/HtmlCssBeautifier';

export const metadata: Metadata = {
  title: 'HTML/CSS Beautifier - 開発者ツール集',
  description: 'HTML/CSSコードの整形と最適化を行うツール',
};

export default function HtmlCssPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">HTML/CSS Beautifier</h1>
        <p className="text-lg text-gray-600">
          HTML/CSSコードの整形、圧縮、検証を行い、コードの可読性を向上させます
        </p>
      </div>
      <HtmlCssBeautifier />
    </div>
  );
}