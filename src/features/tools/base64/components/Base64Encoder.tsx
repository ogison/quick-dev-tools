'use client';

import { Download, Settings, Eye } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { useBase64Converter } from '../hooks/useBase64Converter';
import Image from 'next/image';

export default function Base64Encoder() {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const {
    base64Input,
    base64Output,
    base64Mode,
    base64Error,
    isDragging,
    fileInfo,
    options,
    imagePreview,
    setBase64Input,
    setBase64Mode,
    updateOptions,
    clearAll,
    copyResult,
    downloadResult,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useBase64Converter();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-gray-800">Base64エンコード・デコード</h2>
      <p className="mb-6 text-gray-600">
        テキストやファイルをBase64形式でエンコード・デコードするツールです
      </p>
      <div className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setBase64Mode('encode')}
              variant={base64Mode === 'encode' ? 'default' : 'outline'}
            >
              エンコード
            </Button>
            <Button
              onClick={() => setBase64Mode('decode')}
              variant={base64Mode === 'decode' ? 'default' : 'outline'}
            >
              デコード
            </Button>
          </div>

          {base64Mode === 'encode' && (
            <div className="flex items-center gap-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>ファイル選択</span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            <Settings className="mr-2 h-4 w-4" />
            詳細オプション
          </Button>
        </div>

        {/* Advanced Options Panel */}
        {showAdvancedOptions && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">詳細オプション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Base64 Encoding Type */}
                <div>
                  <Label htmlFor="encoding">エンコード形式</Label>
                  <Select
                    value={options.encoding}
                    onValueChange={(value) => updateOptions({ encoding: value as any })}
                  >
                    <SelectTrigger id="encoding">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">標準 Base64</SelectItem>
                      <SelectItem value="url-safe">URL-safe Base64</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Character Encoding */}
                <div>
                  <Label htmlFor="character-encoding">文字エンコーディング</Label>
                  <Select
                    value={options.characterEncoding}
                    onValueChange={(value) => updateOptions({ characterEncoding: value as any })}
                  >
                    <SelectTrigger id="character-encoding">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utf-8">UTF-8</SelectItem>
                      <SelectItem value="shift-jis">Shift-JIS</SelectItem>
                      <SelectItem value="euc-jp">EUC-JP</SelectItem>
                      <SelectItem value="iso-2022-jp">ISO-2022-JP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* MIME Line Breaks */}
                <div>
                  <label className="mb-2 block text-sm font-medium">MIME改行</label>
                  <Button
                    variant={options.mimeLineBreaks ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateOptions({ mimeLineBreaks: !options.mimeLineBreaks })}
                    className="w-full"
                  >
                    {options.mimeLineBreaks ? '有効' : '無効'}
                  </Button>
                </div>

                {/* Data URI Generation */}
                {base64Mode === 'encode' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">データURI生成</label>
                    <Button
                      variant={options.generateDataUri ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateOptions({ generateDataUri: !options.generateDataUri })}
                      className="w-full"
                    >
                      {options.generateDataUri ? '有効' : '無効'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Option descriptions */}
              <div className="text-muted-foreground space-y-1 text-xs">
                <p>
                  <strong>URL-safe Base64:</strong> URLに安全な文字（+/を-_に置換）を使用
                </p>
                <p>
                  <strong>MIME改行:</strong> 76文字ごとに改行を挿入（RFC2045準拠）
                </p>
                <p>
                  <strong>データURI:</strong> data:スキーマ形式でファイルを埋め込み可能なURI生成
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {fileInfo && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>ファイル情報:</strong> {fileInfo.name} ({(fileInfo.size / 1024).toFixed(1)}{' '}
              KB, {fileInfo.type || '不明'})
            </div>
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              <Eye className="mr-1 inline h-4 w-4" />
              画像プレビュー
            </label>
            <div className="rounded-md border bg-gray-50 p-4 dark:bg-gray-900">
              <Image
                src={imagePreview}
                alt="Preview"
                className="mx-auto max-h-64 max-w-full rounded object-contain"
              />
            </div>
          </div>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {base64Mode === 'encode' ? 'エンコードするテキスト' : 'デコードするBase64文字列'}
            {base64Mode === 'encode' && (
              <span className="ml-2 text-xs text-gray-500">
                （ファイルをドラッグ&ドロップも可能）
              </span>
            )}
          </label>
          <div
            className={`relative ${base64Mode === 'encode' ? '' : 'pointer-events-none'}`}
            onDragOver={base64Mode === 'encode' ? handleDragOver : undefined}
            onDragLeave={base64Mode === 'encode' ? handleDragLeave : undefined}
            onDrop={base64Mode === 'encode' ? handleDrop : undefined}
          >
            <Textarea
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder={
                base64Mode === 'encode'
                  ? 'エンコードするテキストを入力、またはファイルをドラッグ&ドロップしてください（リアルタイム変換）...'
                  : 'デコードするBase64文字列を入力してください（リアルタイム変換）...'
              }
              className={`h-64 font-mono text-sm ${isDragging ? 'border-blue-400 bg-blue-50' : ''}`}
            />
            {isDragging && base64Mode === 'encode' && (
              <div className="bg-opacity-75 absolute inset-0 flex items-center justify-center rounded-md border-2 border-dashed border-blue-400 bg-blue-100">
                <div className="font-medium text-blue-600">
                  ファイルをここにドロップしてください
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {base64Mode === 'encode' ? 'Base64出力' : 'デコード結果'}
          </label>
          <Textarea
            value={base64Output}
            readOnly
            className="h-64 bg-gray-50 font-mono text-sm"
            placeholder={
              base64Mode === 'encode'
                ? 'エンコード結果がここに表示されます...'
                : 'デコード結果がここに表示されます...'
            }
          />
        </div>
      </div>
      {base64Error && (
        <div className="mt-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
          <strong>エラー:</strong> {base64Error}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={copyResult} disabled={!base64Output} variant="outline">
          結果をコピー
        </Button>
        <Button onClick={downloadResult} disabled={!base64Output} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          結果をダウンロード
        </Button>
        <Button onClick={clearAll} variant="outline">
          すべてクリア
        </Button>
      </div>
    </div>
  );
}
