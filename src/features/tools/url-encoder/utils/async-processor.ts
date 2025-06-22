import type { UrlMode, SpaceMode } from '../types';
import { convertUrl } from './url-encoder';

const LARGE_TEXT_THRESHOLD = 1024 * 1024; // 1MB

export interface AsyncProcessingResult {
  result: string;
  error?: string;
  analysis?: any;
  isLargeData: boolean;
}

export function isLargeText(text: string): boolean {
  return text.length > LARGE_TEXT_THRESHOLD;
}

export async function processLargeText(
  input: string,
  mode: UrlMode,
  spaceMode: SpaceMode
): Promise<AsyncProcessingResult> {
  const isLarge = isLargeText(input);
  
  if (!isLarge) {
    // 小さなデータは同期処理
    const result = convertUrl(input, mode, spaceMode);
    return {
      ...result,
      isLargeData: false
    };
  }

  // 大容量データは非同期処理
  return new Promise((resolve) => {
    // Web Workerが利用できない場合はsetTimeoutで非同期化
    setTimeout(() => {
      try {
        const result = convertUrl(input, mode, spaceMode);
        resolve({
          ...result,
          isLargeData: true
        });
      } catch (error) {
        resolve({
          result: '',
          error: error instanceof Error ? error.message : '処理中にエラーが発生しました',
          isLargeData: true
        });
      }
    }, 0);
  });
}

export function chunkProcess(
  text: string,
  chunkSize: number = 10000
): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function processInChunks(
  input: string,
  mode: UrlMode,
  spaceMode: SpaceMode,
  onProgress?: (progress: number) => void
): Promise<AsyncProcessingResult> {
  const chunks = chunkProcess(input);
  const results: string[] = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const result = convertUrl(chunk, mode, spaceMode);
    
    if (result.error) {
      return {
        result: '',
        error: result.error,
        isLargeData: true
      };
    }
    
    results.push(result.result);
    
    if (onProgress) {
      onProgress((i + 1) / chunks.length * 100);
    }
    
    // UIをブロックしないよう適度に待機
    if (i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return {
    result: results.join(''),
    isLargeData: true
  };
}