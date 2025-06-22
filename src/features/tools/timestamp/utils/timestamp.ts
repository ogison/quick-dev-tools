import { TimestampFormat } from '../types';

export function convertTimestamp(input: string | number): TimestampFormat | null {
  try {
    let timestamp: number;
    
    if (typeof input === 'string') {
      // Try parsing as ISO string first, then as unix timestamp
      const date = new Date(input);
      if (isNaN(date.getTime())) {
        timestamp = parseInt(input, 10);
        if (isNaN(timestamp)) return null;
      } else {
        timestamp = date.getTime();
      }
    } else {
      timestamp = input;
    }
    
    // Convert to milliseconds if it looks like seconds
    if (timestamp < 10000000000) {
      timestamp *= 1000;
    }
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return null;
    
    return {
      timestamp,
      unix: Math.floor(timestamp / 1000),
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }),
      relative: getRelativeTime(date)
    };
  } catch {
    return null;
  }
}

export function getCurrentTimestamp(): TimestampFormat {
  const now = new Date();
  const timestamp = now.getTime();
  return {
    timestamp,
    unix: Math.floor(timestamp / 1000),
    iso: now.toISOString(),
    utc: now.toUTCString(),
    local: now.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }),
    relative: getRelativeTime(now)
  };
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'たった今';
  if (diffMinutes < 60) return `${diffMinutes}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  
  return date.toLocaleDateString('ja-JP');
}