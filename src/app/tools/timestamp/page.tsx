import type { Metadata } from 'next';

import { TimestampTool } from '@/features/tools/timestamp/components/TimestampTool';

export const metadata: Metadata = {
  title: 'UNIX時間変換 | QuickDevTools',
  description:
    'Convert Unix timestamps to human-readable dates and vice versa. Support for multiple timezones and formats.',
};

export default function TimestampPage() {
  return <TimestampTool />;
}
