export interface MarkdownPreviewOptions {
  enableTables: boolean;
  enableCodeHighlight: boolean;
  enableMermaid: boolean;
  enableMath: boolean;
  enableEmoji: boolean;
  enableTaskLists: boolean;
}

export const DEFAULT_MARKDOWN_OPTIONS: MarkdownPreviewOptions = {
  enableTables: true,
  enableCodeHighlight: true,
  enableMermaid: false,
  enableMath: false,
  enableEmoji: true,
  enableTaskLists: true,
};

export const parseMarkdown = (
  markdown: string,
  options: MarkdownPreviewOptions = DEFAULT_MARKDOWN_OPTIONS
): string => {
  if (!markdown.trim()) {return '';}

  let html = markdown;

  // Headers
  html = html.replace(
    /^### (.*$)/gm,
    '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900">$1</h3>'
  );
  html = html.replace(
    /^## (.*$)/gm,
    '<h2 class="text-xl font-bold mt-8 mb-4 text-gray-900">$1</h2>'
  );
  html = html.replace(
    /^# (.*$)/gm,
    '<h1 class="text-2xl font-bold mt-8 mb-6 text-gray-900">$1</h1>'
  );

  // Bold and Italic
  html = html.replace(
    /\*\*\*(.*?)\*\*\*/g,
    '<strong class="font-bold"><em class="italic">$1</em></strong>'
  );
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'text';
    return `<pre class="bg-gray-50 border rounded-lg p-4 overflow-x-auto my-4"><code class="language-${language} text-sm font-mono">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-sm my-4" />'
  );

  // Lists
  html = html.replace(/^\* (.+)$/gm, '<li class="ml-4">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>');

  // Wrap consecutive list items
  html = html.replace(/(<li class="ml-4">.*<\/li>\s*)+/g, (match) => {
    return `<ul class="list-disc list-inside space-y-1 my-4">${match}</ul>`;
  });

  // Task lists (if enabled)
  if (options.enableTaskLists) {
    html = html.replace(
      /^\- \[x\] (.+)$/gm,
      '<li class="flex items-center"><input type="checkbox" checked disabled class="mr-2"> $1</li>'
    );
    html = html.replace(
      /^\- \[ \] (.+)$/gm,
      '<li class="flex items-center"><input type="checkbox" disabled class="mr-2"> $1</li>'
    );
  }

  // Tables (if enabled)
  if (options.enableTables) {
    html = parseMarkdownTables(html);
  }

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">$1</blockquote>'
  );

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-t border-gray-300 my-6" />');

  // Emojis (if enabled)
  if (options.enableEmoji) {
    html = parseEmojis(html);
  }

  // Paragraphs
  html = html.replace(/^(?!<[^>]+>)(.+)$/gm, '<p class="mb-4 leading-relaxed">$1</p>');

  // Clean up multiple line breaks
  html = html.replace(/\n\s*\n/g, '\n');

  return html;
};

const parseMarkdownTables = (html: string): string => {
  const tableRegex = /\|(.+)\|\n\|([^|]+)\|\n((?:\|.+\|\n?)*)/g;

  return html.replace(tableRegex, (match, header, separator, rows) => {
    const headerCells = header
      .split('|')
      .map((cell: string) => cell.trim())
      .filter((cell: string) => cell);
    const rowData = rows
      .trim()
      .split('\n')
      .map((row: string) =>
        row
          .split('|')
          .map((cell: string) => cell.trim())
          .filter((cell: string) => cell)
      );

    let tableHtml = '<table class="min-w-full border-collapse border border-gray-300 my-4">';

    // Header
    tableHtml += '<thead class="bg-gray-50"><tr>';
    headerCells.forEach((cell: string) => {
      tableHtml += `<th class="border border-gray-300 px-4 py-2 text-left font-semibold">${cell}</th>`;
    });
    tableHtml += '</tr></thead>';

    // Body
    tableHtml += '<tbody>';
    rowData.forEach((row: string[]) => {
      tableHtml += '<tr>';
      row.forEach((cell: string) => {
        tableHtml += `<td class="border border-gray-300 px-4 py-2">${cell}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';

    return tableHtml;
  });
};

const parseEmojis = (html: string): string => {
  const emojiMap: { [key: string]: string } = {
    ':smile:': '😊',
    ':heart:': '❤️',
    ':thumbsup:': '👍',
    ':thumbsdown:': '👎',
    ':fire:': '🔥',
    ':star:': '⭐',
    ':check:': '✅',
    ':x:': '❌',
    ':warning:': '⚠️',
    ':info:': 'ℹ️',
    ':rocket:': '🚀',
    ':tada:': '🎉',
    ':bulb:': '💡',
    ':lock:': '🔒',
    ':key:': '🔑',
    ':gear:': '⚙️',
    ':book:': '📚',
    ':pencil:': '✏️',
    ':computer:': '💻',
    ':mobile:': '📱',
    ':email:': '📧',
    ':calendar:': '📅',
  };

  Object.entries(emojiMap).forEach(([shortcode, emoji]) => {
    const regex = new RegExp(shortcode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    html = html.replace(regex, emoji);
  });

  return html;
};

const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const generateMarkdownToc = (
  markdown: string
): Array<{ level: number; title: string; id: string }> => {
  const toc: Array<{ level: number; title: string; id: string }> = [];
  const lines = markdown.split('\n');

  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      toc.push({ level, title, id });
    }
  });

  return toc;
};

export const countMarkdownStats = (
  markdown: string
): { words: number; characters: number; lines: number; headers: number } => {
  const lines = markdown.split('\n');
  const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const characters = markdown.length;
  const headers = lines.filter((line) => line.match(/^#+\s/)).length;

  return { words, characters, lines: lines.length, headers };
};

export const exportMarkdownAs = (markdown: string, format: 'html' | 'pdf' | 'txt'): string => {
  switch (format) {
    case 'html':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
    code { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; }
    blockquote { border-left: 4px solid #ddd; padding-left: 15px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f5f5f5; }
  </style>
</head>
<body>
${parseMarkdown(markdown)}
</body>
</html>`;

    case 'txt':
      return markdown;

    default:
      return markdown;
  }
};
