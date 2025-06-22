"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Command } from "lucide-react";
import { TOOLS } from "@/constants/tools";
import { useHomePage } from "@/hooks/useHomePage";

export default function Home() {
  const {
    searchQuery,
    selectedCategory,
    showSearch,
    filteredTools,
    categories,
    popularTools,
    searchSuggestions,
    setSearchQuery,
    setSelectedCategory,
    setShowSearch,
    clearSearch,
    resetFilters,
    navigateToTool,
    getCategoryDisplayName,
  } = useHomePage();

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              開発者ツール集
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              開発効率を最大化する、プロフェッショナルな無料ツールコレクション
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/json">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
                >
                  無料で始める
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg"
              >
                ツール一覧を見る
              </Button>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-300/30 rounded-full blur-lg"></div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Search Section */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ツールを検索... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-20 py-6 text-lg bg-white/80 backdrop-blur-sm border-0 shadow-lg search-focus"
              />
              <div className="absolute right-3 top-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
              </div>
            </div>

            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="mt-2 bg-white rounded-lg shadow-lg border p-2">
                <div className="text-xs text-muted-foreground mb-2 px-2">
                  検索候補:
                </div>
                <div className="flex flex-wrap gap-1">
                  {searchSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6"
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
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              なぜ開発者に選ばれるのか
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              シンプルで直感的、そして高機能。毎日の開発作業を効率化します。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">高速処理</h3>
              <p className="text-muted-foreground">
                ブラウザ上で瞬時に処理。サーバーへのアップロード不要で安全
              </p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">完全無料</h3>
              <p className="text-muted-foreground">
                すべての機能が無料。アカウント登録も不要です
              </p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">レスポンシブ</h3>
              <p className="text-muted-foreground">
                PC・タブレット・スマートフォンで快適に利用可能
              </p>
            </Card>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">カテゴリから選ぶ</h2>
            <p className="text-muted-foreground">
              用途に応じてツールを分類しています（←→キーで移動）
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg category-active"
                    : "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                }`}
              >
                {getCategoryDisplayName(category)}
              </Button>
            ))}
          </div>
          {selectedCategory !== "all" && (
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-muted-foreground"
              >
                フィルターをリセット
              </Button>
            </div>
          )}
        </section>

        {/* Tools Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">開発ツール一覧</h2>
            <p className="text-muted-foreground">
              プロフェッショナルな開発に必要なツールを厳選（1-9キーで直接アクセス）
            </p>
            {filteredTools.length === 0 && searchQuery && (
              <div className="mt-8 p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  「{searchQuery}」に一致するツールが見つかりません
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSearch}
                  className="mt-4"
                >
                  検索をクリア
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredTools.map((tool, index) => (
              <Link key={tool.id} href={tool.href}>
                <Card
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 border-0 shadow-lg animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {tool.icon}
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-1 rounded-full">
                          {tool.badge}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          #{tool.number}
                        </span>
                        {index < 9 && (
                          <span className="text-xs font-mono text-white bg-gray-600 px-2 py-1 rounded-full">
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors text-lg">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {tool.category}
                      </span>
                      <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-300 font-bold">
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
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">人気ツール</CardTitle>
              <CardDescription className="text-base">
                多くの開発者に愛用されている定番ツール
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularTools.map((tool) => (
                  <Link key={tool.id} href={tool.href}>
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center p-6 hover:bg-white hover:shadow-md transition-all bg-white/50 w-full"
                    >
                      <div className="text-3xl mb-3">{tool.icon}</div>
                      <div className="text-sm font-semibold">{tool.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {tool.badge}
                      </div>
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

  return <div className="min-h-screen bg-background">{renderHomePage()}</div>;
}
