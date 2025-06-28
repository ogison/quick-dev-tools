'use client';

import { Check, Copy, Download, FileCode2, Trash2, ChevronDown, Home } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Link from 'next/link';

import { formatCode, detectFormatType, FormatType } from '../utils/formatter';

// サンプルデータ
const SAMPLE_DATA = {
  json: {
    name: 'JSON サンプル',
    value: `{
  "name": "田中太郎",
  "age": 30,
  "city": "東京",
  "hobbies": ["プログラミング", "読書", "映画鑑賞"],
  "address": {
    "zipCode": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区"
  },
  "isActive": true
}`,
  },
  yaml: {
    name: 'YAML サンプル',
    value: `name: 田中太郎
age: 30
city: 東京
hobbies:
  - プログラミング
  - 読書
  - 映画鑑賞
address:
  zipCode: "100-0001"
  prefecture: 東京都
  city: 千代田区
isActive: true`,
  },
  xml: {
    name: 'XML サンプル',
    value: `<?xml version="1.0" encoding="UTF-8"?>
<person>
<name>田中太郎</name>
<age>30</age>
<city>東京</city>
<hobbies>
<hobby>プログラミング</hobby>
<hobby>読書</hobby>
<hobby>映画鑑賞</hobby>
</hobbies>
<address>
<zipCode>100-0001</zipCode>
<prefecture>東京都</prefecture>
<city>千代田区</city>
</address>
<isActive>true</isActive>
</person>`,
  },
  sql: {
    name: 'SQL サンプル',
    value: `SELECT 
    u.name,
    u.email,
    p.title,
    p.created_at
FROM 
    users u
INNER JOIN 
    posts p ON u.id = p.user_id
WHERE 
    u.is_active = true
    AND p.published_at >= '2024-01-01'
ORDER BY 
    p.created_at DESC
LIMIT 10;`,
  },
  css: {
    name: 'CSS サンプル',
    value: `.header{background-color:#f8f9fa;padding:1rem 2rem;border-bottom:1px solid #e9ecef;}.nav{display:flex;justify-content:space-between;align-items:center;}.nav-item{color:#495057;text-decoration:none;margin:0 1rem;transition:color 0.3s ease;}.nav-item:hover{color:#007bff;}`,
  },
  html: {
    name: 'HTML サンプル',
    value: `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>サンプルページ</title></head><body><header class="header"><nav class="nav"><div class="logo">My Site</div><ul class="nav-menu"><li><a href="#" class="nav-item">ホーム</a></li><li><a href="#" class="nav-item">サービス</a></li><li><a href="#" class="nav-item">お問い合わせ</a></li></ul></nav></header><main><h1>ようこそ</h1><p>これはサンプルのHTMLページです。</p></main></body></html>`,
  },
};

