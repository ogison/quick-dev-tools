'use client';

import { X, Search, Command } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { useSearch } from '@/lib/search/search-hooks';

import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import type { SearchModalProps } from './types';

export default function SearchModal({ isOpen, onClose, onSelectTool }: SearchModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { query, results, isLoading, history, updateQuery, clearSearch, selectTool } = useSearch();

  // モーダルの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // スクロール防止
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // ツール選択時の処理
  const handleSelectTool = (tool: any) => {
    selectTool(tool);
    onSelectTool(tool);
    onClose();
  };

  // モーダルが開いていない場合は何も表示しない
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[10vh] backdrop-blur-sm">
      <div
        ref={modalRef}
        className="animate-in fade-in-0 zoom-in-95 mx-4 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl duration-200"
      >
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <Search className="text-muted-foreground h-5 w-5" />
            <h2 className="text-lg font-semibold">ツール検索</h2>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 検索バー */}
        <div className="border-b border-gray-100 p-4">
          <SearchBar
            placeholder="ツールを検索..."
            onSearch={updateQuery}
            onSelectTool={handleSelectTool}
            showSuggestions={true}
            className="w-full"
          />
        </div>

        {/* コンテンツエリア */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() ? (
            // 検索結果表示
            <div className="p-4">
              <SearchResults
                results={results}
                query={query}
                onSelectTool={handleSelectTool}
                isLoading={isLoading}
                maxResults={8}
              />
            </div>
          ) : (
            // 初期状態：検索履歴とヒント
            <div className="space-y-6 p-4">
              {/* 検索履歴 */}
              {history.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Search className="h-4 w-4" />
                    最近の検索
                  </h3>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => updateQuery(item.query)}
                        className="group w-full rounded-lg p-2 text-left transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {item.query}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {item.resultCount}件
                          </span>
                        </div>
                        <div className="text-muted-foreground mt-1 text-xs">
                          {new Date(item.timestamp).toLocaleDateString('ja-JP')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 検索のヒント */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">検索のヒント</h3>
                <div className="text-muted-foreground space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">JSON</span>
                    <span>ツール名で検索</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                      エンコード
                    </span>
                    <span>機能で検索</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                      データ処理
                    </span>
                    <span>カテゴリで検索</span>
                  </div>
                </div>
              </div>

              {/* キーボードショートカット */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">キーボードショートカット</h3>
                <div className="text-muted-foreground space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>検索を開く</span>
                    <div className="flex items-center gap-1">
                      <Command className="h-3 w-3" />
                      <span className="font-mono text-xs">+ K</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>検索を閉じる</span>
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">ESC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>候補を選択</span>
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                      ↑↓ + Enter
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>全{results.length || 10}ツールから検索</span>
            <div className="flex items-center gap-4">
              <span>リアルタイム検索有効</span>
              {query && (
                <Button variant="ghost" size="sm" onClick={clearSearch} className="h-6 text-xs">
                  クリア
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
