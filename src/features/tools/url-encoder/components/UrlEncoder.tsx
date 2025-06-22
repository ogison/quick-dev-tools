'use client';

import { useState, useEffect, useCallback } from 'react';

export default function UrlEncoder() {
  const [urlInput, setUrlInput] = useState('');
  const [urlOutput, setUrlOutput] = useState('');
  const [urlMode, setUrlMode] = useState('encode');
  const [urlError, setUrlError] = useState('');
  const [spaceMode, setSpaceMode] = useState('%20'); // '%20' or '+'
  const [realtimeMode, setRealtimeMode] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [history, setHistory] = useState([]);
  const [showUrlAnalysis, setShowUrlAnalysis] = useState(false);
  const [urlAnalysis, setUrlAnalysis] = useState(null);

  const performUrlAnalysis = (url) => {
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
  };

  const handleUrlConvert = useCallback(() => {
    try {
      let result;
      if (urlMode === 'encode') {
        if (spaceMode === '+') {
          result = encodeURIComponent(urlInput).replace(/%20/g, '+');
        } else {
          result = encodeURIComponent(urlInput);
        }
        setUrlOutput(result);
      } else {
        // 複数回エンコードの検出と段階的デコード
        let decoded = urlInput;
        let decodeCount = 0;
        const maxDecodes = 10;
        
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
        
        setUrlOutput(decoded);
        if (decodeCount > 1) {
          setUrlError(`${decodeCount}回エンコードされた文字列をデコードしました`);
        }
      }
      
      if (!urlError || urlMode === 'decode') {
        setUrlError('');
      }
      
      // 履歴に追加
      const historyItem = {
        input: urlInput,
        output: result || decoded,
        mode: urlMode,
        timestamp: Date.now()
      };
      
      setHistory(prev => {
        const newHistory = [historyItem, ...prev.filter(h => h.input !== urlInput || h.mode !== urlMode)].slice(0, 5);
        localStorage.setItem('urlEncoder_history', JSON.stringify(newHistory));
        return newHistory;
      });
      
      // URL解析
      if (urlMode === 'decode' && decoded.includes('://')) {
        const analysis = performUrlAnalysis(decoded);
        setUrlAnalysis(analysis);
        setShowUrlAnalysis(!!analysis);
      } else {
        setShowUrlAnalysis(false);
        setUrlAnalysis(null);
      }
      
    } catch (error) {
      setUrlError(`Invalid ${urlMode === 'encode' ? 'text' : 'URL encoded'} format: ${error.message}`);
      setUrlOutput('');
      setShowUrlAnalysis(false);
      setUrlAnalysis(null);
    }
  }, [urlInput, urlMode, spaceMode, urlError]);

  // リアルタイム変換
  useEffect(() => {
    if (realtimeMode && urlInput) {
      const timeoutId = setTimeout(handleUrlConvert, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [urlInput, realtimeMode, handleUrlConvert]);

  // 履歴のロード
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('urlEncoder_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch {
      // localStorage読み込みエラーは無視
    }
  }, []);

  const clearUrl = () => {
    setUrlInput('');
    setUrlOutput('');
    setUrlError('');
    setShowUrlAnalysis(false);
    setUrlAnalysis(null);
  };

  const swapInputOutput = () => {
    if (urlOutput) {
      setUrlInput(urlOutput);
      setUrlOutput('');
      setUrlMode(urlMode === 'encode' ? 'decode' : 'encode');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopyFeedback('コピーしました！');
        setTimeout(() => setCopyFeedback(''), 2000);
      }
    } catch {
      setCopyFeedback('コピーに失敗しました');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const selectFromHistory = (item) => {
    setUrlInput(item.input);
    setUrlMode(item.mode);
    handleUrlConvert();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">URLエンコーダー/デコーダー</h2>
      <p className="text-gray-600 text-sm mb-6">テキストやURLを安全にエンコード・デコードし、URLパラメータの解析も行える多機能ツールです。</p>
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() => setUrlMode('encode')}
            className={`px-4 py-2 rounded ${
              urlMode === 'encode'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            エンコード
          </button>
          <button
            onClick={() => setUrlMode('decode')}
            className={`px-4 py-2 rounded ${
              urlMode === 'decode'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            デコード
          </button>
          
          {urlMode === 'encode' && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">スペース:</label>
              <select 
                value={spaceMode} 
                onChange={(e) => setSpaceMode(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
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
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {urlMode === 'encode' ? 'エンコードするテキスト/URL' : 'デコードするURLエンコード文字列'}
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {urlMode === 'encode' ? 'エンコード結果' : 'デコード結果'}
          </label>
          <textarea
            value={urlOutput}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
          />
        </div>
      </div>
      {urlError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {urlError}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={handleUrlConvert} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {urlMode === 'encode' ? 'エンコード' : 'デコード'}
        </button>
        <button
          onClick={() => copyToClipboard(urlOutput)}
          disabled={!urlOutput}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          結果をコピー
        </button>
        <button 
          onClick={swapInputOutput}
          disabled={!urlOutput}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ⇄ 入れ替え
        </button>
        <button onClick={clearUrl} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">全てクリア</button>
      </div>
      
      {copyFeedback && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {copyFeedback}
        </div>
      )}
      {history.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">変換履歴</h3>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-1">
                    {item.mode === 'encode' ? 'エンコード' : 'デコード'} - {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-sm truncate font-mono">{item.input}</div>
                </div>
                <button
                  onClick={() => selectFromHistory(item)}
                  className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  選択
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showUrlAnalysis && urlAnalysis && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-900 mb-3">URL解析結果</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">プロトコル:</span> {urlAnalysis.protocol}</div>
            <div><span className="font-medium">ホスト:</span> {urlAnalysis.hostname}</div>
            {urlAnalysis.port && <div><span className="font-medium">ポート:</span> {urlAnalysis.port}</div>}
            <div><span className="font-medium">パス:</span> {urlAnalysis.pathname}</div>
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
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">よく使われるURL文字:</h3>
        <div className="text-xs text-blue-800 space-y-1">
          <div>スペース → %20</div>
          <div>! → %21</div>
          <div>&quot; → %22</div>
          <div># → %23</div>
          <div>% → %25</div>
          <div>& → %26</div>
          <div>+ → %2B</div>
        </div>
      </div>
    </div>
  );
}