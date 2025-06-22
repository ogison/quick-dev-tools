'use client';

import { useState, useCallback } from 'react';
import {
  generateColorPalette,
  getColorConversions,
  calculateContrastRatio,
  copyToClipboard,
  generateRandomColor
} from '../utils/color';
import type { PaletteType, ColorPalette as ColorPaletteType, ColorConversions } from '../types';

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
    { value: 'splitComplementary', label: '分裂補色' }
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
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">カラーパレット生成</h2>
      <p className="text-gray-600 mb-6">開発者向けのカラーパレット生成・変換ツールです</p>

      {/* カラー選択とオプション */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">配色タイプ:</label>
            <select
              value={paletteType}
              onChange={(e) => setPaletteType(e.target.value as PaletteType)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {paletteTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleRandomColor}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            ランダム色生成
          </button>
        </div>
      </div>

      {/* ベースカラー入力 */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ベースカラー</label>
          <div className="flex gap-4 items-center mb-4">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-16 h-12 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              placeholder="#3b82f6"
              className="flex-1 p-2 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* カラー形式変換 */}
        {colorConversions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">カラー形式変換</label>
            <div className="space-y-2">
              {Object.entries(colorConversions).map(([format, value]) => (
                <div key={format} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600 w-8 uppercase">
                    {format}
                  </span>
                  <input
                    type="text"
                    value={value}
                    readOnly
                    className="flex-1 p-2 text-sm border border-gray-300 rounded font-mono bg-gray-50"
                  />
                  <button
                    onClick={() => handleCopyColor(value)}
                    className={`px-3 py-2 text-sm rounded ${
                      copySuccess === value
                        ? 'bg-green-100 text-green-700 border border-green-300'
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
      <div className="mb-6 p-4 border border-gray-300 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-3">コントラスト比チェック</h3>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">背景色:</label>
            <input
              type="color"
              value={contrastColor}
              onChange={(e) => setContrastColor(e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={contrastColor}
              onChange={(e) => setContrastColor(e.target.value)}
              className="w-24 p-1 border border-gray-300 rounded font-mono text-sm"
            />
          </div>
          <div className="text-sm">
            <span className="font-medium">比率: {contrastResult.ratio.toFixed(2)}</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
              contrastResult.isAccessible 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {contrastResult.level} {contrastResult.isAccessible ? '(合格)' : '(不合格)'}
            </span>
          </div>
        </div>
        <div 
          className="w-full h-16 rounded flex items-center justify-center font-medium text-lg"
          style={{ 
            backgroundColor: contrastColor, 
            color: baseColor 
          }}
        >
          サンプルテキスト
        </div>
      </div>

      {/* パレット生成ボタン */}
      <div className="mb-6">
        <button 
          onClick={generatePalette}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          パレット生成
        </button>
      </div>

      {/* 生成されたパレット */}
      {colorPalette && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {colorPalette.name} ({colorPalette.colors.length}色)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {colorPalette.colors.map((color, index) => (
              <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
                <div
                  className="w-full h-24 cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopyColor(color)}
                  title={`${color}をコピー`}
                />
                <div className="p-3 bg-white">
                  <p className="text-sm font-mono text-gray-800 mb-1">{color}</p>
                  <button
                    onClick={() => handleCopyColor(color)}
                    className={`text-xs px-2 py-1 rounded ${
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