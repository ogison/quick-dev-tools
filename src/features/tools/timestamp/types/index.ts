export interface TimestampFormat {
  timestamp: number;
  iso: string;
  utc: string;
  local: string;
  unix: number;
  relative: string;
}

export type TimestampInput = string | number | Date;

export interface TimestampOptions {
  timezone?: string;
  format?: string;
}
