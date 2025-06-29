'use client';

import { Check, Copy, Download, Link, Trash2, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import CommonLayoutWithHeader from '@/components/layout/CommonLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';

import { urlEncode, urlDecode } from '../utils/url-encoder';

type EncodingMethod = 'encodeURI' | 'encodeURIComponent';

// サンプルデータ
const SAMPLE_DATA = {
  basic: {
    name: '基本的なURL',
    value: 'https://example.com/search?q=プログラミング 学習',
  },
  japanese: {
    name: '日本語パラメータ',
    value: 'https://shop.example.com/products?category=電子機器&name=ノートパソコン&price=100,000円',
  },
  complex: {
    name: '複雑なクエリ',
    value: 'https://api.example.com/v1/users?name=田中太郎&email=tanaka@example.com&tags=開発者,フロントエンド,React',
  },
  path: {
    name: 'パス含む',
    value: 'https://blog.example.com/2024/01/JavaScript入門/第1章-基本構文',
  },
};

export function URLEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [method, setMethod] = useState<EncodingMethod>('encodeURIComponent');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [inputHistory, setInputHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleProcess = useCallback(() => {
    try {
      setError('');
      if (mode === 'encode') {
        const result = urlEncode(input, method);
        setOutput(result);
      } else {
        const result = urlDecode(input);
        setOutput(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setOutput('');
    }
  }, [input, method, mode]);

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);

      // 履歴に追加（最後の入力と異なる場合のみ）
      const lastHistory = inputHistory[historyIndex];
      if (value !== lastHistory) {
        const newHistory = [...inputHistory.slice(0, historyIndex + 1), value];
        // 履歴の最大サイズを50に制限
        const trimmedHistory = newHistory.length > 50 ? newHistory.slice(-50) : newHistory;
        setInputHistory(trimmedHistory);
        setHistoryIndex(trimmedHistory.length - 1);
      }
    },
    [inputHistory, historyIndex]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setInput(inputHistory[newIndex]);
      setOutput('');
      setError('');
    }
  }, [historyIndex, inputHistory]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setInputHistory(['']);
    setHistoryIndex(0);
  };

  const handleLoadSample = (sampleKey: keyof typeof SAMPLE_DATA) => {
    const sampleValue = SAMPLE_DATA[sampleKey].value;
    handleInputChange(sampleValue);
    setOutput('');
    setError('');
  };

  const handleModeToggle = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    // 入力と出力を入れ替え
    const tempInput = input;
    setInput(output);
    setOutput(tempInput);
    setError('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = output;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode === 'encode' ? 'encoded' : 'decoded'}-url.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleProcess();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleProcess, handleUndo]);

  return (
    <TooltipProvider>
      <CommonLayoutWithHeader
        title="URLエンコーダー・デコーダー"
        description="URLを安全にエンコード・デコードするツールです。日本語や特殊文字を含むURLの変換に対応しています。"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'URLエンコーダー・デコーダー', isCurrentPage: true },
        ]}
      >

          <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="p-8">
              <Tabs defaultValue="encoder" className="w-full">
                <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 text-black dark:text-white">
                  <TabsTrigger value="encoder">エンコーダー</TabsTrigger>
                  <TabsTrigger value="settings">設定</TabsTrigger>
                </TabsList>

                <TabsContent value="encoder" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Input Section */}
                    <div className="space-y-4">
                      <div className="flex min-h-[48px] items-start justify-between py-2">
                        <div className="flex items-center gap-3">
                          <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                            入力
                          </label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-gray-300 text-sm hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                              >
                                <Link className="mr-2 h-3 w-3" />
                                サンプル
                                <ChevronDown className="ml-1 h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                              {Object.entries(SAMPLE_DATA).map(([key, sample]) => (
                                <DropdownMenuItem
                                  key={key}
                                  onClick={() => handleLoadSample(key as keyof typeof SAMPLE_DATA)}
                                  className="cursor-pointer"
                                >
                                  <Link className="mr-2 h-4 w-4" />
                                  {sample.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleModeToggle}
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-300 text-sm hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            <ArrowUpDown className="mr-2 h-3 w-3" />
                            {mode === 'encode' ? 'デコードに切替' : 'エンコードに切替'}
                          </Button>
                        </div>
                      </div>
                      <textarea
                        value={input}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder={
                          mode === 'encode'
                            ? 'エンコードするURLを入力してください...\n例: https://example.com/search?q=プログラミング'
                            : 'デコードするURLを入力してください...\n例: https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0'
                        }
                        className="h-[450px] w-full rounded-lg border border-gray-300 p-4 font-mono text-sm transition-colors focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                        aria-label="URL input"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={handleProcess}
                          disabled={!input}
                          className="flex-1"
                          aria-label={mode === 'encode' ? 'エンコード実行' : 'デコード実行'}
                        >
                          {mode === 'encode' ? 'エンコード' : 'デコード'}
                        </Button>
                        <Button
                          onClick={handleClear}
                          variant="outline"
                          className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                          aria-label="Clear all"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          クリア
                        </Button>
                      </div>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-4">
                      <div className="flex min-h-[48px] items-start justify-between py-2">
                        <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                          出力
                        </label>
                        {output && !error && (
                          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <Check className="h-3 w-3" />
                            {mode === 'encode' ? 'エンコード完了' : 'デコード完了'}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <textarea
                          value={output}
                          readOnly
                          placeholder={
                            error ||
                            `${mode === 'encode' ? 'エンコード' : 'デコード'}された結果がここに表示されます...`
                          }
                          className={`h-[450px] w-full rounded-lg border p-4 font-mono text-sm transition-colors ${
                            error
                              ? 'border-red-300 bg-red-50 text-red-800 placeholder-red-600 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:placeholder-red-500'
                              : output
                              ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                              : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900'
                          } dark:text-gray-100`}
                          aria-label="URL output"
                        />
                        {error && (
                          <div className="absolute -bottom-6 left-0 text-sm text-red-600 dark:text-red-400">
                            ⚠️ {error}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleCopy}
                          disabled={!output || !!error}
                          variant="outline"
                          className="flex-1 border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Copy to clipboard"
                        >
                          {copied ? (
                            <>
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                              コピーしました
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              コピー
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleDownload}
                          disabled={!output || !!error}
                          variant="outline"
                          className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Download as file"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          ダウンロード
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                        エンコード方式
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="method"
                            value="encodeURIComponent"
                            checked={method === 'encodeURIComponent'}
                            onChange={(e) => setMethod(e.target.value as EncodingMethod)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div>
                            <div className="font-medium">encodeURIComponent（推奨）</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              クエリパラメータやフォームデータのエンコードに適しています
                            </div>
                          </div>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="method"
                            value="encodeURI"
                            checked={method === 'encodeURI'}
                            onChange={(e) => setMethod(e.target.value as EncodingMethod)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div>
                            <div className="font-medium">encodeURI</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              URL全体のエンコードに適しています（URL構造を保持）
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">使い方のヒント</h3>
                      <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <li>• <strong>Ctrl + Enter</strong>: エンコード/デコード実行</li>
                        <li>• <strong>Ctrl + Z</strong>: 入力を元に戻す</li>
                        <li>• サンプルデータを使って動作を確認できます</li>
                        <li>• 結果はクリップボードにコピーまたはファイルとして保存できます</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">注意事項</h3>
                      <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                        <li>• 日本語や特殊文字を含むURLは必ずエンコードしてください</li>
                        <li>• クエリパラメータには encodeURIComponent を使用することを推奨します</li>
                        <li>• 完全なURLをエンコードする場合は encodeURI を使用してください</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
      </CommonLayoutWithHeader>
    </TooltipProvider>
  );
}