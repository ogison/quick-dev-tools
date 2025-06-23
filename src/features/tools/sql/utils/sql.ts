export interface SqlFormatOptions {
  dialect: 'mysql' | 'postgresql' | 'sqlite' | 'mssql' | 'oracle';
  keywordCase: 'upper' | 'lower' | 'camel';
  indentSize: number;
  commaPosition: 'before' | 'after';
  linesBetweenQueries: number;
}

export const DEFAULT_SQL_OPTIONS: SqlFormatOptions = {
  dialect: 'mysql',
  keywordCase: 'upper',
  indentSize: 2,
  commaPosition: 'after',
  linesBetweenQueries: 1,
};

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER',
  'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'INSERT', 'INTO',
  'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE',
  'INDEX', 'VIEW', 'DATABASE', 'SCHEMA', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
  'CONSTRAINT', 'UNIQUE', 'NOT', 'NULL', 'DEFAULT', 'AUTO_INCREMENT', 'IDENTITY',
  'CHECK', 'UNION', 'ALL', 'DISTINCT', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE',
  'END', 'IF', 'EXISTS', 'BETWEEN', 'IN', 'LIKE', 'IS', 'AND', 'OR', 'XOR',
  'CAST', 'CONVERT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'SUBSTRING',
  'CONCAT', 'COALESCE', 'ISNULL', 'NULLIF', 'YEAR', 'MONTH', 'DAY', 'NOW',
  'CURRENT_TIMESTAMP', 'CURRENT_DATE', 'CURRENT_TIME', 'DATEADD', 'DATEDIFF',
  'WITH', 'RECURSIVE', 'OVER', 'PARTITION', 'ROW_NUMBER', 'RANK', 'DENSE_RANK',
  'LEAD', 'LAG', 'FIRST_VALUE', 'LAST_VALUE'
]);

export const formatSql = (sql: string, options: SqlFormatOptions = DEFAULT_SQL_OPTIONS): string => {
  if (!sql.trim()) return '';

  try {
    let formatted = sql;

    // Remove extra whitespace
    formatted = formatted.replace(/\s+/g, ' ').trim();

    // Format keywords
    formatted = formatKeywords(formatted, options.keywordCase);

    // Add line breaks and indentation
    formatted = addLineBreaks(formatted, options);

    // Handle commas
    formatted = formatCommas(formatted, options.commaPosition);

    // Clean up extra spaces and normalize line breaks
    formatted = formatted
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    return formatted;
  } catch (error) {
    throw new Error('SQL formatting failed: ' + error);
  }
};

const formatKeywords = (sql: string, keywordCase: 'upper' | 'lower' | 'camel'): string => {
  const words = sql.split(/(\s+|[(),;])/);
  
  return words.map(word => {
    const upperWord = word.toUpperCase();
    if (SQL_KEYWORDS.has(upperWord)) {
      switch (keywordCase) {
        case 'upper':
          return upperWord;
        case 'lower':
          return word.toLowerCase();
        case 'camel':
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        default:
          return word;
      }
    }
    return word;
  }).join('');
};

const addLineBreaks = (sql: string, options: SqlFormatOptions): string => {
  const indent = ' '.repeat(options.indentSize);
  
  // Major clauses that should start on new lines
  const majorClauses = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT'];
  
  let formatted = sql;
  
  // Add line breaks before major clauses
  majorClauses.forEach(clause => {
    const regex = new RegExp(`\\b${clause}\\b`, 'gi');
    formatted = formatted.replace(regex, '\n' + clause);
  });

  // Add line breaks for JOIN clauses
  formatted = formatted.replace(/\b(INNER|LEFT|RIGHT|FULL|OUTER)?\s*JOIN\b/gi, '\n$&');

  // Add indentation
  const lines = formatted.split('\n');
  let indentLevel = 0;
  
  return lines.map(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return '';
    
    // Adjust indentation for certain patterns
    if (trimmedLine.match(/\b(JOIN|AND|OR)\b/i)) {
      return indent + trimmedLine;
    }
    
    if (trimmedLine.match(/\b(WHERE|GROUP BY|HAVING|ORDER BY)\b/i)) {
      return trimmedLine;
    }
    
    return (indentLevel > 0 ? indent : '') + trimmedLine;
  }).join('\n');
};

const formatCommas = (sql: string, commaPosition: 'before' | 'after'): string => {
  if (commaPosition === 'before') {
    return sql.replace(/,\s*/g, '\n, ');
  }
  return sql.replace(/,\s*/g, ',\n  ');
};

export const validateSql = (sql: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!sql.trim()) {
    return { isValid: true, errors: [] };
  }

  // Basic syntax validation
  const openParens = (sql.match(/\(/g) || []).length;
  const closeParens = (sql.match(/\)/g) || []).length;
  
  if (openParens !== closeParens) {
    errors.push('Unmatched parentheses');
  }

  // Check for unclosed quotes
  const singleQuotes = (sql.match(/'/g) || []).length;
  const doubleQuotes = (sql.match(/"/g) || []).length;
  
  if (singleQuotes % 2 !== 0) {
    errors.push('Unclosed single quote');
  }
  
  if (doubleQuotes % 2 !== 0) {
    errors.push('Unclosed double quote');
  }

  // Check for common SQL patterns
  const upperSql = sql.toUpperCase();
  
  if (upperSql.includes('SELECT') && !upperSql.includes('FROM') && !upperSql.includes('DUAL')) {
    errors.push('SELECT statement without FROM clause');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const highlightSqlSyntax = (sql: string): string => {
  if (!sql) return '';

  let highlighted = sql;

  // Highlight keywords
  SQL_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    highlighted = highlighted.replace(regex, `<span class="text-blue-600 font-semibold">${keyword}</span>`);
  });

  // Highlight strings
  highlighted = highlighted.replace(/'([^']*)'/g, '<span class="text-green-600">\'$1\'</span>');
  highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="text-green-600">"$1"</span>');

  // Highlight numbers
  highlighted = highlighted.replace(/\b\d+(\.\d+)?\b/g, '<span class="text-purple-600">$&</span>');

  // Highlight comments
  highlighted = highlighted.replace(/--.*$/gm, '<span class="text-gray-500 italic">$&</span>');
  highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>');

  return highlighted;
};

export const extractTableNames = (sql: string): string[] => {
  const tables: string[] = [];
  const upperSql = sql.toUpperCase();

  // Simple extraction - this could be more sophisticated
  const fromMatch = upperSql.match(/FROM\s+([A-Z_][A-Z0-9_]*)/g);
  const joinMatch = upperSql.match(/JOIN\s+([A-Z_][A-Z0-9_]*)/g);
  const intoMatch = upperSql.match(/INTO\s+([A-Z_][A-Z0-9_]*)/g);

  [fromMatch, joinMatch, intoMatch].forEach(matches => {
    if (matches) {
      matches.forEach(match => {
        const tableName = match.split(/\s+/)[1];
        if (tableName && !tables.includes(tableName)) {
          tables.push(tableName);
        }
      });
    }
  });

  return tables;
};