export default function FormatTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [formatType] = useState<FormatType>('auto');
  const [indentSize, setIndentSize] = useState(2);
  const [useTab, setUseTab] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detectedType, setDetectedType] = useState<FormatType | null>(null);
  const [isBasicFormatUsed, setIsBasicFormatUsed] = useState(false);
  const [inputHistory, setInputHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Auto-detect format type when input changes
  useEffect(() => {
    if (formatType === 'auto' && input) {
      const detected = detectFormatType(input);
      setDetectedType(detected);
    }
  }, [input, formatType]);

  const handleFormat = useCallback(() => {
    try {
      setError('');
      setIsBasicFormatUsed(false);
      const typeToUse = formatType === 'auto' ? detectFormatType(input) : formatType;

      if (!typeToUse || typeToUse === 'auto') {
        // フォールバック処理：基本的な整形を実行
        const formatted = formatCode(input, 'basic', { indentSize, useTab });
        setOutput(formatted);
        setIsBasicFormatUsed(true);
        return;
      }

      const formatted = formatCode(input, typeToUse, { indentSize, useTab });
      setOutput(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'フォーマットエラーが発生しました');
      setOutput('');
    }
  }, [input, formatType, indentSize, useTab]);

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
      setIsBasicFormatUsed(false);
    }
  }, [historyIndex, inputHistory]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setDetectedType(null);
    setIsBasicFormatUsed(false);
    setInputHistory(['']);
    setHistoryIndex(0);
  };

  const handleLoadSample = (sampleKey: keyof typeof SAMPLE_DATA) => {
    const shouldLoad = !input || window.confirm('現在の入力内容が削除されます。続行しますか？');
    if (shouldLoad) {
      const sampleValue = SAMPLE_DATA[sampleKey].value;
      handleInputChange(sampleValue);
      setOutput('');
      setError('');
      setDetectedType(null);
      setIsBasicFormatUsed(false);
    }
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
    a.download = `formatted.${formatType === 'auto' ? detectedType || 'txt' : formatType}`;
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
        handleFormat();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFormat, handleUndo]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          <ol className="list-reset flex">
            <li>
              <Link href="/home" className="text-blue-600 hover:underline">
                <Home className="inline h-4 w-4" />
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/tools" className="text-blue-600 hover:underline">
                Tools
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="font-medium text-gray-900 dark:text-white">なんでもフォーマッター</li>
          </ol>
        </nav>
        {/* Header 左寄せ */}
        <div className="mb-12 text-left">
          <h1 className="mb-4 text-5xl font-bold">なんでもフォーマッター</h1>
          <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            JSON, YAML, SQL, XMLなどのフォーマットを整形します。
          </p>
        </div>

        <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-8">
            <Tabs defaultValue="formatter" className="w-full">
              <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 text-black dark:text-white">
                <TabsTrigger value="formatter">Formatter</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="formatter" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Input Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
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
                              <FileCode2 className="mr-2 h-3 w-3" />
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
                                <FileCode2 className="mr-2 h-4 w-4" />
                                {sample.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-col items-end text-xs text-gray-500 dark:text-gray-400">
                        <span>Cmd/Ctrl + Enter でフォーマット</span>
                        <span>Cmd/Ctrl + Z でアンドゥ</span>
                      </div>
                    </div>
                    <textarea
                      value={input}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="フォーマットしたいコードをここに入力..."
                      className="h-[450px] w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                      aria-label="Code input area"
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={handleFormat}
                        disabled={!input}
                        className="flex-1 bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Format code"
                      >
                        <FileCode2 className="mr-2 h-4 w-4" />
                        Format
                      </Button>
                      <Button
                        onClick={handleClear}
                        variant="outline"
                        className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                        aria-label="Clear all"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  </div>

                  {/* Output Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        出力
                      </label>
                      {output && !error && (
                        <span
                          className={`flex items-center gap-1 text-xs ${
                            isBasicFormatUsed
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                          {isBasicFormatUsed ? '基本整形完了' : 'フォーマット完了'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <textarea
                        value={output}
                        readOnly
                        placeholder={error || 'フォーマット済みのコードがここに表示されます...'}
                        className={`h-[450px] w-full rounded-lg border p-4 font-mono text-sm transition-colors ${
                          error
                            ? 'border-red-300 bg-red-50 text-red-800 placeholder-red-600 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:placeholder-red-500'
                            : output
                              ? isBasicFormatUsed
                                ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20'
                                : 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                              : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900'
                        } dark:text-gray-100`}
                        aria-label="Formatted output"
                      />
                      {error && (
                        <div className="absolute -bottom-6 left-0 text-sm text-red-600 dark:text-red-400">
                          ⚠️ {error}
                        </div>
                      )}
                      {isBasicFormatUsed && !error && (
                        <div className="absolute -bottom-12 left-0 text-sm text-yellow-600 dark:text-yellow-400">
                          ⚠️ フォーマットタイプを検出できませんでしたが、基本的な整形を行いました
                        </div>
                      )}
                    </div>
                    {output && !error && (
                      <div className={`flex gap-3 ${isBasicFormatUsed ? 'pt-8' : 'pt-2'}`}>
                        <Button
                          onClick={handleCopy}
                          variant="outline"
                          className="flex-1 border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
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
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          className="flex-1 border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                          aria-label="Download formatted file"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="mx-auto max-w-2xl space-y-6">
                  <h3 className="text-center text-lg font-semibold">フォーマット設定</h3>

                  <Card className="border-gray-200 dark:border-gray-700">
                    <CardContent className="space-y-6 p-6">
                      <div>
                        <label className="mb-3 block text-sm font-medium">インデントサイズ</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="1"
                            max="8"
                            value={indentSize}
                            onChange={(e) => setIndentSize(Number(e.target.value))}
                            className="flex-1"
                            aria-label="Indent size slider"
                          />
                          <input
                            type="number"
                            min="1"
                            max="8"
                            value={indentSize}
                            onChange={(e) => setIndentSize(Number(e.target.value))}
                            className="w-16 rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                            aria-label="Indent size number"
                          />
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <label className="flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={useTab}
                            onChange={(e) => setUseTab(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                            aria-label="Use tabs instead of spaces"
                          />
                          <div>
                            <span className="text-sm font-medium">タブを使用</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              デフォルトはスペースです
                            </p>
                          </div>
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                    <CardContent className="p-6">
                      <h4 className="mb-4 text-center font-medium">
                        サポートされているフォーマット
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{}</span>
                          <span>JSON - JavaScript Object Notation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📋</span>
                          <span>YAML - Yet Another Markup Language</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{'< >'}</span>
                          <span>XML - eXtensible Markup Language</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📊</span>
                          <span>SQL - Structured Query Language</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎨</span>
                          <span>CSS - Cascading Style Sheets</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🌐</span>
                          <span>HTML - HyperText Markup Language</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
