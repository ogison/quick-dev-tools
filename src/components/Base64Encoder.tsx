'use client';

import { useState } from 'react';

export default function Base64Encoder() {
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState('encode');
  const [base64Error, setBase64Error] = useState('');

  const handleBase64Convert = () => {
    try {
      if (base64Mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(base64Input)));
        setBase64Output(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(base64Input)));
        setBase64Output(decoded);
      }
      setBase64Error('');
    } catch {
      setBase64Error(`Invalid ${base64Mode === 'encode' ? 'text' : 'Base64'} format`);
      setBase64Output('');
    }
  };

  const clearBase64 = () => {
    setBase64Input('');
    setBase64Output('');
    setBase64Error('');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Base64 Encoder/Decoder</h2>
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setBase64Mode('encode')}
            className={`px-4 py-2 rounded ${
              base64Mode === 'encode'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setBase64Mode('decode')}
            className={`px-4 py-2 rounded ${
              base64Mode === 'decode'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Decode
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {base64Mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder={
              base64Mode === 'encode'
                ? 'Enter text to encode...'
                : 'Enter Base64 string to decode...'
            }
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {base64Mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
          </label>
          <textarea
            value={base64Output}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
          />
        </div>
      </div>
      {base64Error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {base64Error}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={handleBase64Convert} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {base64Mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(base64Output)}
          disabled={!base64Output}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Copy Result
        </button>
        <button onClick={clearBase64} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Clear All</button>
      </div>
    </div>
  );
}