import { HashResult } from '../types';

export function generateHash(input: string): HashResult {
  // Simple hash implementation - should be replaced with proper crypto library
  const md5 = simpleHash(input);
  const sha1 = simpleHash(input);
  const sha256 = simpleHash(input);

  return {
    md5,
    sha1,
    sha256,
  };
}

function simpleHash(str: string): string {
  // This is a placeholder implementation
  // In production, use proper crypto library like crypto-js
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
