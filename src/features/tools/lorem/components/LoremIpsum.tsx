'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { useLoremGenerator } from '../hooks/useLoremGenerator';

const GENERATION_TYPES = [
  { value: 'words', label: '単語' },
  { value: 'sentences', label: '文' },
  { value: 'paragraphs', label: '段落' },
] as const;

const LANGUAGES = [
  { value: 'latin', label: 'Lorem Ipsum（ラテン語）' },
  { value: 'japanese', label: '日本語ダミー' },
  { value: 'programming', label: 'プログラミング用語' },
] as const;

const OUTPUT_FORMATS = [
  { value: 'plain', label: 'プレーンテキスト' },
  { value: 'html', label: 'HTML' },
  { value: 'markdown', label: 'Markdown' },
] as const;

export default function LoremIpsum() {
  const {
    generationType,
    count,
    language,
    outputFormat,
    generatedText,
    statistics,
    autoGenerate,
    setGenerationType,
    setCount,
    setLanguage,
    setOutputFormat,
    setAutoGenerate,
    generateText,
    copyToClipboard,
    clearAll,
  } = useLoremGenerator();

  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-gray-800">ダミーテキスト生成</h2>
      <p className="mb-6 text-gray-600">
        Webデザインやレイアウト確認用のダミーテキストを生成するツールです
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 設定パネル */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">生成設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 生成タイプ */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">生成単位</label>
                <select
                  value={generationType}
                  onChange={(e) => setGenerationType(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  {GENERATION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 数量 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  数量: {count}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>

              {/* 言語 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">言語</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 出力形式 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">出力形式</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  {OUTPUT_FORMATS.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 自動生成 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-generate"
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="auto-generate" className="text-sm text-gray-700">
                  設定変更時に自動生成
                </label>
              </div>

              {/* アクションボタン */}
              <div className="space-y-2">
                <Button onClick={generateText} className="w-full">
                  テキスト生成
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full"
                  disabled={!generatedText}
                >
                  コピー
                </Button>
                <Button onClick={clearAll} variant="outline" className="w-full">
                  すべてクリア
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 統計情報 */}
          {generatedText && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">統計情報</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">文字数</div>
                    <div className="font-semibold">{statistics.characters.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">文字数（スペース除く）</div>
                    <div className="font-semibold">
                      {statistics.charactersNoSpaces.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">単語数</div>
                    <div className="font-semibold">{statistics.words.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">文数</div>
                    <div className="font-semibold">{statistics.sentences.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">段落数</div>
                    <div className="font-semibold">{statistics.paragraphs.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* テキスト表示エリア */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">生成されたテキスト</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedText ? (
                <Textarea
                  value={generatedText}
                  readOnly
                  className="h-96 resize-none bg-gray-50 font-mono text-sm"
                  placeholder="生成されたテキストがここに表示されます..."
                />
              ) : (
                <div className="flex h-96 items-center justify-center rounded-md border-2 border-dashed border-gray-200 text-gray-500">
                  テキストを生成するとここに表示されます
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
