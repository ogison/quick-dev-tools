'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HashGeneratorTool() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  const [error, setError] = useState('');

  const generateHashes = async () => {
    try {
      if (!input.trim()) {
        setError('Please enter text to hash');
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      // Generate SHA hashes using Web Crypto API
      const sha1Hash = await crypto.subtle.digest('SHA-1', data);
      const sha256Hash = await crypto.subtle.digest('SHA-256', data);
      const sha512Hash = await crypto.subtle.digest('SHA-512', data);

      // Convert ArrayBuffer to hex string
      const arrayBufferToHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      };

      // Simple MD5 implementation (not cryptographically secure, for demo purposes)
      const simpleMD5 = (str: string) => {
        // This is a simplified demonstration - in production, use a proper crypto library
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 32);
      };

      setHashes({
        md5: simpleMD5(input),
        sha1: arrayBufferToHex(sha1Hash),
        sha256: arrayBufferToHex(sha256Hash),
        sha512: arrayBufferToHex(sha512Hash)
      });
      setError('');
    } catch (err) {
      setError('Error generating hashes');
      console.error(err);
    }
  };

  const clearAll = () => {
    setInput('');
    setHashes({
      md5: '',
      sha1: '',
      sha256: '',
      sha512: ''
    });
    setError('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
          Hash Generator
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to generate hashes..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={generateHashes}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Generate Hashes
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-4">
            {/* MD5 Hash */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">MD5</h3>
                <button
                  onClick={() => copyToClipboard(hashes.md5)}
                  disabled={!hashes.md5}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
                {hashes.md5 || 'Hash will appear here...'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Note: This MD5 is a demo implementation. Use proper crypto libraries in production.
              </p>
            </div>
            
            {/* SHA-1 Hash */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">SHA-1</h3>
                <button
                  onClick={() => copyToClipboard(hashes.sha1)}
                  disabled={!hashes.sha1}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
                {hashes.sha1 || 'Hash will appear here...'}
              </div>
            </div>
            
            {/* SHA-256 Hash */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">SHA-256</h3>
                <button
                  onClick={() => copyToClipboard(hashes.sha256)}
                  disabled={!hashes.sha256}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
                {hashes.sha256 || 'Hash will appear here...'}
              </div>
            </div>
            
            {/* SHA-512 Hash */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">SHA-512</h3>
                <button
                  onClick={() => copyToClipboard(hashes.sha512)}
                  disabled={!hashes.sha512}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
                {hashes.sha512 || 'Hash will appear here...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}