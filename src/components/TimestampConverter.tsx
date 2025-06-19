'use client';

import { useState } from 'react';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [timestampResult, setTimestampResult] = useState('');

  const convertTimestamp = () => {
    if (!timestamp.trim()) {
      setTimestampResult('Please enter a timestamp or date');
      return;
    }
    
    try {
      const ts = parseInt(timestamp);
      if (!isNaN(ts) && ts.toString() === timestamp.trim()) {
        const date = new Date(ts * 1000);
        if (date.getTime() > 0) {
          const formatted = {
            iso: date.toISOString(),
            local: date.toLocaleString(),
            utc: date.toUTCString(),
            date: date.toDateString(),
            time: date.toTimeString()
          };
          setTimestampResult(JSON.stringify(formatted, null, 2));
          return;
        }
      }
      
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        const unixTimestamp = Math.floor(date.getTime() / 1000);
        const formatted = {
          unix: unixTimestamp,
          milliseconds: date.getTime(),
          iso: date.toISOString(),
          local: date.toLocaleString(),
          utc: date.toUTCString()
        };
        setTimestampResult(JSON.stringify(formatted, null, 2));
      } else {
        setTimestampResult('Invalid timestamp or date format');
      }
    } catch {
      setTimestampResult('Error parsing timestamp');
    }
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    const currentData = {
      unix: Math.floor(now.getTime() / 1000),
      milliseconds: now.getTime(),
      iso: now.toISOString(),
      local: now.toLocaleString(),
      utc: now.toUTCString()
    };
    setTimestamp(currentData.unix.toString());
    setTimestampResult(JSON.stringify(currentData, null, 2));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Timestamp Converter</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timestamp or Date</label>
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="Enter Unix timestamp or date string..."
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={convertTimestamp} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Convert</button>
          <button onClick={getCurrentTimestamp} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Current Time</button>
        </div>
        {timestampResult && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
            <textarea
              value={timestampResult}
              readOnly
              className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm bg-white"
            />
          </div>
        )}
        <div className="text-sm text-gray-600">
          <p>Current timestamp: {Math.floor(Date.now() / 1000)}</p>
          <p>Current date: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}