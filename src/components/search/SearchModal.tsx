'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { useSearch } from '@/lib/search/search-hooks';
import type { SearchModalProps } from './types';

export default function SearchModal({ isOpen, onClose, onSelectTool }: SearchModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { 
    query, 
    results, 
    isLoading, 
    history,
    updateQuery, 
    clearSearch, 
    selectTool 
  } = useSearch();

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">ツール検索</h2>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 検索バー */}
        <div className="p-4 border-b border-gray-100">
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
            <div className="p-4 space-y-6">
              {/* 検索履歴 */}
              {history.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    最近の検索
                  </h3>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => updateQuery(item.query)}
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            {item.query}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.resultCount}件
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(item.timestamp).toLocaleDateString('ja-JP')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 検索のヒント */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">検索のヒント</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">JSON</span>
                    <span>ツール名で検索</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">エンコード</span>
                    <span>機能で検索</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">データ処理</span>
                    <span>カテゴリで検索</span>
                  </div>
                </div>
              </div>

              {/* キーボードショートカット */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">キーボードショートカット</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>検索を開く</span>
                    <div className="flex items-center gap-1">
                      <Command className="h-3 w-3" />
                      <span className="font-mono text-xs">+ K</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>検索を閉じる</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">ESC</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>候補を選択</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">↑↓ + Enter</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>全{results.length || 10}ツールから検索</span>
            <div className="flex items-center gap-4">
              <span>リアルタイム検索有効</span>
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="text-xs h-6"
                >
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