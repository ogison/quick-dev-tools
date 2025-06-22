'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQrGenerator } from '../hooks/useQrGenerator';

const ERROR_CORRECTION_LEVELS = [
  { value: 'L', label: '低（L）' },
  { value: 'M', label: '中（M）' },
  { value: 'Q', label: '高（Q）' },
  { value: 'H', label: '最高（H）' },
] as const;

export default function QrGenerator() {
  const {
    text,
    size,
    errorCorrectionLevel,
    foregroundColor,
    backgroundColor,
    qrDataURL,
    isGenerating,
    canvasRef,
    setText,
    setSize,
    setErrorCorrectionLevel,
    setForegroundColor,
    setBackgroundColor,
    downloadQrCode,
    clearAll,
  } = useQrGenerator();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">QRコード生成</h2>
      <p className="text-gray-600 mb-6">テキストやURLからQRコードを生成し、画像として保存できるツールです</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 設定パネル */}
        <div className="space-y-6">
          {/* テキスト入力 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QRコード化するテキスト
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="URLやテキストを入力してください（リアルタイム生成）..."
              className="h-24 font-mono text-sm"
            />
          </div>

          {/* オプション設定 */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* サイズ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サイズ: {size}px
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="16"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* エラー訂正レベル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                エラー訂正レベル
              </label>
              <select
                value={errorCorrectionLevel}
                onChange={(e) => setErrorCorrectionLevel(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ERROR_CORRECTION_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 色設定 */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* 前景色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                前景色（QRコード）
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* 背景色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                背景色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={downloadQrCode}
              disabled={!text.trim() || isGenerating}
            >
              PNGダウンロード
            </Button>
            <Button
              onClick={clearAll}
              variant="outline"
            >
              すべてクリア
            </Button>
          </div>
        </div>

        {/* プレビューパネル */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">プレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              {text.trim() ? (
                <div className="text-center">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-gray-500">生成中...</div>
                    </div>
                  ) : qrDataURL ? (
                    <div className="space-y-4">
                      <div className="inline-block p-4 border-2 border-gray-200 rounded-lg">
                        <img
                          src={qrDataURL}
                          alt="QRコード"
                          className="block"
                          style={{ width: size, height: size }}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>サイズ: {size}×{size}px</p>
                        <p>エラー訂正: {ERROR_CORRECTION_LEVELS.find(l => l.value === errorCorrectionLevel)?.label}</p>
                        <p className="break-all mt-2 font-mono text-xs">テキスト: {text}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-gray-500">QRコードを生成できませんでした</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  テキストを入力するとQRコードが表示されます
                </div>
              )}
              
              {/* Hidden canvas for QR generation */}
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}