'use client';

import { useState } from 'react';

export default function UrlEncoder() {
  const [urlInput, setUrlInput] = useState('');
  const [urlOutput, setUrlOutput] = useState('');
  const [urlMode, setUrlMode] = useState('encode');
  const [urlError, setUrlError] = useState('');

  const handleUrlConvert = () => {
    try {
      if (urlMode === 'encode') {
        const encoded = encodeURIComponent(urlInput);
        setUrlOutput(encoded);
      } else {
        const decoded = decodeURIComponent(urlInput);
        setUrlOutput(decoded);
      }
      setUrlError('');
    } catch {
      setUrlError(`Invalid ${urlMode === 'encode' ? 'text' : 'URL encoded'} format`);
      setUrlOutput('');
    }
  };

  const clearUrl = () => {
    setUrlInput('');
    setUrlOutput('');
    setUrlError('');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">URL Encoder/Decoder</h2>
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setUrlMode('encode')}
            className={`px-4 py-2 rounded ${
              urlMode === 'encode'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setUrlMode('decode')}
            className={`px-4 py-2 rounded ${
              urlMode === 'decode'
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
            {urlMode === 'encode' ? 'Text/URL to Encode' : 'URL Encoded Text to Decode'}
          </label>
          <textarea
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={
              urlMode === 'encode'
                ? 'Enter text or URL to encode...\nExample: Hello World!'
                : 'Enter URL-encoded text to decode...\nExample: Hello%20World%21'
            }
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {urlMode === 'encode' ? 'URL Encoded Output' : 'Decoded Text'}
          </label>
          <textarea
            value={urlOutput}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
          />
        </div>
      </div>
      {urlError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {urlError}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={handleUrlConvert} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {urlMode === 'encode' ? 'Encode' : 'Decode'}
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(urlOutput)}
          disabled={!urlOutput}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Copy Result
        </button>
        <button onClick={clearUrl} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Clear All</button>
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Common URL Characters:</h3>
        <div className="text-xs text-blue-800 space-y-1">
          <div>Space → %20</div>
          <div>! → %21</div>
          <div>&quot; → %22</div>
          <div># → %23</div>
          <div>% → %25</div>
          <div>& → %26</div>
          <div>+ → %2B</div>
        </div>
      </div>
    </div>
  );
}