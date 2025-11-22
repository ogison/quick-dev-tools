'use client';

import { Check, Copy, Trash2, Info, Clock, Hash, Type, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

import CommonLayoutWithHeader from '@/components/layout/CommonLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { 
  countCharacters, 
  formatNumber, 
  calculateReadingTime, 
  getTextStatsSummary,
  CharacterCountResult 
} from '../utils/character-count';

// サンプルテキスト
const SAMPLE_TEXTS = [
  {
    name: '日本語サンプル',
    value: `こんにちは、世界！

これは文字数カウントツールのサンプルテキストです。
このツールでは以下の機能を提供します：

• 文字数、単語数、行数の詳細カウント
• 日本語文字（ひらがな、カタカナ、漢字）の分別カウント
• バイト数の計算
• 読書時間の推定

プログラミングやライティングに役立つツールとしてご活用ください。
English text も混在している場合でも正確にカウントできます。`,
  },
  {
    name: '英語サンプル',
    value: `Hello, World!

This is a sample text for the character counting tool.
The tool provides the following features:

• Detailed counting of characters, words, and lines
• Separate counting of Japanese characters (Hiragana, Katakana, Kanji)
• Byte count calculation
• Reading time estimation

Please use this tool for programming and writing tasks.
It can accurately count even when 日本語 text is mixed in.`,
  },
  {
    name: 'プログラムコード',
    value: `function countCharacters(text: string): number {
  if (!text) {
    return 0;
  }
  
  // 文字数をカウント
  const length = text.length;
  
  // 結果を返す
  return length;
}

// 使用例
const sampleText = "こんにちは、世界！";
const count = countCharacters(sampleText);
console.log(\`文字数: \${count}\`);`,
  },
];

