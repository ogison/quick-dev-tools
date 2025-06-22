export interface TokenType {
  type: 'string' | 'number' | 'boolean' | 'null' | 'key' | 'punctuation';
  value: string;
  start: number;
  end: number;
}

export function tokenizeJSON(json: string): TokenType[] {
  const tokens: TokenType[] = [];
  const regex = /("(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b)|(\bnull\b)|([\[\]{}:,])/g;
  
  let match;
  let lastIndex = 0;
  let insideObject = false;
  let expectingKey = false;
  const objectStack: boolean[] = [];

  while ((match = regex.exec(json)) !== null) {
    const [fullMatch, stringMatch, numberMatch, booleanMatch, nullMatch, punctuation] = match;
    const start = match.index;
    const end = start + fullMatch.length;

    // Handle punctuation to track object context
    if (punctuation) {
      if (punctuation === '{') {
        objectStack.push(true);
        insideObject = true;
        expectingKey = true;
      } else if (punctuation === '}') {
        objectStack.pop();
        insideObject = objectStack.length > 0;
        expectingKey = insideObject;
      } else if (punctuation === ':') {
        expectingKey = false;
      } else if (punctuation === ',') {
        expectingKey = insideObject;
      } else if (punctuation === '[') {
        objectStack.push(false);
        expectingKey = false;
      } else if (punctuation === ']') {
        objectStack.pop();
        insideObject = objectStack.length > 0 && objectStack[objectStack.length - 1];
        expectingKey = insideObject;
      }

      tokens.push({
        type: 'punctuation',
        value: punctuation,
        start,
        end
      });
    } else if (stringMatch) {
      tokens.push({
        type: expectingKey ? 'key' : 'string',
        value: stringMatch,
        start,
        end
      });
      if (expectingKey) {
        expectingKey = false;
      }
    } else if (numberMatch) {
      tokens.push({
        type: 'number',
        value: numberMatch,
        start,
        end
      });
    } else if (booleanMatch) {
      tokens.push({
        type: 'boolean',
        value: booleanMatch,
        start,
        end
      });
    } else if (nullMatch) {
      tokens.push({
        type: 'null',
        value: nullMatch,
        start,
        end
      });
    }

    lastIndex = end;
  }

  return tokens;
}

export function highlightJSON(json: string): string {
  const tokens = tokenizeJSON(json);
  let highlighted = '';
  let lastIndex = 0;

  for (const token of tokens) {
    // Add any text between tokens
    if (token.start > lastIndex) {
      highlighted += escapeHtml(json.slice(lastIndex, token.start));
    }

    // Add the highlighted token
    const className = getTokenClassName(token.type);
    highlighted += `<span class="${className}">${escapeHtml(token.value)}</span>`;
    
    lastIndex = token.end;
  }

  // Add any remaining text
  if (lastIndex < json.length) {
    highlighted += escapeHtml(json.slice(lastIndex));
  }

  return highlighted;
}

function getTokenClassName(type: TokenType['type']): string {
  switch (type) {
    case 'string':
      return 'json-string';
    case 'number':
      return 'json-number';
    case 'boolean':
      return 'json-boolean';
    case 'null':
      return 'json-null';
    case 'key':
      return 'json-key';
    case 'punctuation':
      return 'json-punctuation';
    default:
      return '';
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}