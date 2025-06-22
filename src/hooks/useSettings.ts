'use client';

import { useLocalStorage } from './useLocalStorage';
import { AppSettings, ToolSettings, DEFAULT_APP_SETTINGS, DEFAULT_TOOL_SETTINGS } from '@/lib/settings';

export function useAppSettings() {
  return useLocalStorage<AppSettings>('app-settings', DEFAULT_APP_SETTINGS);
}

export function useToolSettings() {
  return useLocalStorage<ToolSettings>('tool-settings', DEFAULT_TOOL_SETTINGS);
}