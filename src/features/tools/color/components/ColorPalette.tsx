'use client';

import { useState } from 'react';

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [colorPalette, setColorPalette] = useState<string[]>([]);

  const generatePalette = () => {
    const hex = baseColor.replace('#', '');
    if (hex.length !== 6) return;
    
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const palette = [];
    
    for (let i = 1; i <= 4; i++) {
      const factor = i * 0.2;
      const newR = Math.round(r + (255 - r) * factor);
      const newG = Math.round(g + (255 - g) * factor);
      const newB = Math.round(b + (255 - b) * factor);
      palette.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    
    for (let i = 1; i <= 4; i++) {
      const factor = i * 0.2;
      const newR = Math.round(r * (1 - factor));
      const newG = Math.round(g * (1 - factor));
      const newB = Math.round(b * (1 - factor));
      palette.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    
    setColorPalette([baseColor, ...palette]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Color Palette Generator</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Base Color</label>
          <div className="flex gap-4 items-center">
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
              className="p-2 border border-gray-300 rounded font-mono"
            />
            <button onClick={generatePalette} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Generate Palette</button>
          </div>
        </div>
        {colorPalette.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {colorPalette.map((color, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-full h-20 rounded-lg border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(color).catch(err => console.error('Copy failed:', err));
                    }
                  }}
                ></div>
                <p className="text-xs font-mono mt-1">{color}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}