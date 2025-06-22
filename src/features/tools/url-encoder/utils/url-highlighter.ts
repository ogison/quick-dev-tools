export interface UrlToken {
  type: 'protocol' | 'hostname' | 'port' | 'pathname' | 'search' | 'hash' | 'encoded' | 'text';
  value: string;
  start: number;
  end: number;
}

export function tokenizeUrl(url: string): UrlToken[] {
  const tokens: UrlToken[] = [];

  try {
    const urlObj = new URL(url);
    let currentIndex = 0;

    // プロトコル
    if (urlObj.protocol) {
      const protocolEnd = url.indexOf('://') + 3;
      tokens.push({
        type: 'protocol',
        value: url.slice(0, protocolEnd),
        start: 0,
        end: protocolEnd,
      });
      currentIndex = protocolEnd;
    }

    // ホスト名
    if (urlObj.hostname) {
      const hostStart = currentIndex;
      const hostEnd = hostStart + urlObj.hostname.length;
      tokens.push({
        type: 'hostname',
        value: urlObj.hostname,
        start: hostStart,
        end: hostEnd,
      });
      currentIndex = hostEnd;
    }

    // ポート
    if (urlObj.port) {
      const portStart = currentIndex;
      const portEnd = portStart + urlObj.port.length + 1; // +1 for ':'
      tokens.push({
        type: 'port',
        value: ':' + urlObj.port,
        start: portStart,
        end: portEnd,
      });
      currentIndex = portEnd;
    }

    // パス
    if (urlObj.pathname && urlObj.pathname !== '/') {
      const pathStart = url.indexOf(urlObj.pathname, currentIndex);
      const pathEnd = pathStart + urlObj.pathname.length;
      tokens.push({
        type: 'pathname',
        value: urlObj.pathname,
        start: pathStart,
        end: pathEnd,
      });
      currentIndex = pathEnd;
    }

    // クエリパラメータ
    if (urlObj.search) {
      const searchStart = url.indexOf(urlObj.search, currentIndex);
      const searchEnd = searchStart + urlObj.search.length;
      tokens.push({
        type: 'search',
        value: urlObj.search,
        start: searchStart,
        end: searchEnd,
      });
      currentIndex = searchEnd;
    }

    // ハッシュ
    if (urlObj.hash) {
      const hashStart = url.indexOf(urlObj.hash, currentIndex);
      const hashEnd = hashStart + urlObj.hash.length;
      tokens.push({
        type: 'hash',
        value: urlObj.hash,
        start: hashStart,
        end: hashEnd,
      });
    }
  } catch {
    // URL解析に失敗した場合は、エンコードされた文字列として処理
    return tokenizeEncodedString(url);
  }

  return tokens;
}

export function tokenizeEncodedString(text: string): UrlToken[] {
  const tokens: UrlToken[] = [];
  const regex = /%[0-9A-Fa-f]{2}/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    // エンコードされていない部分
    if (start > lastIndex) {
      tokens.push({
        type: 'text',
        value: text.slice(lastIndex, start),
        start: lastIndex,
        end: start,
      });
    }

    // エンコードされた部分
    tokens.push({
      type: 'encoded',
      value: match[0],
      start,
      end,
    });

    lastIndex = end;
  }

  // 残りの部分
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

export function highlightUrl(url: string): string {
  const tokens = tokenizeUrl(url);
  let highlighted = '';
  let lastIndex = 0;

  for (const token of tokens) {
    // トークン間のテキストを追加
    if (token.start > lastIndex) {
      highlighted += escapeHtml(url.slice(lastIndex, token.start));
    }

    // ハイライトされたトークンを追加
    const className = getTokenClassName(token.type);
    highlighted += `<span class="${className}">${escapeHtml(token.value)}</span>`;

    lastIndex = token.end;
  }

  // 残りのテキストを追加
  if (lastIndex < url.length) {
    highlighted += escapeHtml(url.slice(lastIndex));
  }

  return highlighted;
}

export function highlightEncodedString(text: string): string {
  const tokens = tokenizeEncodedString(text);
  let highlighted = '';

  for (const token of tokens) {
    const className = getTokenClassName(token.type);
    highlighted += `<span class="${className}">${escapeHtml(token.value)}</span>`;
  }

  return highlighted;
}

function getTokenClassName(type: UrlToken['type']): string {
  switch (type) {
    case 'protocol':
      return 'url-protocol';
    case 'hostname':
      return 'url-hostname';
    case 'port':
      return 'url-port';
    case 'pathname':
      return 'url-pathname';
    case 'search':
      return 'url-search';
    case 'hash':
      return 'url-hash';
    case 'encoded':
      return 'url-encoded';
    case 'text':
      return 'url-text';
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
