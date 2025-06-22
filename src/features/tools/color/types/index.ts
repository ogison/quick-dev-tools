// カラー形式の型定義
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv';

// カラー値の型定義
export interface HexColor {
  format: 'hex';
  value: string; // #rrggbb形式
}

export interface RgbColor {
  format: 'rgb';
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HslColor {
  format: 'hsl';
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface HsvColor {
  format: 'hsv';
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export type Color = HexColor | RgbColor | HslColor | HsvColor;

// パレット生成の配色タイプ
export type PaletteType =
  | 'monochromatic' // モノクロマティック
  | 'analogous' // 類似色
  | 'complementary' // 補色
  | 'triadic' // 三角配色
  | 'tetradic' // 四角配色
  | 'splitComplementary'; // 分裂補色

// カラーパレット情報
export interface ColorPalette {
  colors: string[];
  name: string;
  type: PaletteType;
}

// カラーピッカーのオプション
export interface ColorPickerOptions {
  format: ColorFormat;
  showAlpha: boolean;
}

// コントラスト比の結果
export interface ContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
  isAccessible: boolean;
}

// カラー変換の結果
export interface ColorConversions {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
}

// カラーツールの状態
export interface ColorToolState {
  baseColor: string;
  palette: ColorPalette;
  selectedFormat: ColorFormat;
  conversions: ColorConversions;
  copySuccess: boolean;
}
