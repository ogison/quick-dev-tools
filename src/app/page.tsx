'use client';

import { Search, Command } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHomePage } from '@/hooks/useHomePage';

export default function Home() {
  const {
    searchQuery,
    selectedCategory,
    filteredTools,
    categories,
    popularTools,
    searchSuggestions,
    setSearchQuery,
    setSelectedCategory,
    clearSearch,
    resetFilters,
    getCategoryDisplayName,
  } = useHomePage();

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-20 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-6xl font-extrabold text-transparent md:text-7xl">
              開発者ツール集
            </h1>
            <p className="mb-8 text-xl text-blue-100 md:text-2xl">
              開発効率を最大化する、プロフェッショナルな無料ツールコレクション
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/tools/json">
                <Button
                  size="lg"
                  className="bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50"
                >
                  無料で始める
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-600"
              >
                ツール一覧を見る
              </Button>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 h-full w-full">
          <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute top-40 right-20 h-32 w-32 rounded-full bg-purple-300/20 blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 h-16 w-16 rounded-full bg-blue-300/30 blur-lg"></div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Search Section */}
        <section className="mb-16">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
              <Input
                placeholder="ツールを検索... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-focus border-0 bg-white/80 py-6 pr-20 pl-10 text-lg shadow-lg backdrop-blur-sm"
              />
              <div className="absolute top-2 right-3">
                <div className="text-muted-foreground bg-muted flex items-center gap-1 rounded px-2 py-1 text-xs">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
              </div>
            </div>

            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="mt-2 rounded-lg border bg-white p-2 shadow-lg">
                <div className="text-muted-foreground mb-2 px-2 text-xs">検索候補:</div>
                <div className="flex flex-wrap gap-1">
                  {searchSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
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

        {/* Features Section */}
        <section className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">なぜ開発者に選ばれるのか</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              シンプルで直感的、そして高機能。毎日の開発作業を効率化します。
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">高速処理</h3>
              <p className="text-muted-foreground">
                ブラウザ上で瞬時に処理。サーバーへのアップロード不要で安全
              </p>
            </Card>
            <Card className="border-0 p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">完全無料</h3>
              <p className="text-muted-foreground">すべての機能が無料。アカウント登録も不要です</p>
            </Card>
            <Card className="border-0 p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">レスポンシブ</h3>
              <p className="text-muted-foreground">
                PC・タブレット・スマートフォンで快適に利用可能
              </p>
            </Card>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">カテゴリから選ぶ</h2>
            <p className="text-muted-foreground">
              用途に応じてツールを分類しています（←→キーで移動）
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 transition-all ${
                  selectedCategory === category
                    ? 'category-active bg-blue-600 text-white shadow-lg'
                    : 'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {getCategoryDisplayName(category)}
              </Button>
            ))}
          </div>
          {selectedCategory !== 'all' && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground text-xs"
              >
                フィルターをリセット
              </Button>
            </div>
          )}
        </section>

        {/* Tools Grid */}
        <section className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">開発ツール一覧</h2>
            <p className="text-muted-foreground">
              プロフェッショナルな開発に必要なツールを厳選（1-9キーで直接アクセス）
            </p>
            {filteredTools.length === 0 && searchQuery && (
              <div className="mt-8 rounded-lg bg-gray-50 p-8">
                <p className="text-gray-500">「{searchQuery}」に一致するツールが見つかりません</p>
                <Button variant="outline" size="sm" onClick={clearSearch} className="mt-4">
                  検索をクリア
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool, index) => (
              <Link key={tool.id} href={tool.href}>
                <Card
                  className="group animate-fadeIn cursor-pointer border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="text-4xl transition-transform duration-300 group-hover:scale-110">
                        {tool.icon}
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-1 text-xs font-bold text-white">
                          {tool.badge}
                        </span>
                        <span className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-xs font-semibold">
                          #{tool.number}
                        </span>
                        {index < 9 && (
                          <span className="rounded-full bg-gray-600 px-2 py-1 font-mono text-xs text-white">
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg transition-colors group-hover:text-blue-600">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-xs font-medium">
                        {tool.category}
                      </span>
                      <div className="font-bold text-blue-600 transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Access */}
        <section className="mb-16">
          <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">人気ツール</CardTitle>
              <CardDescription className="text-base">
                多くの開発者に愛用されている定番ツール
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {popularTools.map((tool) => (
                  <Link key={tool.id} href={tool.href}>
                    <Button
                      variant="outline"
                      className="flex h-auto w-full flex-col items-center justify-center bg-white/50 p-6 transition-all hover:bg-white hover:shadow-md"
                    >
                      <div className="mb-3 text-3xl">{tool.icon}</div>
                      <div className="text-sm font-semibold">{tool.name}</div>
                      <div className="text-muted-foreground mt-1 text-xs">{tool.badge}</div>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );

  return <div className="bg-background min-h-screen">{renderHomePage()}</div>;
}
