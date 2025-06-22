'use client';

import { useState, useEffect, useCallback } from 'react';

export default function RegexTester() {
  const [regexPattern, setRegexPattern] = useState('');
  const [regexFlags, setRegexFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false,
  });
  const [regexText, setRegexText] = useState('');
  const [regexMatches, setRegexMatches] = useState<RegExpMatchArray[]>([]);
  const [regexError, setRegexError] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [realtimeMode, setRealtimeMode] = useState(false);
  const [replacePattern, setReplacePattern] = useState('');
  const [replaceResult, setReplaceResult] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [showReplace, setShowReplace] = useState(false);

  const getFlagsString = () => {
    return Object.entries(regexFlags)
      .filter(([, enabled]) => enabled)
      .map(([flag]) => flag)
      .join('');
  };

  const highlightMatches = (text: string, matches: RegExpMatchArray[]) => {
    if (matches.length === 0) {
      return text;
    }

    let result = '';
    let lastIndex = 0;

    matches.forEach((match) => {
      const start = match.index || 0;
      const end = start + match[0].length;

      result += text.slice(lastIndex, start);
      result += `<mark class="bg-yellow-200 px-1 rounded">${text.slice(start, end)}</mark>`;
      lastIndex = end;
    });

    result += text.slice(lastIndex);
    return result;
  };

  const testRegex = useCallback(() => {
    try {
      if (!regexPattern) {
        setRegexError('正規表現パターンを入力してください');
        setRegexMatches([]);
        setHighlightedText(regexText);
        setReplaceResult('');
        return;
      }

      const flagsStr = getFlagsString();
      const regex = new RegExp(regexPattern, flagsStr);

      // 無限ループ検出のためのタイムアウト設定
      const startTime = Date.now();
      const matches = [];
      let match;

      if (flagsStr.includes('g')) {
        const matchIterator = regexText.matchAll(regex);
        for (match of matchIterator) {
          if (Date.now() - startTime > 1000) {
            throw new Error('処理時間が長すぎます。パターンを見直してください。');
          }
          matches.push(match);
          if (matches.length > 1000) {
            throw new Error('マッチ数が多すぎます。パターンを見直してください。');
          }
        }
      } else {
        match = regexText.match(regex);
        if (match) {
          matches.push(match);
        }
      }

      setRegexMatches(matches);
      setHighlightedText(highlightMatches(regexText, matches));
      setRegexError('');

      // 置換処理
      if (replacePattern && matches.length > 0) {
        const replaced = regexText.replace(regex, replacePattern);
        setReplaceResult(replaced);
      } else {
        setReplaceResult('');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '無効な正規表現パターンまたはフラグです';
      setRegexError(message);
      setRegexMatches([]);
      setHighlightedText(regexText);
      setReplaceResult('');
    }
  }, [regexPattern, regexFlags, regexText, replacePattern]);

  // リアルタイムマッチング
  useEffect(() => {
    if (realtimeMode && (regexPattern || regexText)) {
      const timeoutId = setTimeout(testRegex, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [regexPattern, regexFlags, regexText, realtimeMode, testRegex]);

  const toggleFlag = (flag: string) => {
    setRegexFlags((prev) => ({ ...prev, [flag]: !prev[flag as keyof typeof prev] }));
  };

  const clearRegex = () => {
    setRegexPattern('');
    setRegexText('');
    setRegexMatches([]);
    setRegexError('');
    setHighlightedText('');
    setReplacePattern('');
    setReplaceResult('');
  };

  const copyToClipboard = async (text: string) => {
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

  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-gray-800">正規表現テスター</h2>
      <p className="mb-6 text-sm text-gray-600">
        正規表現パターンのテスト・検証・デバッグを行うツールです。
      </p>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">正規表現パターン</label>
          <input
            type="text"
            value={regexPattern}
            onChange={(e) => setRegexPattern(e.target.value)}
            placeholder="正規表現パターンを入力してください... 例: \\d+"
            className="w-full rounded-md border border-gray-300 p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">フラグ設定</label>
          <div className="mb-4 flex flex-wrap gap-4">
            {[
              { key: 'g', label: 'g（全体マッチ）', desc: 'すべてのマッチを検索' },
              { key: 'i', label: 'i（大文字小文字無視）', desc: '大文字小文字を区別しない' },
              { key: 'm', label: 'm（複数行）', desc: '^と$が各行の開始・終了にマッチ' },
              { key: 's', label: 's（ドットオール）', desc: '.が改行文字にもマッチ' },
              { key: 'u', label: 'u（Unicode）', desc: 'Unicode文字をサポート' },
              { key: 'y', label: 'y（スティッキー）', desc: '指定位置からのマッチのみ' },
            ].map((flag) => (
              <label
                key={flag.key}
                className="flex cursor-pointer items-center gap-2 text-sm"
                title={flag.desc}
              >
                <input
                  type="checkbox"
                  checked={regexFlags[flag.key as keyof typeof regexFlags]}
                  onChange={() => toggleFlag(flag.key)}
                  className="rounded"
                />
                {flag.label}
              </label>
            ))}
          </div>

          <label className="mb-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={realtimeMode}
              onChange={(e) => setRealtimeMode(e.target.checked)}
              className="rounded"
            />
            リアルタイムマッチング
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">テスト文字列</label>
            <textarea
              value={regexText}
              onChange={(e) => setRegexText(e.target.value)}
              placeholder="テストする文字列を入力してください...\n例: 今日は2024年12月22日です。"
              className="h-32 w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              マッチ結果（ハイライト表示）
            </label>
            <div
              className="h-32 w-full overflow-auto rounded-md border border-gray-300 bg-gray-50 p-3 text-sm"
              dangerouslySetInnerHTML={{
                __html: highlightedText || 'マッチ結果がここに表示されます',
              }}
            />
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            onClick={testRegex}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            正規表現テスト
          </button>
          <button
            onClick={() => setShowReplace(!showReplace)}
            className={`rounded px-4 py-2 ${showReplace ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
          >
            {showReplace ? '置換を非表示' : '置換を表示'}
          </button>
          <button
            onClick={clearRegex}
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            全てクリア
          </button>
        </div>

        {showReplace && (
          <div className="mb-4 rounded-lg bg-purple-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-purple-900">置換機能</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">置換パターン</label>
                <input
                  type="text"
                  value={replacePattern}
                  onChange={(e) => setReplacePattern(e.target.value)}
                  placeholder="置換後の文字列... 例: $1月$2日"
                  className="w-full rounded-md border border-gray-300 p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">置換結果</label>
                <div className="flex gap-2">
                  <textarea
                    value={replaceResult}
                    readOnly
                    className="h-20 flex-1 rounded-md border border-gray-300 bg-gray-50 p-3 font-mono text-sm"
                    placeholder="置換結果がここに表示されます"
                  />
                  <button
                    onClick={() => copyToClipboard(replaceResult)}
                    disabled={!replaceResult}
                    className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    コピー
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {regexError && (
          <div className="rounded border border-red-400 bg-red-100 p-3 text-red-700">
            <strong>エラー:</strong> {regexError}
          </div>
        )}
        {copyFeedback && (
          <div className="mb-4 rounded border border-green-400 bg-green-100 p-3 text-green-700">
            {copyFeedback}
          </div>
        )}

        {regexMatches.length > 0 && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="mb-3 font-semibold text-green-800">
              マッチ結果 ({regexMatches.length}件):
            </h4>
            <div className="max-h-64 space-y-3 overflow-y-auto">
              {regexMatches.map((match, index) => (
                <div key={index} className="rounded border bg-white p-3">
                  <div className="mb-2 font-mono text-sm text-green-700">
                    <strong>マッチ {index + 1}:</strong> &quot;{match[0]}&quot; (位置: {match.index}
                    )
                  </div>
                  {match.length > 1 && (
                    <div className="text-xs text-gray-600">
                      <strong>グループキャプチャ:</strong>
                      <div className="mt-1 ml-4 space-y-1">
                        {match.slice(1).map((group, groupIndex) => (
                          <div key={groupIndex} className="font-mono">
                            ${groupIndex + 1}: {group !== undefined ? `"${group}"` : '(未マッチ)'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
