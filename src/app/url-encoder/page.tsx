'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function URLEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      if (mode === 'encode') {
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
      }
      setError('');
    } catch {
      setError(`Invalid ${mode === 'encode' ? 'text' : 'URL encoded'} format`);
      setOutput('');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          URL Encoder/Decoder
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setMode('encode')}
                className={`px-4 py-2 rounded ${
                  mode === 'encode'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-4 py-2 rounded ${
                  mode === 'decode'
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
                {mode === 'encode' ? 'Text/URL to Encode' : 'URL Encoded Text to Decode'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'encode'
                    ? 'Enter text or URL to encode...\nExample: Hello World!'
                    : 'Enter URL-encoded text to decode...\nExample: Hello%20World%21'
                }
                className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'encode' ? 'URL Encoded Output' : 'Decoded Text'}
              </label>
              <textarea
                value={output}
                readOnly
                className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
              />
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleConvert}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Copy Result
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
            >
              Clear All
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Common URL Characters:</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <div>Space → %20</div>
              <div>! → %21</div>
              <div>" → %22</div>
              <div># → %23</div>
              <div>% → %25</div>
              <div>& → %26</div>
              <div>+ → %2B</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}