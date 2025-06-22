'use client';

import { useState } from 'react';

export default function QrGenerator() {
  const [qrText, setQrText] = useState('');
  const [qrSize, setQrSize] = useState(200);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">QR Code Generator</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text to encode</label>
          <textarea
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
            placeholder="Enter text or URL..."
            className="w-full h-24 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size: {qrSize}px</label>
          <input
            type="range"
            min="100"
            max="400"
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
            className="w-full"
          />
        </div>
        {qrText && (
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <div className="inline-block p-4 bg-white rounded border-2 border-dashed border-gray-400">
              <p className="text-gray-600">QR Code Preview</p>
              <p className="text-sm text-gray-500 mt-2">Size: {qrSize}x{qrSize}px</p>
              <p className="text-xs text-gray-400 mt-1">Text: {qrText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}