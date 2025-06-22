'use client';

import { useState, useCallback, useEffect } from 'react';

import type { UrlMode, SpaceMode, HistoryItem, UrlAnalysis } from '../types';
import { processLargeText, isLargeText, processInChunks } from '../utils/async-processor';
import {
  copyToClipboard,
  loadHistory,
  addToHistory,
  getSampleData,
  debounce,
} from '../utils/url-encoder';

import { ErrorHighlightedInput } from './ErrorHighlightedInput';
import { SyntaxHighlightedOutput } from './SyntaxHighlightedOutput';

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
        result = await processInChunks(urlInput, urlMode, spaceMode, (progress) =>
          setProcessingProgress(progress)
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
          timestamp: Date.now(),
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
      <h2 className="mb-2 text-2xl font-semibold">URLエンコード・デコード</h2>
      <p className="text-muted-foreground mb-6">URL文字列のエンコード・デコードを行うツールです</p>

      {/* 大容量データ処理通知 */}
      {isLargeData && (
        <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>大容量データ検出:</strong>{' '}
            1MB以上のデータが検出されました。非同期処理モードで実行します。
          </p>
        </div>
      )}

      {/* 処理進捗表示 */}
      {isProcessing && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">処理中...</span>
            <span className="text-sm text-blue-800 dark:text-blue-200">
              {Math.round(processingProgress)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-blue-200 dark:bg-blue-900">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-400"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* オプションツールバー */}
      <div className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">モード:</label>
            <select
              value={urlMode}
              onChange={(e) => setUrlMode(e.target.value as UrlMode)}
              className="border-input bg-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2"
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
                className="border-input bg-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:border-transparent focus:ring-2"
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
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-4 py-2"
          >
            サンプル読み込み
          </button>
        </div>
      </div>

      {/* 入力/出力エリア */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
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
              className="border-input bg-background focus:ring-ring h-64 w-full rounded-md border p-3 font-mono text-sm focus:border-transparent focus:ring-2"
            />
          )}
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium">
              {urlMode === 'encode' ? 'エンコード結果' : 'デコード結果'}
            </label>
            {urlOutput && (
              <button
                onClick={handleCopy}
                className={`rounded px-3 py-1 text-sm transition-colors ${
                  copySuccess
                    ? 'border border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-200'
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
              className="border-input bg-muted/50 h-64 w-full overflow-auto rounded-md border"
              aria-label={`${urlMode === 'encode' ? 'エンコード' : 'デコード'}された結果`}
            />
          ) : (
            <textarea
              value={urlOutput}
              readOnly
              className="border-input bg-muted/50 h-64 w-full rounded-md border p-3 font-mono text-sm"
              placeholder={`${urlMode === 'encode' ? 'エンコード' : 'デコード'}されたテキストがここに表示されます...`}
            />
          )}
        </div>
      </div>

      {/* エラー表示 */}
      {urlError && (
        <div className="bg-destructive/10 border-destructive/50 text-destructive mt-4 rounded border p-3">
          <strong>情報:</strong> {urlError}
        </div>
      )}

      {/* URL解析結果 */}
      {urlAnalysis && (
        <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
          <h3 className="mb-3 text-lg font-medium text-blue-900 dark:text-blue-100">URL解析結果</h3>
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">プロトコル:</span> {urlAnalysis.protocol}
                </div>
                <div>
                  <span className="font-medium">ホスト名:</span> {urlAnalysis.hostname}
                </div>
                {urlAnalysis.port && (
                  <div>
                    <span className="font-medium">ポート:</span> {urlAnalysis.port}
                  </div>
                )}
                <div>
                  <span className="font-medium">パス:</span> {urlAnalysis.pathname || '/'}
                </div>
              </div>
            </div>
            <div>
              {urlAnalysis.search && (
                <div>
                  <span className="font-medium">クエリ:</span> {urlAnalysis.search}
                </div>
              )}
              {urlAnalysis.hash && (
                <div>
                  <span className="font-medium">ハッシュ:</span> {urlAnalysis.hash}
                </div>
              )}
              {urlAnalysis.parameters.length > 0 && (
                <div>
                  <div className="mb-2 font-medium">パラメータ:</div>
                  <div className="ml-4 space-y-1">
                    {urlAnalysis.parameters.map(([key, value], index) => (
                      <div key={index} className="font-mono text-xs">
                        <span className="text-blue-600 dark:text-blue-400">{key}</span> ={' '}
                        <span className="text-green-600 dark:text-green-400">{value}</span>
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
          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded px-4 py-2 transition-colors disabled:cursor-not-allowed"
        >
          {isProcessing ? '処理中...' : urlMode === 'encode' ? 'エンコード' : 'デコード'}
        </button>
        <button
          onClick={swapInputOutput}
          disabled={!urlOutput}
          className="disabled:bg-muted disabled:text-muted-foreground rounded bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed dark:bg-purple-700 dark:hover:bg-purple-800"
        >
          入力⇔出力切替
        </button>
        <button
          onClick={clearAll}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded px-4 py-2 transition-colors"
        >
          すべてクリア
        </button>
      </div>

      {/* 履歴表示 */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-medium">変換履歴</h3>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-muted/50 border-border flex items-center justify-between rounded border p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    {item.mode === 'encode' ? 'エンコード' : 'デコード'}: {item.input.slice(0, 50)}
                    {item.input.length > 50 ? '...' : ''}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {new Date(item.timestamp).toLocaleString('ja-JP')}
                  </div>
                </div>
                <button
                  onClick={() => selectFromHistory(item)}
                  className="ml-3 rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
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
