export interface AsciiOptions {
  font: string;
  width: number;
  height: number;
  style: 'simple' | 'block' | 'shadow' | 'double';
}

export const DEFAULT_ASCII_OPTIONS: AsciiOptions = {
  font: 'standard',
  width: 80,
  height: 10,
  style: 'simple',
};

// Simple ASCII art fonts
const FONTS = {
  standard: {
    'A': [
      '  ▄▄  ',
      ' ▄▀▀▄ ',
      '▄▀██▀▄',
      '▀▄▄▄▄▀',
    ],
    'B': [
      '▄▀▀▀▄ ',
      '▄▀▀▀▄ ',
      '▄▀▀▀▄ ',
      '▀▄▄▄▀ ',
    ],
    'C': [
      ' ▄▀▀▄ ',
      '▄▀    ',
      '▄▀    ',
      ' ▀▄▄▀ ',
    ],
    // Add more letters as needed
    ' ': [
      '      ',
      '      ',
      '      ',
      '      ',
    ],
  },
  block: {
    'A': [
      '████▄ ',
      '█▀ ▀█ ',
      '█████ ',
      '█   █ ',
    ],
    'B': [
      '████▄ ',
      '█▀▀▀█ ',
      '████▄ ',
      '█████ ',
    ],
    'C': [
      ' ████ ',
      '█     ',
      '█     ',
      ' ████ ',
    ],
    ' ': [
      '      ',
      '      ',
      '      ',
      '      ',
    ],
  },
};

export const generateTextArt = (text: string, options: AsciiOptions = DEFAULT_ASCII_OPTIONS): string => {
  if (!text.trim()) return '';

  const font = FONTS[options.font as keyof typeof FONTS] || FONTS.standard;
  const chars = text.toUpperCase().split('');
  const lines: string[] = ['', '', '', ''];

  chars.forEach(char => {
    const charArt = font[char as keyof typeof font] || font[' '];
    charArt.forEach((line, index) => {
      lines[index] += line;
    });
  });

  return lines.join('\n');
};

export const generateBorder = (text: string, style: 'single' | 'double' | 'thick' = 'single'): string => {
  const lines = text.split('\n');
  const maxLength = Math.max(...lines.map(line => line.length));
  
  const borders = {
    single: { h: '─', v: '│', tl: '┌', tr: '┐', bl: '└', br: '┘' },
    double: { h: '═', v: '║', tl: '╔', tr: '╗', bl: '╚', br: '╝' },
    thick: { h: '━', v: '┃', tl: '┏', tr: '┓', bl: '┗', br: '┛' },
  };

  const border = borders[style];
  const top = border.tl + border.h.repeat(maxLength + 2) + border.tr;
  const bottom = border.bl + border.h.repeat(maxLength + 2) + border.br;
  
  const body = lines.map(line => 
    border.v + ' ' + line.padEnd(maxLength) + ' ' + border.v
  );

  return [top, ...body, bottom].join('\n');
};

export const generatePattern = (pattern: 'box' | 'diamond' | 'triangle', size: number): string => {
  switch (pattern) {
    case 'box':
      return generateBox(size);
    case 'diamond':
      return generateDiamond(size);
    case 'triangle':
      return generateTriangle(size);
    default:
      return '';
  }
};

const generateBox = (size: number): string => {
  const lines: string[] = [];
  const topBottom = '█'.repeat(size);
  const middle = '█' + ' '.repeat(size - 2) + '█';
  
  lines.push(topBottom);
  for (let i = 1; i < size - 1; i++) {
    lines.push(middle);
  }
  lines.push(topBottom);
  
  return lines.join('\n');
};

const generateDiamond = (size: number): string => {
  const lines: string[] = [];
  const center = Math.floor(size / 2);
  
  for (let i = 0; i < size; i++) {
    const distance = Math.abs(i - center);
    const width = size - 2 * distance;
    const padding = ' '.repeat(distance);
    const line = padding + '█'.repeat(Math.max(0, width)) + padding;
    lines.push(line);
  }
  
  return lines.join('\n');
};

const generateTriangle = (size: number): string => {
  const lines: string[] = [];
  
  for (let i = 0; i < size; i++) {
    const width = i + 1;
    const padding = ' '.repeat(size - i - 1);
    const line = padding + '█'.repeat(width);
    lines.push(line);
  }
  
  return lines.join('\n');
};

// Simple image to ASCII conversion
export const imageToAscii = (imageData: ImageData, width: number = 80): string => {
  const chars = ' .:-=+*#%@';
  const lines: string[] = [];
  
  const aspectRatio = imageData.height / imageData.width;
  const height = Math.floor(width * aspectRatio * 0.5); // Adjust for character aspect ratio
  
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const srcX = Math.floor((x / width) * imageData.width);
      const srcY = Math.floor((y / height) * imageData.height);
      const index = (srcY * imageData.width + srcX) * 4;
      
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      
      // Calculate brightness
      const brightness = (r + g + b) / 3;
      const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
      line += chars[charIndex];
    }
    lines.push(line);
  }
  
  return lines.join('\n');
};

export const getFontList = (): string[] => {
  return Object.keys(FONTS);
};

export const getPatternList = (): Array<{ name: string; value: 'box' | 'diamond' | 'triangle' }> => {
  return [
    { name: 'ボックス', value: 'box' },
    { name: 'ダイヤモンド', value: 'diamond' },
    { name: '三角形', value: 'triangle' },
  ];
};