'use client';

import { useState, useCallback } from 'react';

import type { PaletteType, ColorPalette as ColorPaletteType, ColorConversions } from '../types';
import {
  generateColorPalette,
  getColorConversions,
  calculateContrastRatio,
  copyToClipboard,
  generateRandomColor,
} from '../utils/color';

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [paletteType, setPaletteType] = useState<PaletteType>('monochromatic');
  const [colorPalette, setColorPalette] = useState<ColorPaletteType | null>(null);
  const [colorConversions, setColorConversions] = useState<ColorConversions | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [contrastColor, setContrastColor] = useState('#ffffff');

  const paletteTypeOptions = [
    { value: 'monochromatic', label: 'モノクロマティック' },
    { value: 'analogous', label: '類似色' },
    { value: 'complementary', label: '補色' },
    { value: 'triadic', label: '三角配色' },
    { value: 'tetradic', label: '四角配色' },
    { value: 'splitComplementary', label: '分裂補色' },
  ];

  const generatePalette = useCallback(() => {
    const palette = generateColorPalette(baseColor, paletteType);
    const conversions = getColorConversions(baseColor);

    setColorPalette(palette);
    setColorConversions(conversions);
  }, [baseColor, paletteType]);

  const handleRandomColor = () => {
    const randomColor = generateRandomColor();
    setBaseColor(randomColor);
  };

  const handleCopyColor = async (color: string) => {
    const success = await copyToClipboard(color);
    if (success) {
      setCopySuccess(color);
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const contrastResult = calculateContrastRatio(baseColor, contrastColor);

  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-gray-800">カラーパレット生成</h2>
      <p className="mb-6 text-gray-600">開発者向けのカラーパレット生成・変換ツールです</p>

      {/* カラー選択とオプション */}
      <div className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">配色タイプ:</label>
            <select
              value={paletteType}
              onChange={(e) => setPaletteType(e.target.value as PaletteType)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              {paletteTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleRandomColor}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            ランダム色生成
          </button>
        </div>
      </div>

      {/* ベースカラー入力 */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">ベースカラー</label>
          <div className="mb-4 flex items-center gap-4">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="h-12 w-16 cursor-pointer rounded border border-gray-300"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              placeholder="#3b82f6"
              className="flex-1 rounded border border-gray-300 p-2 font-mono text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* カラー形式変換 */}
        {colorConversions && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">カラー形式変換</label>
            <div className="space-y-2">
              {Object.entries(colorConversions).map(([format, value]) => (
                <div key={format} className="flex items-center gap-2">
                  <span className="w-8 text-xs font-medium text-gray-600 uppercase">{format}</span>
                  <input
                    type="text"
                    value={value}
                    readOnly
                    className="flex-1 rounded border border-gray-300 bg-gray-50 p-2 font-mono text-sm"
                  />
                  <button
                    onClick={() => handleCopyColor(value)}
                    className={`rounded px-3 py-2 text-sm ${
                      copySuccess === value
                        ? 'border border-green-300 bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {copySuccess === value ? '完了!' : 'コピー'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* コントラスト比チェック */}
      <div className="mb-6 rounded-lg border border-gray-300 p-4">
        <h3 className="mb-3 text-lg font-medium text-gray-800">コントラスト比チェック</h3>
        <div className="mb-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">背景色:</label>
            <input
              type="color"
              value={contrastColor}
              onChange={(e) => setContrastColor(e.target.value)}
              className="h-8 w-12 cursor-pointer rounded border border-gray-300"
            />
            <input
              type="text"
              value={contrastColor}
              onChange={(e) => setContrastColor(e.target.value)}
              className="w-24 rounded border border-gray-300 p-1 font-mono text-sm"
            />
          </div>
          <div className="text-sm">
            <span className="font-medium">比率: {contrastResult.ratio.toFixed(2)}</span>
            <span
              className={`ml-2 rounded px-2 py-1 text-xs font-medium ${
                contrastResult.isAccessible
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {contrastResult.level} {contrastResult.isAccessible ? '(合格)' : '(不合格)'}
            </span>
          </div>
        </div>
        <div
          className="flex h-16 w-full items-center justify-center rounded text-lg font-medium"
          style={{
            backgroundColor: contrastColor,
            color: baseColor,
          }}
        >
          サンプルテキスト
        </div>
      </div>

      {/* パレット生成ボタン */}
      <div className="mb-6">
        <button
          onClick={generatePalette}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          パレット生成
        </button>
      </div>

      {/* 生成されたパレット */}
      {colorPalette && (
        <div>
          <h3 className="mb-4 text-lg font-medium text-gray-800">
            {colorPalette.name} ({colorPalette.colors.length}色)
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {colorPalette.colors.map((color, index) => (
              <div key={index} className="overflow-hidden rounded-lg border border-gray-300">
                <div
                  className="h-24 w-full cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopyColor(color)}
                  title={`${color}をコピー`}
                />
                <div className="bg-white p-3">
                  <p className="mb-1 font-mono text-sm text-gray-800">{color}</p>
                  <button
                    onClick={() => handleCopyColor(color)}
                    className={`rounded px-2 py-1 text-xs ${
                      copySuccess === color
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {copySuccess === color ? 'コピー完了!' : 'コピー'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
