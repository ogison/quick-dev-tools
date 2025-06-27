export interface CsvToJsonOptions {
  delimiter: string;
  hasHeader: boolean;
  inferTypes: boolean;
  skipEmptyLines: boolean;
  encoding: string;
}

export interface JsonToCsvOptions {
  delimiter: string;
  includeHeader: boolean;
  flattenObjects: boolean;
  handleArrays: 'join' | 'separate' | 'index';
  nullValue: string;
}

export const DEFAULT_CSV_OPTIONS: CsvToJsonOptions = {
  delimiter: ',',
  hasHeader: true,
  inferTypes: true,
  skipEmptyLines: true,
  encoding: 'UTF-8',
};

export const DEFAULT_JSON_OPTIONS: JsonToCsvOptions = {
  delimiter: ',',
  includeHeader: true,
  flattenObjects: true,
  handleArrays: 'join',
  nullValue: '',
};

export const csvToJson = (
  csvText: string,
  options: CsvToJsonOptions = DEFAULT_CSV_OPTIONS
): any[] => {
  if (!csvText.trim()) {return [];}

  const lines = csvText.split('\n').filter((line) => !options.skipEmptyLines || line.trim() !== '');

  if (lines.length === 0) {return [];}

  const records: any[] = [];
  let headers: string[] = [];
  let startIndex = 0;

  // Parse first line to determine headers
  const firstLine = parseCsvLine(lines[0], options.delimiter);

  if (options.hasHeader) {
    headers = firstLine;
    startIndex = 1;
  } else {
    // Generate column names: col1, col2, etc.
    headers = firstLine.map((_, index) => `col${index + 1}`);
    startIndex = 0;
  }

  // Parse data lines
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {continue;}

    const values = parseCsvLine(line, options.delimiter);
    const record: any = {};

    headers.forEach((header, index) => {
      let value: any = values[index] || '';

      if (options.inferTypes && value !== '') {
        value = inferDataType(value);
      }

      record[header] = value;
    });

    records.push(record);
  }

  return records;
};

export const jsonToCsv = (
  jsonData: any[],
  options: JsonToCsvOptions = DEFAULT_JSON_OPTIONS
): string => {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return '';
  }

  // Flatten objects if needed
  const flatData = options.flattenObjects
    ? jsonData.map((item) => flattenObject(item, options))
    : jsonData;

  // Get all unique keys
  const allKeys = new Set<string>();
  flatData.forEach((item) => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach((key) => allKeys.add(key));
    }
  });

  const headers = Array.from(allKeys);
  const csvLines: string[] = [];

  // Add header line
  if (options.includeHeader) {
    csvLines.push(
      headers.map((header) => escapeCsvField(header, options.delimiter)).join(options.delimiter)
    );
  }

  // Add data lines
  flatData.forEach((item) => {
    const row = headers.map((header) => {
      let value = item && typeof item === 'object' ? item[header] : '';

      if (value === null || value === undefined) {
        value = options.nullValue;
      } else if (Array.isArray(value)) {
        value = handleArrayValue(value, options);
      } else if (typeof value === 'object') {
        value = JSON.stringify(value);
      } else {
        value = String(value);
      }

      return escapeCsvField(value, options.delimiter);
    });

    csvLines.push(row.join(options.delimiter));
  });

  return csvLines.join('\n');
};

const parseCsvLine = (line: string, delimiter: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === delimiter && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  result.push(current);
  return result;
};

const escapeCsvField = (field: string, delimiter: string): string => {
  const str = String(field);

  // Check if escaping is needed
  if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    // Escape quotes by doubling them and wrap in quotes
    return '"' + str.replace(/"/g, '""') + '"';
  }

  return str;
};

const inferDataType = (value: string): any => {
  const trimmed = value.trim();

  // Boolean
  if (trimmed.toLowerCase() === 'true') {return true;}
  if (trimmed.toLowerCase() === 'false') {return false;}

  // Null/undefined
  if (trimmed.toLowerCase() === 'null') {return null;}
  if (trimmed.toLowerCase() === 'undefined') {return undefined;}

  // Number
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const num = parseFloat(trimmed);
    return isNaN(num) ? value : num;
  }

  // Date (ISO format)
  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(trimmed)) {
    const date = new Date(trimmed);
    return isNaN(date.getTime()) ? value : date.toISOString();
  }

  return value;
};

const flattenObject = (obj: any, options: JsonToCsvOptions, prefix = ''): any => {
  const flattened: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (value === null || value === undefined) {
        flattened[newKey] = options.nullValue;
      } else if (Array.isArray(value)) {
        flattened[newKey] = handleArrayValue(value, options);
      } else if (typeof value === 'object' && value.constructor === Object) {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(value, options, newKey));
      } else {
        flattened[newKey] = value;
      }
    }
  }

  return flattened;
};

const handleArrayValue = (array: any[], options: JsonToCsvOptions): string => {
  switch (options.handleArrays) {
    case 'join':
      return array
        .map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item)))
        .join(';');
    case 'separate':
      return JSON.stringify(array);
    case 'index':
      return `[${array.length} items]`;
    default:
      return JSON.stringify(array);
  }
};

export const detectDelimiter = (csvText: string): string => {
  const delimiters = [',', ';', '\t', '|'];
  const sample = csvText.split('\n').slice(0, 5).join('\n');

  let bestDelimiter = ',';
  let maxCount = 0;

  delimiters.forEach((delimiter) => {
    const count = (sample.match(new RegExp(`\\${delimiter}`, 'g')) || []).length;
    if (count > maxCount) {
      maxCount = count;
      bestDelimiter = delimiter;
    }
  });

  return bestDelimiter;
};

export const validateCsv = (
  csvText: string,
  options: CsvToJsonOptions
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!csvText.trim()) {
    errors.push('CSV text is empty');
    return { isValid: false, errors };
  }

  const lines = csvText.split('\n').filter((line) => line.trim());
  if (lines.length === 0) {
    errors.push('No data lines found');
    return { isValid: false, errors };
  }

  // Check header line
  let expectedColumns = 0;
  if (lines.length > 0) {
    expectedColumns = parseCsvLine(lines[0], options.delimiter).length;
  }

  // Validate each line
  lines.forEach((line, index) => {
    const columns = parseCsvLine(line, options.delimiter);
    if (columns.length !== expectedColumns) {
      errors.push(
        `Line ${index + 1}: Expected ${expectedColumns} columns, found ${columns.length}`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateJson = (jsonText: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
      errors.push('JSON must be an array of objects');
    } else if (parsed.length === 0) {
      errors.push('JSON array is empty');
    } else {
      // Check if all items are objects
      parsed.forEach((item, index) => {
        if (typeof item !== 'object' || item === null) {
          errors.push(`Item at index ${index} is not an object`);
        }
      });
    }
  } catch (error) {
    errors.push(
      'Invalid JSON syntax: ' + (error instanceof Error ? error.message : 'Unknown error')
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const generateSampleData = (type: 'csv' | 'json'): string => {
  if (type === 'csv') {
    return `name,age,city,active
John Doe,25,Tokyo,true
Jane Smith,30,Osaka,false
Bob Johnson,22,Kyoto,true
Alice Brown,28,Yokohama,true`;
  } else {
    return JSON.stringify(
      [
        { name: 'John Doe', age: 25, city: 'Tokyo', active: true },
        { name: 'Jane Smith', age: 30, city: 'Osaka', active: false },
        { name: 'Bob Johnson', age: 22, city: 'Kyoto', active: true },
        { name: 'Alice Brown', age: 28, city: 'Yokohama', active: true },
      ],
      null,
      2
    );
  }
};
