'use client';

import { useState } from 'react';

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonOutput(formatted);
      setJsonError('');
    } catch {
      setJsonError('Invalid JSON format');
      setJsonOutput('');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonOutput(minified);
      setJsonError('');
    } catch {
      setJsonError('Invalid JSON format');
      setJsonOutput('');
    }
  };

  const clearJSON = () => {
    setJsonInput('');
    setJsonOutput('');
    setJsonError('');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">JSON Formatter</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Input JSON</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Formatted JSON</label>
          <textarea
            value={jsonOutput}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
          />
        </div>
      </div>
      {jsonError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {jsonError}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={formatJSON} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Format JSON</button>
        <button onClick={minifyJSON} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Minify JSON</button>
        <button onClick={clearJSON} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Clear All</button>
      </div>
    </div>
  );
}