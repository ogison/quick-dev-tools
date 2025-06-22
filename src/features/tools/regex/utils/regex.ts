import { RegexTestResult, RegexMatch } from '../types';

export function testRegex(pattern: string, testString: string, flags?: string): RegexTestResult {
  try {
    const regex = new RegExp(pattern, flags);
    const matchResult = testString.match(regex);
    
    const matches: RegexMatch[] = [];
    if (matchResult) {
      matchResult.forEach((match, index) => {
        matches.push({
          match,
          index: testString.indexOf(match),
          groups: matchResult.slice(1)
        });
      });
    }
    
    return {
      matches,
      isValid: true
    };
  } catch (error) {
    return {
      matches: [],
      isValid: false,
      error: error instanceof Error ? error.message : '正規表現が無効です'
    };
  }
}

export function getCommonRegexPatterns(): Array<{ name: string; pattern: string; description: string }> {
  return [
    {
      name: 'メールアドレス',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      description: 'メールアドレスの形式をチェック'
    },
    {
      name: 'URL',
      pattern: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
      description: 'HTTPまたはHTTPS URLの形式をチェック'
    },
    {
      name: '日本の電話番号',
      pattern: '^0\\d{1,4}-\\d{1,4}-\\d{4}$',
      description: '日本の電話番号形式（ハイフン区切り）'
    },
    {
      name: '郵便番号',
      pattern: '^\\d{3}-\\d{4}$',
      description: '日本の郵便番号形式'
    },
    {
      name: 'IPv4アドレス',
      pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
      description: 'IPv4アドレスの形式をチェック'
    }
  ];
}