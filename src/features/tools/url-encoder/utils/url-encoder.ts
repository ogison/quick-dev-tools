import type { 
  UrlMode, 
  SpaceMode, 
  UrlAnalysis, 
  UrlConversionResult, 
  HistoryItem 
} from '../types';

// URLエンコード
export function encodeUrl(input: string, spaceMode: SpaceMode = '%20'): string {
  if (!input.trim()) return '';
  
  let encoded = encodeURIComponent(input);
  
  if (spaceMode === '+') {
    encoded = encoded.replace(/%20/g, '+');
  }
  
  return encoded;
}

// URLデコード（複数回エンコード対応）
export function decodeUrl(input: string): UrlConversionResult {
  if (!input.trim()) {
    return { result: '', error: 'デコードする文字列を入力してください' };
  }
  
  try {
    let decoded = input;
    let decodeCount = 0;
    const maxDecodes = 10;
    
    // 複数回エンコードの検出と段階的デコード
    while (decodeCount < maxDecodes) {
      try {
        const nextDecoded = decodeURIComponent(decoded);
        if (nextDecoded === decoded) break;
        decoded = nextDecoded;
        decodeCount++;
      } catch {
        break;
      }
    }
    
    let error: string | undefined;
    if (decodeCount > 1) {
      error = `${decodeCount}回エンコードされた文字列をデコードしました`;
    }
    
    // デコード結果がURLの場合は解析
    let analysis: UrlAnalysis | null = null;
    if (decoded.includes('://')) {
      analysis = analyzeUrl(decoded);
    }
    
    return { 
      result: decoded, 
      error,
      analysis 
    };
  } catch (error) {
    return { 
      result: '', 
      error: error instanceof Error ? error.message : 'デコードに失敗しました' 
    };
  }
}

// URL解析
export function analyzeUrl(url: string): UrlAnalysis | null {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const params = new URLSearchParams(urlObj.search);
    const paramEntries = Array.from(params.entries());
    
    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      parameters: paramEntries
    };
  } catch {
    return null;
  }
}

// URL変換の実行
export function convertUrl(
  input: string, 
  mode: UrlMode, 
  spaceMode: SpaceMode = '%20'
): UrlConversionResult {
  if (mode === 'encode') {
    const result = encodeUrl(input, spaceMode);
    return { result };
  } else {
    return decodeUrl(input);
  }
}

// クリップボードにコピー
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (error) {
    console.error('クリップボードコピーに失敗:', error);
    return false;
  }
}

// 履歴の管理
export function saveHistory(history: HistoryItem[]): void {
  try {
    localStorage.setItem('urlEncoder_history', JSON.stringify(history));
  } catch (error) {
    console.error('履歴の保存に失敗:', error);
  }
}

export function loadHistory(): HistoryItem[] {
  try {
    const savedHistory = localStorage.getItem('urlEncoder_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch {
    return [];
  }
}

export function addToHistory(
  historyItem: HistoryItem, 
  currentHistory: HistoryItem[]
): HistoryItem[] {
  // 同じ入力とモードの履歴があれば除去
  const filteredHistory = currentHistory.filter(
    h => !(h.input === historyItem.input && h.mode === historyItem.mode)
  );
  
  // 新しい履歴を先頭に追加し、最大5件に制限
  const newHistory = [historyItem, ...filteredHistory].slice(0, 5);
  
  saveHistory(newHistory);
  return newHistory;
}

// サンプルデータ
export function getSampleData(mode: UrlMode): string {
  if (mode === 'encode') {
    return 'こんにちは 世界！日本語テスト\nhttps://example.com/search?q=検索キーワード&lang=ja';
  } else {
    return '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%20%E4%B8%96%E7%95%8C%EF%BC%81%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%83%86%E3%82%B9%E3%83%88%0Ahttps%3A//example.com/search%3Fq%3D%E6%A4%9C%E7%B4%A2%E3%82%AD%E3%83%BC%E3%83%AF%E3%83%BC%E3%83%89%26lang%3Dja';
  }
}

// debounce関数
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}