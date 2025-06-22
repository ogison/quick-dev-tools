export function encodeBase64(input: string): string {
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch {
    throw new Error('Base64エンコードに失敗しました');
  }
}

export function decodeBase64(input: string): string {
  try {
    return decodeURIComponent(escape(atob(input)));
  } catch {
    throw new Error('Base64デコードに失敗しました。入力が正しいBase64形式か確認してください');
  }
}

export function isValidBase64(input: string): boolean {
  try {
    return btoa(atob(input)) === input;
  } catch {
    return false;
  }
}
