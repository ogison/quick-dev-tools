'use client';

import { Search, Command, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TOOLS } from '@/constants/tools';
import { generateSearchSuggestions } from '@/lib/search/search-utils';

import type { SearchBarProps } from './types';

export default function SearchBar({
  placeholder = 'ツールを検索...',
  onSearch,
  showSuggestions = true,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 検索クエリの更新
  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (onSearch) {
      onSearch(value);
    }

    // 候補の更新
    if (showSuggestions && value.trim()) {
      const newSuggestions = generateSearchSuggestions(TOOLS, value);
      setSuggestions(newSuggestions);
      setShowSuggestionsList(newSuggestions.length > 0);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestionsList(false);
      setSuggestions([]);
    }
  };

  // キーボード操作
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showSuggestionsList || suggestions.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        event.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;

      case 'Enter':
        event.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          const selectedSuggestion = suggestions[selectedSuggestionIndex];
          handleQueryChange(selectedSuggestion);
          setShowSuggestionsList(false);
        }
        break;

      case 'Escape':
        setShowSuggestionsList(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 候補選択
  const selectSuggestion = (suggestion: string) => {
    handleQueryChange(suggestion);
    setShowSuggestionsList(false);
    inputRef.current?.focus();
  };

  // 検索クリア
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestionsList(false);
    setSelectedSuggestionIndex(-1);

    if (onSearch) {
      onSearch('');
    }

    inputRef.current?.focus();
  };

  // 外部クリックで候補を隠す
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // フォーカス時に候補を表示
  const handleFocus = () => {
    if (showSuggestions && query.trim() && suggestions.length > 0) {
      setShowSuggestionsList(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />

        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="border-0 bg-white/80 py-6 pr-20 pl-10 text-lg shadow-lg backdrop-blur-sm transition-shadow focus:shadow-xl"
          role="searchbox"
          aria-label="ツール検索"
          aria-expanded={showSuggestionsList}
          aria-activedescendant={
            selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined
          }
        />

        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 transform items-center gap-2">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-gray-100"
              aria-label="検索をクリア"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <div className="text-muted-foreground bg-muted flex items-center gap-1 rounded px-2 py-1 text-xs">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* 検索候補リスト */}
      {showSuggestionsList && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full right-0 left-0 z-50 mt-2 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
          role="listbox"
          aria-label="検索候補"
        >
          <div className="p-2">
            <div className="text-muted-foreground mb-2 px-2 text-xs">検索候補:</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                id={`suggestion-${index}`}
                className={`w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                  index === selectedSuggestionIndex ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => selectSuggestion(suggestion)}
                role="option"
                aria-selected={index === selectedSuggestionIndex}
              >
                <div className="flex items-center gap-2">
                  <Search className="text-muted-foreground h-3 w-3" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
