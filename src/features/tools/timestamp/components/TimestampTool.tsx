'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Copy, 
  Clock, 
  Calendar,
  RefreshCw,
  History,
  X
} from 'lucide-react';

import { Breadcrumb } from '@/components/ui/breadcrumb';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  unixToDate,
  dateToUnix,
  formatDate,
  getCurrentUnixTime,
  TIMEZONES
} from '../utils/timestamp';

interface ConversionHistory {
  id: string;
  type: 'unixToDate' | 'dateToUnix';
  input: string;
  output: string;
  timezone: string;
  timestamp: number;
}

export function TimestampTool() {
  const [unixInput, setUnixInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timezone, setTimezone] = useState('Asia/Tokyo');
  const [currentTime, setCurrentTime] = useState(getCurrentUnixTime());
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
  }, []);

  // Unix時間から日時への変換
  const convertUnixToDate = useCallback(() => {
    if (!unixInput) {
      return;
    }
    
    const unix = parseInt(unixInput, 10);
    if (isNaN(unix)) {
      return;
    }
    
    const date = unixToDate(unix, timezone);
    const formatted = formatDate(date, timezone);
    setDateInput(formatted);
    
    // 履歴に追加
    const historyItem: ConversionHistory = {
      id: Date.now().toString(),
      type: 'unixToDate',
      input: unixInput,
      output: formatted,
      timezone,
      timestamp: Date.now()
    };
    setHistory(prev => [historyItem, ...prev.slice(0, 9)]);
  }, [unixInput, timezone]);

  // 日時からUnix時間への変換
  const convertDateToUnix = useCallback(() => {
    if (!dateInput) {
      return;
    }
    
    const unix = dateToUnix(dateInput, timezone);
    if (unix === null) {
      return;
    }
    
    setUnixInput(unix.toString());
    
    // 履歴に追加
    const historyItem: ConversionHistory = {
      id: Date.now().toString(),
      type: 'dateToUnix',
      input: dateInput,
      output: unix.toString(),
      timezone,
      timestamp: Date.now()
    };
    setHistory(prev => [historyItem, ...prev.slice(0, 9)]);
  }, [dateInput, timezone]);

  // コピー機能
  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
  }, []);

  // クリア
  const clearAll = useCallback(() => {
    setUnixInput('');
    setDateInput('');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Unix Time Converter', isCurrentPage: true },
              ]}
            />
            <h1 className="mb-2 text-3xl font-bold">Unix Time Converter</h1>
            <p className="text-muted-foreground">
              Convert Unix timestamps to human-readable dates and vice versa
            </p>
          </div>

          {/* Current Time Display */}
          <Card className="mb-6">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Current Unix Time:</span>
                <Badge variant="secondary" className="font-mono">
                  {currentTime}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {formatDate(unixToDate(currentTime, timezone), timezone)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={setCurrentTimeToInput}
                  className="h-8"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Use Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Converter */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Timezone Selector */}
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {Object.entries(TIMEZONES).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unix to Date */}
                <div className="space-y-2">
                  <Label htmlFor="unix-input">Unix Timestamp</Label>
                  <div className="flex gap-2">
                    <Input
                      id="unix-input"
                      type="text"
                      placeholder="e.g., 1735380000"
                      value={unixInput}
                      onChange={(e) => setUnixInput(e.target.value)}
                      className="font-mono"
                    />
                    <Button onClick={convertUnixToDate} variant="default">
                      <Calendar className="mr-1 h-4 w-4" />
                      To Date
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(unixInput, 'unix')}
                      disabled={!unixInput}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copiedField === 'unix' && (
                    <p className="text-sm text-green-600">Copied!</p>
                  )}
                </div>

                {/* Date to Unix */}
                <div className="space-y-2">
                  <Label htmlFor="date-input">Date & Time</Label>
                  <div className="flex gap-2">
                    <Input
                      id="date-input"
                      type="text"
                      placeholder="e.g., 2024-12-28 15:30:00"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      className="font-mono"
                    />
                    <Button onClick={convertDateToUnix} variant="default">
                      <Clock className="mr-1 h-4 w-4" />
                      To Unix
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(dateInput, 'date')}
                      disabled={!dateInput}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {copiedField === 'date' && (
                    <p className="text-sm text-green-600">Copied!</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowHistory(!showHistory)}
                    disabled={history.length === 0}
                  >
                    <History className="mr-1 h-4 w-4" />
                    History ({history.length})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    disabled={!unixInput && !dateInput}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          {showHistory && history.length > 0 && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="mb-3 font-semibold">Conversion History</h3>
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded border p-2 hover:bg-accent cursor-pointer"
                      onClick={() => restoreFromHistory(item)}
                    >
                      <div className="text-sm">
                        <span className="font-mono">{item.input}</span>
                        <span className="mx-2">→</span>
                        <span className="font-mono">{item.output}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.timezone}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="mb-3 text-lg font-semibold">How to use</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Enter a Unix timestamp to convert it to a human-readable date</li>
                <li>• Enter a date in YYYY-MM-DD HH:MM:SS format to convert it to Unix time</li>
                <li>• Select your preferred timezone from the dropdown</li>
                <li>• Click &quot;Use Now&quot; to quickly insert the current Unix timestamp</li>
                <li>• View your conversion history to reuse previous conversions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}