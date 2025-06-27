export interface BeautifyOptions {
  indentSize: number;
  indentType: 'spaces' | 'tabs';
  maxLineLength: number;
  preserveNewlines: boolean;
  endWithNewline: boolean;
  wrapAttributes: 'auto' | 'force' | 'force-aligned' | 'force-expand-multiline';
  wrapAttributesIndentSize: number;
}

export interface CssBeautifyOptions {
  indentSize: number;
  indentType: 'spaces' | 'tabs';
  sortProperties: boolean;
  newlineBetweenRules: boolean;
  spaceAroundSelectorSeparator: boolean;
  preserveComments: boolean;
}

export const DEFAULT_HTML_OPTIONS: BeautifyOptions = {
  indentSize: 2,
  indentType: 'spaces',
  maxLineLength: 120,
  preserveNewlines: true,
  endWithNewline: true,
  wrapAttributes: 'auto',
  wrapAttributesIndentSize: 2,
};

export const DEFAULT_CSS_OPTIONS: CssBeautifyOptions = {
  indentSize: 2,
  indentType: 'spaces',
  sortProperties: false,
  newlineBetweenRules: true,
  spaceAroundSelectorSeparator: true,
  preserveComments: true,
};

export const beautifyHtml = (
  html: string,
  options: BeautifyOptions = DEFAULT_HTML_OPTIONS
): string => {
  if (!html.trim()) {
    return '';
  }

  const indent = options.indentType === 'tabs' ? '\t' : ' '.repeat(options.indentSize);
  let result = '';
  let level = 0;
  let inTag = false;
  let inComment = false;
  let inScript = false;
  let inStyle = false;
  let buffer = '';

  // Normalize whitespace
  html = html.replace(/\s+/g, ' ').trim();

  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    const next = html[i + 1];

    buffer += char;

    // Handle comments
    if (buffer.endsWith('<!--')) {
      inComment = true;
      continue;
    }

    if (inComment && buffer.endsWith('-->')) {
      inComment = false;
      result += buffer;
      buffer = '';
      if (next === '<') {
        result += '\n' + indent.repeat(level);
      }
      continue;
    }

    if (inComment) {
      continue;
    }

    // Handle script/style tags
    if (buffer.toLowerCase().includes('<script')) {
      inScript = true;
    } else if (buffer.toLowerCase().includes('</script>')) {
      inScript = false;
      result += buffer;
      buffer = '';
      continue;
    }

    if (buffer.toLowerCase().includes('<style')) {
      inStyle = true;
    } else if (buffer.toLowerCase().includes('</style>')) {
      inStyle = false;
      result += buffer;
      buffer = '';
      continue;
    }

    if (inScript || inStyle) {
      continue;
    }

    // Handle regular tags
    if (char === '<' && !inTag) {
      inTag = true;
      if (buffer.length > 1) {
        const text = buffer.slice(0, -1).trim();
        if (text) {
          result += text;
        }
        buffer = '<';
      }
    }

    if (char === '>' && inTag) {
      inTag = false;
      const tag = buffer.toLowerCase();

      // Self-closing or void tags
      if (buffer.endsWith('/>') || isVoidElement(tag)) {
        result += '\n' + indent.repeat(level) + buffer;
        buffer = '';
      }
      // Closing tags
      else if (buffer.startsWith('</')) {
        level = Math.max(0, level - 1);
        result += '\n' + indent.repeat(level) + buffer;
        buffer = '';
      }
      // Opening tags
      else {
        result += '\n' + indent.repeat(level) + buffer;
        level++;
        buffer = '';
      }
    }
  }

  if (buffer) {
    result += buffer;
  }

  // Clean up and format
  result = result
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

  if (options.endWithNewline) {
    result += '\n';
  }

  return result;
};

