'use client';

import { useState } from 'react';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  count: number;
  generatePassphrase: boolean;
  passphraseWords: number;
  passphraseSeparator: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  entropy: number;
  crackTime: string;
}

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    count: 1,
    generatePassphrase: false,
    passphraseWords: 4,
    passphraseSeparator: '-',
  });

  const [generatedPasswords, setGeneratedPasswords] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState<{ [key: number]: boolean }>({});
  const [error, setError] = useState('');

  // Common words for passphrase generation
  const commonWords = [
    'apple',
    'bridge',
    'cloud',
    'dragon',
    'eagle',
    'forest',
    'guitar',
    'house',
    'island',
    'jungle',
    'kitten',
    'lemon',
    'mountain',
    'ocean',
    'piano',
    'queen',
    'rainbow',
    'sunset',
    'tiger',
    'umbrella',
    'valley',
    'window',
    'yellow',
    'zebra',
    'anchor',
    'butterfly',
    'crystal',
    'diamond',
    'elephant',
    'feather',
    'garden',
    'harbor',
    'lightning',
    'meadow',
    'notebook',
    'orange',
    'penguin',
    'rocket',
    'starfish',
    'thunder',
  ];

  const getSecureRandom = (max: number): number => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }
    // Fallback to Math.random
    return Math.floor(Math.random() * max);
  };

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) {
      charsetSize += 26;
    }
    if (/[A-Z]/.test(password)) {
      charsetSize += 26;
    }
    if (/[0-9]/.test(password)) {
      charsetSize += 10;
    }
    if (/[^a-zA-Z0-9]/.test(password)) {
      charsetSize += 32;
    }

    const entropy = Math.log2(Math.pow(charsetSize, password.length));

    // Estimate crack time (assuming 1 billion guesses per second)
    const guessesPerSecond = 1000000000;
    const totalGuesses = Math.pow(charsetSize, password.length) / 2; // Average case
    const secondsToCrack = totalGuesses / guessesPerSecond;

    let crackTime = '';
    if (secondsToCrack < 60) {
      crackTime = '1分未満';
    } else if (secondsToCrack < 3600) {
      crackTime = `${Math.ceil(secondsToCrack / 60)}分`;
    } else if (secondsToCrack < 86400) {
      crackTime = `${Math.ceil(secondsToCrack / 3600)}時間`;
    } else if (secondsToCrack < 31536000) {
      crackTime = `${Math.ceil(secondsToCrack / 86400)}日`;
    } else if (secondsToCrack < 31536000000) {
      crackTime = `${Math.ceil(secondsToCrack / 31536000)}年`;
    } else {
      crackTime = '1000年以上';
    }

    if (entropy < 30) {
      return { score: 1, label: '弱い', color: 'bg-red-500', entropy, crackTime };
    } else if (entropy < 50) {
      return { score: 2, label: '普通', color: 'bg-yellow-500', entropy, crackTime };
    } else if (entropy < 70) {
      return { score: 3, label: '強い', color: 'bg-blue-500', entropy, crackTime };
    } else {
      return { score: 4, label: '非常に強い', color: 'bg-green-500', entropy, crackTime };
    }
  };

  const generatePassphrase = (): string => {
    const words = [];
    for (let i = 0; i < options.passphraseWords; i++) {
      const randomIndex = getSecureRandom(commonWords.length);
      words.push(commonWords[randomIndex]);
    }
    return words.join(options.passphraseSeparator);
  };

  const generateSinglePassword = (): string => {
    if (options.generatePassphrase) {
      return generatePassphrase();
    }

    let charset = '';
    const similarChars = '0O1lI';

    if (options.includeUppercase) {
      charset += options.excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (options.includeLowercase) {
      charset += options.excludeSimilar
        ? 'abcdefghijkmnopqrstuvwxyz'
        : 'abcdefghijklmnopqrstuvwxyz';
    }
    if (options.includeNumbers) {
      charset += options.excludeSimilar ? '23456789' : '0123456789';
    }
    if (options.includeSymbols) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    if (charset === '') {
      throw new Error('少なくとも1つの文字種を選択してください');
    }

    const requiredChars: string[] = [];

    // Ensure at least one character from each selected type
    if (options.includeUppercase) {
      const upperChars = options.excludeSimilar
        ? 'ABCDEFGHJKMNPQRSTUVWXYZ'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      requiredChars.push(upperChars[getSecureRandom(upperChars.length)]);
    }
    if (options.includeLowercase) {
      const lowerChars = options.excludeSimilar
        ? 'abcdefghijkmnopqrstuvwxyz'
        : 'abcdefghijklmnopqrstuvwxyz';
      requiredChars.push(lowerChars[getSecureRandom(lowerChars.length)]);
    }
    if (options.includeNumbers) {
      const numberChars = options.excludeSimilar ? '23456789' : '0123456789';
      requiredChars.push(numberChars[getSecureRandom(numberChars.length)]);
    }
    if (options.includeSymbols) {
      const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      requiredChars.push(symbolChars[getSecureRandom(symbolChars.length)]);
    }

    // Fill the rest with random characters
    for (let i = requiredChars.length; i < options.length; i++) {
      requiredChars.push(charset[getSecureRandom(charset.length)]);
    }

    // Shuffle the array
    for (let i = requiredChars.length - 1; i > 0; i--) {
      const j = getSecureRandom(i + 1);
      [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]];
    }

    return requiredChars.join('');
  };

  const generatePasswords = () => {
    try {
      const passwords: string[] = [];
      for (let i = 0; i < options.count; i++) {
        passwords.push(generateSinglePassword());
      }
      setGeneratedPasswords(passwords);
      setError('');
      setCopySuccess({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'パスワード生成中にエラーが発生しました');
      setGeneratedPasswords([]);
    }
  };

  const copyToClipboard = async (password: string, index: number) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(password);
        setCopySuccess((prev) => ({ ...prev, [index]: true }));
        setTimeout(() => {
          setCopySuccess((prev) => ({ ...prev, [index]: false }));
        }, 2000);
      }
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-gray-800">パスワード生成</h2>
      <p className="mb-6 text-gray-600">セキュアで記憶しやすいパスワードを生成するツールです</p>

      {/* Generation Type */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-medium text-gray-800">生成タイプ</h3>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={!options.generatePassphrase}
              onChange={() => setOptions((prev) => ({ ...prev, generatePassphrase: false }))}
              className="mr-2"
            />
            <span>ランダムパスワード</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={options.generatePassphrase}
              onChange={() => setOptions((prev) => ({ ...prev, generatePassphrase: true }))}
              className="mr-2"
            />
            <span>パスフレーズ（覚えやすい）</span>
          </label>
        </div>
      </div>

      {!options.generatePassphrase ? (
        <>
          {/* Password Length */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              パスワード長: {options.length}文字
            </label>
            <input
              type="range"
              min="4"
              max="128"
              value={options.length}
              onChange={(e) => setOptions((prev) => ({ ...prev, length: Number(e.target.value) }))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          {/* Character Types */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-700">使用する文字種</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.includeUppercase}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, includeUppercase: e.target.checked }))
                  }
                  className="mr-2"
                />
                <span>大文字 (A-Z)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, includeLowercase: e.target.checked }))
                  }
                  className="mr-2"
                />
                <span>小文字 (a-z)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, includeNumbers: e.target.checked }))
                  }
                  className="mr-2"
                />
                <span>数字 (0-9)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.includeSymbols}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, includeSymbols: e.target.checked }))
                  }
                  className="mr-2"
                />
                <span>記号 (!@#$...)</span>
              </label>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, excludeSimilar: e.target.checked }))
                }
                className="mr-2"
              />
              <span>類似文字を除外 (0, O, 1, l, I)</span>
            </label>
          </div>
        </>
      ) : (
        <>
          {/* Passphrase Options */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              単語数: {options.passphraseWords}語
            </label>
            <input
              type="range"
              min="3"
              max="8"
              value={options.passphraseWords}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, passphraseWords: Number(e.target.value) }))
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>3</span>
              <span>8</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">区切り文字</label>
            <select
              value={options.passphraseSeparator}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, passphraseSeparator: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="-">ハイフン (-)</option>
              <option value="_">アンダースコア (_)</option>
              <option value=".">ドット (.)</option>
              <option value=" ">スペース ( )</option>
              <option value="">なし</option>
            </select>
          </div>
        </>
      )}

      {/* Number of passwords */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          生成数: {options.count}個
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={options.count}
          onChange={(e) => setOptions((prev) => ({ ...prev, count: Number(e.target.value) }))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mb-6">
        <button
          onClick={generatePasswords}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          パスワード生成
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
          <strong>エラー:</strong> {error}
        </div>
      )}

      {/* Generated Passwords */}
      {generatedPasswords.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">生成されたパスワード</h3>
          {generatedPasswords.map((password, index) => {
            const strength = calculatePasswordStrength(password);
            return (
              <div key={index} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">パスワード {index + 1}</span>
                  <button
                    onClick={() => copyToClipboard(password, index)}
                    className={`rounded px-3 py-1 text-sm ${
                      copySuccess[index]
                        ? 'border border-green-300 bg-green-100 text-green-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {copySuccess[index] ? 'コピー完了!' : 'コピー'}
                  </button>
                </div>

                <div className="mb-3 rounded bg-gray-50 p-3 font-mono text-sm break-all">
                  {password}
                </div>

                {/* Password Strength */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">強度:</span>
                    <span className={`rounded px-2 py-1 text-xs text-white ${strength.color}`}>
                      {strength.label}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    ></div>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <div>エントロピー: {strength.entropy.toFixed(1)} bits</div>
                    <div>推定解読時間: {strength.crackTime}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
