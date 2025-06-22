// Base64 utility functions for advanced features

export type Base64Encoding = 'standard' | 'url-safe';
export type CharacterEncoding = 'utf-8' | 'shift-jis' | 'euc-jp' | 'iso-2022-jp';

/**
 * Convert standard Base64 to URL-safe Base64
 */
export function toUrlSafeBase64(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Convert URL-safe Base64 to standard Base64
 */
export function fromUrlSafeBase64(urlSafeBase64: string): string {
  let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }

  return base64;
}

/**
 * Add MIME line breaks every 76 characters
 */
export function addMimeLineBreaks(base64: string): string {
  return base64.replace(/(.{76})/g, '$1\r\n');
}

/**
 * Remove MIME line breaks
 */
export function removeMimeLineBreaks(base64: string): string {
  return base64.replace(/\r?\n/g, '');
}

/**
 * Generate data URI from file content and MIME type
 */
export function generateDataUri(base64Content: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64Content}`;
}

/**
 * Parse data URI to extract MIME type and Base64 content
 */
export function parseDataUri(dataUri: string): { mimeType: string; base64Content: string } | null {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    base64Content: match[2],
  };
}

/**
 * Encode text using specified character encoding (modern approach)
 */
export function encodeTextToBytes(text: string, encoding: CharacterEncoding): Uint8Array {
  switch (encoding) {
    case 'utf-8':
      return new TextEncoder().encode(text);
    case 'shift-jis':
    case 'euc-jp':
    case 'iso-2022-jp':
      // For simplicity, fall back to UTF-8 for now
      // In a real implementation, you would use a library like iconv-lite
      console.warn(`Character encoding ${encoding} not fully supported, using UTF-8`);
      return new TextEncoder().encode(text);
    default:
      return new TextEncoder().encode(text);
  }
}

/**
 * Decode bytes to text using specified character encoding
 */
export function decodeBytesToText(bytes: Uint8Array, encoding: CharacterEncoding): string {
  switch (encoding) {
    case 'utf-8':
      return new TextDecoder('utf-8').decode(bytes);
    case 'shift-jis':
    case 'euc-jp':
    case 'iso-2022-jp':
      // For simplicity, fall back to UTF-8 for now
      console.warn(`Character encoding ${encoding} not fully supported, using UTF-8`);
      return new TextDecoder('utf-8').decode(bytes);
    default:
      return new TextDecoder('utf-8').decode(bytes);
  }
}

/**
 * Enhanced Base64 encoding with options
 */
export function encodeBase64(
  input: string | Uint8Array,
  options: {
    encoding?: Base64Encoding;
    mimeLineBreaks?: boolean;
    characterEncoding?: CharacterEncoding;
  } = {}
): string {
  const { encoding = 'standard', mimeLineBreaks = false, characterEncoding = 'utf-8' } = options;

  let bytes: Uint8Array;
  if (typeof input === 'string') {
    bytes = encodeTextToBytes(input, characterEncoding);
  } else {
    bytes = input;
  }

  // Convert to base64
  const binaryString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  let base64 = btoa(binaryString);

  // Apply URL-safe encoding if requested
  if (encoding === 'url-safe') {
    base64 = toUrlSafeBase64(base64);
  }

  // Add MIME line breaks if requested
  if (mimeLineBreaks) {
    base64 = addMimeLineBreaks(base64);
  }

  return base64;
}

/**
 * Enhanced Base64 decoding with options
 */
export function decodeBase64(
  base64: string,
  options: {
    encoding?: Base64Encoding;
    characterEncoding?: CharacterEncoding;
    outputType?: 'text' | 'bytes';
  } = {}
): string | Uint8Array {
  const { encoding = 'standard', characterEncoding = 'utf-8', outputType = 'text' } = options;

  let processedBase64 = base64;

  // Remove MIME line breaks
  processedBase64 = removeMimeLineBreaks(processedBase64);

  // Convert from URL-safe if needed
  if (encoding === 'url-safe') {
    processedBase64 = fromUrlSafeBase64(processedBase64);
  }

  // Decode from base64
  const binaryString = atob(processedBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  if (outputType === 'bytes') {
    return bytes;
  }

  return decodeBytesToText(bytes, characterEncoding);
}

/**
 * Get MIME type from file extension
 */
export function getMimeTypeFromExtension(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();

  const mimeTypes: Record<string, string> = {
    // Images
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',

    // Text
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    xml: 'text/xml',

    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',

    // Default
    default: 'application/octet-stream',
  };

  return mimeTypes[ext || ''] || mimeTypes.default;
}

/**
 * Download data as file
 */
export function downloadAsFile(
  data: string | Uint8Array,
  filename: string,
  mimeType?: string
): void {
  let blob: Blob;

  if (typeof data === 'string') {
    blob = new Blob([data], { type: mimeType || 'text/plain' });
  } else {
    blob = new Blob([data], { type: mimeType || 'application/octet-stream' });
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
