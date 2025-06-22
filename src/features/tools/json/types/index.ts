export type IndentType = 'spaces2' | 'spaces4' | 'tab';

export interface JsonFormatterOptions {
  indentType: IndentType;
  indentSize: number;
}

export interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

export interface JsonFormatterState {
  input: string;
  output: string;
  error: string;
  options: JsonFormatterOptions;
}

export type JsonOperation = 'format' | 'minify' | 'toJs' | 'escape' | 'unescape';