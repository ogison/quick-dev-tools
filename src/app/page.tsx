'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHomePage } from '@/hooks/useHomePage';

export default function Home() {
  const {
    searchQuery,
    selectedCategory,
    filteredTools,
    categories,
    searchSuggestions,
    setSearchQuery,
    setSelectedCategory,
    clearSearch,
    resetFilters,
    getCategoryDisplayName,
  } = useHomePage();

  const renderHomePage = () => (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="border-b border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">開発者ツール集</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            毎日の開発作業を効率化する、シンプルで使いやすいツールコレクション
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="mb-12">
          <div className="mx-auto max-w-3xl">
            <div className="relative mb-6">
              <Search className="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="ツールを検索してください..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 py-4 pr-6 pl-12 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <div className="mb-2 text-sm font-medium text-gray-600">検索候補:</div>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-8 border-gray-200 text-sm hover:border-blue-300 hover:bg-blue-50"
                      onClick={() => setSearchQuery(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">カテゴリーで絞り込む</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {getCategoryDisplayName(category)}
              </Button>
            ))}
            {selectedCategory !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ✕ リセット
              </Button>
            )}
          </div>
        </section>

        {/* Tools List */}
        <section className="mb-12">
          {filteredTools.length === 0 && searchQuery && (
            <div className="py-12 text-center">
              <p className="mb-4 text-gray-500">
                「{searchQuery}」に一致するツールが見つかりません
              </p>
              <Button variant="outline" size="sm" onClick={clearSearch}>
                検索をクリア
              </Button>
            </div>
          )}
          <div className="space-y-4">
            {filteredTools.map((tool, index) => (
              <Link key={tool.id} href={tool.href}>
                <Card className="group cursor-pointer border border-gray-200 transition-all duration-200 hover:border-blue-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-2xl transition-colors group-hover:bg-blue-100">
                        {tool.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                            {tool.name}
                          </h3>
                          <div className="flex flex-shrink-0 gap-2">
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                              {tool.badge}
                            </span>
                            {index < 9 && (
                              <span className="rounded-full bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600">
                                {index + 1}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mb-3 text-sm leading-relaxed text-gray-600">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                            {tool.category}
                          </span>
                          <span className="text-sm font-medium text-blue-600 transition-transform group-hover:translate-x-1">
                            使ってみる →
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );

  return <div className="min-h-screen bg-white">{renderHomePage()}</div>;
}
