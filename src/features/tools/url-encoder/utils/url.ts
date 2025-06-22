export function encodeURL(input: string): string {
  try {
    return encodeURIComponent(input);
  } catch {
    throw new Error('URLエンコードに失敗しました');
  }
}

export function decodeURL(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    throw new Error('URLデコードに失敗しました');
  }
}

export function parseURL(url: string): {
  protocol?: string;
  host?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  params?: Record<string, string>;
} | null {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return {
      protocol: urlObj.protocol,
      host: urlObj.host,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      params
    };
  } catch {
    return null;
  }
}