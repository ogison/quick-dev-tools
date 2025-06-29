'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TOOLS, TOOL_CATEGORIES, searchTools, getToolsByCategory } from '@/constants/tools';
import CommonLayoutWithHeader from '@/components/layout/CommonLayout';

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
    <CommonLayoutWithHeader
      title="Tools"
      description="開発作業を効率化するツールの一覧です。用途に応じてお選びください。"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Tools', isCurrentPage: true },
      ]}
    >
      {/* 検索バー */}
      <div className="bg-card text-card-foreground px-4 py-3">
        <label className="flex h-12 w-full min-w-40 flex-col">
          <div className="flex h-full w-full flex-1 items-stretch rounded-xl">
            <div className="flex items-center justify-center rounded-l-xl border-r-0 border-none">
              <Search className="h-6 w-6" />
            </div>
            <input
              placeholder="Search tools"
              className="form-input flex h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl rounded-l-none border-l-0 border-none px-4 pl-2 text-base leading-normal font-normal placeholder:text-[#49749c] focus:border-none focus:ring-0 focus:outline-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* カテゴリフィルタ */}
      <div className="px-4 py-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="カテゴリを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのカテゴリ</SelectItem>
            {categories.map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          <div className="rounded-xl border border-[#cedce8] bg-slate-50">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-[300px] text-[#0d151c]">Name</TableHead>
                  <TableHead className="w-[400px] text-[#0d151c]">Description</TableHead>
                  <TableHead className="w-[120px] text-[#0d151c]">Category</TableHead>
                  <TableHead className="w-[100px] text-[#0d151c]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTools.map((tool) => (
                  <TableRow
                    key={tool.id}
                    className="border-t border-t-[#cedce8] hover:bg-slate-100/50"
                  >
                    <TableCell className="h-[72px] font-normal text-[#0d151c]">
                      {tool.title}
                    </TableCell>
                    <TableCell className="h-[72px] font-normal text-[#49749c]">
                      {tool.description}
                    </TableCell>
                    <TableCell className="h-[72px] font-normal">
                      {tool.category && (
                        <button className="flex h-8 w-full max-w-[100px] min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#e7edf4] px-3 text-xs leading-normal font-medium text-[#0d151c]">
                          <span className="truncate">
                            {TOOL_CATEGORIES[tool.category as keyof typeof TOOL_CATEGORIES]}
                          </span>
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="h-[72px] font-normal">
                      <Link href={tool.href}>
                        <button className="flex h-8 w-full max-w-[80px] min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#0b80ee] px-3 text-xs leading-normal font-bold text-slate-50 transition-colors hover:bg-[#0970d3]">
                          <span className="truncate">開く</span>
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-xl border border-[#cedce8] bg-white p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-[#49749c]" />
            <h3 className="mb-2 text-lg font-semibold text-[#0d151c]">
              ツールが見つかりませんでした
            </h3>
            <p className="text-[#49749c]">
              検索条件を変更するか、カテゴリフィルタを調整してください。
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 flex h-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#e7edf4] px-4 text-sm leading-normal font-medium text-[#0d151c] transition-colors hover:bg-[#d1dce6]"
            >
              フィルタをリセット
            </button>
          </div>
        )}
      </div>

      {/* 追加情報カード */}
      <div className="mt-8 px-4">
        <div className="rounded-xl border border-[#0b80ee]/20 bg-[#0b80ee]/5 p-6">
          <h3 className="mb-2 font-semibold text-[#0b80ee]">新しいツールをお探しですか？</h3>
          <p className="text-[#49749c]">
            すべてのツールはブラウザ内で動作し、データがサーバーに送信されることはありません。
            安全で高速なローカル処理をお楽しみください。
          </p>
        </div>
      </div>
    </CommonLayoutWithHeader>
  );
}
