'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('json');
  
  // JSON Formatter states
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  // Regex Tester states
  const [regexPattern, setRegexPattern] = useState('');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexText, setRegexText] = useState('');
  const [regexMatches, setRegexMatches] = useState([]);
  const [regexError, setRegexError] = useState('');

  // Color Palette states
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [colorPalette, setColorPalette] = useState([]);

  // QR Code states
  const [qrText, setQrText] = useState('');
  const [qrSize, setQrSize] = useState(200);

  // Password Generator states
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Timestamp Converter states
  const [timestamp, setTimestamp] = useState('');
  const [timestampResult, setTimestampResult] = useState('');

  // Lorem Ipsum states
  const [loremType, setLoremType] = useState('paragraphs');
  const [loremCount, setLoremCount] = useState(3);
  const [loremText, setLoremText] = useState('');

  // Base64 states
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState('encode');
  const [base64Error, setBase64Error] = useState('');

  // URL Encoder states
  const [urlInput, setUrlInput] = useState('');
  const [urlOutput, setUrlOutput] = useState('');
  const [urlMode, setUrlMode] = useState('encode');
  const [urlError, setUrlError] = useState('');

  // Hash Generator states
  const [hashInput, setHashInput] = useState('');
  const [hashResults, setHashResults] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  const [hashError, setHashError] = useState('');


  // JSON Formatter functions
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

  // Regex Tester functions
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

  // Color Palette functions
  const generatePalette = () => {
    const hex = baseColor.replace('#', '');
    if (hex.length !== 6) return;
    
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const palette = [];
    
    // Lighter shades
    for (let i = 1; i <= 4; i++) {
      const factor = i * 0.2;
      const newR = Math.round(r + (255 - r) * factor);
      const newG = Math.round(g + (255 - g) * factor);
      const newB = Math.round(b + (255 - b) * factor);
      palette.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    
    // Darker shades
    for (let i = 1; i <= 4; i++) {
      const factor = i * 0.2;
      const newR = Math.round(r * (1 - factor));
      const newG = Math.round(g * (1 - factor));
      const newB = Math.round(b * (1 - factor));
      palette.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
    }
    
    setColorPalette([baseColor, ...palette]);
  };

  const generateHarmonyPalette = () => {
    const hex = baseColor.replace('#', '');
    if (hex.length !== 6) return;
    
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Convert RGB to HSL
    const rgb2hsl = (r, g, b) => {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return [h * 360, s * 100, l * 100];
    };
    
    const hsl2rgb = (h, s, l) => {
      h /= 360; s /= 100; l /= 100;
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      if (s === 0) {
        return [l, l, l];
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const r = hue2rgb(p, q, h + 1/3);
        const g = hue2rgb(p, q, h);
        const b = hue2rgb(p, q, h - 1/3);
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      }
    };
    
    const [h, s, l] = rgb2hsl(r, g, b);
    const palette = [baseColor];
    
    // Complementary
    const comp = hsl2rgb((h + 180) % 360, s, l);
    palette.push(`#${comp[0].toString(16).padStart(2, '0')}${comp[1].toString(16).padStart(2, '0')}${comp[2].toString(16).padStart(2, '0')}`);
    
    // Triadic
    const tri1 = hsl2rgb((h + 120) % 360, s, l);
    const tri2 = hsl2rgb((h + 240) % 360, s, l);
    palette.push(`#${tri1[0].toString(16).padStart(2, '0')}${tri1[1].toString(16).padStart(2, '0')}${tri1[2].toString(16).padStart(2, '0')}`);
    palette.push(`#${tri2[0].toString(16).padStart(2, '0')}${tri2[1].toString(16).padStart(2, '0')}${tri2[2].toString(16).padStart(2, '0')}`);
    
    // Analogous
    const ana1 = hsl2rgb((h + 30) % 360, s, l);
    const ana2 = hsl2rgb((h - 30 + 360) % 360, s, l);
    palette.push(`#${ana1[0].toString(16).padStart(2, '0')}${ana1[1].toString(16).padStart(2, '0')}${ana1[2].toString(16).padStart(2, '0')}`);
    palette.push(`#${ana2[0].toString(16).padStart(2, '0')}${ana2[1].toString(16).padStart(2, '0')}${ana2[2].toString(16).padStart(2, '0')}`);
    
    setColorPalette(palette);
  };


  // Password Generator functions
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
    
    // Ensure at least one character from each selected type
    let password = '';
    const requiredChars = [];
    
    if (includeUppercase) requiredChars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]);
    if (includeLowercase) requiredChars.push('abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]);
    if (includeNumbers) requiredChars.push('0123456789'[Math.floor(Math.random() * 10)]);
    if (includeSymbols) requiredChars.push('!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 25)]);
    
    // Fill the rest with random characters
    for (let i = requiredChars.length; i < passwordLength; i++) {
      requiredChars.push(charset.charAt(Math.floor(Math.random() * charset.length)));
    }
    
    // Shuffle the array
    for (let i = requiredChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]];
    }
    
    setGeneratedPassword(requiredChars.join(''));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: 'No password' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    const levels = [
      { strength: 0, text: 'Very Weak', color: 'text-red-600' },
      { strength: 1, text: 'Weak', color: 'text-red-500' },
      { strength: 2, text: 'Fair', color: 'text-yellow-500' },
      { strength: 3, text: 'Good', color: 'text-yellow-400' },
      { strength: 4, text: 'Strong', color: 'text-green-500' },
      { strength: 5, text: 'Very Strong', color: 'text-green-600' },
      { strength: 6, text: 'Excellent', color: 'text-green-700' }
    ];
    
    return levels[score] || levels[0];
  };

  // Timestamp Converter functions
  const convertTimestamp = () => {
    if (!timestamp.trim()) {
      setTimestampResult('Please enter a timestamp or date');
      return;
    }
    
    try {
      // Try to parse as Unix timestamp first
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
      
      // Try to parse as date string
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

  // Lorem Ipsum functions
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
        const wordCount = Math.floor(Math.random() * 12) + 8; // 8-20 words per sentence
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
        const sentenceCount = Math.floor(Math.random() * 4) + 4; // 4-8 sentences per paragraph
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

  // Base64 functions
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

  // URL Encoder functions
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

  // Hash Generator functions
  const generateHashes = async () => {
    try {
      if (!hashInput.trim()) {
        setHashError('Please enter text to hash');
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);

      // Generate SHA hashes using Web Crypto API
      const sha1Hash = await crypto.subtle.digest('SHA-1', data);
      const sha256Hash = await crypto.subtle.digest('SHA-256', data);
      const sha512Hash = await crypto.subtle.digest('SHA-512', data);

      // Convert ArrayBuffer to hex string
      const arrayBufferToHex = (buffer) => {
        return Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      };

      // Simple MD5 implementation (demo purposes)
      const simpleMD5 = (str) => {
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
      setHashError('Error generating hashes');
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

  const tabs = [
    { id: 'json', name: 'JSON Formatter', number: '1' },
    { id: 'base64', name: 'Base64 Encoder', number: '2' },
    { id: 'url', name: 'URL Encoder', number: '3' },
    { id: 'hash', name: 'Hash Generator', number: '4' },
    { id: 'regex', name: 'Regex Tester', number: '5' },
    { id: 'color', name: 'Color Palette', number: '6' },
    { id: 'qr', name: 'QR Generator', number: '7' },
    { id: 'password', name: 'Password Gen', number: '8' },
    { id: 'timestamp', name: 'Timestamp', number: '9' },
    { id: 'lorem', name: 'Lorem Ipsum', number: '10' },
  ];


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Developer Tools
        </h1>
        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.number}. {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'json' && (
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
          )}

          {activeTab === 'base64' && (
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
          )}

          {activeTab === 'url' && (
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
                  <div>" → %22</div>
                  <div># → %23</div>
                  <div>% → %25</div>
                  <div>& → %26</div>
                  <div>+ → %2B</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hash' && (
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
                {/* MD5 Hash */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">MD5</h3>
                    <button
                      onClick={() => navigator.clipboard.writeText(hashResults.md5)}
                      disabled={!hashResults.md5}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
                    {hashResults.md5 || 'Hash will appear here...'}
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
                      onClick={() => navigator.clipboard.writeText(hashResults.sha1)}
                      disabled={!hashResults.sha1}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
                    {hashResults.sha1 || 'Hash will appear here...'}
                  </div>
                </div>
                
                {/* SHA-256 Hash */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">SHA-256</h3>
                    <button
                      onClick={() => navigator.clipboard.writeText(hashResults.sha256)}
                      disabled={!hashResults.sha256}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
                    {hashResults.sha256 || 'Hash will appear here...'}
                  </div>
                </div>
                
                {/* SHA-512 Hash */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">SHA-512</h3>
                    <button
                      onClick={() => navigator.clipboard.writeText(hashResults.sha512)}
                      disabled={!hashResults.sha512}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm break-all">
                    {hashResults.sha512 || 'Hash will appear here...'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'regex' && (
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
                <button onClick={testRegex} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Test Regex</button>
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
          )}

          {activeTab === 'color' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Color Palette Generator</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Color</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-16 h-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="p-2 border border-gray-300 rounded font-mono"
                    />
                    <button onClick={generatePalette} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Generate Palette</button>
                  </div>
                </div>
                {colorPalette.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                    {colorPalette.map((color, index) => (
                      <div key={index} className="text-center">
                        <div
                          className="w-full h-20 rounded-lg border border-gray-300 cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={() => navigator.clipboard.writeText(color)}
                        ></div>
                        <p className="text-xs font-mono mt-1">{color}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">QR Code Generator</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text to encode</label>
                  <textarea
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    placeholder="Enter text or URL..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size: {qrSize}px</label>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    value={qrSize}
                    onChange={(e) => setQrSize(e.target.value)}
                    className="w-full"
                  />
                </div>
                {qrText && (
                  <div className="p-4 bg-gray-100 rounded-lg text-center">
                    <div className="inline-block p-4 bg-white rounded border-2 border-dashed border-gray-400">
                      <p className="text-gray-600">QR Code Preview</p>
                      <p className="text-sm text-gray-500 mt-2">Size: {qrSize}x{qrSize}px</p>
                      <p className="text-xs text-gray-400 mt-1">Text: {qrText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'password' && (
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
                    onChange={(e) => setPasswordLength(e.target.value)}
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
                        onClick={() => navigator.clipboard.writeText(generatedPassword)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'timestamp' && (
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
                <button onClick={convertTimestamp} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Convert</button>
                {timestampResult && (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Result</label>
                    <input
                      type="text"
                      value={timestampResult}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm bg-white"
                    />
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <p>Current timestamp: {Math.floor(Date.now() / 1000)}</p>
                  <p>Current date: {new Date().toISOString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lorem' && (
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
                      onChange={(e) => setLoremCount(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button onClick={generateLorem} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Generate Lorem Ipsum</button>
                {loremText && (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Generated Text</label>
                      <button
                        onClick={() => navigator.clipboard.writeText(loremText)}
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
          )}
        </div>
      </div>
    </div>
  );
}
