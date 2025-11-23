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

// Translation keys for tools
export const TOOL_TRANSLATION_KEYS = {
  format: {
    titleKey: 'tools.format.title',
    descriptionKey: 'tools.format.description',
  },
  timestamp: {
    titleKey: 'tools.timestamp.title',
    descriptionKey: 'tools.timestamp.description',
  },
  'url-encoder': {
    titleKey: 'tools.urlEncoder.title',
    descriptionKey: 'tools.urlEncoder.description',
  },
  'character-count': {
    titleKey: 'tools.characterCount.title',
    descriptionKey: 'tools.characterCount.description',
  },
  'uuid-generator': {
    titleKey: 'tools.uuidGenerator.title',
    descriptionKey: 'tools.uuidGenerator.description',
  },
  'markdown-preview': {
    titleKey: 'tools.markdownPreview.title',
    descriptionKey: 'tools.markdownPreview.description',
  },
} as const;

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
    title: 'UNIX時間変換',
    description: 'UNIX時間⇔日付時刻を変換させるツールです。',
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
    title: 'URL Encoder/Decoder',
    description: 'URLエンコードとデコードを行うツールです。',
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
  {
    id: 'character-count',
    title: '文字数カウント',
    description: 'テキストの文字数、単語数、バイト数を詳細にカウントします。',
    href: '/tools/character-count',
    category: 'utility',
    featured: true,
    icon: (
      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 to-indigo-900 p-6">
        <div className="flex h-full items-center justify-center">
          <div className="relative">
            {/* Counter display */}
            <div className="rounded-lg bg-black/30 p-4 font-mono text-white">
              <div className="mb-2 text-center text-xs opacity-60">TEXT COUNTER</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-300">文字数:</span>
                  <span className="text-white">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">単語数:</span>
                  <span className="text-white">567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">行数:</span>
                  <span className="text-white">89</span>
                </div>
              </div>
            </div>
            {/* Floating numbers animation effect */}
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-purple-400/70 flex items-center justify-center text-xs font-bold text-white">
              3
            </div>
            <div className="absolute -bottom-1 -left-1 h-4 w-4 rounded-full bg-indigo-400/60 flex items-center justify-center text-xs font-bold text-white">
              7
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'uuid-generator',
    title: 'UUID生成ツール',
    description: 'UUID v1、v4、Nil UUIDを簡単に生成できるツールです。',
    href: '/tools/uuid-generator',
    category: 'generator',
    featured: true,
    icon: (
      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-900 to-teal-900 p-6">
        <div className="flex h-full items-center justify-center">
          <div className="relative">
            {/* UUID display */}
            <div className="rounded-lg bg-black/30 p-4 font-mono text-white">
              <div className="mb-2 text-center text-xs opacity-60">UUID GENERATOR</div>
              <div className="space-y-2 text-xs">
                <div className="text-blue-300">a3bb189e-8bf9-3888-9912</div>
                <div className="text-teal-300">550e8400-e29b-41d4-a716</div>
                <div className="text-blue-200">6ba7b810-9dad-11d1-80b4</div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-blue-400/70 flex items-center justify-center text-xs font-bold text-white">
              v4
            </div>
            <div className="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-teal-400/60 flex items-center justify-center text-xs font-bold text-white">
              v1
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'markdown-preview',
    title: 'Markdownプレビュー',
    description: 'Markdownをリアルタイムでプレビュー。GitHub Flavored Markdown対応、HTMLエクスポート可能。',
    href: '/tools/markdown-preview',
    category: 'format',
    featured: true,
    icon: (
      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 p-6">
        <div className="flex h-full items-center justify-center">
          <div className="relative w-full">
            {/* Markdown preview display */}
            <div className="rounded-lg bg-black/30 p-4 text-white">
              <div className="mb-2 text-center text-xs opacity-60">MARKDOWN PREVIEW</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-blue-400">#</span>
                  <span className="text-slate-300">Heading</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">-</span>
                  <span className="text-slate-400">List item</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-purple-400">**</span>
                  <span className="text-slate-300">Bold</span>
                  <span className="text-purple-400">**</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">`</span>
                  <span className="font-mono text-slate-300">code</span>
                  <span className="text-yellow-400">`</span>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-slate-500/70 flex items-center justify-center text-xs font-bold text-white">
              MD
            </div>
            <div className="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-blue-500/60 flex items-center justify-center text-xs font-bold text-white">
              ⚡
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

// カテゴリ定義 (with translation keys)
export const TOOL_CATEGORIES = {
  format: 'フォーマッター',
  converter: 'コンバーター',
  encoder: 'エンコーダー',
  generator: 'ジェネレーター',
  utility: 'ユーティリティ',
} as const;

export const CATEGORY_TRANSLATION_KEYS = {
  format: 'tools.categories.format',
  converter: 'tools.categories.converter',
  encoder: 'tools.categories.encoder',
  generator: 'tools.categories.generator',
  utility: 'tools.categories.utility',
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
