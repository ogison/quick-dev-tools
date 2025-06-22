import type { Tool } from '@/features/tools/types';
import type { SearchResult, SearchOptions, SearchFilters } from '@/components/search/types';

// デフォルトの検索オプション
const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  includeDescription: true,
  includeCategory: true,
  includeBadge: true,
  caseSensitive: false,
  fuzzyMatch: true,
  maxResults: 10
};

// 文字列の正規化（ひらがな・カタカナ・英数字の統一）
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[ァ-ン]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
    .replace(/[\u3041-\u3096]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0x60))
    .trim();
}

// 検索クエリの前処理
function preprocessQuery(query: string): string[] {
  return query
    .split(/[\s\u3000]+/) // スペースと全角スペースで分割
    .filter(term => term.length > 0)
    .map(normalizeString);
}

// テキストマッチングのスコア計算
function calculateMatchScore(
  text: string, 
  queryTerms: string[], 
  fieldWeight: number = 1
): { score: number; matched: boolean } {
  const normalizedText = normalizeString(text);
  let totalScore = 0;
  let matchedTerms = 0;

  queryTerms.forEach(term => {
    if (normalizedText.includes(term)) {
      matchedTerms++;
      // 完全一致ボーナス
      if (normalizedText === term) {
        totalScore += 100 * fieldWeight;
      }
      // 前方一致ボーナス
      else if (normalizedText.startsWith(term)) {
        totalScore += 80 * fieldWeight;
      }
      // 部分一致
      else {
        const position = normalizedText.indexOf(term);
        const positionScore = Math.max(0, 50 - position * 2); // 前方ほど高スコア
        totalScore += positionScore * fieldWeight;
      }
    }
  });

  return {
    score: totalScore,
    matched: matchedTerms > 0
  };
}

// テキストハイライト処理
function highlightText(text: string, queryTerms: string[]): string {
  let highlightedText = text;
  
  queryTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(
      regex, 
      '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
    );
  });
  
  return highlightedText;
}

// メイン検索関数
export function searchTools(
  tools: Tool[], 
  query: string, 
  filters: SearchFilters = {},
  options: Partial<SearchOptions> = {}
): SearchResult[] {
  const searchOptions = { ...DEFAULT_SEARCH_OPTIONS, ...options };
  
  if (!query.trim()) {
    return tools.map(tool => ({
      tool,
      score: 0,
      matchedFields: []
    }));
  }

  const queryTerms = preprocessQuery(query);
  const results: SearchResult[] = [];

  tools.forEach(tool => {
    // フィルター適用
    if (filters.category && tool.category !== filters.category) return;
    if (filters.badge && tool.badge !== filters.badge) return;

    let totalScore = 0;
    const matchedFields: string[] = [];
    let highlightedName = tool.name;
    let highlightedDescription = tool.description;

    // ツール名での検索（最高重み）
    const nameMatch = calculateMatchScore(tool.name, queryTerms, 3);
    if (nameMatch.matched) {
      totalScore += nameMatch.score;
      matchedFields.push('name');
      highlightedName = highlightText(tool.name, queryTerms);
    }

    // 説明文での検索
    if (searchOptions.includeDescription) {
      const descMatch = calculateMatchScore(tool.description, queryTerms, 2);
      if (descMatch.matched) {
        totalScore += descMatch.score;
        matchedFields.push('description');
        highlightedDescription = highlightText(tool.description, queryTerms);
      }
    }

    // カテゴリでの検索
    if (searchOptions.includeCategory) {
      const categoryMatch = calculateMatchScore(tool.category, queryTerms, 1.5);
      if (categoryMatch.matched) {
        totalScore += categoryMatch.score;
        matchedFields.push('category');
      }
    }

    // バッジでの検索
    if (searchOptions.includeBadge) {
      const badgeMatch = calculateMatchScore(tool.badge, queryTerms, 1);
      if (badgeMatch.matched) {
        totalScore += badgeMatch.score;
        matchedFields.push('badge');
      }
    }

    // マッチした場合のみ結果に追加
    if (matchedFields.length > 0) {
      results.push({
        tool,
        score: totalScore,
        matchedFields,
        highlightedName,
        highlightedDescription
      });
    }
  });

  // スコア順でソート
  results.sort((a, b) => b.score - a.score);

  // 最大結果数で制限
  return results.slice(0, searchOptions.maxResults);
}

// 検索候補生成
export function generateSearchSuggestions(tools: Tool[], query: string = ''): string[] {
  const suggestions = new Set<string>();
  
  // ツール名を候補に追加
  tools.forEach(tool => {
    suggestions.add(tool.name);
    
    // 部分一致でフィルタリング
    if (query && normalizeString(tool.name).includes(normalizeString(query))) {
      suggestions.add(tool.name);
    }
  });

  // カテゴリを候補に追加
  const categories = [...new Set(tools.map(tool => tool.category))];
  categories.forEach(category => {
    if (!query || normalizeString(category).includes(normalizeString(query))) {
      suggestions.add(category);
    }
  });

  // 人気キーワードを追加
  const popularKeywords = [
    'JSON', 'Base64', 'URL', 'ハッシュ', '正規表現', 'カラー', 
    'QR', 'パスワード', 'タイムスタンプ', 'ダミーテキスト',
    'エンコード', 'デコード', '変換', '生成', 'テスト'
  ];

  popularKeywords.forEach(keyword => {
    if (!query || normalizeString(keyword).includes(normalizeString(query))) {
      suggestions.add(keyword);
    }
  });

  return Array.from(suggestions).slice(0, 5);
}

// 検索履歴の管理
export function saveSearchHistory(query: string, resultCount: number): void {
  try {
    const history = getSearchHistory();
    const newItem = {
      query: query.trim(),
      timestamp: Date.now(),
      resultCount
    };

    // 重複除去
    const filteredHistory = history.filter(item => item.query !== newItem.query);
    
    // 新しいアイテムを先頭に追加し、最大10件に制限
    const updatedHistory = [newItem, ...filteredHistory].slice(0, 10);
    
    localStorage.setItem('search_history', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('検索履歴の保存に失敗:', error);
  }
}

export function getSearchHistory(): Array<{query: string; timestamp: number; resultCount: number}> {
  try {
    const history = localStorage.getItem('search_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('検索履歴の読み込みに失敗:', error);
    return [];
  }
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem('search_history');
  } catch (error) {
    console.error('検索履歴のクリアに失敗:', error);
  }
}