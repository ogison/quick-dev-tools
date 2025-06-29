export type EncodingMethod = 'encodeURI' | 'encodeURIComponent';

export function urlEncode(input: string, method: EncodingMethod = 'encodeURIComponent'): string {
  if (!input) {
    return '';
  }

  try {
    if (method === 'encodeURI') {
      return encodeURI(input);
    } else {
      return encodeURIComponent(input);
    }
  } catch (error) {
    throw new Error(`Failed to encode URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function urlDecode(input: string): string {
  if (!input) {
    return '';
  }

  try {
    // Try decodeURIComponent first (more common)
    return decodeURIComponent(input);
  } catch {
    try {
      // Fall back to decodeURI
      return decodeURI(input);
    } catch {
      throw new Error('Invalid encoded URL: Unable to decode the input');
    }
  }
}

export function isValidEncodedURL(input: string): boolean {
  try {
    urlDecode(input);
    return true;
  } catch {
    return false;
  }
}

export function getEncodingDifference(original: string, encoded: string): Array<{char: string, encoded: string}> {
  const differences: Array<{char: string, encoded: string}> = [];
  let i = 0;
  let j = 0;

  while (i < original.length && j < encoded.length) {
    if (original[i] === encoded[j]) {
      i++;
      j++;
    } else if (encoded[j] === '%' && j + 2 < encoded.length) {
      const encodedChar = encoded.substring(j, j + 3);
      differences.push({
        char: original[i],
        encoded: encodedChar
      });
      i++;
      j += 3;
    } else {
      i++;
      j++;
    }
  }

  return differences;
}