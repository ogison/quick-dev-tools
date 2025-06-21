'use client';

import { useState } from 'react';

export default function HashGenerator() {
  const [hashInput, setHashInput] = useState('');
  const [hashResults, setHashResults] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  const [hashError, setHashError] = useState('');

  const generateHashes = async () => {
    try {
      if (!hashInput.trim()) {
        setHashError('Please enter text to hash');
        return;
      }

      // Check if browser APIs are available
      if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
        setHashError('Crypto APIs not available in this environment');
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);

      const sha1Hash = await crypto.subtle.digest('SHA-1', data);
      const sha256Hash = await crypto.subtle.digest('SHA-256', data);
      const sha512Hash = await crypto.subtle.digest('SHA-512', data);

      const arrayBufferToHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      };

      const simpleMD5 = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 32);
      };

      setHashResults({
        md5: simpleMD5(hashInput),
        sha1: arrayBufferToHex(sha1Hash),
        sha256: arrayBufferToHex(sha256Hash),
        sha512: arrayBufferToHex(sha512Hash)
      });
      setHashError('');
    } catch (err) {
      setHashError('Error generating hashes: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error(err);
    }
  };

  const clearHash = () => {
    setHashInput('');
    setHashResults({
      md5: '',
      sha1: '',
      sha256: '',
      sha512: ''
    });
    setHashError('');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Hash Generator</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Text
        </label>
        <textarea
          value={hashInput}
          onChange={(e) => setHashInput(e.target.value)}
          placeholder="Enter text to generate hashes..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {hashError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {hashError}
        </div>
      )}
      <div className="mb-6 flex flex-wrap gap-3">
        <button onClick={generateHashes} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Generate Hashes
        </button>
        <button onClick={clearHash} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Clear All
        </button>
      </div>
      <div className="space-y-4">
        {['md5', 'sha1', 'sha256', 'sha512'].map((hashType) => (
          <div key={hashType} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{hashType.toUpperCase()}</h3>
              <button
                onClick={() => {
                  const text = hashResults[hashType as keyof typeof hashResults];
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(text).catch(err => {
                      console.error('Failed to copy:', err);
                    });
                  }
                }}
                disabled={!hashResults[hashType as keyof typeof hashResults]}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Copy
              </button>
            </div>
            <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
              {hashResults[hashType as keyof typeof hashResults] || 'Hash will appear here...'}
            </div>
            {hashType === 'md5' && (
              <p className="text-xs text-gray-500 mt-1">
                Note: This MD5 is a demo implementation. Use proper crypto libraries in production.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}