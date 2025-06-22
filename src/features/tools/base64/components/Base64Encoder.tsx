'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { useBase64Converter } from '../hooks/useBase64Converter';
import { Download, Settings, Eye } from 'lucide-react';
import { useState } from 'react';

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
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">Base64エンコード・デコード</h2>
      <p className="text-gray-600 mb-6">テキストやファイルをBase64形式でエンコード・デコードするツールです</p>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
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
            <Settings className="w-4 h-4 mr-2" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Base64 Encoding Type */}
                <div>
                  <Select
                    label="エンコード形式"
                    value={options.encoding}
                    onChange={(e) => updateOptions({ encoding: e.target.value as any })}
                    options={[
                      { value: "standard", label: "標準 Base64" },
                      { value: "url-safe", label: "URL-safe Base64" }
                    ]}
                  />
                </div>
                
                {/* Character Encoding */}
                <div>
                  <Select
                    label="文字エンコーディング"
                    value={options.characterEncoding}
                    onChange={(e) => updateOptions({ characterEncoding: e.target.value as any })}
                    options={[
                      { value: "utf-8", label: "UTF-8" },
                      { value: "shift-jis", label: "Shift-JIS" },
                      { value: "euc-jp", label: "EUC-JP" },
                      { value: "iso-2022-jp", label: "ISO-2022-JP" }
                    ]}
                  />
                </div>
                
                {/* MIME Line Breaks */}
                <div>
                  <label className="block text-sm font-medium mb-2">MIME改行</label>
                  <Button
                    variant={options.mimeLineBreaks ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateOptions({ mimeLineBreaks: !options.mimeLineBreaks })}
                    className="w-full"
                  >
                    {options.mimeLineBreaks ? "有効" : "無効"}
                  </Button>
                </div>
                
                {/* Data URI Generation */}
                {base64Mode === 'encode' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">データURI生成</label>
                    <Button
                      variant={options.generateDataUri ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateOptions({ generateDataUri: !options.generateDataUri })}
                      className="w-full"
                    >
                      {options.generateDataUri ? "有効" : "無効"}
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Option descriptions */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>URL-safe Base64:</strong> URLに安全な文字（+/を-_に置換）を使用</p>
                <p><strong>MIME改行:</strong> 76文字ごとに改行を挿入（RFC2045準拠）</p>
                <p><strong>データURI:</strong> data:スキーマ形式でファイルを埋め込み可能なURI生成</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {fileInfo && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>ファイル情報:</strong> {fileInfo.name} ({(fileInfo.size / 1024).toFixed(1)} KB, {fileInfo.type || '不明'})
            </div>
          </div>
        )}
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              <Eye className="w-4 h-4 inline mr-1" />
              画像プレビュー
            </label>
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full max-h-64 object-contain mx-auto rounded"
              />
            </div>
          </div>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {base64Mode === 'encode' ? 'エンコードするテキスト' : 'デコードするBase64文字列'}
            {base64Mode === 'encode' && (
              <span className="text-xs text-gray-500 ml-2">（ファイルをドラッグ&ドロップも可能）</span>
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
              className={`h-64 font-mono text-sm ${
                isDragging ? 'border-blue-400 bg-blue-50' : ''
              }`}
            />
            {isDragging && base64Mode === 'encode' && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-75 border-2 border-dashed border-blue-400 rounded-md flex items-center justify-center">
                <div className="text-blue-600 font-medium">
                  ファイルをここにドロップしてください
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {base64Mode === 'encode' ? 'Base64出力' : 'デコード結果'}
          </label>
          <Textarea
            value={base64Output}
            readOnly
            className="h-64 font-mono text-sm bg-gray-50"
            placeholder={base64Mode === 'encode' ? 'エンコード結果がここに表示されます...' : 'デコード結果がここに表示されます...'}
          />
        </div>
      </div>
      {base64Error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>エラー:</strong> {base64Error}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          onClick={copyResult}
          disabled={!base64Output}
          variant="outline"
        >
          結果をコピー
        </Button>
        <Button
          onClick={downloadResult}
          disabled={!base64Output}
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          結果をダウンロード
        </Button>
        <Button 
          onClick={clearAll}
          variant="outline"
        >
          すべてクリア
        </Button>
      </div>
    </div>
  );
}