import { ReactNode } from 'react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  category?: string;
  featured?: boolean;
}

export const TOOLS: Tool[] = [
  {
    id: 'format',
    title: 'なんでもフォーマッター',
    description: 'JSON, YAML, SQL, XMLなどのフォーマットを整形します。',
    href: '/tools/format',
    category: 'format',
    featured: true,
    icon: (
      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-900 p-8">
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Molecule-like structure */}
            <div className="absolute top-0 left-0 h-12 w-12 rounded-full bg-cyan-400/80"></div>
            <div className="absolute top-8 left-16 h-10 w-10 rounded-full bg-cyan-500/60"></div>
            <div className="absolute top-16 left-8 h-8 w-8 rounded-full bg-cyan-300/70"></div>
            {/* Connecting lines */}
            <svg className="absolute inset-0 h-24 w-24" viewBox="0 0 100 100">
              <line
                x1="24"
                y1="24"
                x2="64"
                y2="32"
                stroke="rgba(34, 211, 238, 0.5)"
                strokeWidth="2"
              />
              <line
                x1="24"
                y1="24"
                x2="32"
                y2="64"
                stroke="rgba(34, 211, 238, 0.5)"
                strokeWidth="2"
              />
              <line
                x1="64"
                y1="32"
                x2="32"
                y2="64"
                stroke="rgba(34, 211, 238, 0.5)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'timestamp',
    title: 'Unix Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa.',
    href: '/tools/timestamp',
    category: 'converter',
    featured: true,
    icon: (
      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-50 p-6">
        <div className="space-y-2 font-mono text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>1735689600</span>
            <span className="text-gray-400">1 minute ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span>1735603200</span>
            <span className="text-gray-400">1 day ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span>1733011200</span>
            <span className="text-gray-400">1 month ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span>1704153600</span>
            <span className="text-gray-400">1 year ago</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder',
    description: 'Encode and decode URLs.',
    href: '/tools/url-encoder',
    category: 'encoder',
    featured: true,
    icon: (
      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-emerald-900 p-6">
        <div className="rounded-lg bg-black/20 p-4 font-mono text-xs text-emerald-300">
          <div className="space-y-1">
            <div>{'script {"'}</div>
            <div className="pl-4">{'www.example.com'}</div>
            <div className="pl-4">{'&name=John&id=123&category'}</div>
            <div className="pl-4">{'Www.example.com'}</div>
            <div className="pl-4">{'&id=789&name=Jane'}</div>
            <div className="pl-4">{'Swww.example.com'}</div>
            <div className="pl-4">{'https://www.example.com'}</div>
            <div>{'}'}</div>
          </div>
        </div>
      </div>
    ),
  },
];

// カテゴリ定義
export const TOOL_CATEGORIES = {
  format: 'フォーマッター',
  converter: 'コンバーター',
  encoder: 'エンコーダー',
  generator: 'ジェネレーター',
  utility: 'ユーティリティ',
} as const;

// フィーチャードツールを取得
export const getFeaturedTools = (): Tool[] => {
  return TOOLS.filter((tool) => tool.featured);
};

// カテゴリ別ツールを取得
export const getToolsByCategory = (category: string): Tool[] => {
  return TOOLS.filter((tool) => tool.category === category);
};

// ツールを検索
export const searchTools = (query: string): Tool[] => {
  const lowercaseQuery = query.toLowerCase();
  return TOOLS.filter(
    (tool) =>
      tool.title.toLowerCase().includes(lowercaseQuery) ||
      tool.description.toLowerCase().includes(lowercaseQuery)
  );
};