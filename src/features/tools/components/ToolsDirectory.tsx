'use client';

import { Home, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { TOOLS, TOOL_CATEGORIES, searchTools, getToolsByCategory } from '@/constants/tools';

export default function ToolsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // フィルタリングされたツールを取得
  const getFilteredTools = () => {
    let filteredTools = TOOLS;

    // カテゴリフィルタ
    if (selectedCategory !== 'all') {
      filteredTools = getToolsByCategory(selectedCategory);
    }

    // 検索フィルタ
    if (searchQuery.trim()) {
      filteredTools = searchTools(searchQuery).filter((tool) =>
        selectedCategory === 'all' ? true : tool.category === selectedCategory
      );
    }

    return filteredTools;
  };

  const filteredTools = getFilteredTools();
  const categories = Object.entries(TOOL_CATEGORIES);

  return (
    <div className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-slate-50">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center px-10 py-5">
          <div className="layout-content-container flex max-w-[960px] flex-1 flex-col">
            {/* ブレッドクラム */}
            <nav className="mb-4 text-sm text-gray-500">
              <ol className="list-reset flex">
                <li>
                  <Link href="/" className="text-blue-600 hover:underline">
                    <Home className="inline h-4 w-4" />
                  </Link>
                </li>
                <li>
                  <span className="mx-2">/</span>
                </li>
                <li className="font-medium text-[#0d151c]">Tools</li>
              </ol>
            </nav>

            {/* ヘッダーセクション */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="tracking-light text-[32px] leading-tight font-bold text-[#0d151c]">
                  Tools
                </p>
                <p className="text-sm leading-normal font-normal text-[#49749c]">
                  開発作業を効率化するツールの一覧です。用途に応じてお選びください。
                </p>
              </div>
            </div>

            {/* 検索バー */}
            <div className="px-4 py-3">
              <label className="flex h-12 w-full min-w-40 flex-col">
                <div className="flex h-full w-full flex-1 items-stretch rounded-xl">
                  <div className="flex items-center justify-center rounded-l-xl border-r-0 border-none bg-[#e7edf4] pl-4 text-[#49749c]">
                    <Search className="h-6 w-6" />
                  </div>
                  <input
                    placeholder="Search tools"
                    className="form-input flex h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl rounded-l-none border-l-0 border-none bg-[#e7edf4] px-4 pl-2 text-base leading-normal font-normal text-[#0d151c] placeholder:text-[#49749c] focus:border-none focus:ring-0 focus:outline-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </label>
            </div>

            {/* カテゴリフィルタ */}
            <div className="px-4 py-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-[#cedce8] bg-white py-2 px-3 text-sm text-[#0d151c] focus:border-[#0b80ee] focus:ring-2 focus:ring-[#0b80ee]/20 focus:outline-none"
              >
                <option value="all">すべてのカテゴリ</option>
                {categories.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* 結果カウンター */}
            <div className="px-4 py-2">
              <p className="text-sm text-[#49749c]">
                {filteredTools.length} 個のツールが見つかりました
                {searchQuery && (
                  <span className="ml-2">
                    「<span className="font-medium">{searchQuery}</span>」の検索結果
                  </span>
                )}
              </p>
            </div>

            {/* ツールテーブル */}
            <div className="@container px-4 py-3">
              {filteredTools.length > 0 ? (
                <div className="flex overflow-hidden rounded-xl border border-[#cedce8] bg-slate-50">
                  <table className="flex-1">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="w-[300px] px-4 py-3 text-left text-sm leading-normal font-medium text-[#0d151c]">
                          Name
                        </th>
                        <th className="w-[400px] px-4 py-3 text-left text-sm leading-normal font-medium text-[#0d151c]">
                          Description
                        </th>
                        <th className="w-[120px] px-4 py-3 text-left text-sm leading-normal font-medium text-[#0d151c]">
                          Category
                        </th>
                        <th className="w-[100px] px-4 py-3 text-left text-sm leading-normal font-medium text-[#0d151c]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTools.map((tool) => (
                        <tr key={tool.id} className="border-t border-t-[#cedce8]">
                          <td className="h-[72px] w-[300px] px-4 py-2 text-sm leading-normal font-normal text-[#0d151c]">
                            {tool.title}
                          </td>
                          <td className="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal text-[#49749c]">
                            {tool.description}
                          </td>
                          <td className="h-[72px] w-[120px] px-4 py-2 text-sm leading-normal font-normal">
                            {tool.category && (
                              <button className="flex h-8 w-full max-w-[100px] min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#e7edf4] px-3 text-xs leading-normal font-medium text-[#0d151c]">
                                <span className="truncate">
                                  {TOOL_CATEGORIES[tool.category as keyof typeof TOOL_CATEGORIES]}
                                </span>
                              </button>
                            )}
                          </td>
                          <td className="h-[72px] w-[100px] px-4 py-2 text-sm leading-normal font-normal">
                            <Link href={tool.href}>
                              <button className="flex h-8 w-full max-w-[80px] min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#0b80ee] px-3 text-xs leading-normal font-bold text-slate-50 hover:bg-[#0970d3] transition-colors">
                                <span className="truncate">開く</span>
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-[#cedce8] bg-white p-12 text-center rounded-xl">
                  <Search className="mx-auto mb-4 h-12 w-12 text-[#49749c]" />
                  <h3 className="mb-2 text-lg font-semibold text-[#0d151c]">ツールが見つかりませんでした</h3>
                  <p className="text-[#49749c]">
                    検索条件を変更するか、カテゴリフィルタを調整してください。
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 flex h-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#e7edf4] px-4 text-sm leading-normal font-medium text-[#0d151c] hover:bg-[#d1dce6] transition-colors"
                  >
                    フィルタをリセット
                  </button>
                </div>
              )}
            </div>

            {/* 追加情報カード */}
            <div className="mt-8 px-4">
              <div className="border border-[#0b80ee]/20 bg-[#0b80ee]/5 rounded-xl p-6">
                <h3 className="mb-2 text-lg font-semibold text-[#0b80ee]">
                  新しいツールをお探しですか？
                </h3>
                <p className="text-[#49749c]">
                  すべてのツールはブラウザ内で動作し、データがサーバーに送信されることはありません。
                  安全で高速なローカル処理をお楽しみください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}