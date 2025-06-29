'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
}

export function DateTimePicker({ value, onChange, placeholder, className, hasError }: DateTimePickerProps) {
  // 文字列から日付、時、分、秒を解析
  const parseDateTime = (dateTimeStr: string) => {
    const match = dateTimeStr.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    if (!match) {
      return {
        date: null,
        hours: '00',
        minutes: '00',
        seconds: '00',
      };
    }

    const [, dateStr, hours, minutes, seconds] = match;
    const date = new Date(dateStr);
    
    return {
      date: isNaN(date.getTime()) ? null : date,
      hours,
      minutes,
      seconds,
    };
  };

  const { date, hours, minutes, seconds } = parseDateTime(value);

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
      return;
    }
    
    const dateStr = format(newDate, 'yyyy-MM-dd');
    const newValue = `${dateStr} ${hours}:${minutes}:${seconds}`;
    onChange(newValue);
  };

  const handleTimeChange = (type: 'hours' | 'minutes' | 'seconds', newValue: string) => {
    if (!date) {
      // 日付が選択されていない場合は今日の日付を使用
      const today = new Date();
      const dateStr = format(today, 'yyyy-MM-dd');
      const newDateTime = {
        hours: type === 'hours' ? newValue : hours,
        minutes: type === 'minutes' ? newValue : minutes,
        seconds: type === 'seconds' ? newValue : seconds,
      };
      onChange(`${dateStr} ${newDateTime.hours}:${newDateTime.minutes}:${newDateTime.seconds}`);
    } else {
      const dateStr = format(date, 'yyyy-MM-dd');
      const newDateTime = {
        hours: type === 'hours' ? newValue : hours,
        minutes: type === 'minutes' ? newValue : minutes,
        seconds: type === 'seconds' ? newValue : seconds,
      };
      onChange(`${dateStr} ${newDateTime.hours}:${newDateTime.minutes}:${newDateTime.seconds}`);
    }
  };

  // 時・分・秒の選択肢を生成
  const generateOptions = (max: number) => {
    return Array.from({ length: max }, (_, i) => {
      const value = i.toString().padStart(2, '0');
      return { value, label: value };
    });
  };

  const hourOptions = generateOptions(24);
  const minuteOptions = generateOptions(60);
  const secondOptions = generateOptions(60);

  return (
    <div className={cn('flex gap-2', className)}>
      {/* 日付選択 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal flex-1',
              !date && 'text-muted-foreground',
              hasError && 'border-red-300 dark:border-red-700'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'yyyy年MM月dd日', { locale: ja }) : <span>{placeholder || '日付を選択'}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleDateChange}
            locale={ja}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* 時刻選択 */}
      <div className="flex gap-1 items-center">
        <Select value={hours} onValueChange={(value) => handleTimeChange('hours', value)}>
          <SelectTrigger className={cn('w-[70px]', hasError && 'border-red-300 dark:border-red-700')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hourOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-gray-500">:</span>

        <Select value={minutes} onValueChange={(value) => handleTimeChange('minutes', value)}>
          <SelectTrigger className={cn('w-[70px]', hasError && 'border-red-300 dark:border-red-700')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {minuteOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-gray-500">:</span>

        <Select value={seconds} onValueChange={(value) => handleTimeChange('seconds', value)}>
          <SelectTrigger className={cn('w-[70px]', hasError && 'border-red-300 dark:border-red-700')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {secondOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}