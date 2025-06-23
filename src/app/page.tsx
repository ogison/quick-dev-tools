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
      <header className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            開発者ツール集
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            毎日の開発作業を効率化する、シンプルで使いやすいツールコレクション
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="mb-12">
          <div className="mx-auto max-w-3xl">
            <div className="relative mb-6">
              <Search className="absolute top-1/2 -translate-y-1/2 left-4 h-6 w-6 text-gray-400" />
              <Input
                placeholder="ツールを検索してください..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 pl-12 pr-6 text-lg border-2 border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <div className="text-gray-600 mb-2 text-sm font-medium">検索候補:</div>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-8 text-sm border-gray-200 hover:bg-blue-50 hover:border-blue-300"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">カテゴリーで絞り込む</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
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
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ✕ リセット
              </Button>
            )}
          </div>
        </section>

        {/* Tools List */}
        <section className="mb-12">
          {filteredTools.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">「{searchQuery}」に一致するツールが見つかりません</p>
              <Button variant="outline" size="sm" onClick={clearSearch}>
                検索をクリア
              </Button>
            </div>
          )}
          <div className="space-y-4">
            {filteredTools.map((tool, index) => (
              <Link key={tool.id} href={tool.href}>
                <Card className="group cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors">
                        {tool.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h3>
                          <div className="flex gap-2 flex-shrink-0">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full font-medium">
                              {tool.badge}
                            </span>
                            {index < 9 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full font-mono">
                                {index + 1}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs rounded-full">
                            {tool.category}
                          </span>
                          <span className="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
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

  return <div className="bg-white min-h-screen">{renderHomePage()}</div>;
}
