// タイムゾーン定義
export const TIMEZONES = {
  'UTC': 'UTC',
  'Asia/Tokyo': 'Japan (JST)',
  'America/New_York': 'New York (EST/EDT)',
  'America/Los_Angeles': 'Los Angeles (PST/PDT)',
  'Europe/London': 'London (GMT/BST)',
  'Europe/Paris': 'Paris (CET/CEST)',
  'Asia/Shanghai': 'Shanghai (CST)',
  'Asia/Singapore': 'Singapore (SGT)',
  'Australia/Sydney': 'Sydney (AEDT/AEST)',
} as const;

export type TimezoneKey = keyof typeof TIMEZONES;

/**
 * 現在のUnix時間を取得
 */
export function getCurrentUnixTime(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Unix時間をDateオブジェクトに変換
 */
export function unixToDate(unix: number, _timezone?: string): Date {
  return new Date(unix * 1000);
}

/**
 * 日時文字列をUnix時間に変換
 */
export function dateToUnix(dateStr: string, timezone?: string): number | null {
  try {
    // さまざまな日時フォーマットに対応
    const formats = [
      dateStr, // そのまま
      dateStr.replace(' ', 'T'), // スペースをTに変換
      `${dateStr}:00`, // 秒を追加
      `${dateStr}T00:00:00`, // 時刻を追加
    ];

    for (const format of formats) {
      const date = new Date(format);
      if (!isNaN(date.getTime())) {
        // タイムゾーンオフセットを考慮
        if (timezone && timezone !== 'UTC') {
          const offset = getTimezoneOffset(date, timezone);
          return Math.floor((date.getTime() + offset) / 1000);
        }
        return Math.floor(date.getTime() / 1000);
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * タイムゾーンオフセットを取得（ミリ秒）
 */
export function getTimezoneOffset(date: Date, timezone: string): number {
  try {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return utcDate.getTime() - tzDate.getTime();
  } catch {
    return 0;
  }
}

/**
 * 日付をフォーマット
 */
export function formatDate(date: Date, timezone?: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timezone || 'UTC',
    };

    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const parts = formatter.formatToParts(date);
    
    const dateParts: { [key: string]: string } = {};
    parts.forEach(part => {
      dateParts[part.type] = part.value;
    });

    return `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;
  } catch {
    // フォールバック
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
}

/**
 * Unix時間が有効かチェック
 */
export function isValidUnixTime(unix: number): boolean {
  // 1970年1月1日から2100年1月1日までの範囲をチェック
  return unix >= 0 && unix <= 4102444800;
}

/**
 * ミリ秒のUnix時間を秒に変換（自動検出）
 */
export function normalizeUnixTime(value: number): number {
  // 13桁以上の場合はミリ秒として扱う
  if (value > 9999999999) {
    return Math.floor(value / 1000);
  }
  return value;
}