export interface CronField {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export const DEFAULT_CRON: CronField = {
  minute: '0',
  hour: '0',
  dayOfMonth: '*',
  month: '*',
  dayOfWeek: '*',
};

export const buildCronExpression = (fields: CronField): string => {
  return `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`;
};

export const parseCronExpression = (cron: string): CronField | null => {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {return null;}

  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4],
  };
};

export const getNextExecutions = (cron: string, count: number = 5): Date[] => {
  const executions: Date[] = [];
  const now = new Date();

  try {
    const fields = parseCronExpression(cron);
    if (!fields) {return [];}

    let current = new Date(now);
    current.setSeconds(0, 0);
    current.setMinutes(current.getMinutes() + 1);

    for (let i = 0; i < count && executions.length < count; i++) {
      const next = findNextExecution(current, fields);
      if (next) {
        executions.push(new Date(next));
        current = new Date(next.getTime() + 60000);
      } else {
        break;
      }
    }
  } catch (error) {
    console.error('Error calculating next executions:', error);
  }

  return executions;
};

const findNextExecution = (from: Date, fields: CronField): Date | null => {
  const current = new Date(from);

  // Simple implementation - in production, use a proper cron library
  for (let i = 0; i < 1000; i++) {
    if (matchesCron(current, fields)) {
      return current;
    }
    current.setMinutes(current.getMinutes() + 1);
  }

  return null;
};

const matchesCron = (date: Date, fields: CronField): boolean => {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  return (
    matchesField(minute, fields.minute, 0, 59) &&
    matchesField(hour, fields.hour, 0, 23) &&
    matchesField(dayOfMonth, fields.dayOfMonth, 1, 31) &&
    matchesField(month, fields.month, 1, 12) &&
    matchesField(dayOfWeek, fields.dayOfWeek, 0, 6)
  );
};

const matchesField = (value: number, field: string, min: number, max: number): boolean => {
  if (field === '*') {return true;}
  if (field === '?') {return true;}

  if (field.includes(',')) {
    return field.split(',').some((part) => matchesField(value, part.trim(), min, max));
  }

  if (field.includes('/')) {
    const [range, step] = field.split('/');
    const stepValue = parseInt(step);
    if (range === '*') {
      return value % stepValue === 0;
    }
  }

  if (field.includes('-')) {
    const [start, end] = field.split('-').map((n) => parseInt(n));
    return value >= start && value <= end;
  }

  const numValue = parseInt(field);
  return !isNaN(numValue) && value === numValue;
};

export const describeCronExpression = (cron: string): string => {
  const fields = parseCronExpression(cron);
  if (!fields) {return 'Invalid cron expression';}

  const parts: string[] = [];

  // Minute
  if (fields.minute === '*') {
    parts.push('毎分');
  } else if (fields.minute === '0') {
    parts.push('0分に');
  } else {
    parts.push(`${fields.minute}分に`);
  }

  // Hour
  if (fields.hour === '*') {
    parts.push('毎時');
  } else {
    parts.push(`${fields.hour}時`);
  }

  // Day
  if (fields.dayOfMonth === '*' && fields.dayOfWeek === '*') {
    parts.push('毎日');
  } else if (fields.dayOfMonth !== '*') {
    parts.push(`${fields.dayOfMonth}日`);
  } else if (fields.dayOfWeek !== '*') {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dayNum = parseInt(fields.dayOfWeek);
    if (!isNaN(dayNum) && dayNum >= 0 && dayNum <= 6) {
      parts.push(`${days[dayNum]}曜日`);
    }
  }

  // Month
  if (fields.month !== '*') {
    parts.push(`${fields.month}月`);
  }

  return parts.join(' ');
};
