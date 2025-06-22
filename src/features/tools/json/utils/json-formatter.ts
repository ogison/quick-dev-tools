import { IndentType, JsonValidationResult, JsonFormatterOptions } from '../types';

export const validateJson = (jsonString: string): JsonValidationResult => {
  if (!jsonString.trim()) {
    return { isValid: true };
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
    
    // Parse error position from error message
    const match = errorMessage.match(/at position (\d+)/);
    if (match) {
      const position = parseInt(match[1], 10);
      const lines = jsonString.substring(0, position).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      return {
        isValid: false,
        error: errorMessage,
        line,
        column
      };
    }
    
    return {
      isValid: false,
      error: errorMessage
    };
  }
};

export const formatJson = (jsonString: string, options: JsonFormatterOptions): string => {
  if (!jsonString.trim()) return '';
  
  const parsed = JSON.parse(jsonString);
  const indentChar = options.indentType === 'tab' ? '\t' : ' ';
  const indentSize = options.indentType === 'tab' ? 1 : options.indentSize;
  
  return JSON.stringify(parsed, null, indentChar.repeat(indentSize));
};

export const minifyJson = (jsonString: string): string => {
  if (!jsonString.trim()) return '';
  
  const parsed = JSON.parse(jsonString);
  return JSON.stringify(parsed);
};

export const jsonToJavaScript = (jsonString: string): string => {
  if (!jsonString.trim()) return '';
  
  const parsed = JSON.parse(jsonString);
  return `const obj = ${JSON.stringify(parsed, null, 2)};`;
};

export const escapeJson = (jsonString: string): string => {
  return JSON.stringify(jsonString);
};

export const unescapeJson = (escapedString: string): string => {
  try {
    return JSON.parse(escapedString);
  } catch {
    return escapedString;
  }
};

export const getSampleJson = (): string => {
  return JSON.stringify({
    "name": "JSON Formatter",
    "version": "1.0.0",
    "description": "A tool for formatting and validating JSON",
    "features": [
      "Format JSON with custom indentation",
      "Minify JSON",
      "Validate JSON syntax",
      "Convert to JavaScript object",
      "Escape and unescape strings"
    ],
    "config": {
      "indentSize": 2,
      "theme": "light",
      "autoFormat": true
    },
    "numbers": [1, 2, 3, 4, 5],
    "boolean": true,
    "nullValue": null
  }, null, 2);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};