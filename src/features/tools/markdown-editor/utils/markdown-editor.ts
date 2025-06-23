// Re-export from the existing markdown utils
export {
  parseMarkdown,
  generateMarkdownToc,
  countMarkdownStats,
  exportMarkdownAs,
  MarkdownPreviewOptions,
  DEFAULT_MARKDOWN_OPTIONS
} from '../../markdown/utils/markdown';

// Additional editor-specific utilities
export interface EditorState {
  content: string;
  cursorPosition: number;
  selection: { start: number; end: number } | null;
  undoStack: string[];
  redoStack: string[];
}

export const createInitialEditorState = (): EditorState => ({
  content: '',
  cursorPosition: 0,
  selection: null,
  undoStack: [],
  redoStack: [],
});

export const insertTextAtCursor = (content: string, insertion: string, position: number): { newContent: string; newPosition: number } => {
  const before = content.slice(0, position);
  const after = content.slice(position);
  
  return {
    newContent: before + insertion + after,
    newPosition: position + insertion.length,
  };
};

export const wrapSelection = (content: string, start: number, end: number, prefix: string, suffix: string = prefix): { newContent: string; newStart: number; newEnd: number } => {
  const before = content.slice(0, start);
  const selected = content.slice(start, end);
  const after = content.slice(end);
  
  const newContent = before + prefix + selected + suffix + after;
  
  return {
    newContent,
    newStart: start + prefix.length,
    newEnd: start + prefix.length + selected.length,
  };
};

export const insertMarkdownSyntax = {
  bold: (content: string, start: number, end: number) => 
    wrapSelection(content, start, end, '**'),
  
  italic: (content: string, start: number, end: number) => 
    wrapSelection(content, start, end, '*'),
  
  code: (content: string, start: number, end: number) => 
    wrapSelection(content, start, end, '`'),
  
  strikethrough: (content: string, start: number, end: number) => 
    wrapSelection(content, start, end, '~~'),
  
  link: (content: string, start: number, end: number, url = '') => {
    const selected = content.slice(start, end);
    const linkText = selected || 'リンクテキスト';
    const linkUrl = url || 'https://example.com';
    return wrapSelection(content, start, end, `[${linkText}](`, `${linkUrl})`);
  },
  
  image: (content: string, start: number, end: number, url = '') => {
    const selected = content.slice(start, end);
    const altText = selected || '画像の説明';
    const imageUrl = url || 'https://via.placeholder.com/300x200';
    return wrapSelection(content, start, end, `![${altText}](`, `${imageUrl})`);
  },
  
  header: (content: string, start: number, end: number, level = 1) => {
    const hashes = '#'.repeat(level);
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = content.indexOf('\n', end);
    const actualEnd = lineEnd === -1 ? content.length : lineEnd;
    
    const line = content.slice(lineStart, actualEnd);
    const newLine = `${hashes} ${line.replace(/^#+\s*/, '')}`;
    
    const before = content.slice(0, lineStart);
    const after = content.slice(actualEnd);
    
    return {
      newContent: before + newLine + after,
      newStart: lineStart,
      newEnd: lineStart + newLine.length,
    };
  },
  
  list: (content: string, start: number, end: number, ordered = false) => {
    const lines = content.split('\n');
    const startLine = content.slice(0, start).split('\n').length - 1;
    const endLine = content.slice(0, end).split('\n').length - 1;
    
    for (let i = startLine; i <= endLine; i++) {
      if (lines[i] !== undefined) {
        const prefix = ordered ? `${i - startLine + 1}. ` : '- ';
        lines[i] = prefix + lines[i].replace(/^(\d+\.\s*|\-\s*|\*\s*|\+\s*)/, '');
      }
    }
    
    return {
      newContent: lines.join('\n'),
      newStart: start,
      newEnd: end,
    };
  },
  
  table: (content: string, position: number, rows = 3, cols = 3) => {
    const header = '| ' + Array(cols).fill('ヘッダー').join(' | ') + ' |';
    const separator = '| ' + Array(cols).fill('---').join(' | ') + ' |';
    const bodyRows = Array(rows - 1).fill('| ' + Array(cols).fill('セル').join(' | ') + ' |');
    
    const table = [header, separator, ...bodyRows].join('\n');
    
    return insertTextAtCursor(content, '\n' + table + '\n', position);
  },
  
  codeBlock: (content: string, start: number, end: number, language = '') => {
    const selected = content.slice(start, end);
    const codeBlock = `\`\`\`${language}\n${selected || 'コードをここに入力'}\n\`\`\``;
    
    return {
      newContent: content.slice(0, start) + codeBlock + content.slice(end),
      newStart: start + 3 + language.length + 1,
      newEnd: start + 3 + language.length + 1 + (selected || 'コードをここに入力').length,
    };
  },
};

export const getMarkdownShortcuts = () => [
  { key: 'Ctrl+B', action: 'bold', description: '太字' },
  { key: 'Ctrl+I', action: 'italic', description: '斜体' },
  { key: 'Ctrl+K', action: 'link', description: 'リンク' },
  { key: 'Ctrl+Shift+C', action: 'code', description: 'インラインコード' },
  { key: 'Ctrl+Shift+K', action: 'codeBlock', description: 'コードブロック' },
  { key: 'Ctrl+1', action: 'header1', description: '見出し1' },
  { key: 'Ctrl+2', action: 'header2', description: '見出し2' },
  { key: 'Ctrl+3', action: 'header3', description: '見出し3' },
];

export const handleKeyboardShortcut = (
  e: KeyboardEvent,
  content: string,
  selectionStart: number,
  selectionEnd: number
): { newContent: string; newStart: number; newEnd: number } | null => {
  const { ctrlKey, metaKey, shiftKey, key } = e;
  const isModifier = ctrlKey || metaKey;
  
  if (!isModifier) return null;
  
  switch (key.toLowerCase()) {
    case 'b':
      return insertMarkdownSyntax.bold(content, selectionStart, selectionEnd);
    case 'i':
      return insertMarkdownSyntax.italic(content, selectionStart, selectionEnd);
    case 'k':
      if (shiftKey) {
        return insertMarkdownSyntax.codeBlock(content, selectionStart, selectionEnd);
      } else {
        return insertMarkdownSyntax.link(content, selectionStart, selectionEnd);
      }
    case 'c':
      if (shiftKey) {
        return insertMarkdownSyntax.code(content, selectionStart, selectionEnd);
      }
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
      const level = parseInt(key);
      return insertMarkdownSyntax.header(content, selectionStart, selectionEnd, level);
    default:
      return null;
  }
  
  return null;
};