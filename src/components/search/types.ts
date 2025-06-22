import type { Tool } from '@/features/tools/types';

// 検索結果の型
export interface SearchResult {
  tool: Tool;
  score: number;
  matchedFields: string[];
  highlightedName?: string;
  highlightedDescription?: string;
}

// 検索フィルターの型
export interface SearchFilters {
  category?: string;
  badge?: string;
  keywords?: string[];
}

// 検索オプションの型
export interface SearchOptions {
  includeDescription: boolean;
  includeCategory: boolean;
  includeBadge: boolean;
  caseSensitive: boolean;
  fuzzyMatch: boolean;
  maxResults: number;
}

// 検索履歴アイテムの型
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultCount: number;
}

// 検索状態の型
export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  filters: SearchFilters;
  suggestions: string[];
  history: SearchHistoryItem[];
  showResults: boolean;
}

// 検索モーダルの props
export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: Tool) => void;
}

// 検索バーの props
export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelectTool?: (tool: Tool) => void;
  showSuggestions?: boolean;
  className?: string;
}

// 検索結果表示の props
export interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onSelectTool: (tool: Tool) => void;
  isLoading?: boolean;
  maxResults?: number;
}