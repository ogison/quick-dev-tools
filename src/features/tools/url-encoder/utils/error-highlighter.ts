export interface ErrorToken {
  type: 'error' | 'warning' | 'text';
  value: string;
  start: number;
  end: number;
  message?: string;
}

export interface ValidationError {
  type: 'invalid_encoding' | 'malformed_url' | 'incomplete_encoding';
  message: string;
  position: number;
  length: number;
}

export function validateEncodedString(text: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const incompletePattern = /%[0-9A-Fa-f]?$/g;
  const invalidPattern = /%[^0-9A-Fa-f]/g;

  // 不完全なエンコーディングをチェック
  let match;
  while ((match = incompletePattern.exec(text)) !== null) {
    if (match[0].length < 3) {
      errors.push({
        type: 'incomplete_encoding',
        message: '不完全なパーセントエンコーディングです',
        position: match.index,
        length: match[0].length,
      });
    }
  }

  // 無効なエンコーディングをチェック
  incompletePattern.lastIndex = 0;
  while ((match = invalidPattern.exec(text)) !== null) {
    errors.push({
      type: 'invalid_encoding',
      message: '無効なパーセントエンコーディングです',
      position: match.index,
      length: match[0].length,
    });
  }

  // 孤立した%記号をチェック
  const percentPattern = /%(?![0-9A-Fa-f]{2})/g;
  while ((match = percentPattern.exec(text)) !== null) {
    errors.push({
      type: 'invalid_encoding',
      message: '不正な%記号です',
      position: match.index,
      length: 1,
    });
  }

  return errors;
}

export function validateUrl(url: string): ValidationError[] {
  const errors: ValidationError[] = [];

  try {
    new URL(url);
  } catch {
    // 基本的なURL形式チェック
    if (!url.includes('://')) {
      errors.push({
        type: 'malformed_url',
        message: 'プロトコルが指定されていません',
        position: 0,
        length: url.length,
      });
    } else {
      const protocolEnd = url.indexOf('://');
      const protocol = url.slice(0, protocolEnd);

      if (!/^[a-zA-Z][a-zA-Z0-9+.-]*$/.test(protocol)) {
        errors.push({
          type: 'malformed_url',
          message: '無効なプロトコルです',
          position: 0,
          length: protocolEnd,
        });
      }

      const hostStart = protocolEnd + 3;
      const pathStart = url.indexOf('/', hostStart);
      const queryStart = url.indexOf('?', hostStart);
      const hashStart = url.indexOf('#', hostStart);

      const hostEnd = Math.min(
        ...[pathStart, queryStart, hashStart, url.length].filter((i) => i >= 0)
      );

      const host = url.slice(hostStart, hostEnd);
      if (!host) {
        errors.push({
          type: 'malformed_url',
          message: 'ホスト名が指定されていません',
          position: hostStart,
          length: 0,
        });
      }
    }
  }

  return errors;
}

export function tokenizeWithErrors(text: string, mode: 'encode' | 'decode'): ErrorToken[] {
  const tokens: ErrorToken[] = [];
  const errors = mode === 'encode' ? validateUrl(text) : validateEncodedString(text);

  if (errors.length === 0) {
    // エラーがない場合は通常のテキストとして扱う
    tokens.push({
      type: 'text',
      value: text,
      start: 0,
      end: text.length,
    });
    return tokens;
  }

  // エラーでテキストを分割
  const sortedErrors = errors.sort((a, b) => a.position - b.position);
  let lastIndex = 0;

  for (const error of sortedErrors) {
    // エラー前のテキスト
    if (error.position > lastIndex) {
      tokens.push({
        type: 'text',
        value: text.slice(lastIndex, error.position),
        start: lastIndex,
        end: error.position,
      });
    }

    // エラー部分
    tokens.push({
      type: 'error',
      value: text.slice(error.position, error.position + error.length),
      start: error.position,
      end: error.position + error.length,
      message: error.message,
    });

    lastIndex = error.position + error.length;
  }

  // 残りのテキスト
  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      value: text.slice(lastIndex),
      start: lastIndex,
      end: text.length,
    });
  }

  return tokens;
}

export function highlightErrors(text: string, mode: 'encode' | 'decode'): string {
  const tokens = tokenizeWithErrors(text, mode);
  let highlighted = '';

  for (const token of tokens) {
    const className = getErrorTokenClassName(token.type);
    const title = token.message ? ` title="${escapeHtml(token.message)}"` : '';
    highlighted += `<span class="${className}"${title}>${escapeHtml(token.value)}</span>`;
  }

  return highlighted;
}

function getErrorTokenClassName(type: ErrorToken['type']): string {
  switch (type) {
    case 'error':
      return 'error-highlight';
    case 'warning':
      return 'warning-highlight';
    case 'text':
      return 'normal-text';
    default:
      return '';
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
