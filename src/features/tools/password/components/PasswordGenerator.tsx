'use client';

import { useState } from 'react';

export default function PasswordGenerator() {
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (charset === '') {
      setGeneratedPassword('Please select at least one character type');
      return;
    }
    
    const requiredChars = [];
    
    if (includeUppercase) requiredChars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]);
    if (includeLowercase) requiredChars.push('abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]);
    if (includeNumbers) requiredChars.push('0123456789'[Math.floor(Math.random() * 10)]);
    if (includeSymbols) requiredChars.push('!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 25)]);
    
    for (let i = requiredChars.length; i < passwordLength; i++) {
      requiredChars.push(charset.charAt(Math.floor(Math.random() * charset.length)));
    }
    
    for (let i = requiredChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]];
    }
    
    setGeneratedPassword(requiredChars.join(''));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Password Generator</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Length: {passwordLength}</label>
          <input
            type="range"
            min="4"
            max="50"
            value={passwordLength}
            onChange={(e) => setPasswordLength(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="mr-2"
            />
            Uppercase (A-Z)
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="mr-2"
            />
            Lowercase (a-z)
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="mr-2"
            />
            Numbers (0-9)
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="mr-2"
            />
            Symbols (!@#$...)
          </label>
        </div>
        <button onClick={generatePassword} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Generate Password</button>
        {generatedPassword && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Generated Password</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={generatedPassword}
                readOnly
                className="flex-1 p-3 border border-gray-300 rounded-md font-mono text-sm bg-white"
              />
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(generatedPassword).catch(err => console.error('Copy failed:', err));
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}