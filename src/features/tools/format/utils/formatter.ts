export type FormatType = 'auto' | 'json' | 'yaml' | 'xml' | 'sql' | 'css' | 'html' | 'basic';

interface FormatOptions {
  indentSize?: number;
  useTab?: boolean;
}

export function detectFormatType(input: string): FormatType | null {
  const trimmed = input.trim();

  // JSON detection
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not valid JSON, continue checking
    }
  }

  // XML/HTML detection
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    if (
      trimmed.toLowerCase().includes('<!doctype html') ||
      trimmed.toLowerCase().includes('<html')
    ) {
      return 'html';
    }
    return 'xml';
  }

  // YAML detection
  if (trimmed.includes(':') && !trimmed.includes('{') && !trimmed.includes('<')) {
    const lines = trimmed.split('\n');
    const yamlPattern = /^[a-zA-Z0-9_-]+:\s*.+$/;
    if (lines.some((line) => yamlPattern.test(line.trim()))) {
      return 'yaml';
    }
  }

  // SQL detection
  const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'];
  const upperInput = trimmed.toUpperCase();
  if (sqlKeywords.some((keyword) => upperInput.includes(keyword))) {
    return 'sql';
  }

  // CSS detection
  if (
    trimmed.includes('{') &&
    trimmed.includes('}') &&
    trimmed.includes(':') &&
    trimmed.includes(';')
  ) {
    return 'css';
  }

  return null;
}

export function formatCode(input: string, type: FormatType, options: FormatOptions = {}): string {
  const { indentSize = 2, useTab = false } = options;
  const indent = useTab ? '\t' : ' '.repeat(indentSize);

  switch (type) {
    case 'json':
      return formatJSON(input, indent);
    case 'yaml':
      return formatYAML(input, indent);
    case 'xml':
      return formatXML(input, indent);
    case 'sql':
      return formatSQL(input);
    case 'css':
      return formatCSS(input, indent);
    case 'html':
      return formatHTML(input, indent);
    case 'basic':
      return formatBasic(input, indent);
    default:
      throw new Error(`Unsupported format type: ${type}`);
  }
}

function formatJSON(input: string, indent: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    throw new Error('無効なJSON形式です: ' + (error as Error).message);
  }
}

function formatYAML(input: string, indent: string): string {
  // Simple YAML formatter
  const lines = input.split('\n');
  const formatted: string[] = [];
  let currentIndentLevel = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    // Decrease indent for closing brackets/arrays
    if (trimmed === ']' || trimmed === '}') {
      currentIndentLevel = Math.max(0, currentIndentLevel - 1);
    }

    // Add proper indentation
    const indentedLine = indent.repeat(currentIndentLevel) + trimmed;
    formatted.push(indentedLine);

    // Increase indent for nested structures
    if (trimmed.endsWith(':') && !trimmed.includes(': ')) {
      currentIndentLevel++;
    } else if (trimmed === '-' || trimmed.startsWith('- ')) {
      // List items maintain current level
    }
  }

  return formatted.join('\n');
}

function formatXML(input: string, indent: string): string {
  let formatted = '';
  let level = 0;

  // Simple XML formatter
  const xml = input.replace(/>\s*</g, '><').trim();
  const parts = xml.split(/(<[^>]+>)/);

  for (const part of parts) {
    if (!part) {
      continue;
    }

    if (part.startsWith('</')) {
      // 閉じタグ
      level--;
      formatted += indent.repeat(Math.max(0, level)) + part + '\n';
    } else if (part.startsWith('<') && !part.startsWith('<?')) {
      // 開きタグまたは宣言
      formatted += indent.repeat(level) + part;
      if (part.endsWith('/>')) {
        // 自己終了タグの場合は改行を追加
        formatted += '\n';
      } else if (!part.includes('</')) {
        // 通常の開きタグの場合
        level++;
        formatted += '\n';
      }
    } else if (part.trim()) {
      // テキストコンテンツ
      // テキストの前後の改行を調整
      const trimmed = part.trim();
      if (trimmed) {
        // 最後の文字が改行でない場合、現在のインデントレベルでテキストを配置
        if (formatted.endsWith('\n')) {
          formatted += indent.repeat(level) + trimmed + '\n';
        } else {
          // インライン要素の場合
          formatted += trimmed;
        }
      }
    }
  }

  return formatted.trim();
}

function formatSQL(input: string): string {
  // Simple SQL formatter
  const keywords = [
    'SELECT',
    'FROM',
    'WHERE',
    'JOIN',
    'LEFT JOIN',
    'RIGHT JOIN',
    'INNER JOIN',
    'ON',
    'GROUP BY',
    'ORDER BY',
    'HAVING',
    'LIMIT',
    'OFFSET',
    'INSERT INTO',
    'VALUES',
    'UPDATE',
    'SET',
    'DELETE FROM',
    'CREATE TABLE',
    'ALTER TABLE',
    'DROP TABLE',
    'CREATE INDEX',
  ];

  let formatted = input;

  // Add newlines before keywords
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\s+(${keyword})\\s+`, 'gi');
    formatted = formatted.replace(regex, '\n$1 ');
  });

  // Clean up multiple spaces and trim
  formatted = formatted.replace(/\s+/g, ' ').trim();

  // Uppercase keywords
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, keyword);
  });

  return formatted;
}

function formatCSS(input: string, indent: string): string {
  // Simple CSS formatter
  let formatted = input
    .replace(/\s*{\s*/g, ' {\n')
    .replace(/;\s*/g, ';\n')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/:\s*/g, ': ')
    .trim();

  // Add indentation
  const lines = formatted.split('\n');
  let level = 0;
  formatted = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    if (trimmed.includes('}')) {
      level = Math.max(0, level - 1);
    }

    formatted += indent.repeat(level) + trimmed + '\n';

    if (trimmed.includes('{')) {
      level++;
    }
  }

  return formatted.trim();
}

function formatHTML(input: string, indent: string): string {
  // Use XML formatter for HTML
  return formatXML(input, indent);
}

function formatBasic(input: string, indent: string): string {
  const lines = input.split('\n');
  const formatted: string[] = [];
  let indentLevel = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      formatted.push('');
      continue;
    }

    // Decrease indent for closing brackets
    if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add proper indentation
    const indentedLine = indent.repeat(indentLevel) + trimmed;
    formatted.push(indentedLine);

    // Increase indent for opening brackets
    if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
      indentLevel++;
    }
  }

  return formatted.join('\n');
}
