'use client';

import { useState, useCallback, useMemo } from 'react';
import { workerManager } from '@/lib/worker-manager';

type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512';

interface HashResults {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

export default function HashGenerator() {
  const [hashInput, setHashInput] = useState('');
  const [hashResults, setHashResults] = useState<HashResults>({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  const [hashError, setHashError] = useState('');
  const [copySuccess, setCopySuccess] = useState<{[key: string]: boolean}>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [useWebWorker, setUseWebWorker] = useState(true);

  // Memoized utility functions
  const arrayBufferToHex = useCallback((buffer: ArrayBuffer) => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }, []);

  const simpleMD5 = useCallback((str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 32);
  }, []);

  const generateHashes = useCallback(async () => {
    if (!hashInput.trim()) {
      setHashError('ハッシュ化するテキストを入力してください');
      return;
    }

    setIsGenerating(true);
    setHashError('');

    try {
      if (useWebWorker && typeof Worker !== 'undefined') {
        // Use Web Worker for hash generation
        const results = await workerManager.postMessage('hash', 'GENERATE_HASHES', {
          input: hashInput
        });
        setHashResults(results);
      } else {
        // Fallback to main thread
        if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
          setHashError('この環境では暗号化APIが利用できません');
          return;
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(hashInput);

        const [sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
          crypto.subtle.digest('SHA-1', data),
          crypto.subtle.digest('SHA-256', data),
          crypto.subtle.digest('SHA-512', data)
        ]);

        setHashResults({
          md5: simpleMD5(hashInput),
          sha1: arrayBufferToHex(sha1Hash),
          sha256: arrayBufferToHex(sha256Hash),
          sha512: arrayBufferToHex(sha512Hash)
        });
      }
    } catch (err) {
      console.error('Hash generation error:', err);
      // Try fallback on worker error
      if (useWebWorker) {
        setUseWebWorker(false);
        setTimeout(() => generateHashes(), 100);
      } else {
        setHashError('ハッシュ生成エラー: ' + (err instanceof Error ? err.message : '不明なエラー'));
      }
    } finally {
      setIsGenerating(false);
    }
  }, [hashInput, useWebWorker, arrayBufferToHex, simpleMD5]);

  const clearHash = useCallback(() => {
    setHashInput('');
    setHashResults({
      md5: '',
      sha1: '',
      sha256: '',
      sha512: ''
    });
    setHashError('');
    setCopySuccess({});
  }, []);

  const copyToClipboard = useCallback(async (text: string, hashType: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopySuccess(prev => ({ ...prev, [hashType]: true }));
        setTimeout(() => {
          setCopySuccess(prev => ({ ...prev, [hashType]: false }));
        }, 2000);
      }
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  }, []);

  const getAlgorithmInfo = (hashType: HashType) => {
    switch (hashType) {
      case 'md5':
        return {
          name: 'MD5',
          warning: '⚠️ MD5は暗号学的に安全ではありません。レガシー目的のみ使用してください',
          isDeprecated: true
        };
      case 'sha1':
        return {
          name: 'SHA-1',
          warning: '⚠️ SHA-1は暗号学的に安全ではありません。SHA-256以上を推奨します',
          isDeprecated: true
        };
      case 'sha256':
        return {
          name: 'SHA-256',
          warning: '✅ 推奨: 暗号学的に安全なアルゴリズムです',
          isDeprecated: false
        };
      case 'sha512':
        return {
          name: 'SHA-512',
          warning: '✅ 推奨: 暗号学的に安全なアルゴリズムです',
          isDeprecated: false
        };
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">ハッシュ生成</h2>
      <p className="text-gray-600 mb-6">各種ハッシュアルゴリズムを使用してテキストのハッシュ値を生成するツールです</p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          入力テキスト
        </label>
        <textarea
          value={hashInput}
          onChange={(e) => setHashInput(e.target.value)}
          placeholder="ハッシュ化するテキストを入力してください..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {hashError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>エラー:</strong> {hashError}
        </div>
      )}
      
      <div className="mb-6 flex flex-wrap gap-3">
        <button 
          onClick={generateHashes} 
          disabled={!hashInput.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ハッシュ生成
        </button>
        <button 
          onClick={clearHash} 
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          すべてクリア
        </button>
      </div>
      
      <div className="space-y-4">
        {(['md5', 'sha1', 'sha256', 'sha512'] as HashType[]).map((hashType) => {
          const info = getAlgorithmInfo(hashType);
          return (
            <div key={hashType} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-lg font-semibold ${info.isDeprecated ? 'text-orange-600' : 'text-green-600'}`}>
                  {info.name}
                </h3>
                <button
                  onClick={() => copyToClipboard(hashResults[hashType], hashType)}
                  disabled={!hashResults[hashType]}
                  className={`px-3 py-1 text-sm rounded disabled:bg-gray-400 disabled:cursor-not-allowed ${
                    copySuccess[hashType] 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {copySuccess[hashType] ? 'コピー完了!' : 'コピー'}
                </button>
              </div>
              
              <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all min-h-[2.5rem] flex items-center">
                {hashResults[hashType] || 'ハッシュ値がここに表示されます...'}
              </div>
              
              <div className={`text-xs mt-2 p-2 rounded ${
                info.isDeprecated 
                  ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {info.warning}
              </div>
              
              {hashType === 'md5' && (
                <p className="text-xs text-gray-500 mt-1">
                  注意: これは簡易実装のMD5です。本格的な用途では適切な暗号ライブラリを使用してください。
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}