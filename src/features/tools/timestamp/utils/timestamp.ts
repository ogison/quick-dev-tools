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
      unix: Math.floor(timestamp / 1000),
      iso: date.toISOString(),
      local: date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      })
    };
  } catch {
    return null;
  }
}

export function getCurrentTimestamp(): TimestampFormat {
  const now = new Date();
  return {
    unix: Math.floor(now.getTime() / 1000),
    iso: now.toISOString(),
    local: now.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  };
}