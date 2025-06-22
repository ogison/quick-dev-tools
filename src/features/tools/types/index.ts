// Base types for tool definitions
export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Tool {
  id: string;
  name: string;
  number: string;
  description: string;
  icon: string;
  category: string;
  badge: string;
  href: string;
}

// Common UI types
export interface CopyButtonState {
  [key: string]: boolean;
}

// Hash Generator types
export interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

export type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512';

// Color Palette types
export interface ColorPalette {
  colors: string[];
  name?: string;
}

// Password Generator types
export interface PasswordOptions {
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

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  entropy: number;
  crackTime: string;
}

// Regex Tester types
export interface RegexTestResult {
  matches: RegExpMatchArray | null;
  isValid: boolean;
  error?: string;
}

export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

// Timestamp Converter types
export interface TimestampFormat {
  unix: number;
  iso: string;
  local: string;
}

export interface ConversionResult {
  unix: number;
  milliseconds: number;
  iso: string;
  local: string;
  utc: string;
  jst: string;
  formatted: {
    yyyy_mm_dd: string;
    dd_mm_yyyy: string;
    mm_dd_yyyy: string;
    japanese: string;
  };
}

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

// QR Generator types
export interface QrGeneratorOptions {
  text: string;
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
}

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

// Base64 Encoder types
export interface Base64Result {
  encoded: string;
  decoded: string;
  isValid: boolean;
  error?: string;
}

// URL Encoder types
export interface UrlResult {
  encoded: string;
  decoded: string;
  isValid: boolean;
  error?: string;
}