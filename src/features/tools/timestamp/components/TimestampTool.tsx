'use client';

import { Copy, Clock, Calendar, RefreshCw, History, X, Check, Info, ChevronDown, FileCode2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import {
  unixToDate,
  dateToUnix,
  formatDate,
  getCurrentUnixTime,
  TIMEZONES,
} from '../utils/timestamp';

import { DateTimePicker } from './DateTimePicker';

interface ConversionHistory {
  id: string;
  type: 'unixToDate' | 'dateToUnix';
  input: string;
  output: string;
  timezone: string;
  timestamp: number;
}

// サンプルデータ
const SAMPLE_DATA = {
  epoch: {
    name: 'エポック時間 (1970-01-01)',
    value: '0',
  },
  y2k: {
    name: '2000年問題',
    value: '946684800',
  },
  current: {
    name: '現在時刻',
    value: getCurrentUnixTime().toString(),
  },
  future: {
    name: '2038年問題',
    value: '2147483647',
  },
};

export function TimestampTool() {
  const [unixInput, setUnixInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timezone, setTimezone] = useState('Asia/Tokyo');
  const [currentTime, setCurrentTime] = useState(getCurrentUnixTime());
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<{ unix?: string; date?: string }>({});

  // リアルタイム時刻更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentUnixTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 現在時刻を設定
  const setCurrentTimeToInput = useCallback(() => {
    const now = getCurrentUnixTime();
    setUnixInput(now.toString());
    setError({});
  }, []);

  // Unix時間から日時への変換
  const convertUnixToDate = useCallback(() => {
    if (!unixInput) {
      setError({ unix: 'Unix時間を入力してください' });
      return;
    }

    const unix = parseInt(unixInput, 10);
    if (isNaN(unix)) {
      setError({ unix: '有効な数値を入力してください' });
      return;
    }

    try {
      const date = unixToDate(unix, timezone);
      const formatted = formatDate(date, timezone);
      setDateInput(formatted);
      setError({});

      // 履歴に追加
      const historyItem: ConversionHistory = {
        id: Date.now().toString(),
        type: 'unixToDate',
        input: unixInput,
        output: formatted,
        timezone,
        timestamp: Date.now(),
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]);
    } catch {
      setError({ unix: '変換エラーが発生しました' });
    }
  }, [unixInput, timezone]);

  // 日時からUnix時間への変換
  const convertDateToUnix = useCallback(() => {
    if (!dateInput) {
      setError({ date: '日付時刻を入力してください' });
      return;
    }

    try {
      const unix = dateToUnix(dateInput, timezone);
      if (unix === null) {
        setError({ date: '有効な日付形式で入力してください (例: 2024-12-28 15:30:00)' });
        return;
      }

      setUnixInput(unix.toString());
      setError({});

      // 履歴に追加
      const historyItem: ConversionHistory = {
        id: Date.now().toString(),
        type: 'dateToUnix',
        input: dateInput,
        output: unix.toString(),
        timezone,
        timestamp: Date.now(),
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]);
    } catch {
      setError({ date: '変換エラーが発生しました' });
    }
  }, [dateInput, timezone]);

  // 日付入力が空の場合のデフォルト設定
  const handleDateInputChange = useCallback((value: string) => {
    // 空の値が来たら現在時刻をデフォルトとして設定
    if (!value && !dateInput) {
      const now = new Date();
      const defaultValue = formatDate(now, timezone);
      setDateInput(defaultValue);
    } else {
      setDateInput(value);
    }
    setError({});
  }, [dateInput, timezone]);

  // コピー機能
  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  }, []);

  // 履歴から復元
  const restoreFromHistory = useCallback((item: ConversionHistory) => {
    if (item.type === 'unixToDate') {
      setUnixInput(item.input);
      setDateInput(item.output);
    } else {
      setDateInput(item.input);
      setUnixInput(item.output);
    }
    setTimezone(item.timezone);
    setShowHistory(false);
    setError({});
  }, []);

  // クリア
  const clearAll = useCallback(() => {
    setUnixInput('');
    setDateInput('');
    setError({});
  }, []);

  // サンプルデータを読み込み
  const handleLoadSample = (sampleKey: keyof typeof SAMPLE_DATA) => {
    const sampleValue = SAMPLE_DATA[sampleKey].value;
    setUnixInput(sampleValue);
    setError({});
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (document.activeElement?.id === 'unix-input') {
          convertUnixToDate();
        } else if (document.activeElement?.id === 'date-input') {
          convertDateToUnix();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [convertUnixToDate, convertDateToUnix]);

  return (
    <TooltipProvider>
      <CommonLayoutWithHeader
        title="UNIX時間変換"
        description="UNIX時間と日付時刻を相互変換するツールです。タイムゾーンに対応した高精度な変換を行います。"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'UNIX時間変換', isCurrentPage: true },
        ]}
      >

          {/* Current Time Display */}
          <Card className="mb-6 border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">現在のUNIX時間</p>
                  <p className="font-mono text-2xl font-bold">{currentTime}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">{timezone}</p>
                <p className="font-mono text-lg">
                  {formatDate(unixToDate(currentTime, timezone), timezone)}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={setCurrentTimeToInput}
                  className="mt-2 h-8 border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  現在時刻を使用
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Converter */}
          <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="p-8">
              <Tabs defaultValue="converter" className="w-full">
                <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 text-black dark:text-white">
                  <TabsTrigger value="converter">変換ツール</TabsTrigger>
                  <TabsTrigger value="settings">設定</TabsTrigger>
                </TabsList>

                <TabsContent value="converter" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Unix to Date Section */}
                    <div className="space-y-4">
                      <div className="flex min-h-[48px] items-start justify-between py-2">
                        <div className="flex items-center gap-3">
                          <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                            UNIX時間 → 日付時刻
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
                                  <Clock className="mr-2 h-4 w-4" />
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
                                - 変換実行
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            id="unix-input"
                            type="text"
                            placeholder="例: 1735380000"
                            value={unixInput}
                            onChange={(e) => {
                              setUnixInput(e.target.value);
                              setError({});
                            }}
                            className={`h-[60px] w-full rounded-lg border px-4 font-mono text-lg transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                              error.unix
                                ? 'border-red-300 dark:border-red-700'
                                : 'border-gray-300 dark:border-gray-600'
                            } bg-white dark:bg-gray-900`}
                          />
                          {error.unix && (
                            <div className="absolute -bottom-6 left-0 text-sm text-red-600 dark:text-red-400">
                              ⚠️ {error.unix}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={convertUnixToDate}
                            disabled={!unixInput}
                            className="flex-1 bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            日付に変換
                          </Button>
                          <Button
                            onClick={() => copyToClipboard(unixInput, 'unix')}
                            disabled={!unixInput}
                            variant="outline"
                            className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            {copiedField === 'unix' ? (
                              <>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                コピー済み
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-4 w-4" />
                                コピー
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Date to Unix Section */}
                    <div className="space-y-4">
                      <div className="flex min-h-[48px] items-start justify-between py-2">
                        <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                          日付時刻 → UNIX時間
                        </label>
                      </div>
                      <div className="space-y-4">
                        <div className="relative">
                          <DateTimePicker
                            value={dateInput}
                            onChange={handleDateInputChange}
                            placeholder="日付を選択してください"
                            hasError={!!error.date}
                            className="w-full"
                          />
                          {error.date && (
                            <div className="absolute -bottom-6 left-0 text-sm text-red-600 dark:text-red-400">
                              ⚠️ {error.date}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={convertDateToUnix}
                            disabled={!dateInput}
                            className="flex-1 bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            UNIXに変換
                          </Button>
                          <Button
                            onClick={() => copyToClipboard(dateInput, 'date')}
                            disabled={!dateInput}
                            variant="outline"
                            className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            {copiedField === 'date' ? (
                              <>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                コピー済み
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-4 w-4" />
                                コピー
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-3 pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowHistory(!showHistory)}
                      disabled={history.length === 0}
                      className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <History className="mr-2 h-4 w-4" />
                      履歴 ({history.length})
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearAll}
                      disabled={!unixInput && !dateInput}
                      className="border-gray-300 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <X className="mr-2 h-4 w-4" />
                      クリア
                    </Button>
                  </div>

                  {/* History */}
                  {showHistory && history.length > 0 && (
                    <Card className="mt-6 border-gray-200 dark:border-gray-700">
                      <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-semibold">変換履歴</h3>
                        <div className="space-y-2">
                          {history.map((item) => (
                            <div
                              key={item.id}
                              className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                              onClick={() => restoreFromHistory(item)}
                            >
                              <div className="flex items-center gap-3">
                                {item.type === 'unixToDate' ? (
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-gray-500" />
                                )}
                                <div>
                                  <span className="font-mono text-sm">{item.input}</span>
                                  <span className="mx-2 text-gray-500">→</span>
                                  <span className="font-mono text-sm">{item.output}</span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">{item.timezone}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div className="mx-auto max-w-2xl space-y-6">
                    <h3 className="text-center text-lg font-semibold">変換設定</h3>

                    <Card className="border-gray-200 dark:border-gray-700">
                      <CardContent className="space-y-6 p-6">
                        <div>
                          <label className="mb-3 block text-sm font-medium">タイムゾーン</label>
                          <select
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                          >
                            {Object.entries(TIMEZONES).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                          <h4 className="mb-3 text-sm font-medium">使い方</h4>
                          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>• UNIX時間を入力して日付時刻に変換できます</li>
                            <li>• 日付ピッカーで直感的に日付を選択できます</li>
                            <li>• 時・分・秒をドロップダウンで簡単に設定できます</li>
                            <li>• タイムゾーンを選択して、異なる地域の時刻に変換できます</li>
                            <li>• 「現在時刻を使用」ボタンで現在のUNIX時間を簡単に入力できます</li>
                            <li>• 変換履歴から過去の変換結果を再利用できます</li>
                            <li>• <strong>Ctrl + Enter</strong>: フォーカスした入力欄の変換を実行</li>
                          </ul>
                        </div>

                        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                          <h4 className="mb-3 text-sm font-medium">UNIX時間とは</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            UNIX時間（エポック秒）は、1970年1月1日00:00:00
                            UTCからの経過秒数で時刻を表現する方法です。
                            コンピューターシステムで広く使用されており、タイムゾーンに依存しない統一的な時刻表現が可能です。
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