export const beautifyCss = (
  css: string,
  options: CssBeautifyOptions = DEFAULT_CSS_OPTIONS
): string => {
  if (!css.trim()) {
    return '';
  }

  const indent = options.indentType === 'tabs' ? '\t' : ' '.repeat(options.indentSize);
  let result = '';
  let level = 0;
  let inComment = false;
  let inRule = false;
  let currentRule = '';
  let currentProperties: string[] = [];

  // Remove extra whitespace
  css = css.replace(/\s+/g, ' ').trim();

  let i = 0;
  while (i < css.length) {
    const char = css[i];
    const next = css[i + 1];

    // Handle comments
    if (char === '/' && next === '*') {
      if (!inComment) {
        inComment = true;
        let comment = '/*';
        i += 2;
        while (i < css.length) {
          comment += css[i];
          if (css[i] === '*' && css[i + 1] === '/') {
            comment += '/';
            i++;
            break;
          }
          i++;
        }
        if (options.preserveComments) {
          result += comment + '\n';
        }
        inComment = false;
        i++;
        continue;
      }
    }

    // Handle rule start
    if (char === '{') {
      inRule = true;
      currentRule = result.split('\n').pop()?.trim() || '';
      result = result.substring(0, result.lastIndexOf(currentRule));
      result += currentRule + ' {\n';
      level++;
      currentProperties = [];
      i++;
      continue;
    }

    // Handle rule end
    if (char === '}') {
      if (inRule) {
        // Sort properties if option is enabled
        if (options.sortProperties) {
          currentProperties.sort();
        }

        currentProperties.forEach((prop) => {
          result += indent + prop + '\n';
        });

        result += '}\n';
        if (options.newlineBetweenRules) {
          result += '\n';
        }

        inRule = false;
        level--;
        currentProperties = [];
        i++;
        continue;
      }
    }

    // Handle properties within rules
    if (inRule && char === ';') {
      let property = '';
      let j = result.length - 1;
      while (j >= 0 && result[j] !== '\n' && result[j] !== '{') {
        property = result[j] + property;
        j--;
      }
      result = result.substring(0, j + 1);

      property = property.trim();
      if (property) {
        currentProperties.push(property + ';');
      }
      i++;
      continue;
    }

    result += char;
    i++;
  }

  // Clean up
  result = result
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

  return result;
};

export const minifyHtml = (html: string): string => {
  return html
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .trim();
};

export const minifyCss = (css: string): string => {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Remove last semicolon in blocks
    .replace(/\s*{\s*/g, '{') // Clean braces
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';') // Clean semicolons
    .replace(/\s*:\s*/g, ':') // Clean colons
    .trim();
};

export const validateHtml = (html: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Basic validation
  const openTags: string[] = [];
  const voidElements = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ];

  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();

    if (fullTag.startsWith('</')) {
      // Closing tag
      const lastOpenTag = openTags.pop();
      if (lastOpenTag !== tagName) {
        errors.push(`Mismatched closing tag: expected </${lastOpenTag}>, found </${tagName}>`);
      }
    } else if (!fullTag.endsWith('/>') && !voidElements.includes(tagName)) {
      // Opening tag (not self-closing)
      openTags.push(tagName);
    }
  }

  // Check for unclosed tags
  if (openTags.length > 0) {
    errors.push(`Unclosed tags: ${openTags.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateCss = (css: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check for unmatched braces
  const openBraces = (css.match(/{/g) || []).length;
  const closeBraces = (css.match(/}/g) || []).length;

  if (openBraces !== closeBraces) {
    errors.push('Unmatched braces');
  }

  // Check for basic syntax errors
  const lines = css.split('\n');
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.match(/^[a-zA-Z@]/) &&
      !trimmed.match(/[{}]/) &&
      !trimmed.includes(':') &&
      !trimmed.startsWith('/*')
    ) {
      errors.push(`Line ${index + 1}: Invalid CSS syntax`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const isVoidElement = (tag: string): boolean => {
  const voidElements = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ];
  const tagName = tag.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/, '$1').toLowerCase();
  return voidElements.includes(tagName);
};

export const detectLanguage = (code: string): 'html' | 'css' | 'unknown' => {
  const trimmed = code.trim().toLowerCase();

  if (
    trimmed.includes('<!doctype') ||
    trimmed.includes('<html') ||
    trimmed.includes('<div') ||
    trimmed.includes('<span')
  ) {
    return 'html';
  }

  if (
    trimmed.includes('{') &&
    trimmed.includes('}') &&
    (trimmed.includes(':') || trimmed.includes('selector'))
  ) {
    return 'css';
  }

  return 'unknown';
};

export const extractInlineStyles = (html: string): { html: string; css: string } => {
  const styles: string[] = [];
  let counter = 0;

  const processedHtml = html.replace(/style\s*=\s*["']([^"']+)["']/gi, (match, styleContent) => {
    const className = `extracted-style-${counter++}`;
    styles.push(`.${className} { ${styleContent} }`);
    return `class="${className}"`;
  });

  return {
    html: processedHtml,
    css: styles.join('\n'),
  };
};
