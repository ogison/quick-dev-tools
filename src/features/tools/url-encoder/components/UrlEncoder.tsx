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

  const handleUrlConvert = () => {
    if (!urlInput.trim()) {
      setUrlError('変換する文字列を入力してください');
      setUrlOutput('');
      setUrlAnalysis(null);
      return;
    }

    const result = convertUrl(urlInput, urlMode, spaceMode);
    
    setUrlOutput(result.result);
    setUrlError(result.error || '');
    setUrlAnalysis(result.analysis || null);

    // 履歴に追加
    if (result.result) {
      const historyItem: HistoryItem = {
        input: urlInput,
        output: result.result,
        mode: urlMode,
        timestamp: Date.now()
      };
      
      const newHistory = addToHistory(historyItem, history);
      setHistory(newHistory);
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
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">URLエンコード・デコード</h2>
      <p className="text-gray-600 mb-6">URL文字列のエンコード・デコードを行うツールです</p>

      {/* オプションツールバー */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">モード:</label>
            <select
              value={urlMode}
              onChange={(e) => setUrlMode(e.target.value as UrlMode)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="encode">エンコード</option>
              <option value="decode">デコード</option>
            </select>
          </div>
          
          {urlMode === 'encode' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">スペース:</label>
              <select
                value={spaceMode}
                onChange={(e) => setSpaceMode(e.target.value as SpaceMode)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            サンプル読み込み
          </button>
        </div>
      </div>

      {/* 入力/出力エリア */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {urlMode === 'encode' ? '入力テキスト/URL' : 'エンコード済み文字列'}
            </label>
          </div>
          <textarea
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={
              urlMode === 'encode'
                ? 'エンコードするテキストやURLを入力してください...\n例: こんにちは 世界!'
                : 'デコードするURLエンコード文字列を入力してください...\n例: %E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%20%E4%B8%96%E7%95%8C%21'
            }
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {urlMode === 'encode' ? 'エンコード結果' : 'デコード結果'}
            </label>
            {urlOutput && (
              <button
                onClick={handleCopy}
                className={`px-3 py-1 text-sm rounded ${
                  copySuccess 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {copySuccess ? 'コピー完了!' : 'コピー'}
              </button>
            )}
          </div>
          <textarea
            value={urlOutput}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
            placeholder={`${urlMode === 'encode' ? 'エンコード' : 'デコード'}されたテキストがここに表示されます...`}
          />
        </div>
      </div>

      {/* エラー表示 */}
      {urlError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>情報:</strong> {urlError}
        </div>
      )}

      {/* URL解析結果 */}
      {urlAnalysis && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="text-lg font-medium text-blue-900 mb-3">URL解析結果</h3>
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
                        <span className="text-blue-600">{key}</span> = <span className="text-green-600">{value}</span>
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
          disabled={!urlInput.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {urlMode === 'encode' ? 'エンコード' : 'デコード'}
        </button>
        <button 
          onClick={swapInputOutput}
          disabled={!urlOutput}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          入力⇔出力切替
        </button>
        <button 
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          すべてクリア
        </button>
      </div>

      {/* 履歴表示 */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">変換履歴</h3>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {item.mode === 'encode' ? 'エンコード' : 'デコード'}: {item.input.slice(0, 50)}{item.input.length > 50 ? '...' : ''}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString('ja-JP')}
                  </div>
                </div>
                <button
                  onClick={() => selectFromHistory(item)}
                  className="ml-3 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
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