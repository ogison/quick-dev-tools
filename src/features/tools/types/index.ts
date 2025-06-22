export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
}

export interface ColorPalette {
  colors: string[];
  name?: string;
}

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface RegexTestResult {
  matches: RegExpMatchArray | null;
  isValid: boolean;
  error?: string;
}

export interface TimestampFormat {
  unix: number;
  iso: string;
  local: string;
}