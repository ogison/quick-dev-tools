'use client';

import { Check, Copy, Download, FileCode2, Trash2, ChevronDown, Info } from 'lucide-react';
import { useTheme } from 'next-themes';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


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
  const { theme } = useTheme();
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

  // Get format-specific styles
  const getFormatTypeStyles = () => {
    // 統一されたダークスタイル（背景: 暗い黒、文字: 白）
    return 'bg-gray-900 text-white border-gray-700';
  };

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
    const sampleValue = SAMPLE_DATA[sampleKey].value;
    handleInputChange(sampleValue);
    setOutput('');
    setError('');
    setDetectedType(null);
    setIsBasicFormatUsed(false);
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
    <TooltipProvider>
      <CommonLayoutWithHeader
        title="なんでもフォーマッター"
        description="JSON, YAML, SQL, XMLなどのフォーマットを整形します。"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'なんでもフォーマッター', isCurrentPage: true },
        ]}
      >
        <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-6">
            <Tabs defaultValue="formatter" className="w-full">
              <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 text-black dark:text-white">
                <TabsTrigger value="formatter">Formatter</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="formatter" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Input Section */}
                  <div className="space-y-3">
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">ショートカット情報</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-semibold">キーボードショートカット</p>
                            <p className="text-xs">
                              <kbd className="rounded bg-gray-100 px-1 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                Cmd/Ctrl + Enter
                              </kbd>{' '}
                              - フォーマット実行
                            </p>
                            <p className="text-xs">
                              <kbd className="rounded bg-gray-100 px-1 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                Cmd/Ctrl + Z
                              </kbd>{' '}
                              - 元に戻す
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
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
                  <div className="space-y-3">
                    <div className="flex min-h-[48px] items-start justify-between py-2">
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
                    <div>
                      {output && !error ? (
                        <div className="relative h-[450px] w-full">
                          <pre
                            className={`h-full w-full overflow-auto rounded-lg border p-4 font-mono text-sm whitespace-pre-wrap ${getFormatTypeStyles()}`}
                            aria-label="Formatted output"
                          >
                            <code>{output}</code>
                          </pre>
                        </div>
                      ) : (
                        <textarea
                          value={output}
                          readOnly
                          placeholder={error || 'フォーマット済みのコードがここに表示されます...'}
                          className={`h-[450px] w-full rounded-lg border p-4 font-mono text-sm transition-colors ${
                            error
                              ? 'border-red-300 bg-red-50 text-red-800 placeholder-red-600 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400 dark:placeholder-red-500'
                              : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900'
                          } dark:text-gray-100`}
                          aria-label="Formatted output"
                        />
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleCopy}
                        disabled={!output || !!error}
                        variant="outline"
                        className="flex-1 border-gray-300 hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
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
                        disabled={!output || !!error}
                        variant="outline"
                        className="flex-1 border-gray-300 hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
                        aria-label="Download formatted file"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    {error && (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-400">⚠️ {error}</div>
                    )}
                    {isBasicFormatUsed && !error && output && (
                      <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                        ⚠️ フォーマットタイプを検出できませんでしたが、基本的な整形を行いました
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

                      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <h4 className="mb-3 text-sm font-medium">使い方</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <li>• フォーマットしたいコードを入力欄に貼り付けてください</li>
                          <li>• JSON、YAML、SQL、XML、CSS、HTMLを自動検出してフォーマットします</li>
                          <li>• サンプルデータを使ってフォーマット機能をお試しいただけます</li>
                          <li>
                            • <strong>Ctrl + Enter</strong>: フォーマット実行のショートカット
                          </li>
                          <li>
                            • <strong>Ctrl + Z</strong>: 入力内容を元に戻すショートカット
                          </li>
                          <li>• フォーマット後の結果はコピーまたはファイルとして保存できます</li>
                        </ul>
                      </div>

                      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <h4 className="mb-3 text-sm font-medium">対応フォーマット</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              データ形式
                            </p>
                            <ul className="mt-1 space-y-1">
                              <li>• JSON (JavaScript Object Notation)</li>
                              <li>• YAML (YAML Ain&apos;t Markup Language)</li>
                              <li>• XML (eXtensible Markup Language)</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Web技術</p>
                            <ul className="mt-1 space-y-1">
                              <li>• HTML (HyperText Markup Language)</li>
                              <li>• CSS (Cascading Style Sheets)</li>
                              <li>• SQL (Structured Query Language)</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                        <h4 className="mb-3 text-sm font-medium">インデント設定について</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          インデントサイズは1〜8スペースまで調整可能です。
                          プロジェクトのコーディング規約に合わせてスペースまたはタブを選択できます。
                          一般的にはスペース2個または4個のインデントが推奨されています。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </CommonLayoutWithHeader>
    </TooltipProvider>
  );
}
