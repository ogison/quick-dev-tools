'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  convertUrl,
  copyToClipboard,
  loadHistory,
  addToHistory,
  getSampleData,
  debounce
} from '../utils/url-encoder';
import { 
  processLargeText, 
  isLargeText,
  processInChunks 
} from '../utils/async-processor';
import { SyntaxHighlightedOutput } from './SyntaxHighlightedOutput';
import { ErrorHighlightedInput } from './ErrorHighlightedInput';
import type { 
  UrlMode, 
  SpaceMode, 
  HistoryItem, 
  UrlAnalysis 
} from '../types';

export default function UrlEncoder() {
  const [urlInput, setUrlInput] = useState('');
  const [urlOutput, setUrlOutput] = useState('');
  const [urlMode, setUrlMode] = useState<UrlMode>('encode');
  const [spaceMode, setSpaceMode] = useState<SpaceMode>('%20');
  const [realtimeMode, setRealtimeMode] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [urlAnalysis, setUrlAnalysis] = useState<UrlAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isLargeData, setIsLargeData] = useState(false);
  const [enableSyntaxHighlight, setEnableSyntaxHighlight] = useState(true);
  const [enableErrorHighlight, setEnableErrorHighlight] = useState(true);

  // デバウンス付きの変換関数
  const debouncedConvert = useCallback(() => {
    const debouncedFn = debounce((input: string) => {
      if (input.trim()) {
        handleUrlConvert();
      }
    }, 500);
    return debouncedFn;
  }, [urlMode, spaceMode]);

  // リアルタイム変換
  useEffect(() => {
    if (realtimeMode && urlInput.trim()) {
      const debouncedFn = debouncedConvert();
      debouncedFn(urlInput);
    }
  }, [urlInput, realtimeMode, debouncedConvert]);

  // 履歴のロード
  useEffect(() => {
    const savedHistory = loadHistory();
    setHistory(savedHistory);
  }, []);

  const handleUrlConvert = async () => {
    if (!urlInput.trim()) {
      setUrlError('変換する文字列を入力してください');
      setUrlOutput('');
      setUrlAnalysis(null);
      return;
    }

    const isLarge = isLargeText(urlInput);
    setIsLargeData(isLarge);
    
    if (isLarge) {
      setIsProcessing(true);
      setProcessingProgress(0);
    }

    try {
      let result;
      
      if (isLarge) {
        result = await processInChunks(
          urlInput, 
          urlMode, 
          spaceMode,
          (progress) => setProcessingProgress(progress)
        );
      } else {
        result = await processLargeText(urlInput, urlMode, spaceMode);
      }
      
      setUrlOutput(result.result);
      setUrlError(result.error || '');
      setUrlAnalysis(result.analysis || null);

      // 履歴に追加
      if (result.result) {
        const historyItem: HistoryItem = {
          input: urlInput.length > 100 ? urlInput.slice(0, 100) + '...' : urlInput,
          output: result.result.length > 100 ? result.result.slice(0, 100) + '...' : result.result,
          mode: urlMode,
          timestamp: Date.now()
        };
        
        const newHistory = addToHistory(historyItem, history);
        setHistory(newHistory);
      }
    } catch (error) {
      setUrlError(error instanceof Error ? error.message : '処理中にエラーが発生しました');
      setUrlOutput('');
      setUrlAnalysis(null);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const clearAll = () => {
    setUrlInput('');
    setUrlOutput('');
    setUrlError('');
    setUrlAnalysis(null);
  };

  const swapInputOutput = () => {
    if (urlOutput) {
      setUrlInput(urlOutput);
      setUrlOutput('');
      setUrlMode(urlMode === 'encode' ? 'decode' : 'encode');
      setUrlError('');
      setUrlAnalysis(null);
    }
  };

  const loadSample = () => {
    const sample = getSampleData(urlMode);
    setUrlInput(sample);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(urlOutput);
    setCopySuccess(success);
    if (success) {
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const selectFromHistory = (item: HistoryItem) => {
    setUrlInput(item.input);
    setUrlMode(item.mode);
    setUrlOutput('');
    setUrlError('');
    setUrlAnalysis(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">URLエンコード・デコード</h2>
      <p className="text-muted-foreground mb-6">URL文字列のエンコード・デコードを行うツールです</p>
      
      {/* 大容量データ処理通知 */}
      {isLargeData && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>大容量データ検出:</strong> 1MB以上のデータが検出されました。非同期処理モードで実行します。
          </p>
        </div>
      )}
      
      {/* 処理進捗表示 */}
      {isProcessing && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-800 dark:text-blue-200">処理中...</span>
            <span className="text-sm text-blue-800 dark:text-blue-200">{Math.round(processingProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
            <div 
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${processingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* オプションツールバー */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">モード:</label>
            <select
              value={urlMode}
              onChange={(e) => setUrlMode(e.target.value as UrlMode)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="encode">エンコード</option>
              <option value="decode">デコード</option>
            </select>
          </div>
          
          {urlMode === 'encode' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">スペース:</label>
              <select
                value={spaceMode}
                onChange={(e) => setSpaceMode(e.target.value as SpaceMode)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="%20">%20</option>
                <option value="+">+</option>
              </select>
            </div>
          )}
          
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={realtimeMode} 
              onChange={(e) => setRealtimeMode(e.target.checked)}
              className="rounded"
            />
            リアルタイム変換
          </label>
          
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={enableSyntaxHighlight} 
              onChange={(e) => setEnableSyntaxHighlight(e.target.checked)}
              className="rounded"
            />
            シンタックスハイライト
          </label>
          
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={enableErrorHighlight} 
              onChange={(e) => setEnableErrorHighlight(e.target.checked)}
              className="rounded"
            />
            エラーハイライト
          </label>
          
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          >
            サンプル読み込み
          </button>
        </div>
      </div>

      {/* 入力/出力エリア */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              {urlMode === 'encode' ? '入力テキスト/URL' : 'エンコード済み文字列'}
            </label>
          </div>
          {enableErrorHighlight ? (
            <ErrorHighlightedInput
              value={urlInput}
              onChange={setUrlInput}
              mode={urlMode}
              placeholder={
                urlMode === 'encode'
                  ? 'エンコードするテキストやURLを入力してください...\n例: こんにちは 世界!'
                  : 'デコードするURLエンコード文字列を入力してください...\n例: %E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%20%E4%B8%96%E7%95%8C%21'
              }
              className="w-full"
              aria-label={urlMode === 'encode' ? '入力テキスト/URL' : 'エンコード済み文字列'}
              aria-invalid={!!urlError}
            />
          ) : (
            <textarea
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={
                urlMode === 'encode'
                  ? 'エンコードするテキストやURLを入力してください...\n例: こんにちは 世界!'
                  : 'デコードするURLエンコード文字列を入力してください...\n例: %E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%20%E4%B8%96%E7%95%8C%21'
              }
              className="w-full h-64 p-3 border border-input bg-background rounded-md font-mono text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              {urlMode === 'encode' ? 'エンコード結果' : 'デコード結果'}
            </label>
            {urlOutput && (
              <button
                onClick={handleCopy}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  copySuccess 
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-700' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {copySuccess ? 'コピー完了!' : 'コピー'}
              </button>
            )}
          </div>
          {enableSyntaxHighlight ? (
            <SyntaxHighlightedOutput
              text={urlOutput}
              mode={urlMode}
              className="w-full h-64 border border-input rounded-md bg-muted/50 overflow-auto"
              aria-label={`${urlMode === 'encode' ? 'エンコード' : 'デコード'}された結果`}
            />
          ) : (
            <textarea
              value={urlOutput}
              readOnly
              className="w-full h-64 p-3 border border-input rounded-md font-mono text-sm bg-muted/50"
              placeholder={`${urlMode === 'encode' ? 'エンコード' : 'デコード'}されたテキストがここに表示されます...`}
            />
          )}
        </div>
      </div>

      {/* エラー表示 */}
      {urlError && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/50 text-destructive rounded">
          <strong>情報:</strong> {urlError}
        </div>
      )}

      {/* URL解析結果 */}
      {urlAnalysis && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">URL解析結果</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="space-y-2">
                <div><span className="font-medium">プロトコル:</span> {urlAnalysis.protocol}</div>
                <div><span className="font-medium">ホスト名:</span> {urlAnalysis.hostname}</div>
                {urlAnalysis.port && <div><span className="font-medium">ポート:</span> {urlAnalysis.port}</div>}
                <div><span className="font-medium">パス:</span> {urlAnalysis.pathname || '/'}</div>
              </div>
            </div>
            <div>
              {urlAnalysis.search && <div><span className="font-medium">クエリ:</span> {urlAnalysis.search}</div>}
              {urlAnalysis.hash && <div><span className="font-medium">ハッシュ:</span> {urlAnalysis.hash}</div>}
              {urlAnalysis.parameters.length > 0 && (
                <div>
                  <div className="font-medium mb-2">パラメータ:</div>
                  <div className="ml-4 space-y-1">
                    {urlAnalysis.parameters.map(([key, value], index) => (
                      <div key={index} className="font-mono text-xs">
                        <span className="text-blue-600 dark:text-blue-400">{key}</span> = <span className="text-green-600 dark:text-green-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button 
          onClick={handleUrlConvert} 
          disabled={!urlInput.trim() || isProcessing}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? '処理中...' : (urlMode === 'encode' ? 'エンコード' : 'デコード')}
        </button>
        <button 
          onClick={swapInputOutput}
          disabled={!urlOutput}
          className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded hover:bg-purple-700 dark:hover:bg-purple-800 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
        >
          入力⇔出力切替
        </button>
        <button 
          onClick={clearAll}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
        >
          すべてクリア
        </button>
      </div>

      {/* 履歴表示 */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">変換履歴</h3>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded border border-border">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    {item.mode === 'encode' ? 'エンコード' : 'デコード'}: {item.input.slice(0, 50)}{item.input.length > 50 ? '...' : ''}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString('ja-JP')}
                  </div>
                </div>
                <button
                  onClick={() => selectFromHistory(item)}
                  className="ml-3 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  選択
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}