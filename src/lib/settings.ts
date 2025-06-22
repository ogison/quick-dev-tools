export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'ja' | 'en';
  autoSave: boolean;
  showHints: boolean;
}

export interface ToolSettings {
  json: {
    indentSize: number;
    sortKeys: boolean;
    showLineNumbers: boolean;
  };
  password: {
    defaultLength: number;
    defaultIncludeUppercase: boolean;
    defaultIncludeLowercase: boolean;
    defaultIncludeNumbers: boolean;
    defaultIncludeSymbols: boolean;
    defaultExcludeSimilar: boolean;
  };
  qr: {
    defaultSize: number;
    defaultErrorCorrection: 'L' | 'M' | 'Q' | 'H';
    defaultForegroundColor: string;
    defaultBackgroundColor: string;
  };
  hash: {
    defaultAlgorithms: string[];
    showSecurityWarnings: boolean;
  };
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'system',
  language: 'ja',
  autoSave: true,
  showHints: true,
};

export const DEFAULT_TOOL_SETTINGS: ToolSettings = {
  json: {
    indentSize: 2,
    sortKeys: false,
    showLineNumbers: true,
  },
  password: {
    defaultLength: 12,
    defaultIncludeUppercase: true,
    defaultIncludeLowercase: true,
    defaultIncludeNumbers: true,
    defaultIncludeSymbols: true,
    defaultExcludeSimilar: false,
  },
  qr: {
    defaultSize: 256,
    defaultErrorCorrection: 'M',
    defaultForegroundColor: '#000000',
    defaultBackgroundColor: '#FFFFFF',
  },
  hash: {
    defaultAlgorithms: ['md5', 'sha256'],
    showSecurityWarnings: true,
  },
};
