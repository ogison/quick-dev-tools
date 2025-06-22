'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Command, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { SearchBarProps } from './types';
import { generateSearchSuggestions } from '@/lib/search/search-utils';
import { TOOLS } from '@/constants/tools';

export default function SearchBar({
  placeholder = 'ツールを検索...',
  onSearch,
  onSelectTool,
  showSuggestions = true,
  className = ''
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
    if (!showSuggestionsList || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="pl-10 pr-20 py-6 text-lg bg-white/80 backdrop-blur-sm border-0 shadow-lg focus:shadow-xl transition-shadow"
          role="searchbox"
          aria-label="ツール検索"
          aria-expanded={showSuggestionsList}
          aria-activedescendant={
            selectedSuggestionIndex >= 0 
              ? `suggestion-${selectedSuggestionIndex}` 
              : undefined
          }
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
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
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* 検索候補リスト */}
      {showSuggestionsList && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto"
          role="listbox"
          aria-label="検索候補"
        >
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">検索候補:</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                id={`suggestion-${index}`}
                className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                  index === selectedSuggestionIndex ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => selectSuggestion(suggestion)}
                role="option"
                aria-selected={index === selectedSuggestionIndex}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-3 w-3 text-muted-foreground" />
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