export default function CharacterCountTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<CharacterCountResult | null>(null);
  const [copied, setCopied] = useState(false);

  // テキストが変更されたときにリアルタイムでカウントを更新
  useEffect(() => {
    const countResult = countCharacters(input);
    setResult(countResult);
  }, [input]);

  const handleClear = () => {
    setInput('');
  };

  const handleLoadSample = (sampleText: string) => {
    setInput(sampleText);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyStats = () => {
    if (result) {
      handleCopy(getTextStatsSummary(result));
    }
  };

  return (
    <TooltipProvider>
      <CommonLayoutWithHeader
        title="文字数カウント"
        description="テキストの文字数、単語数、バイト数を詳細にカウントします。"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: '文字数カウント', isCurrentPage: true },
        ]}
      >
        <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-6">
            <Tabs defaultValue="counter" className="w-full">
              <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 text-black dark:text-white">
                <TabsTrigger value="counter">Counter</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="counter" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Input Section */}
                  <div className="space-y-3">
                    <div className="flex min-h-[48px] items-start justify-between py-2">
                      <div className="flex items-center gap-3">
                        <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                          テキスト入力
                        </label>
                        <div className="flex gap-2">
                          {SAMPLE_TEXTS.map((sample, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleLoadSample(sample.value)}
                              className="h-8 border-gray-300 text-xs hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                              <FileText className="mr-1 h-3 w-3" />
                              {sample.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">ツール情報</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-semibold">文字数カウント機能</p>
                            <p className="text-xs">
                              • 日本語（ひらがな、カタカナ、漢字）を分別カウント
                            </p>
                            <p className="text-xs">
                              • リアルタイムでカウント結果を表示
                            </p>
                            <p className="text-xs">
                              • バイト数・読書時間も計算
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="カウントしたいテキストをここに入力または貼り付けてください..."
                      className="h-[450px] w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                      aria-label="Text input area"
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={handleClear}
                        variant="outline"
                        className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                        aria-label="Clear all"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                      <Button
                        onClick={copyStats}
                        disabled={!result || result.characters === 0}
                        variant="outline"
                        className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
                        aria-label="Copy statistics"
                      >
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4 text-green-600" />
                            コピーしました
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            統計をコピー
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="space-y-3">
                    <div className="flex min-h-[48px] items-center justify-between py-2">
                      <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        カウント結果
                      </label>
                      {result && result.characters > 0 && (
                        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <Check className="h-3 w-3" />
                          リアルタイム更新
                        </span>
                      )}
                    </div>
                    <div className="space-y-4">
                      {/* Main Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Hash className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">文字数</span>
                            </div>
                            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                              {result ? formatNumber(result.characters) : '0'}
                            </div>
                            <div className="text-xs text-purple-600 dark:text-purple-400">
                              (空白除く: {result ? formatNumber(result.charactersWithoutSpaces) : '0'})
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Type className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">単語数</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                              {result ? formatNumber(result.words) : '0'}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              行数: {result ? formatNumber(result.lines) : '0'}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Additional Stats */}
                      <Card className="border-gray-200 dark:border-gray-600">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-600 dark:text-gray-400">バイト数:</span>
                                <span className="font-mono text-gray-800 dark:text-gray-200">
                                  {result ? formatNumber(result.bytes) : '0'}
                                </span>
                              </div>
                              <div className="flex justify-between mb-1">
                                <span className="text-gray-600 dark:text-gray-400">段落数:</span>
                                <span className="font-mono text-gray-800 dark:text-gray-200">
                                  {result ? formatNumber(result.paragraphs) : '0'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">空白文字:</span>
                                <span className="font-mono text-gray-800 dark:text-gray-200">
                                  {result ? formatNumber(result.spaces) : '0'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-2">
                                <Clock className="h-3 w-3 text-gray-500" />
                                <span className="text-gray-600 dark:text-gray-400 text-xs">読書時間目安</span>
                              </div>
                              <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                {result ? calculateReadingTime(result.characters) : '-'}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <div className="mx-auto max-w-4xl">
                  <h3 className="text-center text-lg font-semibold mb-6">詳細分析</h3>
                  
                  {/* Japanese Character Breakdown */}
                  <Card className="border-gray-200 dark:border-gray-700 mb-6">
                    <CardContent className="p-6">
                      <h4 className="text-md font-semibold mb-4 text-gray-800 dark:text-gray-200">日本語文字分析</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                            {result ? formatNumber(result.hiragana) : '0'}
                          </div>
                          <div className="text-sm text-red-700 dark:text-red-300">ひらがな</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                            {result ? formatNumber(result.katakana) : '0'}
                          </div>
                          <div className="text-sm text-green-700 dark:text-green-300">カタカナ</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                            {result ? formatNumber(result.kanji) : '0'}
                          </div>
                          <div className="text-sm text-orange-700 dark:text-orange-300">漢字</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Other Character Types */}
                  <Card className="border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <h4 className="text-md font-semibold mb-4 text-gray-800 dark:text-gray-200">その他の文字分析</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                            {result ? formatNumber(result.alphabetic) : '0'}
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">英字</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                            {result ? formatNumber(result.numeric) : '0'}
                          </div>
                          <div className="text-sm text-purple-700 dark:text-purple-300">数字</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20">
                          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-1">
                            {result ? formatNumber(result.symbols) : '0'}
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">記号</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Usage Guide */}
                  <Card className="border-gray-200 dark:border-gray-700 mt-6">
                    <CardContent className="p-6">
                      <h4 className="text-md font-semibold mb-4 text-gray-800 dark:text-gray-200">使い方</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li>• テキストを入力すると自動的にリアルタイムでカウントされます</li>
                        <li>• 日本語（ひらがな、カタカナ、漢字）と英数字を分別してカウントできます</li>
                        <li>• バイト数計算により、データ容量の目安が分かります</li>
                        <li>• 読書時間推定機能で、文章を読むのにかかる時間が分かります</li>
                        <li>• 統計情報をクリップボードにコピーしてレポートに活用できます</li>
                        <li>• プログラムコードや文書作成時の文字数制限確認に便利です</li>
                      </ul>
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