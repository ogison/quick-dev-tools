'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import CommonLayoutWithHeader from '@/components/layout/CommonLayout';
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
import {
  TOOLS,
  TOOL_CATEGORIES,
  TOOL_TRANSLATION_KEYS,
  CATEGORY_TRANSLATION_KEYS,
  searchTools,
  getToolsByCategory
} from '@/constants/tools';
import { Link } from '@/i18n/routing';

export default function ToolsDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = useTranslations('tools');

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

  // Get translated tool data
  const getToolTranslation = (toolId: string) => {
    const key = TOOL_TRANSLATION_KEYS[toolId as keyof typeof TOOL_TRANSLATION_KEYS];
    if (!key) {
      return null;
    }
    return {
      title: t(key.titleKey as 'title'),
      description: t(key.descriptionKey as 'description'),
    };
  };

  return (
    <CommonLayoutWithHeader
      title={t('title')}
      description={t('description')}
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
            <SelectValue placeholder={t('selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCategories')}</SelectItem>
            {categories.map(([key]) => (
              <SelectItem key={key} value={key}>
                {t(CATEGORY_TRANSLATION_KEYS[key as keyof typeof CATEGORY_TRANSLATION_KEYS] as 'title')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 結果カウンター */}
      <div className="px-4 py-2">
        <p className="text-sm text-[#49749c]">
          {filteredTools.length}{t('toolsFound')}
          {searchQuery && (
            <span className="ml-2">
              {t('searchResults')} &ldquo;<span className="font-medium">{searchQuery}</span>&rdquo;
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
                {filteredTools.map((tool) => {
                  const translated = getToolTranslation(tool.id);
                  return (
                    <TableRow
                      key={tool.id}
                      className="border-t border-t-[#cedce8] hover:bg-slate-100/50"
                    >
                      <TableCell className="h-[72px] font-normal text-[#0d151c]">
                        {translated?.title || tool.title}
                      </TableCell>
                      <TableCell className="h-[72px] font-normal text-[#49749c]">
                        {translated?.description || tool.description}
                      </TableCell>
                      <TableCell className="h-[72px] font-normal">
                        {tool.category && (
                          <button className="flex h-8 w-full max-w-[100px] min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#e7edf4] px-3 text-xs leading-normal font-medium text-[#0d151c]">
                            <span className="truncate">
                              {t(CATEGORY_TRANSLATION_KEYS[tool.category as keyof typeof CATEGORY_TRANSLATION_KEYS] as 'title')}
                            </span>
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="h-[72px] font-normal">
                        <Link href={tool.href}>
                          <button className="flex h-8 w-full max-w-[80px] min-w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#0b80ee] px-3 text-xs leading-normal font-bold text-slate-50 transition-colors hover:bg-[#0970d3]">
                            <span className="truncate">Open</span>
                          </button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-xl border border-[#cedce8] bg-white p-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-[#49749c]" />
            <h3 className="mb-2 text-lg font-semibold text-[#0d151c]">
              {t('notFound')}
            </h3>
            <p className="text-[#49749c]">
              {t('notFoundDescription')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 flex h-8 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#e7edf4] px-4 text-sm leading-normal font-medium text-[#0d151c] transition-colors hover:bg-[#d1dce6]"
            >
              {t('resetFilters')}
            </button>
          </div>
        )}
      </div>

      {/* 追加情報カード */}
      <div className="mt-8 px-4">
        <div className="rounded-xl border border-[#0b80ee]/20 bg-[#0b80ee]/5 p-6">
          <h3 className="mb-2 font-semibold text-[#0b80ee]">{t('newToolsTitle')}</h3>
          <p className="text-[#49749c]">
            {t('newToolsDescription')}
          </p>
        </div>
      </div>
    </CommonLayoutWithHeader>
  );
}
