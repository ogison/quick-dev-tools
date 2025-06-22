import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TOOLS } from '@/constants/tools';
import type { Tool } from '@/features/tools/types';
import type { SearchResult, SearchFilters, SearchState } from '@/components/search/types';
import { 
  searchTools, 
  generateSearchSuggestions, 
  saveSearchHistory, 
  getSearchHistory 
} from './search-utils';

// メイン検索フック
export function useSearch() {
  const router = useRouter();
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    filters: {},
    suggestions: [],
    history: [],
    showResults: false
  });

  // 検索履歴の初期化
  useEffect(() => {
    const history = getSearchHistory();
    setSearchState(prev => ({ ...prev, history }));
  }, []);

  // デバウンス付き検索実行
  const executeSearch = useCallback((query: string, filters: SearchFilters = {}) => {
    setSearchState(prev => ({ ...prev, isLoading: true }));

    // 実際の検索処理
    setTimeout(() => {
      const results = searchTools(TOOLS, query, filters);
      
      // 検索履歴に保存（空でない検索のみ）
      if (query.trim()) {
        saveSearchHistory(query.trim(), results.length);
      }

      setSearchState(prev => ({
        ...prev,
        query,
        results,
        isLoading: false,
        showResults: true
      }));
    }, 200); // 200ms のデバウンス
  }, []);

  // 検索クエリの更新
  const updateQuery = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }));
    
    // 候補の更新
    const suggestions = generateSearchSuggestions(TOOLS, query);
    setSearchState(prev => ({ ...prev, suggestions }));

    // 空でない場合は検索実行
    if (query.trim()) {
      executeSearch(query, searchState.filters);
    } else {
      setSearchState(prev => ({ 
        ...prev, 
        results: [], 
        showResults: false 
      }));
    }
  }, [executeSearch, searchState.filters]);

  // フィルターの更新
  const updateFilters = useCallback((filters: SearchFilters) => {
    setSearchState(prev => ({ ...prev, filters }));
    
    if (searchState.query.trim()) {
      executeSearch(searchState.query, filters);
    }
  }, [executeSearch, searchState.query]);

  // 検索のクリア
  const clearSearch = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      query: '',
      results: [],
      showResults: false,
      suggestions: []
    }));
  }, []);

  // ツール選択時の処理
  const selectTool = useCallback((tool: Tool) => {
    router.push(tool.href);
    clearSearch();
  }, [router, clearSearch]);

  return {
    ...searchState,
    updateQuery,
    updateFilters,
    clearSearch,
    selectTool,
    executeSearch
  };
}

// ホームページ用の統合検索フック
export function useHomePageSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSearch, setShowSearch] = useState(false);

  // フィルタリングされたツール一覧
  const filteredTools = useMemo(() => {
    let tools = TOOLS;

    // カテゴリフィルター
    if (selectedCategory !== 'all') {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }

    // 検索クエリフィルター
    if (searchQuery.trim()) {
      const results = searchTools(tools, searchQuery);
      return results.map(result => result.tool);
    }

    return tools;
  }, [searchQuery, selectedCategory]);

  // カテゴリ一覧
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(TOOLS.map(tool => tool.category))];
    return ['all', ...uniqueCategories];
  }, []);

  // 人気ツール（最初の4つ）
  const popularTools = useMemo(() => TOOLS.slice(0, 4), []);

  // 検索候補
  const searchSuggestions = useMemo(() => {
    if (searchQuery.length > 0) {
      return generateSearchSuggestions(TOOLS, searchQuery);
    }
    return [];
  }, [searchQuery]);

  // 検索クリア
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSearch(false);
  }, []);

  // フィルターリセット
  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchQuery('');
  }, []);

  // ツールナビゲーション
  const navigateToTool = useCallback((tool: Tool) => {
    window.location.href = tool.href;
  }, []);

  // カテゴリ表示名の取得
  const getCategoryDisplayName = useCallback((category: string) => {
    return category === 'all' ? 'すべて' : category;
  }, []);

  return {
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
    getCategoryDisplayName
  };
}

// キーボードショートカット用フック
export function useSearchShortcuts(onSearchOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K または Cmd+K で検索モーダルを開く
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onSearchOpen();
      }

      // ESC で検索をクリア
      if (event.key === 'Escape') {
        // 検索バーにフォーカスがある場合はクリア
        const activeElement = document.activeElement;
        if (activeElement && activeElement.getAttribute('role') === 'searchbox') {
          (activeElement as HTMLInputElement).value = '';
          activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSearchOpen]);
}

// 検索結果ハイライト用フック
export function useSearchHighlight() {
  const highlightMatches = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  }, []);

  return { highlightMatches };
}