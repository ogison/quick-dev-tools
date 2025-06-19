'use client';

import { useState } from 'react';

export default function RegexTester() {
  const [regexPattern, setRegexPattern] = useState('');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexText, setRegexText] = useState('');
  const [regexMatches, setRegexMatches] = useState<RegExpMatchArray[]>([]);
  const [regexError, setRegexError] = useState('');

  const testRegex = () => {
    try {
      if (!regexPattern) {
        setRegexError('Please enter a regular expression pattern');
        setRegexMatches([]);
        return;
      }
      const regex = new RegExp(regexPattern, regexFlags);
      const matches = Array.from(regexText.matchAll(regex));
      setRegexMatches(matches);
      setRegexError('');
    } catch {
      setRegexError('Invalid regular expression pattern or flags');
      setRegexMatches([]);
    }
  };

  const clearRegex = () => {
    setRegexPattern('');
    setRegexText('');
    setRegexMatches([]);
    setRegexError('');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Regular Expression Tester</h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Regular Expression</label>
            <input
              type="text"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flags</label>
            <input
              type="text"
              value={regexFlags}
              onChange={(e) => setRegexFlags(e.target.value)}
              placeholder="g, i, m, s, u, y"
              className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Test String</label>
          <textarea
            value={regexText}
            onChange={(e) => setRegexText(e.target.value)}
            placeholder="Enter text to test..."
            className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={testRegex} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Test Regex</button>
          <button onClick={clearRegex} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Clear All</button>
        </div>
        {regexError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{regexError}</div>
        )}
        {regexMatches.length > 0 && (
          <div className="p-3 bg-green-100 border border-green-400 rounded">
            <h4 className="font-semibold text-green-800 mb-2">Matches ({regexMatches.length}):</h4>
            {regexMatches.map((match, index) => (
              <div key={index} className="font-mono text-sm text-green-700">
                Match {index + 1}: &quot;{match[0]}&quot; at position {match.index}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}