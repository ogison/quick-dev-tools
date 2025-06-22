'use client';

import { Search, Clock, TrendingUp, Filter } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Badge コンポーネントの代替
import type { SearchResultsProps } from './types';

export default function SearchResults({
  results,
  query,
  onSelectTool,
  isLoading = false,
  maxResults = 10,
}: SearchResultsProps) {
  const [showAllResults, setShowAllResults] = useState(false);

  const displayResults = showAllResults ? results : results.slice(0, maxResults);
  const hasMoreResults = results.length > maxResults;

  // ローディング状態
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-2">
          <Search className="h-4 w-4 animate-spin" />
          <span className="text-sm">検索中...</span>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-3 w-full rounded bg-gray-200"></div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 結果なし
  if (results.length === 0 && query.trim()) {
    return (
      <div className="space-y-4 py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">検索結果が見つかりません</h3>
          <p className="text-muted-foreground">
            「<span className="font-medium">{query}</span>」に一致するツールが見つかりませんでした
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">検索のヒント:</p>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• 異なるキーワードを試してみてください</li>
            <li>• より短いキーワードを使用してください</li>
            <li>• カテゴリ名でも検索できます</li>
          </ul>
        </div>
      </div>
    );
  }

  // 検索結果表示
  return (
    <div className="space-y-4">
      {/* 検索結果ヘッダー */}
      {query.trim() && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              「<span className="font-medium text-gray-900">{query}</span>」の検索結果
              <span className="ml-1">({results.length}件)</span>
            </span>
          </div>

          {hasMoreResults && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllResults(!showAllResults)}
              className="text-xs"
            >
              {showAllResults ? '一部を表示' : `すべて表示 (+${results.length - maxResults})`}
            </Button>
          )}
        </div>
      )}

      {/* 検索結果リスト */}
      <div className="space-y-3">
        {displayResults.map((result, index) => {
          const { tool, score, matchedFields, highlightedName, highlightedDescription } = result;

          return (
            <Card
              key={tool.id}
              className="group cursor-pointer border-0 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
              onClick={() => onSelectTool(tool)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {/* ツールアイコン */}
                  <div className="text-3xl transition-transform duration-200 group-hover:scale-110">
                    {tool.icon}
                  </div>

                  {/* ツール情報 */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <CardTitle className="text-lg transition-colors group-hover:text-blue-600">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightedName || tool.name,
                          }}
                        />
                      </CardTitle>

                      {/* バッジとスコア */}
                      <div className="ml-2 flex items-center gap-2">
                        <span className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-1 text-xs font-bold text-white">
                          {tool.badge}
                        </span>
                        {process.env.NODE_ENV === 'development' && (
                          <span className="rounded-full border border-gray-300 bg-white px-2 py-1 text-xs">
                            {score.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    <CardDescription className="mb-2 text-sm leading-relaxed">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightedDescription || tool.description,
                        }}
                      />
                    </CardDescription>

                    {/* メタ情報 */}
                    <div className="text-muted-foreground flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        {tool.category}
                      </span>

                      {matchedFields.length > 0 && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          マッチ: {matchedFields.join(', ')}
                        </span>
                      )}

                      <span className="text-muted-foreground">#{tool.number}</span>
                    </div>
                  </div>

                  {/* アクセス指示 */}
                  <div className="font-bold text-blue-600 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* 検索結果フッター */}
      {results.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              {displayResults.length} / {results.length} 件を表示
            </span>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                リアルタイム検索
              </span>

              <span>Ctrl+K で再検索</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
