import { ColorPalette } from '../types';

export function generateColorPalette(baseColor?: string): ColorPalette {
  const colors = baseColor 
    ? generateHarmonicColors(baseColor)
    : generateRandomColors();
    
  return {
    colors,
    name: baseColor ? `Palette from ${baseColor}` : 'Random Palette'
  };
}

function generateHarmonicColors(baseColor: string): string[] {
  // Convert hex to HSL and generate harmonic colors
  const hsl = hexToHsl(baseColor);
  const colors = [];
  
  // Generate complementary, triadic, and analogous colors
  for (let i = 0; i < 5; i++) {
    const hue = (hsl.h + (i * 72)) % 360;
    colors.push(hslToHex(hue, hsl.s, hsl.l));
  }
  
  return colors;
}

function generateRandomColors(): string[] {
  const colors = [];
  for (let i = 0; i < 5; i++) {
    colors.push('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
  }
  return colors;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Simple hex to HSL conversion
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 1/6) { r = c; g = x; b = 0; }
  else if (1/6 <= h && h < 2/6) { r = x; g = c; b = 0; }
  else if (2/6 <= h && h < 3/6) { r = 0; g = c; b = x; }
  else if (3/6 <= h && h < 4/6) { r = 0; g = x; b = c; }
  else if (4/6 <= h && h < 5/6) { r = x; g = 0; b = c; }
  else if (5/6 <= h && h < 1) { r = c; g = 0; b = x; }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}