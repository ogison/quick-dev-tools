'use client';

import { useState } from 'react';

export default function LoremIpsum() {
  const [loremType, setLoremType] = useState('paragraphs');
  const [loremCount, setLoremCount] = useState(3);
  const [loremText, setLoremText] = useState('');

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];
  
  const generateLorem = () => {
    if (loremCount <= 0) {
      setLoremText('Please enter a count greater than 0');
      return;
    }
    
    let result = '';
    
    if (loremType === 'words') {
      const words = [];
      for (let i = 0; i < loremCount; i++) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      result = words.join(' ');
    } else if (loremType === 'sentences') {
      const sentences = [];
      for (let i = 0; i < loremCount; i++) {
        const wordCount = Math.floor(Math.random() * 12) + 8;
        const words = [];
        for (let j = 0; j < wordCount; j++) {
          words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        const sentence = words.join(' ');
        sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
      }
      result = sentences.join(' ');
    } else if (loremType === 'paragraphs') {
      const paragraphs = [];
      for (let i = 0; i < loremCount; i++) {
        const sentenceCount = Math.floor(Math.random() * 4) + 4;
        const sentences = [];
        for (let j = 0; j < sentenceCount; j++) {
          const wordCount = Math.floor(Math.random() * 12) + 8;
          const words = [];
          for (let k = 0; k < wordCount; k++) {
            words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
          }
          const sentence = words.join(' ');
          sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
        }
        paragraphs.push(sentences.join(' '));
      }
      result = paragraphs.join('\n\n');
    }
    
    setLoremText(result);
  };

  const clearLorem = () => {
    setLoremText('');
    setLoremCount(3);
    setLoremType('paragraphs');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Lorem Ipsum Generator</h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={loremType}
              onChange={(e) => setLoremType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
            <input
              type="number"
              min="1"
              max="50"
              value={loremCount}
              onChange={(e) => setLoremCount(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={generateLorem} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Generate Lorem Ipsum</button>
          <button onClick={clearLorem} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Clear</button>
        </div>
        {loremText && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Generated Text</label>
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(loremText).catch(err => console.error('Copy failed:', err));
                  }
                }}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Copy
              </button>
            </div>
            <textarea
              value={loremText}
              readOnly
              className="w-full h-48 p-3 border border-gray-300 rounded-md text-sm bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}