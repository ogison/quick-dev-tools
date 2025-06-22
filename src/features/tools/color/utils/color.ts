import {
  ColorPalette,
  PaletteType,
  ColorConversions,
  ContrastResult,
  RgbColor,
  HslColor,
  HsvColor,
} from '../types';

// カラーパレット生成
export function generateColorPalette(
  baseColor: string,
  type: PaletteType = 'monochromatic'
): ColorPalette {
  const colors = generatePaletteByType(baseColor, type);
  const paletteNames = {
    monochromatic: 'モノクロマティック',
    analogous: '類似色',
    complementary: '補色',
    triadic: '三角配色',
    tetradic: '四角配色',
    splitComplementary: '分裂補色',
  };

  return {
    colors,
    name: `${paletteNames[type]}パレット`,
    type,
  };
}

// パレットタイプ別の色生成
function generatePaletteByType(baseColor: string, type: PaletteType): string[] {
  const hsl = hexToHsl(baseColor);
  const colors = [baseColor];

  switch (type) {
    case 'monochromatic':
      return generateMonochromatic(baseColor);
    case 'analogous':
      return generateAnalogous(hsl);
    case 'complementary':
      return generateComplementary(hsl);
    case 'triadic':
      return generateTriadic(hsl);
    case 'tetradic':
      return generateTetradic(hsl);
    case 'splitComplementary':
      return generateSplitComplementary(hsl);
    default:
      return colors;
  }
}

// モノクロマティック配色
function generateMonochromatic(baseColor: string): string[] {
  const hsl = hexToHsl(baseColor);
  const colors = [];

  // 明度を変化させた5色を生成
  for (let i = 0; i < 5; i++) {
    const lightness = Math.max(10, Math.min(90, hsl.l + (i - 2) * 20));
    colors.push(hslToHex(hsl.h, hsl.s, lightness));
  }

  return colors;
}

// 類似色配色
function generateAnalogous(hsl: HslColor): string[] {
  const colors = [];
  for (let i = -2; i <= 2; i++) {
    const hue = (hsl.h + i * 30 + 360) % 360;
    colors.push(hslToHex(hue, hsl.s, hsl.l));
  }
  return colors;
}

// 補色配色
function generateComplementary(hsl: HslColor): string[] {
  const complementaryHue = (hsl.h + 180) % 360;
  return [
    hslToHex(hsl.h, hsl.s, hsl.l),
    hslToHex(complementaryHue, hsl.s, hsl.l),
    hslToHex(hsl.h, hsl.s * 0.7, hsl.l * 1.2),
    hslToHex(complementaryHue, hsl.s * 0.7, hsl.l * 1.2),
    hslToHex(hsl.h, hsl.s * 0.3, hsl.l * 0.8),
  ];
}

// 三角配色
function generateTriadic(hsl: HslColor): string[] {
  return [
    hslToHex(hsl.h, hsl.s, hsl.l),
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
    hslToHex(hsl.h, hsl.s * 0.5, hsl.l * 1.1),
    hslToHex((hsl.h + 120) % 360, hsl.s * 0.5, hsl.l * 1.1),
  ];
}

// 四角配色
function generateTetradic(hsl: HslColor): string[] {
  return [
    hslToHex(hsl.h, hsl.s, hsl.l),
    hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l),
    hslToHex(hsl.h, hsl.s * 0.6, hsl.l * 0.9),
  ];
}

// 分裂補色配色
function generateSplitComplementary(hsl: HslColor): string[] {
  const baseHue = hsl.h;
  return [
    hslToHex(baseHue, hsl.s, hsl.l),
    hslToHex((baseHue + 150) % 360, hsl.s, hsl.l),
    hslToHex((baseHue + 210) % 360, hsl.s, hsl.l),
    hslToHex(baseHue, hsl.s * 0.7, hsl.l * 1.1),
    hslToHex((baseHue + 180) % 360, hsl.s * 0.5, hsl.l * 0.8),
  ];
}

// カラー形式変換
export function getColorConversions(color: string): ColorConversions {
  const hex = normalizeHex(color);
  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);
  const hsv = hexToHsv(hex);

  return {
    hex,
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
    hsv: `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`,
  };
}

// HEXからRGBに変換
export function hexToRgb(hex: string): RgbColor {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  return { format: 'rgb', r, g, b };
}

// HEXからHSLに変換
export function hexToHsl(hex: string): HslColor {
  const rgb = hexToRgb(hex);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    format: 'hsl',
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

// HEXからHSVに変換
export function hexToHsv(hex: string): HsvColor {
  const rgb = hexToRgb(hex);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const s = max === 0 ? 0 : delta / max;
  const v = max;

  if (delta !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / delta + 2) / 6;
        break;
      case b:
        h = ((r - g) / delta + 4) / 6;
        break;
    }
  }

  return {
    format: 'hsv',
    h: h * 360,
    s: s * 100,
    v: v * 100,
  };
}

// HSLからHEXに変換
export function hslToHex(h: number, s: number, l: number): string {
  h = h % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

// コントラスト比計算
export function calculateContrastRatio(color1: string, color2: string): ContrastResult {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const luminance1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const luminance2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  const ratio = (brighter + 0.05) / (darker + 0.05);

  let level: ContrastResult['level'] = 'FAIL';
  let isAccessible = false;

  if (ratio >= 7) {
    level = 'AAA';
    isAccessible = true;
  } else if (ratio >= 4.5) {
    level = 'AA';
    isAccessible = true;
  } else if (ratio >= 3) {
    level = 'A';
  }

  return { ratio, level, isAccessible };
}

// 相対輝度計算
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// HEXカラーの正規化
function normalizeHex(color: string): string {
  let hex = color.trim();

  if (!hex.startsWith('#')) {
    hex = '#' + hex;
  }

  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  return hex.toLowerCase();
}

// クリップボードコピー
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (error) {
    console.error('クリップボードコピーに失敗:', error);
    return false;
  }
}

// ランダムカラー生成
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
