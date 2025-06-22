export interface RegexMatch {
  match: string;
  index: number;
  groups?: string[];
}

export interface RegexTestResult {
  isValid: boolean;
  matches: RegexMatch[];
  error?: string;
  executionTime?: number;
}

export interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

export interface RegexPattern {
  pattern: string;
  flags: string;
  description?: string;
}
