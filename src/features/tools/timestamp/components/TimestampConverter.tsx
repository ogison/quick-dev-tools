'use client';

import { useState, useEffect } from 'react';

type TimezoneOption = {
  value: string;
  label: string;
  offset: string;
};

interface ConversionResult {
  unix: number;
  milliseconds: number;
  iso: string;
  local: string;
  utc: string;
  jst: string;
  formatted: {
    yyyy_mm_dd: string;
    dd_mm_yyyy: string;
    mm_dd_yyyy: string;
    japanese: string;
  };
}

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Tokyo');
  const [copySuccess, setCopySuccess] = useState<{[key: string]: boolean}>({});
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const timezones: TimezoneOption[] = [
    { value: 'Asia/Tokyo', label: '日本標準時 (JST)', offset: 'UTC+9' },
    { value: 'UTC', label: '協定世界時 (UTC)', offset: 'UTC+0' },
    { value: 'America/New_York', label: '東部標準時 (EST)', offset: 'UTC-5/-4' },
    { value: 'America/Los_Angeles', label: '太平洋標準時 (PST)', offset: 'UTC-8/-7' },
    { value: 'Europe/London', label: 'グリニッジ標準時 (GMT)', offset: 'UTC+0/+1' },
    { value: 'Europe/Paris', label: '中央ヨーロッパ時間 (CET)', offset: 'UTC+1/+2' },
    { value: 'Asia/Shanghai', label: '中国標準時 (CST)', offset: 'UTC+8' },
    { value: 'Asia/Seoul', label: '韓国標準時 (KST)', offset: 'UTC+9' }
  ];

  // Update current time every second
  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };
    
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date): ConversionResult => {
    const unix = Math.floor(date.getTime() / 1000);
    const milliseconds = date.getTime();
    
    // Various format options
    const jstDate = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
    
    return {
      unix,
      milliseconds,
      iso: date.toISOString(),
      local: date.toLocaleString('ja-JP', {
        timeZone: selectedTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }),
      utc: date.toUTCString(),
      jst: jstDate.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      formatted: {
        yyyy_mm_dd: date.toISOString().split('T')[0],
        dd_mm_yyyy: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`,
        mm_dd_yyyy: `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`,
        japanese: date.toLocaleDateString('ja-JP', {
          era: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        })
      }
    };
  };

  const convertTimestamp = () => {
    if (!timestamp.trim()) {
      setError('タイムスタンプまたは日時を入力してください');
      setResult(null);
      return;
    }
    
    try {
      let date: Date;
      
      // Try parsing as Unix timestamp (seconds)
      const ts = parseInt(timestamp);
      if (!isNaN(ts) && ts.toString() === timestamp.trim()) {
        // Check if it's likely seconds (reasonable range)
        if (ts > 0 && ts < 4102444800) { // 1970-01-01 to 2100-01-01
          date = new Date(ts * 1000);
        } else {
          // Treat as milliseconds
          date = new Date(ts);
        }
      } else {
        // Try parsing as date string
        date = new Date(timestamp);
      }
      
      if (isNaN(date.getTime())) {
        setError('無効なタイムスタンプまたは日時形式です');
        setResult(null);
        return;
      }
      
      setResult(formatDate(date));
      setError('');
    } catch {
      setError('タイムスタンプの解析中にエラーが発生しました');
      setResult(null);
    }
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    const formatted = formatDate(now);
    setTimestamp(formatted.unix.toString());
    setResult(formatted);
    setError('');
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopySuccess(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setCopySuccess(prev => ({ ...prev, [key]: false }));
        }, 2000);
      }
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">タイムスタンプ変換</h2>
      <p className="text-gray-600 mb-6">Unix時刻と人間が読める日時形式の相互変換を行うツールです</p>
      
      {/* Current Time Display */}
      {currentTime && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">現在時刻</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><strong>Unix時刻:</strong> {Math.floor(currentTime.getTime() / 1000)}</div>
            <div><strong>ミリ秒:</strong> {currentTime.getTime()}</div>
            <div><strong>日本時間:</strong> {currentTime.toLocaleString('ja-JP')}</div>
            <div><strong>ISO形式:</strong> {currentTime.toISOString()}</div>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          タイムスタンプまたは日時
        </label>
        <input
          type="text"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          placeholder="Unix時刻（秒）、ミリ秒、または日時文字列を入力..."
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Timezone Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          タイムゾーン
        </label>
        <select
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label} ({tz.offset})
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button 
          onClick={convertTimestamp}
          disabled={!timestamp.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          変換
        </button>
        <button 
          onClick={getCurrentTimestamp}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          現在時刻を取得
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>エラー:</strong> {error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">変換結果</h3>
          
          {/* Basic Formats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-700">Unix時刻（秒）</h4>
                <button
                  onClick={() => copyToClipboard(result.unix.toString(), 'unix')}
                  className={`px-3 py-1 text-sm rounded ${
                    copySuccess.unix 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {copySuccess.unix ? 'コピー完了!' : 'コピー'}
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm">{result.unix}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-700">ミリ秒</h4>
                <button
                  onClick={() => copyToClipboard(result.milliseconds.toString(), 'milliseconds')}
                  className={`px-3 py-1 text-sm rounded ${
                    copySuccess.milliseconds 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {copySuccess.milliseconds ? 'コピー完了!' : 'コピー'}
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm">{result.milliseconds}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-700">ISO 8601形式</h4>
                <button
                  onClick={() => copyToClipboard(result.iso, 'iso')}
                  className={`px-3 py-1 text-sm rounded ${
                    copySuccess.iso 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {copySuccess.iso ? 'コピー完了!' : 'コピー'}
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm">{result.iso}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-700">選択タイムゾーン</h4>
                <button
                  onClick={() => copyToClipboard(result.local, 'local')}
                  className={`px-3 py-1 text-sm rounded ${
                    copySuccess.local 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {copySuccess.local ? 'コピー完了!' : 'コピー'}
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm">{result.local}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-700">UTC時間</h4>
                <button
                  onClick={() => copyToClipboard(result.utc, 'utc')}
                  className={`px-3 py-1 text-sm rounded ${
                    copySuccess.utc 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {copySuccess.utc ? 'コピー完了!' : 'コピー'}
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm">{result.utc}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-700">日本標準時</h4>
                <button
                  onClick={() => copyToClipboard(result.jst, 'jst')}
                  className={`px-3 py-1 text-sm rounded ${
                    copySuccess.jst 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {copySuccess.jst ? 'コピー完了!' : 'コピー'}
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm">{result.jst}</div>
            </div>
          </div>

          {/* Additional Formats */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">その他の形式</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">YYYY-MM-DD:</span>
                  <button
                    onClick={() => copyToClipboard(result.formatted.yyyy_mm_dd, 'yyyy_mm_dd')}
                    className={`px-2 py-1 text-xs rounded ${
                      copySuccess.yyyy_mm_dd 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {copySuccess.yyyy_mm_dd ? 'コピー完了!' : 'コピー'}
                  </button>
                </div>
                <div className="bg-gray-50 p-2 rounded font-mono text-sm">{result.formatted.yyyy_mm_dd}</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">DD/MM/YYYY:</span>
                  <button
                    onClick={() => copyToClipboard(result.formatted.dd_mm_yyyy, 'dd_mm_yyyy')}
                    className={`px-2 py-1 text-xs rounded ${
                      copySuccess.dd_mm_yyyy 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {copySuccess.dd_mm_yyyy ? 'コピー完了!' : 'コピー'}
                  </button>
                </div>
                <div className="bg-gray-50 p-2 rounded font-mono text-sm">{result.formatted.dd_mm_yyyy}</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">MM/DD/YYYY:</span>
                  <button
                    onClick={() => copyToClipboard(result.formatted.mm_dd_yyyy, 'mm_dd_yyyy')}
                    className={`px-2 py-1 text-xs rounded ${
                      copySuccess.mm_dd_yyyy 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {copySuccess.mm_dd_yyyy ? 'コピー完了!' : 'コピー'}
                  </button>
                </div>
                <div className="bg-gray-50 p-2 rounded font-mono text-sm">{result.formatted.mm_dd_yyyy}</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">和暦表記:</span>
                  <button
                    onClick={() => copyToClipboard(result.formatted.japanese, 'japanese')}
                    className={`px-2 py-1 text-xs rounded ${
                      copySuccess.japanese 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {copySuccess.japanese ? 'コピー完了!' : 'コピー'}
                  </button>
                </div>
                <div className="bg-gray-50 p-2 rounded text-sm">{result.formatted.japanese}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}