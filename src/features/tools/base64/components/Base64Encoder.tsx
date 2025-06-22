'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useBase64Converter } from '../hooks/useBase64Converter';

export default function Base64Encoder() {
  const {
    base64Input,
    base64Output,
    base64Mode,
    base64Error,
    isDragging,
    fileInfo,
    setBase64Input,
    setBase64Mode,
    clearAll,
    copyResult,
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
        </div>
        
        {fileInfo && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm text-blue-800">
              <strong>ファイル情報:</strong> {fileInfo.name} ({(fileInfo.size / 1024).toFixed(1)} KB, {fileInfo.type || '不明'})
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
          onClick={clearAll}
          variant="outline"
        >
          すべてクリア
        </Button>
      </div>
    </div>
  );
}