export interface XmlFormatOptions {
  indentSize: number;
  sortAttributes: boolean;
  preserveComments: boolean;
  preserveWhitespace: boolean;
}

export const DEFAULT_XML_OPTIONS: XmlFormatOptions = {
  indentSize: 2,
  sortAttributes: false,
  preserveComments: true,
  preserveWhitespace: false,
};

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

export const formatXml = (
  xmlString: string,
  options: XmlFormatOptions = DEFAULT_XML_OPTIONS
): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');

    // Check for parsing errors
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      throw new Error('Invalid XML: ' + errorNode.textContent);
    }

    return formatXmlNode(doc.documentElement, options, 0);
  } catch (error) {
    throw new Error(
      'XML formatting failed: ' + (error instanceof Error ? error.message : String(error))
    );
  }
};

const formatXmlNode = (node: Node, options: XmlFormatOptions, depth: number): string => {
  const indent = ' '.repeat(depth * options.indentSize);

  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      return formatElement(node as Element, options, depth);
    case Node.TEXT_NODE:
      const text = node.textContent?.trim() || '';
      return text ? indent + text : '';
    case Node.COMMENT_NODE:
      return options.preserveComments ? `${indent}<!-- ${node.textContent} -->` : '';
    case Node.CDATA_SECTION_NODE:
      return `${indent}<![CDATA[${node.textContent}]]>`;
    case Node.DOCUMENT_NODE:
      const children = Array.from(node.childNodes)
        .map((child) => formatXmlNode(child, options, depth))
        .filter((text) => text.trim());
      return children.join('\n');
    default:
      return '';
  }
};

const formatElement = (element: Element, options: XmlFormatOptions, depth: number): string => {
  const indent = ' '.repeat(depth * options.indentSize);
  const tagName = element.tagName;

  // Format attributes
  let attributes = '';
  if (element.attributes.length > 0) {
    const attrs = Array.from(element.attributes);
    if (options.sortAttributes) {
      attrs.sort((a, b) => a.name.localeCompare(b.name));
    }
    attributes = attrs.map((attr) => ` ${attr.name}="${attr.value}"`).join('');
  }

  // Handle self-closing tags
  if (!element.hasChildNodes()) {
    return `${indent}<${tagName}${attributes} />`;
  }

  // Handle elements with only text content
  if (element.childNodes.length === 1 && element.firstChild?.nodeType === Node.TEXT_NODE) {
    const textContent = element.textContent?.trim() || '';
    if (textContent.length < 80) {
      return `${indent}<${tagName}${attributes}>${textContent}</${tagName}>`;
    }
  }

  // Handle elements with child elements
  const children = Array.from(element.childNodes)
    .map((child) => formatXmlNode(child, options, depth + 1))
    .filter((text) => text.trim());

  if (children.length === 0) {
    return `${indent}<${tagName}${attributes}></${tagName}>`;
  }

  const openTag = `${indent}<${tagName}${attributes}>`;
  const closeTag = `${indent}</${tagName}>`;

  return [openTag, ...children, closeTag].join('\n');
};

export const validateXml = (xmlString: string): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
  };

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');

    // Check for parser errors
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      result.isValid = false;
      result.errors.push({
        line: 1,
        column: 1,
        message: errorNode.textContent || 'XML parsing error',
        severity: 'error',
      });
    } else {
      // Additional validation checks
      validateXmlStructure(doc.documentElement, result);
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push({
      line: 1,
      column: 1,
      message: error instanceof Error ? error.message : 'Unknown validation error',
      severity: 'error',
    });
  }

  return result;
};

const validateXmlStructure = (element: Element, result: ValidationResult) => {
  // Check for duplicate attributes
  const attributeNames = new Set<string>();
  Array.from(element.attributes).forEach((attr) => {
    if (attributeNames.has(attr.name)) {
      result.errors.push({
        line: 1,
        column: 1,
        message: `Duplicate attribute: ${attr.name}`,
        severity: 'error',
      });
      result.isValid = false;
    }
    attributeNames.add(attr.name);
  });

  // Recursively validate child elements
  Array.from(element.children).forEach((child) => {
    validateXmlStructure(child, result);
  });
};

export const xmlToJson = (xmlString: string): object => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Invalid XML');
  }

  return xmlNodeToJson(doc.documentElement);
};

const xmlNodeToJson = (node: Element): any => {
  const result: any = {};

  // Add attributes
  if (node.attributes.length > 0) {
    result['@attributes'] = {};
    Array.from(node.attributes).forEach((attr) => {
      result['@attributes'][attr.name] = attr.value;
    });
  }

  // Process child nodes
  const children: { [key: string]: any[] } = {};
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as Element;
      const key = element.tagName;
      if (!children[key]) {
        children[key] = [];
      }
      children[key].push(xmlNodeToJson(element));
    } else if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim();
      if (text) {
        result['#text'] = text;
      }
    }
  });

  // Add children to result
  Object.keys(children).forEach((key) => {
    if (children[key].length === 1) {
      result[key] = children[key][0];
    } else {
      result[key] = children[key];
    }
  });

  return result;
};

export const minifyXml = (xmlString: string): string => {
  return xmlString.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
};

export const extractXmlInfo = (
  xmlString: string
): {
  encoding?: string;
  version?: string;
  rootElement?: string;
  namespaces: string[];
  elementCount: number;
  attributeCount: number;
} => {
  const info: {
    encoding?: string;
    version?: string;
    rootElement?: string;
    namespaces: string[];
    elementCount: number;
    attributeCount: number;
  } = {
    namespaces: [] as string[],
    elementCount: 0,
    attributeCount: 0,
  };

  try {
    // Extract XML declaration
    const declarationMatch = xmlString.match(/<\?xml\s+([^?]+)\?>/);
    if (declarationMatch) {
      const versionMatch = declarationMatch[1].match(/version=["']([^"']+)["']/);
      const encodingMatch = declarationMatch[1].match(/encoding=["']([^"']+)["']/);

      if (versionMatch) {
        info.version = versionMatch[1];
      }
      if (encodingMatch) {
        info.encoding = encodingMatch[1];
      }
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');

    if (doc.documentElement) {
      info.rootElement = doc.documentElement.tagName;
      countElements(doc.documentElement, info);
      extractNamespaces(doc.documentElement, info);
    }
  } catch {}

  return info;
};

const countElements = (element: Element, info: any) => {
  info.elementCount++;
  info.attributeCount += element.attributes.length;

  Array.from(element.children).forEach((child) => {
    countElements(child, info);
  });
};

const extractNamespaces = (element: Element, info: any) => {
  Array.from(element.attributes).forEach((attr) => {
    if (attr.name.startsWith('xmlns')) {
      const namespace = attr.name === 'xmlns' ? 'default' : attr.name.substring(6);
      if (!info.namespaces.includes(namespace)) {
        info.namespaces.push(namespace);
      }
    }
  });

  Array.from(element.children).forEach((child) => {
    extractNamespaces(child, info);
  });
};
