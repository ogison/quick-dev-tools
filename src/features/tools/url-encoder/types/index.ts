// URLエンコード/デコードモード
export type UrlMode = 'encode' | 'decode';

// スペース処理方式
export type SpaceMode = '%20' | '+';

// URLエンコード/デコードオプション
export interface UrlEncoderOptions {
  spaceMode: SpaceMode;
  realtimeMode: boolean;
}

// 変換履歴アイテム
export interface HistoryItem {
  input: string;
  output: string;
  mode: UrlMode;
  timestamp: number;
}

// URL解析結果
export interface UrlAnalysis {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  parameters: Array<[string, string]>;
}

// URL変換結果
export interface UrlConversionResult {
  result: string;
  error?: string;
  analysis?: UrlAnalysis;
}

// URLエンコーダーの状態
export interface UrlEncoderState {
  input: string;
  output: string;
  mode: UrlMode;
  options: UrlEncoderOptions;
  history: HistoryItem[];
  analysis: UrlAnalysis | null;
  error: string;
  copyFeedback: string;
}

// URLエンコーダーのアクション
export type UrlEncoderAction = 
  | 'convert'
  | 'clear'
  | 'swap'
  | 'copy'
  | 'load_sample';